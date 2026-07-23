# 🌾 Website Dusun Petung (Desa Sidorejo, Kemalang, Klaten)

Website informasi dan pariwisata resmi **Dusun Petung** yang terletak di kaki tenggara Gunung Merapi. Platform ini dirancang untuk memperkenalkan potensi dusun, sejarah, pariwisata utama (**Gumuk Petung Camp**), program **Live In Experience**, serta kebudayaan lokal kepada masyarakat luas.

Platform ini dilengkapi dengan **Panel Admin** dinamis untuk mempermudah pemuda/pengelola dusun memperbarui informasi, mengelola galeri kegiatan, serta mengelola daftar rumah warga untuk program Live In secara real-time.

---

## 🚀 Fitur Utama

1. **Beranda (Home)**: Tampilan visual megah dengan Hero Image yang responsif (crop dinamis), ringkasan profil, preview camping, preview live in, dan dokumentasi visual kehidupan dusun.
2. **Profil Dusun (Profile)**: Menyajikan identitas geografis, data statistik kependudukan ("Dusun dalam Angka") dengan animasi counter bergulir, jejak sejarah (timeline interaktif), serta potensi utama dusun.
3. **Kehidupan Dusun (Village Life)**: Galeri foto dokumenter aktivitas gotong royong dan kebudayaan warga dengan filter pengurutan khusus (Pertanian, Peternakan, Camp, Merapi, Arang, dll.) serta fitur Lightbox interaktif pada tampilan mobile.
4. **Gumuk Petung Camp**: Halaman pariwisata camping ground dengan informasi paket, fasilitas, galeri foto, peta lokasi interaktif, dan tombol langsung WhatsApp untuk pemesanan/reservasi cepat.
5. **Live In Experience**: Direktori interaktif rumah warga untuk program menginap. Dilengkapi dengan filter pencarian, filter kapasitas, filter paket, serta panduan tata tertib & FAQ bagi wisatawan.
6. **Panel Admin (Dashboard)**:
   * Pengaturan profil dusun (Nama, No. HP WhatsApp, Logo, Sosial Media).
   * Manajemen Galeri Aktivitas (Tambah, Edit, Hapus foto kegiatan).
   * Manajemen Akomodasi Live In (Tambah, Edit, Hapus data rumah warga beserta status ketersediaannya).

---

## 🛠️ Tech Stack

### Frontend (Client-side)
* **Framework**: React.js (Vite) + TypeScript
* **Styling**: Tailwind CSS v4.0 (Modern styling & utility-first)
* **Animations**: Motion (Framer Motion) untuk smooth transition & micro-interactions
* **Icons**: Lucide React
* **Components**: Radix UI Primitives & Material UI Icons (MUI)

### Backend (Server-side)
* **Runtime**: Node.js
* **Framework**: Express.js (ES Modules)
* **Database**: SQLite / LibSQL Client (Turso support)
* **Authentication**: JSON Web Token (JWT) & bcrypt untuk hashing password admin
* **File Uploads**: Multer & Cloudinary integration (untuk penyimpanan media di cloud)

---

## 📂 Struktur Proyek

```text
Dusun-Petung-Website/
├── backend/                  # REST API Express Server
│   ├── src/
│   │   ├── config/           # Konfigurasi Database & Cloudinary
│   │   ├── controllers/      # Logika Bisnis & Request Handlers
│   │   ├── middlewares/      # Middleware Auth JWT & Upload Multer
│   │   ├── routes/           # Routing API (/auth, /activities, /livein, /settings)
│   │   └── index.js          # Entrypoint server Express
│   ├── local.db              # Database SQLite lokal
│   ├── package.json
│   └── vercel.json           # Konfigurasi deployment serverless backend
│
├── frontend/                 # Client React App (Vite)
│   ├── public/               # Aset statis public (ikon, robots.txt, sitemap)
│   ├── src/
│   │   ├── app/              # Komponen utama App.tsx & routing utama
│   │   ├── components/       # Reusable components (Footer, Toast, Counter, dll)
│   │   ├── config/           # Konfigurasi statis & tautan aset
│   │   ├── pages/            # Halaman utama (Home, Profile, Camp, LiveIn, Admin, Login)
│   │   ├── styles/           # File CSS global
│   │   └── types/            # Deklarasi tipe TypeScript (.d.ts)
│   ├── package.json
│   └── vercel.json           # Konfigurasi deployment SPA frontend
└── README.md
```

---

## 💻 Instalasi & Menjalankan Lokal

### Catatan
* Pastikan komputer Anda telah terinstal **Node.js** (v18 ke atas disarankan) dan package manager seperti **npm**, **pnpm**, atau **yarn**.

---

### Langkah 1: Setup Backend

1. Buka terminal dan masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Salin file `.env.example` (jika ada) atau buat file `.env` baru di dalam folder `backend`:
   ```env
   PORT=5000
   JWT_SECRET=rahasia_super_aman_anda
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=password_admin_anda
   
   # Opsional (untuk Cloudinary media hosting di serverless environment seperti Vercel)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Jalankan server backend dalam mode pengembangan:
   ```bash
   npm start
   ```
   Server backend akan berjalan di `http://localhost:5000`.

---

### Langkah 2: Setup Frontend

1. Buka tab terminal baru dan masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Instal semua dependensi (menggunakan `pnpm` or `npm`):
   ```bash
   npm install
   # atau jika menggunakan pnpm:
   pnpm install
   ```
3. Buat file `.env` di dalam folder `frontend` untuk mendefinisikan URL API:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Jalankan server frontend dalam mode pengembangan:
   ```bash
   npm run dev
   ```
   Website dapat diakses secara lokal di `http://localhost:5173`.

---

## 📦 Build Produksi & Deployment

### Build Frontend
Untuk mengompilasi kode React ke bentuk statis produksi yang siap di-deploy:
```bash
cd frontend
npm run build
```
Hasil build akan tersimpan di dalam folder `dist/` dan siap di-host di CDN (Vercel, Netlify, dll.).

### Deployment ke Vercel
Platform ini telah dilengkapi dengan konfigurasi `vercel.json` baik di sisi frontend maupun backend untuk kemudahan deployment satu tombol di **Vercel**.

1. Hubungkan repositori GitHub Anda ke Vercel.
2. Tambahkan **Environment Variables** yang sesuai pada panel pengaturan proyek Vercel Anda.
3. Jalankan deployment. Vercel akan otomatis membaca file konfigurasi dan melakukan proses build.
