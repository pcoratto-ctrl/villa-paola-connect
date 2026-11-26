/** A resolved invocation alone is not proof that a lead was saved. */
export function isLeadAcknowledgement(data: unknown): data is { id: string; created_at: string; email_sent?: boolean } {
  if (!data || typeof data !== "object") return false;
  const value = data as Record<string, unknown>;
  return typeof value.id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.id)
    && typeof value.created_at === "string" && Number.isFinite(Date.parse(value.created_at)) && !("error" in value);
}