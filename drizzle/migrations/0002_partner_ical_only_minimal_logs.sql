ALTER TABLE public.partner_feed_tokens ADD CONSTRAINT partner_feed_tokens_ical_only CHECK (kind = 'ical');
COMMENT ON COLUMN public.partner_feed_tokens.allowed_origins IS 'DEPRECATED: widget removed from scope';
COMMENT ON COLUMN public.partner_access_log.ip_prefix IS 'DEPRECATED: minimal logs, no IP stored';
COMMENT ON COLUMN public.partner_access_log.user_agent IS 'DEPRECATED: minimal logs, no browser stored';
ALTER TABLE public.partner_access_log ADD CONSTRAINT partner_access_log_no_client_meta CHECK (ip_prefix IS NULL AND user_agent IS NULL) NOT VALID;
ALTER TABLE public.partner_access_log ADD CONSTRAINT partner_access_log_kind_scope CHECK (kind IN ('dashboard','ical')) NOT VALID;