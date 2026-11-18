CREATE TABLE public.partner_operators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  company text NOT NULL CHECK (length(btrim(company)) BETWEEN 1 AND 150),
  contact_name text CHECK (contact_name IS NULL OR length(contact_name) <= 120),
  email text NOT NULL UNIQUE CHECK (length(email) BETWEEN 3 AND 200),
  phone text CHECK (phone IS NULL OR length(phone) <= 40),
  notes text CHECK (notes IS NULL OR length(notes) <= 1000),
  status text NOT NULL DEFAULT 'enabled' CHECK (status IN ('enabled','suspended','revoked')),
  last_access_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partner_operators TO authenticated;
GRANT ALL ON public.partner_operators TO service_role;
ALTER TABLE public.partner_operators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage operators" ON public.partner_operators FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Partner reads own operator row" ON public.partner_operators FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE TRIGGER partner_operators_updated_at BEFORE UPDATE ON public.partner_operators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TABLE public.partner_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id uuid REFERENCES public.partner_operators(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('dashboard','ical','widget')),
  outcome text NOT NULL CHECK (outcome IN ('ok','denied')),
  ip_prefix text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX partner_access_log_op_idx ON public.partner_access_log(operator_id, created_at DESC);
GRANT SELECT ON public.partner_access_log TO authenticated;
GRANT ALL ON public.partner_access_log TO service_role;
ALTER TABLE public.partner_access_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read access log" ON public.partner_access_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.partner_feed_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id uuid NOT NULL REFERENCES public.partner_operators(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('ical','widget')),
  token_hash text NOT NULL UNIQUE,
  allowed_origins text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);
GRANT SELECT ON public.partner_feed_tokens TO authenticated;
GRANT ALL ON public.partner_feed_tokens TO service_role;
ALTER TABLE public.partner_feed_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read feed tokens" ON public.partner_feed_tokens FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));