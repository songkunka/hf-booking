-- Create Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert reviews (since there is no auth)
CREATE POLICY "Allow public inserts"
ON public.reviews
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read reviews
CREATE POLICY "Allow public read"
ON public.reviews
FOR SELECT
USING (true);
