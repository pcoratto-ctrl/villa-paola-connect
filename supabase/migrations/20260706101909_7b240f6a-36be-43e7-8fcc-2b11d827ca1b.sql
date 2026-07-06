-- Lock down SECURITY DEFINER functions: revoke broad EXECUTE.
-- update_updated_at is a trigger function; no role needs direct EXECUTE.
REVOKE ALL ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;

-- has_role is only used server-side inside RLS policies and other definer
-- functions. Revoke from PUBLIC/anon/authenticated; grant only to service_role.
-- RLS policies referencing has_role continue to work because those policies
-- themselves are evaluated by the database, not gated on caller EXECUTE of the function.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;