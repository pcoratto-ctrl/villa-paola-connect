DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

CREATE POLICY "Anyone can submit a lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(guest_name)) BETWEEN 1 AND 100
  AND length(btrim(email)) BETWEEN 3 AND 200
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR length(phone) <= 40)
  AND (message IS NULL OR length(message) <= 1500)
  AND (guests_count IS NULL OR (guests_count >= 1 AND guests_count <= 30))
  AND (
    arrival_date IS NULL
    OR departure_date IS NULL
    OR departure_date >= arrival_date
  )
);