DROP POLICY IF EXISTS "Anyone can log a click" ON public.click_events;

CREATE POLICY "Anyone can log a click"
ON public.click_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  event_type IN ('call', 'whatsapp')
  AND length(btrim(source)) >= 1
  AND length(source) <= 80
  AND source ~ '^[a-z0-9_-]+$'
  AND length(page) >= 1
  AND length(page) <= 200
  AND page ~ '^/[^\s]*$'
);