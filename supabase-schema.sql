-- ============================================================
-- HPP Motif Inventory - Supabase Schema
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- 1. Buat tabel motifs
CREATE TABLE IF NOT EXISTS public.motifs (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kode            VARCHAR(20) NOT NULL UNIQUE,
  nama_motif      VARCHAR(100) NOT NULL,
  hpp             DECIMAL(15, 2) NOT NULL CHECK (hpp > 0),
  stok_datang     INTEGER NOT NULL DEFAULT 0 CHECK (stok_datang >= 0),
  tanggal_datang  DATE NOT NULL,
  foto_url        TEXT,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Index untuk performa pencarian & sorting
CREATE INDEX IF NOT EXISTS idx_motifs_kode ON public.motifs (kode);
CREATE INDEX IF NOT EXISTS idx_motifs_tanggal ON public.motifs (tanggal_datang DESC);
CREATE INDEX IF NOT EXISTS idx_motifs_kode_lower ON public.motifs (lower(kode));

-- 3. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_motifs_updated_at
  BEFORE UPDATE ON public.motifs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.motifs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies - hanya user yang login bisa akses
-- Baca semua motif (user authenticated)
CREATE POLICY "Authenticated users can view motifs"
  ON public.motifs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert motif baru
CREATE POLICY "Authenticated users can insert motifs"
  ON public.motifs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Update motif
CREATE POLICY "Authenticated users can update motifs"
  ON public.motifs FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Delete motif
CREATE POLICY "Authenticated users can delete motifs"
  ON public.motifs FOR DELETE
  USING (auth.role() = 'authenticated');


-- ============================================================
-- STORAGE BUCKET SETUP
-- ============================================================
-- Buat bucket untuk foto motif (jalankan di SQL Editor)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'motif-photos',
  'motif-photos',
  true,           -- public bucket agar foto bisa ditampilkan
  5242880,        -- 5MB max
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: user authenticated bisa upload dan hapus
CREATE POLICY "Authenticated users can upload motif photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'motif-photos');

CREATE POLICY "Authenticated users can update motif photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'motif-photos');

CREATE POLICY "Authenticated users can delete motif photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'motif-photos');

CREATE POLICY "Public can view motif photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'motif-photos');


-- ============================================================
-- SAMPLE DATA (Opsional - untuk testing)
-- ============================================================
INSERT INTO public.motifs (kode, nama_motif, hpp, stok_datang, tanggal_datang) VALUES
  ('MT001', 'Batik Parang Rusak', 125000, 50, '2024-12-01'),
  ('MT002', 'Batik Kawung Klasik', 150000, 35, '2024-12-05'),
  ('MT003', 'Tenun Ikat Flores', 275000, 20, '2024-12-10'),
  ('MT004', 'Lurik Jogja Tradisional', 95000, 80, '2024-12-12'),
  ('MT005', 'Batik Mega Mendung', 185000, 45, '2024-12-15'),
  ('MT006', 'Songket Palembang', 450000, 15, '2024-12-18'),
  ('MT007', 'Batik Truntum Solo', 165000, 60, '2024-12-20'),
  ('MT008', 'Endek Bali Modern', 320000, 25, '2024-12-22')
ON CONFLICT (kode) DO NOTHING;
