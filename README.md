# HPP Motif Inventory

Sistem manajemen inventory motif kain & produk tekstil yang elegan dan profesional.

**Stack:** Next.js 15 · TypeScript · Tailwind CSS · Supabase · Vercel

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone <repo-url> hpp-motif-inventory
cd hpp-motif-inventory
npm install
```

### 2. Setup Supabase

1. Buka [supabase.com](https://supabase.com) → **New Project**
2. Catat `Project URL` dan `anon public key` dari **Settings → API**
3. Buka **SQL Editor** di dashboard Supabase
4. Copy-paste isi file `supabase-schema.sql` dan klik **Run**

### 3. Setup Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Buat User (Anggota Tim)

Di Supabase Dashboard → **Authentication → Users → Add User**:
- Masukkan email dan password untuk setiap anggota tim
- User baru otomatis bisa login ke aplikasi

### 5. Jalankan Lokal

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deploy ke Vercel

### Cara 1: Via Vercel CLI (Recommended)

```bash
npm i -g vercel
vercel

# Ikuti petunjuk, lalu tambahkan environment variables:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Deploy production
vercel --prod
```

### Cara 2: Via GitHub + Vercel Dashboard

1. Push kode ke GitHub
2. Buka [vercel.com](https://vercel.com) → **New Project**
3. Import repository dari GitHub
4. Di **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL project Supabase Anda
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Anon key Supabase Anda
5. Klik **Deploy**

### Konfigurasi Supabase untuk Production

Di Supabase Dashboard → **Authentication → URL Configuration**:
- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: `https://your-app.vercel.app/**`

---

## 📁 Struktur Folder

```
hpp-motif-inventory/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + fonts
│   │   ├── globals.css         # Design system CSS variables
│   │   ├── page.tsx            # Root redirect
│   │   ├── login/
│   │   │   └── page.tsx        # Halaman login
│   │   └── dashboard/
│   │       ├── layout.tsx      # Dashboard layout + auth check
│   │       └── page.tsx        # Dashboard page
│   ├── components/
│   │   ├── DashboardNavbar.tsx # Top navigation + dark mode
│   │   ├── MotifDashboard.tsx  # Main dashboard dengan grid
│   │   ├── MotifCard.tsx       # Card individual motif
│   │   ├── MotifFormModal.tsx  # Form tambah/edit motif
│   │   ├── MotifDetailModal.tsx # Detail view motif
│   │   ├── DeleteConfirmModal.tsx # Konfirmasi hapus
│   │   └── Toast.tsx           # Notifikasi sukses/error
│   ├── lib/
│   │   ├── motif-api.ts        # Semua fungsi CRUD Supabase
│   │   ├── utils.ts            # Helper functions
│   │   └── supabase/
│   │       ├── client.ts       # Client-side Supabase
│   │       ├── server.ts       # Server-side Supabase
│   │       └── middleware.ts   # Auth middleware
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── middleware.ts           # Next.js middleware (auth guard)
├── supabase-schema.sql         # ⭐ SQL schema lengkap
├── .env.local.example          # Template environment variables
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## ✨ Fitur

| Fitur | Keterangan |
|-------|-----------|
| 🔐 Auth | Login email/password via Supabase Auth |
| 📸 Upload Foto | Upload foto produk ke Supabase Storage (max 5MB) |
| 🔍 Pencarian | Real-time filter by kode motif |
| 📊 Sorting | 6 opsi sorting (tanggal, kode, HPP) |
| ✏️ CRUD Lengkap | Tambah, lihat, edit, hapus motif |
| 🌙 Dark Mode | Toggle light/dark mode |
| 📱 Responsive | Grid 2-4 kolom, optimal di HP & laptop |
| 💾 Auto-save | Data tersimpan otomatis setelah operasi |
| 🏷️ Format Rupiah | HPP otomatis diformat sebagai Rp xxx.xxx |

---

## 🗄️ Database Schema

```sql
Table: motifs
├── id             UUID (PK)
├── kode           VARCHAR(20) UNIQUE NOT NULL
├── nama_motif     VARCHAR(100) NOT NULL  
├── hpp            DECIMAL(15,2) NOT NULL
├── stok_datang    INTEGER NOT NULL DEFAULT 0
├── tanggal_datang DATE NOT NULL
├── foto_url       TEXT (nullable)
├── created_at     TIMESTAMPTZ
└── updated_at     TIMESTAMPTZ (auto-updated)
```

Storage Bucket: `motif-photos` (public)

---

## 🔧 Pengembangan Lebih Lanjut

Beberapa fitur yang bisa ditambahkan:
- Export data ke Excel/CSV
- Laporan HPP per periode
- Riwayat perubahan HPP
- Multiple foto per motif
- Kategori / tag motif
- Print label motif

---

## 📞 Support

Jika ada pertanyaan tentang setup, periksa:
1. Supabase SQL Editor → apakah schema berhasil dijalankan?
2. Environment variables → apakah sudah diisi dengan benar?
3. Supabase Auth → apakah ada user yang sudah dibuat?
