# 🌾 Website Resmi Dusun Petung - Developer Guide & Repository Documentation
**Alamat Produksi: [petungsidorejo.my.id](http://petungsidorejo.my.id)**

Dokumen ini berfungsi sebagai panduan teknis (*Developer Guide*) bagi mahasiswa IT, pengembang, atau tim pemelihara (*maintainer*) berikutnya yang bertanggung jawab untuk melakukan perawatan, perbaikan, maupun pengembangan fitur lanjutan pada Website Resmi Dusun Petung (Desa Sidorejo, Kemalang, Klaten).

---

### **1. PROJECT OVERVIEW**

Website Dusun Petung adalah sebuah platform profil wilayah (*company profile*) dan sistem manajemen informasi dusun berbasis web. Sistem ini dirancang untuk:
* Memperkenalkan potensi geografis, sejarah, dan kebudayaan Dusun Petung.
* Memfasilitasi reservasi dan promosi pariwisata unggulan, yaitu **Gumuk Petung Camp** dan program **Live In Experience** (akomodasi homestay warga secara *real-time*).
* Menyediakan **Dashboard Admin (CMS)** dinamis yang memungkinkan pengelola dari Karang Taruna (GPC) dan Perangkat Desa memperbarui konten web secara mandiri tanpa koding.

---

### **2. TECH STACK**

Sistem ini dikembangkan menggunakan arsitektur modern berbasis *Javascript/Javascript/TypeScript* dengan pembagian *decoupled* antara frontend dan backend:

* **Frontend (Client-side):**
  * **Framework:** React.js (Vite) dengan TypeScript
  * **Styling:** CSS / Tailwind CSS v4.0 (utility-first framework)
  * **Animasi:** Motion (Framer Motion) untuk transisi halus & mikro-interaksi
  * **Ikon:** Lucide React & Material-UI Icons (MUI)

* **Backend (Server-side):**
  * **Runtime:** Node.js
  * **Framework:** Express.js (menggunakan sintaks ES Modules)
  * **Otentikasi:** JSON Web Token (JWT) untuk autentikasi admin & `bcrypt` untuk hashing password

* **Database (Penyimpanan Data):**
  * **DBMS:** Turso Database (berbasis LibSQL/SQLite yang dioptimalkan untuk edge network)

* **Media Storage (Penyimpanan Gambar):**
  * **Provider:** Cloudinary API (digunakan untuk menyimpan berkas unggahan gambar secara cloud karena backend menggunakan Vercel Serverless yang bersifat *read-only/ephemeral*)

* **Hosting & Infrastruktur:**
  * **Frontend:** Vercel (SPA Deployment)
  * **Backend:** Vercel Serverless Functions (Node.js runtime via `vercel.json` routing)

---

### **3. INFRASTRUCTURE LINKS**

Gunakan tautan berikut untuk mengelola infrastruktur pendukung website (memerlukan hak akses admin):

* **Vercel Dashboard (Hosting):** [https://vercel.com](https://vercel.com)
  *(Digunakan untuk memantau status aplikasi, logs server backend, serta konfigurasi environment variables produksi).*
* **Turso Dashboard (Database):** [https://turso.tech](https://turso.tech)
  *(Digunakan untuk memantau basis data, penggunaan storage, serta query data SQLite).*
* **GitHub Repository (Penyimpanan Kode):** [https://github.com](https://github.com)
  *(Repositori utama kode sumber program).*

---

### **4. PREREQUISITES**

Sebelum menjalankan atau memodifikasi kode di lingkungan lokal, pastikan komputer Anda telah terinstal perangkat lunak berikut:

1. **Git:** Versi terbaru untuk mengelola versi kode.
2. **Node.js:** Versi **18.x (LTS) atau versi di atasnya**.
3. **Package Manager:** `npm` (bawaan Node.js) atau `pnpm` (direkomendasikan untuk manajemen dependensi monorepo/workspace).

---

### **5. LOCAL DEVELOPMENT (REPRODUCIBILITY)**

Ikuti langkah-langkah di bawah ini untuk menjalankan seluruh sistem di komputer lokal Anda (*localhost*):

#### **Langkah 1: Clone Repositori**
Unduh kode sumber dari GitHub ke komputer lokal Anda:
```bash
git clone https://github.com/username/dusun-petung-website.git
cd dusun-petung-website
```

#### **Langkah 2: Menjalankan Server Backend**
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Instal seluruh dependensi Node.js:
   ```bash
   npm install
   ```
3. Buat file `.env` baru di dalam folder `backend` (lihat bagian **Environment Variables** di bawah untuk daftar variabel wajib).
4. Jalankan database migrasi/seeding awal (jika database masih kosong):
   ```bash
   node src/config/initDb.js
   ```
5. Jalankan server lokal:
   ```bash
   npm start
   ```
   *Server backend akan aktif di port default `http://localhost:5000`.*

#### **Langkah 3: Menjalankan Aplikasi Frontend**
1. Buka terminal baru dan kembali ke direktori utama, lalu masuk ke folder frontend:
   ```bash
   cd frontend
   ```
2. Instal dependensi frontend:
   ```bash
   npm install
   # Atau jika menggunakan pnpm:
   pnpm install
   ```
3. Buat file `.env` baru di dalam folder `frontend`.
4. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```
   *Aplikasi frontend dapat diakses melalui browser di `http://localhost:5173`.*

---

### **6. ENVIRONMENT VARIABLES (.ENV)**

Anda wajib membuat file `.env` baik di sisi frontend maupun backend agar aplikasi dapat berkomunikasi dengan database dan API penyimpanan gambar.

#### **A. Backend Configuration (`backend/.env`)**
Buat file ini di direktori root folder `backend/`:

```env
# Port server backend lokal
PORT=5000

# Kunci rahasia untuk tanda tangan token login JWT admin (Gunakan string acak yang kuat)
JWT_SECRET=JWT_SECRET_RAHASIA_ANDA

# URL Database LibSQL dari Turso (contoh lokal: file database sqlite, produksi: URL Turso)
TURSO_DATABASE_URL=libsql://nama-database.turso.io

# Token otentikasi database Turso
TURSO_AUTH_TOKEN=TOKEN_DATABASE_TURSO_ANDA

# Konfigurasi integrasi Cloudinary (Media Hosting)
CLOUDINARY_CLOUD_NAME=NAMA_CLOUD_CLOUDINARY_ANDA
CLOUDINARY_API_KEY=KEY_API_CLOUDINARY_ANDA
CLOUDINARY_API_SECRET=SECRET_API_CLOUDINARY_ANDA
```

#### **B. Frontend Configuration (`frontend/.env`)**
Buat file ini di direktori root folder `frontend/`:

```env
# Alamat URL API backend untuk komunikasi HTTP
VITE_API_URL=http://localhost:5000
```
*Catatan: Saat deployment produksi di Vercel, ubah nilai `VITE_API_URL` menjadi URL backend produksi Anda (misal: `https://api.petungsidorejo.my.id`).*

---

### **7. SKEMA DATABASE INTI (TURSO / SQLite)**

Database menggunakan database relasional SQLite (dikelola melalui Turso). Skema tabel didefinisikan dalam file `backend/src/config/initDb.js` sebagai berikut:

#### **A. Tabel `users`**
Menyimpan akun pengguna yang memiliki hak akses masuk ke panel administrator.
* `id` (INTEGER, Primary Key, Auto Increment)
* `username` (TEXT, Unique, Not Null) - Nama akun login.
* `password` (TEXT, Not Null) - Kata sandi yang sudah disandi (*hashed*) menggunakan `bcrypt`.
* `display_name` (TEXT, Not Null) - Nama tampilan admin di dashboard.
* `role` (TEXT, Default 'Administrator') - Peran pengguna.

#### **B. Tabel `settings`**
Menyimpan data konfigurasi dasar dan informasi kontak website. Diperketat dengan aturan hanya boleh ada **satu baris** data (`id = 1`).
* `id` (INTEGER, Primary Key, Check `id = 1`)
* `village_name` (TEXT, Not Null) - Nama dusun utama (default: "Dusun Petung").
* `logo_url` (TEXT) - Tautan URL berkas logo resmi dusun.
* `hero_image_url` (TEXT) - Tautan URL foto banner utama halaman depan.
* `phone_number` (TEXT) - Nomor WhatsApp pengelola untuk reservasi wisata.
* `instagram_url` (TEXT) - Link akun Instagram resmi dusun.
* `tiktok_url` (TEXT) - Link akun TikTok resmi dusun.

#### **C. Tabel `activities`**
Menyimpan data galeri foto dan dokumentasi kegiatan publik.
* `id` (INTEGER, Primary Key, Auto Increment)
* `title` (TEXT, Not Null) - Judul atau nama kegiatan dusun.
* `description` (TEXT) - Deskripsi atau rangkuman kegiatan.
* `image_url` (TEXT) - Tautan URL gambar dokumentasi yang tersimpan di Cloudinary.
* `uploaded_at` (TEXT, Not Null) - Tanggal pengunggahan kegiatan.

#### **D. Tabel `livein`**
Menyimpan data homestay warga yang terintegrasi di halaman pencarian Live In.
* `id` (INTEGER, Primary Key, Auto Increment)
* `name` (TEXT, Not Null) - Nama homestay/rumah warga.
* `owner` (TEXT, Not Null) - Nama pemilik homestay.
* `cover_image` (TEXT) - Foto utama depan homestay.
* `gallery` (TEXT) - Menyimpan daftar foto tambahan (disimpan dalam format teks array JSON stringified).
* `description` (TEXT) - Profil dan deskripsi homestay.
* `highlight` (TEXT) - Keunggulan/keunikan homestay.
* `overnight_active` (INTEGER, Default 0) - Penanda jika Paket Harian aktif (0 = Tidak, 1 = Aktif).
* `overnight_price` (REAL) - Harga paket menginap harian.
* `overnight_checkin` / `overnight_checkout` (TEXT) - Jam operasional masuk dan keluar tamu.
* `hour24_active` (INTEGER, Default 0) - Penanda jika Paket 24 Jam aktif.
* `hour24_price` (REAL) - Harga paket 24 jam.
* `hour24_description` (TEXT) - Keterangan fasilitas paket 24 jam.
* `pricing_type` (TEXT, Default 'house') - Kategori harga ('house' = Per Rumah, 'person' = Per Orang).
* `min_guests` / `max_guests` (INTEGER) - Batas minimum dan maksimum jumlah tamu.
* `facilities` / `facilities_other` (TEXT) - Fasilitas homestay (disimpan dalam format array JSON stringified).
* `experiences` / `experiences_other` (TEXT) - Pengalaman aktivitas lokal (disimpan dalam format array JSON stringified).
* `status` (TEXT, Default 'Available') - Status ketersediaan homestay ('Available', 'Unavailable', 'Inactive').
* `updated_at` (TEXT, Not Null) - Tanggal perubahan data terakhir.

---

### **8. DEPLOYMENT (CI/CD)**

Aplikasi ini mendukung **Continuous Integration & Continuous Deployment (CI/CD)** otomatis yang dijembatani oleh Vercel dan GitHub:

1. **Pemicu Deployment (CI/CD Trigger):** 
   Setiap kali pengembang melakukan komit (*commit*) dan mendorong (*push*) perubahan kode ke cabang utama (**`main`**) di GitHub, Vercel akan secara otomatis mendeteksi perubahan tersebut.
2. **Proses Build & Rilis:** 
   Vercel akan memulai proses pembuatan build secara otomatis (*automatic build processes*) berdasarkan file konfigurasi `vercel.json` di folder frontend dan backend.
3. **Status Log & Error:**
   Jika proses build sukses, versi website di produksi akan terupdate secara instan tanpa ada waktu henti (*zero-downtime deployment*). Jika build gagal, Anda dapat memantau log error langsung pada *Vercel Deployment Dashboard* untuk melakukan debugging lebih lanjut.
