CREATE TABLE public.click_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('call', 'whatsapp')),
  source TEXT NOT NULL DEFAULT 'unknown',
  page TEXT NOT NULL DEFAULT '/',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT INSERT ON public.click_events TO anon;
GRANT INSERT ON public.click_events TO authenticated;
GRANT ALL ON public.click_events TO service_role;
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log a click" ON public.click_events FOR INSERT TO anon, authenticated WITH CHECK (true);