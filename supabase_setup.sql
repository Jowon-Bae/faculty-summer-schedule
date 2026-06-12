-- Create schedules table
CREATE TABLE public.schedules (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    type text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    participants text[] NOT NULL,
    location text NOT NULL,
    custom_label text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.schedules
    FOR SELECT
    TO public
    USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert" ON public.schedules
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update" ON public.schedules
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to delete" ON public.schedules
    FOR DELETE
    TO authenticated
    USING (true);
