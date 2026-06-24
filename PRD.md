# PRD – Sistem Informasi Manajemen Data Pegawai
## Insan APU – LAZWaf Al Azhar (Google Apps Script)

> **Versi:** 1.3.0 · **Tanggal:** 24 Juni 2026 · **Status:** Draft  
> **Platform:** Laravel 11 (Backend API) + Astro.js (Frontend) + MySQL  
> **Sumber Data:** [Spreadsheet Pegawai LAZWaf Al Azhar](https://docs.google.com/spreadsheets/d/1VEbMDaiqXRTGUymB_uL7uip0OIe_qO0qnRdbd7j_FGs/edit?usp=sharing)

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Konteks Organisasi](#2-konteks-organisasi)
3. [Analisis Data Sumber](#3-analisis-data-sumber)
4. [Arsitektur & Teknologi](#4-arsitektur--teknologi)
5. [Fitur: Tampilan Awal](#5-fitur-tampilan-awal)
6. [Fitur: Login & Autentikasi](#6-fitur-login--autentikasi)
7. [Fitur: Dashboard](#7-fitur-dashboard)
8. [Fitur: Hak Akses](#8-fitur-hak-akses)
9. [Fitur: Data Pegawai](#9-fitur-data-pegawai)
10. [Fitur: Riwayat Karir](#10-fitur-riwayat-karir)
11. [Fitur: Struktur Organisasi](#11-fitur-struktur-organisasi)
12. [Fitur: Manajemen Reimbursement & Klaim](#12-fitur-manajemen-reimbursement--klaim)
13. [Fitur: Import Data](#13-fitur-import-data)
14. [Fitur: Manajemen Kehadiran](#14-fitur-manajemen-kehadiran)
15. [Fitur: Payroll, Kompensasi & Benefit](#15-fitur-payroll-kompensasi--benefit)
16. [Fitur: Administrasi HR](#16-fitur-administrasi-hr)
17. [Fitur: Rekrutmen & Talent Acquisition](#17-fitur-rekrutmen--talent-acquisition)
18. [Fitur: Pengembangan Karyawan](#18-fitur-pengembangan-karyawan)
19. [Fitur Tambahan](#19-fitur-tambahan)
20. [Struktur Database (Google Sheets)](#20-struktur-database-google-sheets)
21. [Functional Requirements](#21-functional-requirements)
22. [Non-Functional Requirements](#22-non-functional-requirements)
23. [Milestone Pengembangan](#23-milestone-pengembangan)

---

## 1. Ringkasan Eksekutif

**Insan APU** adalah aplikasi web berbasis Google Apps Script yang menggantikan pengelolaan data karyawan yang saat ini dilakukan secara manual di Google Sheets. Data sumber yang ada mencakup **lebih dari 100 karyawan** yang tersebar di 5+ divisi dengan histori karir yang kompleks (hingga 12 riwayat jabatan per orang).

**Masalah yang diselesaikan:**
- Data tersebar di banyak baris/kolom tanpa UI yang ramah pengguna
- Tidak ada kontrol akses — siapa pun yang punya link bisa melihat semua data sensitif (KTP, no HP, dll.)
- Sulit membuat laporan ringkasan (total per divisi, per status, per gender) tanpa formula manual
- Tidak ada notifikasi otomatis untuk karyawan kontrak yang akan habis masa kerjanya
- Tidak ada visualisasi struktur organisasi dan hierarki jabatan
- Tidak ada sistem pengelolaan klaim reimbursement biaya karyawan

**Perubahan dari versi sebelumnya:**
- Sumber data baru: `spreadsheet ID 1VEbMDaiqXRTGUymB_uL7uip0OIe_qO0qnRdbd7j_FGs`
- Level jabatan disederhanakan (menghilangkan grade kode seperti 5A, 5C, 4A, dst.)
- Fitur baru: Struktur Organisasi (Org Chart)
- Fitur baru: Manajemen Reimbursement & Klaim
- Fitur baru: Import data via upload CSV dan Excel
- Fitur baru: **Manajemen Kehadiran** (absensi, cuti, lembur, timesheet, shift)
- Fitur baru: **Payroll, Kompensasi & Benefit** (kalkulasi gaji, slip gaji, e-Bupot)
- Fitur baru: **Administrasi HR** (ESS, onboarding/offboarding, template dokumen, aset, helpdesk)
- Fitur baru: **Rekrutmen & Talent Acquisition** (ATS, lowongan, manpower planning) dengan toggle on/off rekrutmen oleh Admin
- Fitur baru: **Pengembangan Karyawan** (performance review, talent management, LMS pelatihan)
- Backend diubah dari Google Apps Script ke **Laravel 11 + MySQL** untuk arsitektur yang lebih robust dan skalabel

---

## 2. Konteks Organisasi

### Struktur Divisi

| Kode | Nama Divisi | Jumlah Karyawan (estimasi) |
|------|-------------|---------------------------|
| SEK | Sekretariat | ±24 orang |
| KEU | Keuangan | ±9 orang |
| LAZ | LAZ Al Azhar | ±1 orang (Direktur) |
| FUN | Fundraising & Partnership | ±27 orang |
| PRO | Program | ±8+ orang |
| KPW | Kantor Perwakilan Wilayah | TBD |

### Unit dalam Divisi

| Divisi | Unit |
|--------|------|
| Sekretariat | Direksi, Kelembagaan, Humas/GA/IT, Diklat & Litbang |
| Keuangan | Direksi, Pengeluaran, Penerimaan, Anggaran & Akuntansi |
| Fundraising & Partnership | Internal Fundraising, Eksternal Fundraising |
| Program | Program |

### Status Kepegawaian

| Status | Gaji/Honorarium | Tunjangan (Kesehatan, Transport, dll.) | Kontrak Tertulis |
|--------|:-:|:-:|:-:|
| **Tetap** | ✅ | ✅ Penuh | ✅ |
| **Kontrak** | ✅ | ✅ Penuh | ✅ (waktu tertentu) |
| **Relawan** | ✅ | ❌ Tidak ada | Opsional |

> **Catatan penting:** Relawan di LAZWaf Al Azhar **bukan sukarelawan tanpa bayaran**. Mereka tetap menerima gaji/honorarium, tetapi **tidak mendapatkan komponen tunjangan** apa pun (kesehatan, transport, makan, BPJS, dll.). Ini harus tercermin di sistem agar laporan payroll dan kepegawaian akurat.

### Sistem Level Jabatan (Disederhanakan)

Level jabatan tidak lagi menggunakan kode grade alfanumerik (5A, 4B, dll.), melainkan menggunakan label jabatan fungsional yang jelas:

| Level | Jabatan |
|-------|---------|
| 5 | Direktur / Kepala Divisi |
| 4 | Manager Senior |
| 3 | Manager / Koordinator Senior |
| 2 | Koordinator / Staf Senior |
| 1 | Staf Junior / Non-Staf |

### Hierarki Jabatan

```
Direktur / Kepala Divisi  (Level 5)
    └── Manager Senior      (Level 4)
         └── Manager / Koordinator Senior  (Level 3)
              └── Koordinator / Staf Senior  (Level 2)
                   └── Staf Junior / Non-Staf / Relawan  (Level 1)
```

---

## 3. Analisis Data Sumber

### Sumber Data Baru

**Spreadsheet:** [https://docs.google.com/spreadsheets/d/1VEbMDaiqXRTGUymB_uL7uip0OIe_qO0qnRdbd7j_FGs](https://docs.google.com/spreadsheets/d/1VEbMDaiqXRTGUymB_uL7uip0OIe_qO0qnRdbd7j_FGs/edit?usp=sharing)

Sistem harus membaca spreadsheet ini via Google Sheets API saat proses import. Spreadsheet **tidak dimodifikasi** — hanya dibaca sebagai sumber data.

### Kolom-Kolom di Spreadsheet Sumber

#### Blok A – Identitas & Posisi

| Kolom | Field | Contoh Data |
|-------|-------|-------------|
| A | No. (urut per divisi) | 1, 2, 3… |
| B | Employee ID | `20103008013` |
| C | Full Name | `Rahmatullah Sidik` |
| D | Current Position | `Kepala Divisi Sekretariat LAZWaf…` |
| E | Department | `Sekretariat`, `Keuangan`, `Fundraising`, `Program` |
| F | Unit | `Direksi`, `Kelembagaan`, `Humas, GA, dan IT` |
| G | Employment Status | `Tetap`, `Kontrak`, `Relawan` |
| H | Level | Level jabatan fungsional (lihat bagian 2) |

#### Blok B – Kontak & Kepegawaian

| Kolom | Field | Contoh Data |
|-------|-------|-------------|
| I | Mobile Phone Number | `081280571098` |
| J | Place of Birth | `Bekasi` |
| K | Date of Birth | `8/21/1977` |
| L | Age | `48` (auto-hitung) |
| M | Join Date | `1/1/2010` |
| N | Count Date (Today) | `6/17/2026` (auto) |
| O | Employment Count (Year) | `16` (auto-hitung) |
| P | Employment Count (Month) | `5` (auto-hitung) |
| Q | Employment Count (Day) | `16` (auto-hitung) |
| R | Email | *(sebagian besar kosong – perlu diisi)* |

#### Blok C – Data Pribadi

| Kolom | Field | Contoh Data |
|-------|-------|-------------|
| S | Education | *(kosong – fallback ke kolom AJ)* |
| T | Citizen ID (NIK) | `3674052108770003` |
| U | Citizen ID Address | *(kosong – perlu diisi)* |
| V | Residential Address | *(kosong – perlu diisi)* |
| W | Gender | `L` (Laki-laki), `P` (Perempuan) |
| X | Marital Status | `Menikah`, `Single`, `Janda` |

#### Blok D – Data Keluarga

| Kolom | Field | Contoh Data |
|-------|-------|-------------|
| Y | Spouse Name | `PURWANTI` |
| Z | Spouse Date of Birth | `4 Apr 1980` |
| AA | Child Name 1 | `ALMA HAYYA SHIDDIQY` |
| AB | Child DOB 1 | `3 Jul 2007` |
| AC | Child Name 2 | `SALIMA SHIDDIQY` |
| AD | Child DOB 2 | `25 Mar 2012` |
| AE | Child Name 3 | `ILMAN HANNAN SIDIK` |
| AF | Child DOB 3 | `18 Sep 2015` |
| AG | Child Name 4 | *(opsional)* |
| AH | Child DOB 4 | *(opsional)* |

#### Blok E – Pendidikan

| Kolom | Field | Contoh Data |
|-------|-------|-------------|
| AI | Graduation Date | `9/3/2002` |
| AJ | Educational Institution | `UIN Syarif Hidayatullah` |
| AK | Institution Place | `Jakarta` |

#### Blok F – Jabatan & Riwayat Karir

| Kolom | Field | Keterangan |
|-------|-------|------------|
| AL | Job Level | `Kepala Divisi`, `Manager`, `Koordinator`, `Staf` |
| AM | Career Start | Jabatan awal saat bergabung |
| AN | Career Path 1 Date | Tanggal mulai jabatan ke-1 |
| AO | Career Path 1 | Nama jabatan ke-1 |
| … | (hingga Career Path 12) | |
| BK | Career Path 12 | Kolom jabatan terakhir |

### Temuan & Isu Data Sumber

| Isu | Dampak | Penanganan di Sistem |
|-----|--------|---------------------|
| Kolom Email (R) sebagian besar kosong | Tidak bisa kirim notifikasi | Form wajib isi email saat edit data |
| Format tanggal tidak konsisten (`8/21/1977`, `3 Jul 2007`, `13/01/1982`) | Error parsing | Normalisasi otomatis saat import ke `YYYY-MM-DD` |
| Kolom NIK Address & Residential Address kosong | Data tidak lengkap | Field opsional dengan indikator kelengkapan |
| Kolom Education (S) kosong | Data pendidikan tidak ada | Gunakan kolom AJ (Educational Institution) sebagai fallback |
| Career Path tersebar di 26 kolom (AM–BK) | Sulit di-query | Normalisasi ke tabel terpisah `career_history` |
| Row separator divisi (bukan data karyawan) | Perlu di-skip saat import | Filter baris di mana kolom B bukan format Employee ID |
| Employee ID format `YYYYMMNNXXX` | Bisa decode join date & urutan | Parsing ditampilkan di UI detail karyawan |

---

## 4. Arsitektur & Teknologi

### Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | **Astro.js** (SSR mode) + Tailwind CSS + komponen interaktif berbasis React/Vanilla JS |
| **Backend / API** | **Laravel 11** (PHP 8.3) – RESTful API dengan struktur MVC penuh |
| **Database** | **MySQL 8** (via cPanel) — database relasional menggantikan Google Sheets sebagai penyimpanan utama |
| **ORM** | Laravel Eloquent + Laravel Migrations & Seeders |
| **Auth** | Laravel Sanctum (token-based API auth) + Google OAuth 2.0 via Laravel Socialite |
| **Queue / Scheduler** | Laravel Queue (database driver) + Laravel Task Scheduler (`cron` via cPanel) |
| **Storage Dokumen** | Laravel Storage — Google Drive via `google-drive` Flysystem adapter |
| **Email** | Laravel Mail + SMTP (mis. Mailgun, Google Workspace SMTP, atau SMTP cPanel) |
| **Import** | Laravel Excel (`maatwebsite/excel`) untuk parsing CSV & XLSX |
| **Hosting** | Shared Hosting cPanel (PHP 8.3, MySQL, Apache/LiteSpeed) |
| **Chart Org** | OrgChart.js atau D3.js (diintegrasikan sebagai Astro component, data dari Laravel API) |
| **Version Control** | Git + GitHub |

### Mengapa Laravel?

| Alasan | Penjelasan |
|--------|-----------|
| **Arsitektur enterprise-grade** | MVC + Service Layer + Repository Pattern — cocok untuk sistem HR yang kompleks dengan banyak modul |
| **Database relasional penuh** | MySQL via Eloquent ORM: relasi antar tabel, transaksi, foreign key, query kompleks (join, group by, subquery) jauh lebih powerful dari Google Sheets |
| **Ekosistem kaya** | Ribuan package siap pakai: Laravel Excel, Sanctum, Socialite, Horizon, Telescope, dll. |
| **Keamanan mature** | CSRF protection, SQL injection prevention via Eloquent, rate limiting, middleware auth, enkripsi bcrypt bawaan |
| **Queue & Scheduler** | Notifikasi email, export berat, dan proses batch dijalankan di background — tidak memblokir user |
| **Cocok dengan cPanel** | Laravel berjalan sempurna di shared hosting cPanel dengan PHP 8.x + MySQL |
| **Skalabilitas** | Jika ke depan butuh VPS/cloud, kode Laravel tidak perlu diubah — hanya konfigurasi server |

### Arsitektur Sistem

```
[Browser Pengguna]
       │
       │  HTTPS
       ▼
┌─────────────────────────────────────────────────────┐
│           Shared Hosting cPanel                     │
│                                                     │
│  ┌──────────────────────┐  ┌───────────────────┐   │
│  │   Astro.js (SSR)     │  │   Laravel 11 API  │   │
│  │   Frontend           │◀─│   /api/v1/*       │   │
│  │   (public_html/)     │  │   (laravel/)      │   │
│  └──────────────────────┘  └────────┬──────────┘   │
│                                     │               │
│                              ┌──────▼──────┐        │
│                              │  MySQL 8    │        │
│                              │  (cPanel DB)│        │
│                              └─────────────┘        │
└─────────────────────────────────────────────────────┘
       │
       ├──▶ Google Drive API   (penyimpanan dokumen & bukti klaim)
       ├──▶ Google Sheets API  (import data sumber — read-only)
       ├──▶ Google OAuth 2.0   (login via Google)
       └──▶ SMTP Server        (pengiriman notifikasi email)
```

### Struktur Proyek

#### Backend — Laravel 11

```
insan-apu-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── PegawaiController.php
│   │   │   ├── CareerController.php
│   │   │   ├── OrgChartController.php
│   │   │   ├── ReimbursementController.php
│   │   │   ├── AttendanceController.php
│   │   │   ├── LeaveController.php
│   │   │   ├── PayrollController.php
│   │   │   ├── RecruitmentController.php
│   │   │   ├── PerformanceController.php
│   │   │   ├── TrainingController.php
│   │   │   ├── ImportController.php
│   │   │   └── DashboardController.php
│   │   ├── Middleware/
│   │   │   ├── CheckRole.php
│   │   │   ├── CheckDivisiScope.php
│   │   │   └── AuditLogger.php
│   │   └── Requests/           # Form Request Validation
│   ├── Models/
│   │   ├── Pegawai.php
│   │   ├── CareerHistory.php
│   │   ├── FamilyMember.php
│   │   ├── Reimbursement.php
│   │   ├── Attendance.php
│   │   ├── LeaveRequest.php
│   │   ├── Payroll.php
│   │   ├── JobVacancy.php
│   │   ├── Candidate.php
│   │   ├── PerformanceReview.php
│   │   ├── Training.php
│   │   └── User.php
│   ├── Services/               # Business logic layer
│   │   ├── PayrollService.php
│   │   ├── ImportService.php
│   │   ├── NotificationService.php
│   │   └── GoogleDriveService.php
│   ├── Jobs/                   # Background queue jobs
│   │   ├── ProcessImportJob.php
│   │   ├── SendNotificationJob.php
│   │   └── GeneratePayslipJob.php
│   └── Console/Commands/       # Scheduled commands
│       ├── CheckKontrakHabis.php
│       ├── SendBirthdayNotification.php
│       └── CheckKlaimPending.php
├── database/
│   ├── migrations/             # Semua migrasi tabel
│   └── seeders/                # Seeder master data
├── routes/
│   └── api.php                 # Semua endpoint API
├── config/
│   ├── sanctum.php
│   └── filesystems.php         # Google Drive config
└── .env                        # Konfigurasi environment
```

#### Frontend — Astro.js (SSR)

```
insan-apu-frontend/
├── src/
│   ├── pages/
│   │   ├── index.astro              # Halaman login
│   │   ├── dashboard.astro          # Dashboard utama
│   │   ├── pegawai/
│   │   │   ├── index.astro          # Daftar karyawan
│   │   │   ├── [id].astro           # Detail karyawan
│   │   │   └── tambah.astro         # Form tambah karyawan
│   │   ├── org-chart.astro          # Struktur organisasi
│   │   ├── reimbursement/
│   │   │   ├── index.astro          # Daftar klaim
│   │   │   └── ajukan.astro         # Form pengajuan klaim
│   │   ├── kehadiran/
│   │   │   ├── index.astro          # Absensi & cuti
│   │   │   └── timesheet.astro
│   │   ├── payroll/
│   │   │   └── index.astro
│   │   ├── rekrutmen/
│   │   │   ├── index.astro          # Lowongan & kandidat
│   │   │   └── [id].astro
│   │   ├── pengembangan/
│   │   │   └── index.astro
│   │   ├── import.astro             # Halaman import data
│   │   └── admin/
│   │       ├── users.astro
│   │       └── master.astro
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Sidebar.astro
│   │   ├── StatWidget.astro
│   │   ├── OrgChart.astro
│   │   └── DataTable.astro
│   ├── layouts/
│   │   └── MainLayout.astro
│   └── lib/
│       ├── api.ts                   # Fungsi fetch ke Laravel API
│       └── auth.ts                  # Logika token Sanctum
├── public/
│   └── logo.png
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

### Desain API Laravel (RESTful)

Semua endpoint diawali `/api/v1/` dan dilindungi middleware `auth:sanctum` kecuali endpoint login.

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| `POST` | `/auth/login` | Login Email/Password |
| `POST` | `/auth/google` | Login via Google OAuth |
| `POST` | `/auth/logout` | Logout & revoke token |
| `GET` | `/dashboard/stats` | Data widget statistik |
| `GET/POST` | `/pegawai` | Daftar & tambah karyawan |
| `GET/PUT/DELETE` | `/pegawai/{id}` | Detail, edit, nonaktifkan |
| `GET/POST` | `/pegawai/{id}/career` | Riwayat karir |
| `GET` | `/org-chart` | Data hierarki org chart |
| `GET/POST` | `/reimbursement` | Daftar & ajukan klaim |
| `PUT` | `/reimbursement/{id}/approve` | Approve klaim |
| `GET/POST` | `/attendance` | Absensi harian |
| `GET/POST` | `/leave` | Pengajuan cuti |
| `GET/POST` | `/payroll` | Data payroll |
| `GET/POST` | `/rekrutmen/lowongan` | Manajemen lowongan |
| `GET/POST` | `/rekrutmen/kandidat` | Data kandidat |
| `GET/PUT` | `/rekrutmen/toggle` | Toggle ON/OFF rekrutmen |
| `GET/POST` | `/performance` | Penilaian kinerja |
| `GET/POST` | `/training` | Program pelatihan |
| `POST` | `/import/sheets` | Import dari Google Sheets |
| `POST` | `/import/csv` | Import dari CSV |
| `POST` | `/import/excel` | Import dari Excel |

### Planning Deployment ke cPanel Shared Hosting

#### Prasyarat Hosting

| Kebutuhan | Spesifikasi Minimum |
|-----------|-------------------|
| PHP | **8.3** dengan ekstensi: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo` |
| MySQL | **8.0** (tersedia via cPanel phpMyAdmin) |
| Node.js | Diperlukan hanya saat build Astro (lokal) |
| Disk Space | Minimal **1 GB** |
| SSL | Wajib — Let's Encrypt via cPanel |
| Domain/Subdomain | `insan-apu.alazhar.or.id` |
| Cron Job | Akses **cPanel Cron Jobs** untuk Laravel Scheduler |

#### Struktur Direktori di cPanel

```
/home/username/
├── public_html/                ← Astro frontend (HTML/CSS/JS)
│   └── .htaccess
│
└── laravel/                    ← Laravel app (di luar public_html!)
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── database/
    ├── public/                 ← Di-symlink atau copy ke public_html/api/
    ├── routes/
    ├── storage/
    └── .env
```

> **Penting:** Folder `laravel/` ditempatkan **di luar `public_html/`** agar kode sumber tidak bisa diakses langsung via browser. Hanya folder `laravel/public/` yang diekspos ke web.

#### Langkah Deployment

**Backend (Laravel):**

```
1. Upload seluruh folder laravel/ via FTP / File Manager
   ke /home/username/laravel/

2. Symlink atau copy laravel/public/* ke public_html/api/

3. Edit public_html/api/index.php:
   require __DIR__.'/../../../laravel/vendor/autoload.php';

4. Buat database MySQL di cPanel → phpMyAdmin

5. Set .env:
   DB_HOST=localhost
   DB_DATABASE=nama_db
   DB_USERNAME=user_db
   DB_PASSWORD=pass_db
   APP_URL=https://insan-apu.alazhar.or.id/api

6. Via cPanel Terminal (jika tersedia) atau SSH:
   php artisan migrate --seed
   php artisan storage:link
   php artisan config:cache
   php artisan route:cache

7. Set permission:
   chmod -R 755 storage/
   chmod -R 755 bootstrap/cache/
```

**Frontend (Astro):**

```
1. Lokal: npm run build → menghasilkan folder dist/

2. Upload isi dist/ ke public_html/

3. Pastikan .htaccess terkonfigurasi (lihat di bawah)
```

#### Konfigurasi `.htaccess` di `public_html/`

```apache
Options -MultiViews
RewriteEngine On

# Redirect HTTP ke HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Arahkan /api/* ke Laravel
RewriteRule ^api/(.*)$ /api/index.php [L]

# Handle Astro SSR routing (semua non-file ke index.html)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ /index.html [L]
```

#### Laravel Scheduler via cPanel Cron Jobs

Di cPanel → **Cron Jobs**, tambahkan:

```
* * * * * php /home/username/laravel/artisan schedule:run >> /dev/null 2>&1
```

Ini menjalankan semua scheduled task Laravel setiap menit (notifikasi kontrak habis, ulang tahun, klaim pending, dll.).

#### Queue Worker (opsional untuk shared hosting)

Karena shared hosting tidak mendukung daemon process, gunakan **cron job sebagai queue runner**:

```
*/5 * * * * php /home/username/laravel/artisan queue:work --stop-when-empty >> /dev/null 2>&1
```

Ini menjalankan queue setiap 5 menit — cukup untuk notifikasi email dan proses import batch.

#### Update Deployment (jika ada perubahan kode)

```
Backend  : Upload file yang berubah via FTP → php artisan config:cache → php artisan route:cache
Frontend : npm run build → upload dist/ baru → replace di public_html/
```

> Untuk otomasi, gunakan **GitHub Actions** yang auto-deploy ke cPanel via FTP/SSH setiap push ke branch `main` — backend dan frontend di-deploy secara terpisah dalam satu workflow.

### Alur Data

```
[Sumber Data]                         [Import via Laravel]         [Database MySQL]
──────────────────────────────────────────────────────────────────────────────────
Google Sheets Sumber  ──Sheets API──▶  ImportController          ──▶  tabel pegawai
(read-only)                            ImportService                ──▶  tabel career_history
                                       (normalisasi data)           ──▶  tabel family_members

Upload CSV / Excel    ──maatwebsite──▶  Validasi & Preview        ──▶  tabel pegawai
(manual upload)           /excel        ProcessImportJob (queue)
```

---

## 5. Fitur: Tampilan Awal

Halaman pertama setelah login menampilkan **angka statistik** dalam bentuk kartu. Tidak menggunakan grafik, cukup angka yang jelas dan ringkas.

### Widget Statistik

Semua widget dapat dikonfigurasi (aktif/nonaktif, urutan, label, visibilitas per role) melalui **Master Akses** oleh Super Admin.

| Kode Widget | Label | Sumber Kalkulasi |
|-------------|-------|-----------------|
| `TOTAL_AKTIF` | Total Karyawan Aktif | COUNT(is_active = true) |
| `TOTAL_TETAP` | Karyawan Tetap | COUNT(employment_status = 'Tetap') |
| `TOTAL_KONTRAK` | Karyawan Kontrak | COUNT(employment_status = 'Kontrak') |
| `TOTAL_RELAWAN` | Relawan | COUNT(employment_status = 'Relawan') |
| `JK_PRIA` | Laki-Laki | COUNT(gender = 'L') |
| `JK_WANITA` | Perempuan | COUNT(gender = 'P') |
| `PER_DIVISI` | Per Divisi | Tabel: Nama Divisi \| Angka |
| `PER_UNIT` | Per Unit | Tabel: Nama Unit \| Angka |
| `PER_LEVEL` | Per Level Jabatan | Tabel: Level \| Angka |
| `MASA_KERJA_AVG` | Rata-rata Masa Kerja | AVG(employment_count_year) dalam tahun |
| `KONTRAK_30_HARI` | Kontrak Habis < 30 Hari | COUNT(kontrak yang akan habis) |
| `JOIN_BULAN_INI` | Masuk Bulan Ini | COUNT(join_date bulan berjalan) |
| `ULTAH_MINGGU_INI` | Ulang Tahun Minggu Ini | COUNT(date_of_birth minggu ini) |
| `KLAIM_PENDING` | Klaim Menunggu Approval | COUNT(reimbursement status = 'pending') |

### Konfigurasi Widget di Master Akses

- Toggle **aktif/nonaktif** per widget
- Atur **urutan tampil** (drag-and-drop atau input angka)
- Ubah **label** sesuai istilah internal LAZWaf
- Atur **visibilitas per role** (contoh: widget detail unit hanya untuk Admin HR ke atas)

---

## 6. Fitur: Login & Autentikasi

### Mekanisme

Sistem mendukung **dua metode login** yang dapat digunakan bergantian:

#### Metode 1 — Login dengan Google Account

- Login via Google OAuth menggunakan **Laravel Socialite**
- Setelah Google callback, Laravel membuat atau memperbarui data user di tabel `users`
- Token **Laravel Sanctum** diterbitkan dan disimpan di localStorage/cookie frontend
- Cocok untuk pengguna yang menggunakan akun Google (Gmail atau Google Workspace)

#### Metode 2 — Login dengan Email & Password

- Untuk pengguna yang **tidak menggunakan Google/Gmail** (mis. email kantor non-Google, Yahoo, Outlook, dll.)
- Admin mendaftarkan akun pengguna terlebih dahulu di modul **Manajemen User** dengan mengisi: email, nama lengkap, role, dan password awal
- Password disimpan menggunakan **bcrypt** (Laravel default via `Hash::make()`) — tidak pernah disimpan dalam bentuk plain text
- Pengguna login dengan email yang didaftarkan admin + password
- Laravel menerbitkan token Sanctum setelah verifikasi berhasil
- Fitur **Lupa Password**: Admin HR / Super Admin melakukan reset password dari panel Manajemen User; sistem mengirim password baru sementara ke email pengguna via Laravel Mail

#### Manajemen Akun oleh Admin

Di halaman **Manajemen User**, Super Admin / Admin HR dapat:
- Tambah akun baru (pilih metode login: Google atau Email/Password)
- Set / reset password (untuk akun Email/Password)
- Nonaktifkan akun
- Ubah role pengguna
- Paksa logout / revoke semua token Sanctum pengguna

#### Sesi & Keamanan

- Semua request API menggunakan **Bearer Token** (Laravel Sanctum) di header `Authorization`
- Token disimpan di `localStorage` frontend (Astro) atau cookie `HttpOnly`
- Durasi token: **8 jam** (dapat dikonfigurasi via `sanctum.expiration` di `config/sanctum.php`)
- Login gagal 5 kali berturut-turut → akun dikunci sementara 15 menit (via Laravel `RateLimiter`)

### Halaman Login

```
┌──────────────────────────────────────────┐
│        🏢 Insan APU – LAZWaf Al Azhar    │
├──────────────────────────────────────────┤
│                                          │
│  [G]  Masuk dengan Google                │
│                                          │
│  ──────────── atau ────────────          │
│                                          │
│  Email   : [____________________]        │
│  Password: [____________________]        │
│                                          │
│  [     Masuk     ]                       │
│                                          │
│  Lupa password? Hubungi Admin HR         │
│                                          │
└──────────────────────────────────────────┘
```

- Tampilkan logo **Insan APU** dan nama organisasi LAZWaf Al Azhar
- Dua opsi login tersedia dalam satu halaman (tombol Google + form email/password)
- Pesan error jika email tidak terdaftar atau password salah: tampilkan instruksi menghubungi Admin HR
- Tidak menampilkan pesan spesifik "email tidak ada" atau "password salah" secara terpisah (untuk keamanan) — cukup: *"Email atau password tidak valid"*

### Audit Login

Setiap percobaan login (berhasil maupun gagal) dicatat di tabel `audit_logs` (MySQL) oleh middleware `AuditLogger`:

| Field | Contoh |
|-------|--------|
| Timestamp | `2026-06-23 08:30:00` |
| Email | `user@alazhar.or.id` |
| Metode Login | `GOOGLE` / `EMAIL_PASSWORD` |
| Status | `SUCCESS` / `FAILED` |
| Alasan Gagal | `Password salah` / `Akun tidak aktif` / `Akun terkunci` |
| User Agent | `Chrome/125.0` |

---

## 7. Fitur: Dashboard

### Layout Utama

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER: Logo Insan APU | Nama User | Divisi | Logout         │
├────────────┬─────────────────────────────────────────────────┤
│            │  [Widget] [Widget] [Widget] [Widget]             │
│  SIDEBAR   │                                                  │
│  Navigasi  │  [Tabel Per Divisi]   [Tabel Per Unit]          │
│            │                                                  │
│            │  [Widget] [Widget] [Widget]                      │
├────────────┴─────────────────────────────────────────────────┤
│ FOOTER: Insan APU – LAZWaf Al Azhar | v1.1 | 23 Jun 2026    │
└──────────────────────────────────────────────────────────────┘
```

### Perilaku Dashboard

- Data di-refresh setiap kali halaman dibuka
- Tombol **Refresh Manual** tersedia di pojok kanan atas
- Timestamp "Terakhir diperbarui: HH:MM" ditampilkan per widget
- Widget Per Divisi hanya menampilkan divisi yang ada datanya

---

## 8. Fitur: Hak Akses

### Role Default

| Role | Deskripsi | Siapa |
|------|-----------|-------|
| **Super Admin** | Akses penuh + konfigurasi sistem | IT / Pimpinan |
| **Admin HR** | Kelola semua data karyawan | Tim HRD |
| **Manager Divisi** | Lihat & approve data divisinya saja | Kepala Divisi / Manager |
| **Staf Viewer** | Lihat data terbatas milik sendiri | Karyawan umum |

### Matrix Permission

| Modul | Super Admin | Admin HR | Manager Divisi | Staf Viewer |
|-------|:-----------:|:--------:|:--------------:|:-----------:|
| Dashboard (semua widget) | ✅ | ✅ | ✅ (divisi sendiri) | ✅ (terbatas) |
| Data Pegawai – View | ✅ | ✅ | ✅ (divisi sendiri) | ❌ |
| Data Pegawai – Tambah | ✅ | ✅ | ❌ | ❌ |
| Data Pegawai – Edit | ✅ | ✅ | ❌ | ❌ |
| Data Pegawai – Nonaktifkan | ✅ | ✅ | ❌ | ❌ |
| Data Pegawai – Hapus | ✅ | ❌ | ❌ | ❌ |
| Riwayat Karir – View | ✅ | ✅ | ✅ (divisi sendiri) | ❌ |
| Riwayat Karir – Edit | ✅ | ✅ | ❌ | ❌ |
| Struktur Organisasi – View | ✅ | ✅ | ✅ | ✅ |
| Struktur Organisasi – Edit | ✅ | ✅ | ❌ | ❌ |
| Reimbursement – Ajukan | ✅ | ✅ | ✅ | ✅ |
| Reimbursement – Approve (L1) | ✅ | ✅ | ✅ (divisi sendiri) | ❌ |
| Reimbursement – Approve (L2) | ✅ | ✅ | ❌ | ❌ |
| Reimbursement – View Semua | ✅ | ✅ | ✅ (divisi sendiri) | ❌ |
| Kehadiran – Absensi / Cuti / Lembur | ✅ | ✅ | ✅ | ✅ (diri sendiri) |
| Kehadiran – Approve | ✅ | ✅ | ✅ (divisi sendiri) | ❌ |
| Kehadiran – Rekap & Laporan | ✅ | ✅ | ✅ (divisi sendiri) | ❌ |
| Payroll – View Slip Gaji | ✅ | ✅ | ✅ (divisi sendiri) | ✅ (diri sendiri) |
| Payroll – Proses & Finalisasi | ✅ | ✅ | ❌ | ❌ |
| Payroll – Konfigurasi Komponen | ✅ | ✅ | ❌ | ❌ |
| Administrasi HR – ESS | ✅ | ✅ | ✅ | ✅ |
| Administrasi HR – Onboarding/Offboarding | ✅ | ✅ | ❌ | ❌ |
| Administrasi HR – Template Dokumen | ✅ | ✅ | ✅ (view) | ❌ |
| Administrasi HR – Manajemen Aset | ✅ | ✅ | ✅ (view, divisi sendiri) | ❌ |
| Administrasi HR – HR Helpdesk (kirim tiket) | ✅ | ✅ | ✅ | ✅ |
| Administrasi HR – HR Helpdesk (kelola) | ✅ | ✅ | ❌ | ❌ |
| Rekrutmen – Toggle ON/OFF | ✅ | ✅ | ❌ | ❌ |
| Rekrutmen – Kelola Lowongan & Kandidat | ✅ | ✅ | ❌ | ❌ |
| Pengembangan – Performance Review | ✅ | ✅ | ✅ (divisi sendiri) | ✅ (self-assessment) |
| Pengembangan – LMS & IDP | ✅ | ✅ | ✅ (view, divisi sendiri) | ✅ (view diri sendiri) |
| Master Data | ✅ | ✅ (view+edit) | ✅ (view) | ❌ |
| Import Data (Sheets) | ✅ | ✅ | ❌ | ❌ |
| Import Data (CSV/Excel) | ✅ | ✅ | ❌ | ❌ |
| Laporan & Export | ✅ | ✅ | ✅ (divisi sendiri) | ❌ |
| Hak Akses – Role & User | ✅ | ❌ | ❌ | ❌ |
| Master Akses / Config Widget | ✅ | ❌ | ❌ | ❌ |
| Audit Log | ✅ | ✅ (view) | ❌ | ❌ |
| App Settings | ✅ | ❌ | ❌ | ❌ |

### Pembatasan Data Berdasarkan Role

- **Manager Divisi:** query ke sheet `pegawai` otomatis ter-filter `WHERE departement = [divisi_manager]`
- **Staf Viewer:** hanya dapat melihat profil diri sendiri dan mengajukan reimbursement
- Kolom **NIK, No. HP, Alamat** hanya tampil untuk Admin HR ke atas

---

## 9. Fitur: Data Pegawai

### Form Data Pegawai (Multi-Step)

#### Step 1 – Identitas & Posisi

```
Employee ID*        : [auto-generate dari format YYYYMMNNXXX / manual]
Nama Lengkap*       : [text]
Posisi Saat Ini*    : [text]
Departemen*         : [dropdown: Sekretariat | Keuangan | LAZ Al Azhar | Fundraising | Program | ...]
Unit*               : [dropdown: dinamis berdasarkan Departemen dipilih]
Status Kepegawaian* : [dropdown: Tetap | Kontrak | Relawan]
                      [tooltip: "Relawan: berbayar namun tanpa komponen tunjangan"]
Level*              : [dropdown: Level 1 – Staf Junior | Level 2 – Koordinator/Staf Senior |
                       Level 3 – Manager/Koordinator Senior | Level 4 – Manager Senior |
                       Level 5 – Direktur/Kepala Divisi]
Job Level*          : [dropdown: Direktur | Kepala Divisi | Manager Senior | Manager |
                       Koordinator Senior | Koordinator | Staf Senior | Staf | Non-Staf | Relawan]
Atasan Langsung     : [search autocomplete dari daftar karyawan aktif]
Tanggal Masuk*      : [date]
Tanggal Kontrak Berakhir : [date, tampil jika Status = Kontrak]
```

#### Step 2 – Data Pribadi

```
Tempat Lahir*       : [text]
Tanggal Lahir*      : [date]
Jenis Kelamin*      : [radio: Laki-laki | Perempuan]
Status Nikah*       : [dropdown: Menikah | Single | Janda | Duda]
No. HP*             : [text, format 08xx / +62xx]
Email Kantor        : [email]
Email Pribadi       : [email]
NIK                 : [text, 16 digit]
Alamat KTP          : [textarea]
Alamat Domisili     : [textarea]
```

#### Step 3 – Pendidikan

```
Pendidikan Terakhir : [dropdown: SD | SMP | SMA/SMK | D3 | S1 | S2 | S3]
Nama Institusi      : [text]
Kota Institusi      : [text]
Tanggal Lulus       : [date]
```

#### Step 4 – Data Keluarga *(Opsional)*

```
Nama Pasangan       : [text]
Tanggal Lahir Pasangan: [date]

[+] Tambah Anak (dinamis, tidak dibatasi jumlah)
  Anak 1 - Nama     : [text]
  Anak 1 - Tanggal Lahir: [date]
  [Hapus baris ini]
...
```

> Data keluarga bersifat opsional namun diperlukan untuk keperluan administrasi BPJS dan data pegawai lengkap.

#### Step 5 – Riwayat Karir *(Lihat Bagian 10)*

### Tampilan Daftar Karyawan

**Kolom tabel:**

| Kolom | Keterangan |
|-------|------------|
| Employee ID | |
| Nama Lengkap | |
| Posisi Saat Ini | disingkat jika terlalu panjang, tooltip full teks |
| Departemen | |
| Unit | |
| Status | badge warna: Tetap (hijau) / Kontrak (kuning) / Relawan (abu-abu) |
| Level | Level 1 s.d. Level 5 |
| Masa Kerja | contoh: "16 th 5 bl" |
| Aksi | [👁 Detail] [✏ Edit] [⏸ Nonaktifkan] |

**Filter tersedia:**
- Departemen (Sekretariat, Keuangan, LAZ, Fundraising, Program, Semua)
- Unit (dinamis berdasarkan departemen)
- Status Kepegawaian (Tetap / Kontrak / Relawan / Semua)
- Job Level (Direktur / Kepala Divisi / Manager / Koordinator / Staf / Semua)
- Gender (Laki-laki / Perempuan / Semua)
- Status Aktif (Aktif / Nonaktif / Semua)

**Pencarian:** Nama, Employee ID, NIK, Posisi

### Halaman Detail Karyawan

Tab navigasi:

1. **Profil** — identitas, kontak, data pribadi
2. **Kepegawaian** — posisi, departemen, level, masa kerja auto-hitung
3. **Keluarga** — pasangan + daftar anak
4. **Riwayat Karir** — timeline karir
5. **Reimbursement** — riwayat klaim biaya karyawan ini
6. **Dokumen** — lampiran file (KTP, ijazah, kontrak, dll.)
7. **Log Perubahan** — siapa mengubah apa, kapan

### Masa Kerja Auto-Hitung

```
Masa Kerja = TODAY() - Join Date
Tampil sebagai: "16 tahun 5 bulan 16 hari"
```

---

## 10. Fitur: Riwayat Karir

Fitur **kritis** karena data sumber memiliki hingga 12 riwayat jabatan per karyawan tersebar di 26 kolom (AM–BK).

### Struktur Data Riwayat Karir

Data dari kolom `AM` (Career Start) hingga `BK` (Career Path 12 + tanggal) dinormalisasi ke sheet `career_history`:

```
career_history sheet:
| id | employee_id | urutan | jabatan | departement | tanggal_mulai | tanggal_selesai | keterangan | is_current |
```

**Contoh konversi dari Rahmatullah Sidik:**

| # | Jabatan | Mulai | Selesai |
|---|---------|-------|---------|
| 0 | Staf Program Charity | Jan 2010 | Jan 2011 |
| 1 | Manager Program | Jan 2011 | Feb 2012 |
| … | … | … | … |
| 11 | Kepala Divisi Sekretariat LAZWaf | Okt 2024 | *sekarang* |

### Tampilan Timeline Karir

```
[2010] ──●── Staf Program Charity
         │
[2011] ──●── Manager Program
         │
[2016] ──●── Kepala Divisi Program dan Pendayagunaan
         │
[2024] ──●── Kepala Divisi Sekretariat LAZWaf Al Azhar  ◀ (saat ini)
```

### Fitur CRUD Riwayat Karir

- **Tambah** entri karir baru (saat promosi/mutasi/rotasi)
- **Edit** entri yang sudah ada
- **Hapus** entri (dengan konfirmasi, hanya Admin HR ke atas)
- **Urut ulang** otomatis berdasarkan tanggal mulai

---

## 11. Fitur: Struktur Organisasi

### 11.1 Org Chart (Bagan Organisasi)

Visualisasi hierarki seluruh karyawan aktif dalam bentuk bagan organisasi interaktif.

**Spesifikasi teknis:**
- Library: OrgChart.js atau D3.js (dirender via HTML Service GAS)
- Data bagan diambil dari field `atasan_langsung` di sheet `pegawai`
- Render real-time berdasarkan data terbaru

**Tampilan per node:**
```
┌─────────────────────────┐
│  [Foto / Avatar Inisial]│
│  Rahmatullah Sidik      │
│  Kepala Divisi Sekretariat│
│  Sekretariat            │
└─────────────────────────┘
```

**Fitur interaktif:**
- Zoom in/out dan pan (geser)
- Klik node → sidebar detail karyawan (nama, posisi, kontak)
- Expand/collapse sub-tree per divisi
- Filter tampilkan per divisi saja
- Tombol **Fullscreen**
- Export org chart ke **PNG** atau **PDF**

### 11.2 Hierarki Atasan-Bawahan (untuk Approval)

Setiap karyawan memiliki **atasan langsung** yang digunakan sebagai rantai approval:

```
Staf → Koordinator → Manager → Kepala Divisi → Admin HR → (selesai)
```

**Konfigurasi:**
- Field `atasan_langsung` diisi di Step 1 form data pegawai
- Sistem menyimpan relasi di kolom `manager_id` di sheet `pegawai`
- Digunakan oleh fitur Reimbursement untuk routing approval

**Tampilan hierarki di profil karyawan:**
```
Atasan Langsung: Ahmad Maulana (Kepala Divisi Sekretariat)
  └── Anda: Rahmatullah Sidik (Staf Kelembagaan)
       └── Bawahan Langsung: [daftar nama]
```

### 11.3 Manajemen Struktur Org

- Admin HR / Super Admin dapat mengubah `atasan_langsung` karyawan
- Sistem mendeteksi dan memperingatkan jika terjadi **circular reference** (A atasan B, B atasan A)
- Riwayat perubahan atasan tersimpan di `audit_log`

---

## 12. Fitur: Manajemen Reimbursement & Klaim

### 12.1 Pengajuan Klaim

Setiap karyawan (semua role) dapat mengajukan klaim penggantian biaya melalui halaman **"Ajukan Klaim"**.

**Kategori klaim yang didukung:**

| Kategori | Contoh Biaya |
|----------|-------------|
| Kesehatan | Obat, dokter, lab, kacamata |
| Transportasi | Bensin, taksi, toll, parkir |
| Makan | Uang makan dinas luar |
| Komunikasi | Pulsa, kuota internet dinas |
| Operasional | ATK, percetakan dinas |
| Lainnya | Biaya lain-lain dengan keterangan |

**Form Pengajuan Klaim:**

```
Kategori Biaya*   : [dropdown]
Jumlah Klaim*     : [nominal, Rp]
Tanggal Pengeluaran* : [date]
Keterangan*       : [textarea, min 10 karakter]
Upload Bukti*     : [file upload, maks 5 file, format: JPG/PNG/PDF, maks 5MB/file]
```

**Validasi upload bukti:**
- Format yang diterima: JPG, PNG, PDF
- Ukuran maksimum per file: 5 MB
- Jumlah file maksimum: 5 file per klaim
- File disimpan ke Google Drive: `/Insan APU/Reimbursement/{EmployeeID}/{KlaimID}/`

### 12.2 Approval Workflow

Klaim melalui dua level approval:

```
PENGAJU  ──▶  APPROVAL L1 (Atasan Langsung)  ──▶  APPROVAL L2 (Admin HR / Keuangan)  ──▶  SELESAI
              [Setujui / Tolak]                    [Setujui / Tolak / Revisi]
```

**Status Klaim:**

| Status | Keterangan | Warna Badge |
|--------|-----------|-------------|
| `draft` | Baru dibuat, belum disubmit | Abu-abu |
| `pending_l1` | Menunggu approval atasan langsung | Kuning |
| `approved_l1` | Disetujui atasan, menunggu Admin HR | Biru |
| `pending_l2` | Menunggu approval Admin HR / Keuangan | Oranye |
| `approved` | Disetujui semua, siap dibayarkan | Hijau |
| `rejected` | Ditolak (dengan alasan) | Merah |
| `revision` | Perlu revisi dari pengaju | Ungu |

**Notifikasi email otomatis:**
- Ke pengaju: saat klaim disetujui L1, ditolak L1, diminta revisi, disetujui final, ditolak final
- Ke approver L1: saat ada klaim baru dari bawahannya
- Ke Admin HR: saat klaim masuk ke approval L2

### 12.3 Tampilan Daftar Klaim

**Filter:**
- Status (Semua / Pending / Approved / Rejected)
- Kategori
- Rentang tanggal pengajuan
- Departemen (untuk Admin HR)
- Nama karyawan (untuk Admin HR)

**Kolom tabel:**

| Kolom | Keterangan |
|-------|------------|
| ID Klaim | Format: `KLM-2026-00001` |
| Nama Pengaju | |
| Departemen | |
| Kategori | |
| Jumlah | nominal Rp |
| Tanggal Pengajuan | |
| Status | badge warna |
| Aksi | [👁 Detail] [✅ Approve] [❌ Tolak] [✏ Revisi] |

### 12.4 Detail & Preview Bukti

- Preview thumbnail gambar langsung di halaman
- Klik thumbnail → buka full view modal
- PDF dibuka di tab baru
- Download semua bukti dalam satu klik (ZIP)

### 12.5 Laporan Reimbursement

| Laporan | Filter |
|---------|--------|
| Rekap klaim per karyawan | Periode, status |
| Rekap klaim per departemen | Periode, kategori |
| Klaim pending lebih dari N hari | Rentang waktu |
| Total pengeluaran per kategori | Periode, divisi |

---

## 13. Fitur: Import Data

### 13.1 Import dari Google Sheets Sumber

- Tombol **"Import dari Google Sheets"** di halaman Data Pegawai
- Sistem membaca spreadsheet sumber via Google Sheets API (ID: `1VEbMDaiqXRTGUymB_uL7uip0OIe_qO0qnRdbd7j_FGs`)
- **Preview tabel** sebelum dieksekusi
- Progress bar saat import berjalan

**Proses validasi otomatis:**
- Skip baris yang bukan data karyawan (baris header divisi seperti "Divisi Sekretariat")
- Tandai baris dengan format tanggal tidak konsisten untuk review manual
- Deteksi Employee ID duplikat
- Validasi kolom wajib tidak kosong

**Normalisasi otomatis:**
- Format tanggal: `8/21/1977`, `3 Jul 2007`, `13/01/1982` → `YYYY-MM-DD`
- Gender: `L` → `Laki-laki`, `P` → `Perempuan`
- Career path 12 kolom → normalisasi ke tabel `career_history`

### 13.2 Import dari CSV

Upload file `.csv` dengan format yang telah ditentukan:

**Langkah-langkah:**
1. Download template CSV dari tombol **"Unduh Template CSV"**
2. Isi data karyawan mengikuti template
3. Upload file CSV via tombol **"Upload CSV"**
4. Sistem menampilkan preview hasil parsing (jumlah baris valid, baris error)
5. Admin review & konfirmasi sebelum data dimasukkan

**Spesifikasi template CSV:**

```csv
employee_id,full_name,current_position,departement,unit,employment_status,job_level,
join_date,email_kantor,mobile_phone,place_of_birth,date_of_birth,gender,marital_status,
nik,education_level,institution_name,graduation_date
```

**Aturan validasi CSV:**
- Baris pertama harus berupa header (sama persis dengan template)
- Field wajib: `full_name`, `departement`, `employment_status`, `join_date`, `gender`
- Format tanggal: `YYYY-MM-DD` atau `DD/MM/YYYY`
- Encoding: UTF-8
- Pemisah: koma (`,`) atau titik koma (`;`) — sistem auto-detect
- Ukuran file maksimum: 10 MB

**Penanganan error:**
- Tampilkan baris bermasalah beserta alasan error
- Opsi: lewati baris error & import yang valid saja, atau batalkan semua

### 13.3 Import dari Excel (.xlsx)

Upload file Excel `.xlsx` dengan sheet bernama **"Data Pegawai"**:

**Langkah-langkah:**
1. Download template Excel dari tombol **"Unduh Template Excel"**
2. Isi data karyawan di sheet "Data Pegawai"
3. Upload file Excel via tombol **"Upload Excel"**
4. Sistem parse menggunakan Google Apps Script built-in atau library SheetJS
5. Preview hasil parsing → konfirmasi → import

**Spesifikasi template Excel:**
- Sheet pertama: `Data Pegawai` (kolom sama seperti template CSV)
- Sheet kedua (opsional): `Riwayat Karir` dengan kolom `employee_id, jabatan, tanggal_mulai, tanggal_selesai`
- Sheet ketiga (opsional): `Data Keluarga` dengan kolom `employee_id, tipe, nama, tanggal_lahir`

**Aturan validasi Excel:**
- Kolom harus sesuai template (nama kolom tidak boleh diubah)
- Tipe data per kolom harus sesuai (tanggal sebagai date Excel, bukan teks)
- Ukuran file maksimum: 25 MB

### 13.4 Halaman Import (UI)

```
┌─────────────────────────────────────────────────────────────┐
│ IMPORT DATA KARYAWAN                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Pilih sumber import:                                        │
│  [📊 Google Sheets]  [📄 Upload CSV]  [📗 Upload Excel]      │
│                                                              │
│  ── Setelah pilih sumber ──                                  │
│                                                              │
│  Preview Data (N baris ditemukan):                           │
│  ┌────────────────────────────────────────────────┐          │
│  │ [Tabel preview 5 baris pertama]                │          │
│  │ ⚠ 3 baris memiliki error (klik untuk detail)  │          │
│  └────────────────────────────────────────────────┘          │
│                                                              │
│  [✅ Import N Baris Valid]   [❌ Batal]                       │
│                                                              │
│  Progress: ████████░░ 80% — Memproses baris 80 dari 100…    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 14. Fitur: Manajemen Kehadiran

### 14.1 Absensi Online

Karyawan melakukan clock in dan clock out kehadiran harian langsung melalui aplikasi Insan APU (via browser desktop atau mobile).

**Form Clock In / Clock Out:**
```
Waktu           : [otomatis — timestamp server]
Lokasi (opsional): [geolokasi browser — latitude/longitude]
Selfie / Foto   : [upload foto wajah sebagai bukti kehadiran]
Keterangan      : [opsional, mis. "WFH", "Dinas Luar"]
```

**Aturan:**
- Satu karyawan hanya bisa clock in sekali per hari
- Clock out hanya bisa dilakukan setelah clock in
- Rekap kehadiran tersimpan di sheet `attendance`

### 14.2 Liveness Validation

Verifikasi foto wajah saat absensi untuk mencegah manipulasi atau titip absen. Foto yang diupload divalidasi:
- Ukuran dan format: JPG/PNG, maks 2 MB
- Foto disimpan ke Google Drive: `/Insan APU/Absensi/{EmployeeID}/{Tanggal}/`
- Admin HR dapat meninjau foto absensi dari panel monitoring

> **Catatan implementasi:** Validasi liveness aktif penuh (deteksi wajah real-time) membutuhkan integrasi library pihak ketiga (mis. Face API.js). Pada versi awal, cukup wajibkan upload selfie sebagai bukti manual yang dapat diperiksa Admin HR.

### 14.3 Leave Management (Manajemen Cuti)

**Pengajuan Cuti:**
```
Jenis Cuti*     : [dropdown: Cuti Tahunan | Cuti Sakit | Cuti Melahirkan | Izin | Lainnya]
Tanggal Mulai*  : [date]
Tanggal Selesai*: [date]
Alasan*         : [textarea]
Lampiran        : [upload surat dokter / dokumen pendukung, opsional]
```

**Approval workflow:**
```
Pengaju ──▶ Atasan Langsung (Approve/Tolak) ──▶ Admin HR (Konfirmasi & Catat)
```

**Saldo cuti:**
- Sistem melacak saldo cuti per karyawan per tahun
- Saldo ditampilkan di profil karyawan dan halaman pengajuan cuti
- Konfigurasi jatah cuti per jenis di Master Data

### 14.4 Timesheet Management

Karyawan dapat mengisi laporan waktu kerja dan tugas harian:

```
Tanggal*     : [date]
Proyek/Tugas*: [text / dropdown dari master proyek]
Jam Mulai*   : [time]
Jam Selesai* : [time]
Deskripsi    : [textarea]
```

- Admin / Manager dapat melihat timesheet seluruh anggota divisi
- Export timesheet per karyawan atau per divisi ke Excel

### 14.5 Overtime Management (Lembur)

**Pengajuan Lembur:**
```
Tanggal Lembur*  : [date]
Jam Mulai*       : [time]
Jam Selesai*     : [time]
Alasan Lembur*   : [textarea]
```

- Approval lembur mengikuti jalur yang sama dengan klaim (atasan langsung → Admin HR)
- Rekap total jam lembur per karyawan per bulan tersedia di laporan

### 14.6 Shift Management

Admin HR / Super Admin dapat mengatur jadwal shift karyawan:

| Field | Keterangan |
|-------|-----------|
| Nama Shift | mis. "Shift Pagi", "Shift Siang" |
| Jam Masuk | mis. 08:00 |
| Jam Keluar | mis. 17:00 |
| Toleransi Keterlambatan | dalam menit |
| Hari Kerja | Senin–Jumat, Senin–Sabtu, dll. |

- Penugasan shift per karyawan atau per divisi
- Jadwal shift dapat dilihat karyawan di profil masing-masing
- Riwayat perubahan shift dicatat di `audit_log`

### 14.7 Rekap & Laporan Kehadiran

| Laporan | Filter | Format |
|---------|--------|--------|
| Rekap kehadiran harian | Tanggal, divisi | Excel |
| Rekap kehadiran bulanan | Bulan, karyawan | Excel |
| Laporan keterlambatan | Periode, divisi | Excel |
| Rekap cuti per karyawan | Periode | Excel |
| Rekap lembur per karyawan | Periode | Excel |

---

## 15. Fitur: Payroll, Kompensasi & Benefit

### 15.1 Payroll Calculation

Sistem menghitung gaji bersih karyawan berdasarkan komponen yang dikonfigurasi Admin HR:

**Komponen Gaji:**

| Komponen | Jenis | Keterangan |
|----------|-------|-----------|
| Gaji Pokok | Tetap | Sesuai kontrak per karyawan |
| Tunjangan Kesehatan | Tetap | Hanya untuk status Tetap & Kontrak |
| Tunjangan Transport | Tetap | Hanya untuk status Tetap & Kontrak |
| Tunjangan Makan | Tetap | Hanya untuk status Tetap & Kontrak |
| BPJS Ketenagakerjaan | Potongan | Sesuai regulasi pemerintah |
| BPJS Kesehatan | Potongan | Sesuai regulasi pemerintah |
| PPh 21 | Potongan | Otomatis kalkulasi |
| Potongan lainnya | Potongan | Mis. pinjaman, keterlambatan |
| Bonus / THR | Variabel | Dikonfigurasi per periode |
| Uang Lembur | Variabel | Dari data overtime yang disetujui |

> **Catatan:** Karyawan berstatus **Relawan** hanya menerima Gaji Pokok — tidak ada komponen tunjangan apa pun.

**Proses payroll bulanan:**
1. Admin HR membuka periode payroll (mis. Juni 2026)
2. Sistem menarik data kehadiran, lembur, dan klaim yang sudah approved
3. Kalkulasi otomatis menghasilkan draft slip gaji per karyawan
4. Admin HR review → konfirmasi → finalisasi

### 15.2 Payslip Distribution

- Slip gaji tersedia di profil masing-masing karyawan (tab **Payslip**)
- Notifikasi email otomatis dikirim saat slip gaji bulan berjalan sudah tersedia
- Format: tampilan web + dapat di-download sebagai PDF
- Slip gaji hanya dapat dilihat oleh karyawan yang bersangkutan dan Admin HR ke atas

### 15.3 Employee Benefit

Konfigurasi paket benefit per status kepegawaian di Master Data:

| Benefit | Tetap | Kontrak | Relawan |
|---------|:-----:|:-------:|:-------:|
| BPJS Kesehatan | ✅ | ✅ | ❌ |
| BPJS Ketenagakerjaan | ✅ | ✅ | ❌ |
| Tunjangan Transport | ✅ | ✅ | ❌ |
| Tunjangan Makan | ✅ | ✅ | ❌ |
| Tunjangan Kesehatan | ✅ | ✅ | ❌ |

### 15.4 Payroll Report

Laporan yang tersedia di modul Payroll:

| Laporan | Filter | Format |
|---------|--------|--------|
| Rekap gaji per karyawan | Periode, divisi | Excel, PDF |
| Total pengeluaran gaji per divisi | Periode | Excel |
| Laporan PPh 21 | Periode | Excel |
| Laporan BPJS | Periode | Excel |
| Perbandingan payroll bulan ke bulan | Rentang periode | Excel |

### 15.5 Expense Management

Pencatatan dan monitoring pengeluaran operasional yang terhubung dengan data klaim reimbursement (Bagian 12):
- Dashboard total pengeluaran klaim per kategori per bulan
- Perbandingan realisasi vs anggaran (jika anggaran dikonfigurasi)
- Export laporan expense ke Excel

### 15.6 e-Bupot (Integrasi Pajak)

Ekspor data PPh 21 dalam format yang kompatibel untuk diinput ke sistem Coretax DJP:
- Generate file CSV / Excel sesuai format e-Bupot
- Data per karyawan: NPWP, penghasilan bruto, PPh 21 yang dipotong
- Hanya dapat diakses oleh Super Admin dan Admin HR

---

## 16. Fitur: Administrasi HR

### 16.1 Employee Self Service (ESS)

Karyawan dapat mengurus kebutuhan administratif mereka sendiri tanpa harus menghubungi HR:

| Aksi | Keterangan |
|------|-----------|
| Lihat & update profil pribadi | Alamat, no HP, email pribadi |
| Ajukan cuti | Via form leave management |
| Ajukan lembur | Via form overtime |
| Ajukan klaim reimbursement | Via form klaim |
| Download slip gaji | Payslip bulan berjalan & historis |
| Lihat saldo cuti | Sisa cuti tahunan |
| Lihat jadwal shift | Shift yang berlaku bulan ini |
| Lihat org chart | Posisi diri dalam struktur organisasi |

### 16.2 Onboarding & Offboarding

**Onboarding (karyawan baru):**

Checklist tugas yang harus diselesaikan saat karyawan baru masuk:

```
□ Data karyawan diinput ke sistem
□ Akun Insan APU dibuat
□ Foto formal diupload
□ Dokumen wajib diupload (KTP, ijazah, kontrak)
□ BPJS didaftarkan
□ Shift & atasan langsung dikonfigurasi
□ Email kantor diberikan
□ Orientasi HR selesai
```

**Offboarding (karyawan keluar):**

```
□ Status karyawan dinonaktifkan
□ Tanggal & alasan keluar dicatat
□ Akses sistem dicabut
□ Aset perusahaan dikembalikan (dicatat di manajemen aset)
□ Slip gaji terakhir diterbitkan
□ Dokumen akhir masa kerja diarsipkan
```

Setiap item checklist dapat di-tick oleh Admin HR; progres tersimpan di sheet `onboarding_log`.

### 16.3 Document Template

Tersedia template dokumen HR siap pakai yang dapat di-generate otomatis dengan data karyawan:

| Template | Keterangan |
|----------|-----------|
| Surat Kontrak Kerja | Auto-isi nama, posisi, tanggal mulai |
| Surat Pengangkatan Karyawan Tetap | Auto-isi data karyawan |
| Surat Keterangan Kerja | Auto-isi data & masa kerja |
| Surat Peringatan (SP1/SP2/SP3) | Template dengan field kustom |
| Surat Cuti | Auto-isi data cuti yang diajukan |
| Surat Tugas Dinas Luar | Auto-isi karyawan & tujuan |

- Template dapat dikustomisasi oleh Admin HR di halaman Master Data
- Output dokumen berformat PDF yang dapat langsung diunduh

### 16.4 Manajemen Aset & Akses

Pencatatan aset perusahaan yang dipinjamkan ke karyawan:

```
Nama Aset*      : [text, mis. "Laptop Lenovo ThinkPad"]
Kode/Seri Aset  : [text]
Kategori*       : [dropdown: Laptop | HP Dinas | Kendaraan | ATK | Lainnya]
Dipinjamkan ke* : [autocomplete nama karyawan]
Tanggal Pinjam* : [date]
Tanggal Kembali : [date, diisi saat aset dikembalikan]
Kondisi         : [Baik | Rusak Ringan | Rusak Berat]
Keterangan      : [textarea]
```

- List aset per karyawan ditampilkan di tab profil karyawan
- Notifikasi otomatis ke Admin HR saat karyawan offboarding dengan aset belum dikembalikan

### 16.5 HR Helpdesk

Portal bantuan internal untuk karyawan mengajukan pertanyaan atau keluhan HR:

```
Kategori*    : [dropdown: Payslip | Cuti | Absensi | BPJS | Reimbursement | Lainnya]
Subjek*      : [text]
Deskripsi*   : [textarea]
Lampiran     : [file upload opsional]
```

- Setiap tiket mendapat nomor unik dan status: `open` / `in_progress` / `resolved` / `closed`
- Admin HR membalas tiket via panel helpdesk
- Notifikasi email ke karyawan saat ada update status tiket

### 16.6 Komunikasi Internal

Fitur pengumuman dari HR ke seluruh karyawan atau divisi tertentu:

- Admin HR membuat pengumuman (judul, isi teks, lampiran)
- Pilih penerima: Semua Karyawan / Per Divisi / Per Unit / Individu tertentu
- Notifikasi email dikirim ke penerima yang terdaftar emailnya
- Pengumuman tampil di halaman dashboard karyawan sebagai banner/notifikasi

---

## 17. Fitur: Rekrutmen & Talent Acquisition

### 17.1 Toggle Aktif / Nonaktif Rekrutmen

Super Admin dan Admin HR dapat mengaktifkan atau menonaktifkan fitur rekrutmen kapan saja:

```
Pengaturan Rekrutmen:
  [🟢 ON / 🔴 OFF]  Fitur Rekrutmen Aktif

  Jika OFF:
  - Formulir lamaran tidak dapat diakses oleh pelamar
  - Halaman lowongan menampilkan pesan: "Saat ini tidak ada lowongan yang tersedia."
  - Semua data lowongan & kandidat tetap tersimpan (tidak dihapus)
  - Proses rekrutmen yang sedang berjalan tetap bisa dikelola Admin
```

> Toggle ini tersedia di **App Settings → Modul Rekrutmen** dan hanya dapat diubah oleh Super Admin dan Admin HR.

### 17.2 Manajemen Lowongan

Admin HR dapat membuat dan mengelola posting lowongan:

```
Judul Posisi*    : [text, mis. "Staf Fundraising"]
Departemen*      : [dropdown — dari master divisi]
Unit             : [dropdown — dinamis]
Job Level*       : [dropdown]
Tipe Kontrak*    : [dropdown: Tetap | Kontrak | Relawan]
Deskripsi Tugas* : [rich text editor]
Kualifikasi*     : [rich text editor]
Batas Lamaran*   : [date]
Status Lowongan* : [Draf | Aktif | Ditutup]
Jumlah Kebutuhan*: [angka]
```

**Status lowongan:**
- `Draf` — hanya terlihat oleh Admin HR, belum dipublikasikan
- `Aktif` — menerima lamaran (hanya berlaku jika toggle rekrutmen = ON)
- `Ditutup` — tidak menerima lamaran baru

### 17.3 Applicant Tracking System (ATS)

Alur seleksi kandidat per lowongan:

```
Lamaran Masuk ──▶ Seleksi Administrasi ──▶ Tes/Assessment ──▶ Wawancara ──▶ Offering ──▶ Onboarding
```

**Status kandidat yang dilacak:**

| Status | Keterangan |
|--------|-----------|
| `applied` | Lamaran diterima |
| `reviewed` | Sedang diseleksi admin |
| `shortlisted` | Lolos seleksi administrasi |
| `assessment` | Dalam proses tes/assessment |
| `interview` | Terjadwal wawancara |
| `offering` | Penawaran kerja dikirim |
| `accepted` | Kandidat menerima tawaran |
| `rejected` | Tidak lolos di tahap tertentu |
| `withdrawn` | Kandidat mengundurkan diri |

**Data kandidat yang dicatat:**

```
Nama Lengkap*     : [text]
Email*            : [email]
No. HP*           : [text]
Posisi Dilamar*   : [otomatis dari lowongan]
Tanggal Lamaran   : [otomatis — timestamp]
CV / Resume*      : [upload PDF, maks 5 MB]
Surat Lamaran     : [upload PDF, opsional]
Portofolio        : [upload file / URL link, opsional]
Sumber Lamaran    : [dropdown: Website | Referral | Job Portal | Walk-in | Lainnya]
```

### 17.4 Assessment Kandidat

- Admin HR dapat membuat catatan penilaian per kandidat per tahap seleksi
- Field penilaian: skor (1–10), komentar, rekomendasi (Lanjut / Tidak Lanjut)
- Komparasi skor antar kandidat untuk satu posisi yang sama
- Riwayat assessment tersimpan meski status kandidat berubah

### 17.5 Manpower Planning

Admin HR dapat membuat rencana kebutuhan tenaga kerja:

```
Periode*          : [bulan/tahun]
Departemen*       : [dropdown]
Posisi yang Butuh*: [text]
Jumlah Kebutuhan* : [angka]
Alasan*           : [text: Pengganti resign | Ekspansi | Proyek khusus]
Status Rencana    : [Draft | Disetujui | Terealisasi]
```

- Rencana yang disetujui dapat langsung dikonversi menjadi posting lowongan
- Rekap manpower planning tersedia di laporan HR

### 17.6 Laporan Rekrutmen

| Laporan | Filter | Format |
|---------|--------|--------|
| Daftar kandidat per lowongan | Posisi, status | Excel |
| Rekap lamaran masuk per periode | Bulan, divisi | Excel |
| Funnel seleksi (jumlah per tahap) | Per lowongan | Excel |
| Waktu rata-rata per tahap seleksi | Periode | Excel |

---

## 18. Fitur: Pengembangan Karyawan

### 18.1 Performance Management

**Siklus penilaian kinerja:**

```
Admin HR buka periode penilaian
      │
      ▼
Karyawan isi self-assessment (penilaian diri sendiri)
      │
      ▼
Atasan langsung mengisi penilaian karyawan
      │
      ▼
Admin HR / Kepala Divisi finalisasi & kalibrasi
      │
      ▼
Hasil penilaian dikomunikasikan ke karyawan
```

**Form Penilaian Kinerja:**

```
Periode*           : [mis. "Semester 1 2026"]
Karyawan*          : [otomatis / dipilih oleh atasan]
Aspek Penilaian    : dikonfigurasi di Master Data
  - Kualitas Kerja    : [skor 1–5]
  - Kedisiplinan      : [skor 1–5]
  - Kerja Tim         : [skor 1–5]
  - Inisiatif         : [skor 1–5]
  - Pencapaian Target : [skor 1–5]
Komentar Atasan    : [textarea]
Rekomendasi        : [dropdown: Promosi | Pertahankan | Perlu Pembinaan | Rotasi]
```

- Skor akhir dihitung otomatis dengan bobot yang dikonfigurasi Admin HR
- Riwayat penilaian per karyawan tersimpan dan dapat dilihat di tab profil
- Laporan rekap kinerja per divisi tersedia untuk Kepala Divisi & Admin HR

### 18.2 Talent Management

Identifikasi dan pengembangan potensi karyawan:

**Talent Mapping:**
- Admin HR dapat menandai karyawan sebagai **High Potential**, **Key Person**, atau **Need Development**
- Tag ini hanya terlihat untuk Admin HR dan Super Admin (tidak tampil di profil karyawan umum)
- Digunakan untuk perencanaan suksesi dan pengembangan karir

**Rencana Pengembangan Individu (IDP):**
```
Karyawan*          : [autocomplete]
Tujuan Pengembangan*: [textarea]
Aktivitas*         : [textarea, mis. "Ikut pelatihan manajemen proyek"]
Target Selesai*    : [date]
Status             : [Belum Mulai | Sedang Berjalan | Selesai]
Evaluasi           : [textarea, diisi saat selesai]
```

### 18.3 Learning Management System (LMS)

Pengelolaan program pelatihan dan pengembangan SDM:

**Manajemen Kursus / Pelatihan:**
```
Nama Pelatihan*   : [text]
Kategori*         : [dropdown: Leadership | Teknis | Soft Skill | Regulasi | Lainnya]
Penyelenggara     : [text, mis. "Internal HR" atau "Lembaga X"]
Metode*           : [dropdown: Online | Offline | Blended]
Tanggal Mulai*    : [date]
Tanggal Selesai*  : [date]
Peserta*          : [pilih karyawan / divisi]
Materi            : [upload file PDF/PPT/video link]
```

**Rekap pelatihan per karyawan:**
- Daftar pelatihan yang pernah diikuti (nama, tanggal, penyelenggara, status)
- Sertifikat / bukti keikutsertaan dapat diupload ke Drive
- Tampil di tab **Pengembangan** di profil karyawan

**Laporan LMS:**

| Laporan | Filter | Format |
|---------|--------|--------|
| Rekap pelatihan per karyawan | Periode, karyawan | Excel |
| Total jam pelatihan per divisi | Periode | Excel |
| Karyawan belum ikut pelatihan wajib | Periode | Excel |

---

## 19. Fitur Tambahan

### 19.1 Export & Laporan

| Laporan | Filter | Format |
|---------|--------|--------|
| Daftar Karyawan Aktif | Divisi, Unit, Status | Excel, PDF |
| Rekap per Divisi | Semua | Excel |
| Karyawan dengan Kontrak Akan Habis | Rentang hari | Excel |
| Riwayat Karir Karyawan | Per orang | PDF |
| Statistik Gender & Status | Semua / per Divisi | Excel |
| Karyawan Berdasarkan Level | Semua | Excel |
| Karyawan Baru Periode Tertentu | Rentang tanggal | Excel |
| Rekap Reimbursement | Periode, divisi, kategori | Excel |
| Org Chart | Divisi tertentu / semua | PNG, PDF |

### 19.2 Notifikasi Otomatis

Berjalan via **Laravel Task Scheduler** (cron job di cPanel, setiap menit) — notifikasi email dikirim lewat **Laravel Mail**:

| Jenis | Trigger | Penerima |
|-------|---------|---------|
| Kontrak akan habis 30 hari | H-30 | Admin HR + email karyawan |
| Kontrak akan habis 14 hari | H-14 | Admin HR + Kepala Divisi |
| Kontrak akan habis 7 hari | H-7 | Admin HR + Kepala Divisi + Direksi |
| Ulang tahun karyawan | Hari H | Admin HR (rekap harian) |
| Masa kerja anniversary | Hari H (tahun bulat) | Admin HR (opsional, bisa dikonfigurasi) |
| Kolom Email belum diisi | Mingguan (Senin) | Admin HR (daftar karyawan tanpa email) |
| Klaim pending > 3 hari | Harian | Approver terkait |

### 19.3 Manajemen Dokumen

- Upload dokumen ke Google Drive per karyawan: `/Insan APU/{EmployeeID}/`
- Kategori dokumen: KTP, Ijazah, SK Pengangkatan, Kontrak Kerja, NPWP, BPJS, Foto Formal
- Preview file PDF/gambar langsung di aplikasi
- Indikator kelengkapan dokumen per karyawan (berapa dari total dokumen wajib sudah ada)

### 19.4 Audit Log

Setiap aksi tercatat di tabel `audit_logs` (MySQL) oleh middleware `AuditLogger`:

| Field | Contoh |
|-------|--------|
| Timestamp | `2026-06-23 09:45:22` |
| User | `admin.hr@alazhar.or.id` |
| Aksi | `EDIT` |
| Modul | `Data Pegawai` |
| Employee ID | `20103008013` |
| Field diubah | `Current Position` |
| Nilai lama | `Wakil Direktur` |
| Nilai baru | `Kepala Divisi Sekretariat` |

### 19.5 Master Data

| Master | Field |
|--------|-------|
| Divisi | Kode, Nama, Kepala Divisi, Status |
| Unit | Kode, Nama, Divisi induk, Status |
| Level Jabatan | Nomor level (1–5), Label deskriptif |
| Job Level | Nama jabatan fungsional |
| Status Kepegawaian | Tetap, Kontrak, Relawan |
| Jenis Dokumen | Nama, Wajib/Opsional |
| Kategori Klaim | Nama, Batas maksimum per klaim (opsional) |

---

## 20. Struktur Database (MySQL)

Seluruh data sistem disimpan di **MySQL 8** melalui Laravel Eloquent ORM. Migrasi tabel dikelola via `php artisan migrate`. Google Sheets hanya digunakan sebagai **sumber import awal** (read-only), bukan sebagai database operasional.

### Daftar Tabel

| Tabel | Fungsi |
|-------|--------|
| `pegawai` | Data utama karyawan (1 baris = 1 karyawan) |
| `career_histories` | Riwayat karir (1 baris = 1 jabatan) |
| `family_members` | Data keluarga (pasangan + anak, multi-row per karyawan) |
| `reimbursements` | Data pengajuan klaim biaya |
| `reimbursement_documents` | Referensi file bukti di Google Drive |
| `attendances` | Data absensi harian karyawan |
| `leave_requests` | Pengajuan cuti |
| `overtime_requests` | Pengajuan lembur |
| `timesheets` | Timesheet / laporan waktu kerja |
| `shifts` | Master jadwal shift |
| `shift_assignments` | Penugasan shift per karyawan |
| `payrolls` | Data payroll per periode per karyawan |
| `payroll_components` | Konfigurasi komponen gaji per karyawan |
| `onboarding_logs` | Checklist onboarding & offboarding |
| `assets` | Data aset perusahaan |
| `asset_assignments` | Peminjaman aset ke karyawan |
| `helpdesk_tickets` | Tiket HR Helpdesk |
| `announcements` | Pengumuman internal |
| `document_templates` | Template dokumen HR |
| `job_vacancies` | Data lowongan rekrutmen |
| `candidates` | Data pelamar / kandidat |
| `candidate_assessments` | Penilaian kandidat per tahap seleksi |
| `manpower_plans` | Rencana kebutuhan tenaga kerja |
| `performance_reviews` | Penilaian kinerja karyawan |
| `talent_tags` | Tag talent (High Potential, dsb.) |
| `individual_development_plans` | Rencana Pengembangan Individu (IDP) |
| `trainings` | Data program pelatihan |
| `training_participants` | Peserta pelatihan |
| `users` | Akun pengguna sistem |
| `roles` | Definisi peran |
| `permissions` | Izin per role per modul |
| `personal_access_tokens` | Token Sanctum (auto-generated Laravel) |
| `master_divisi` | Data divisi |
| `master_units` | Data unit dalam divisi |
| `master_levels` | Daftar level jabatan (1–5) |
| `master_job_levels` | Daftar jabatan fungsional |
| `master_klaim_kategori` | Kategori reimbursement |
| `employee_documents` | Referensi dokumen karyawan di Google Drive |
| `audit_logs` | Log semua aktivitas sistem |
| `dashboard_configs` | Konfigurasi widget |
| `notification_configs` | Setting notifikasi |
| `import_logs` | Log riwayat proses import |
| `app_settings` | Konfigurasi aplikasi |

### Tabel: `pegawai` — Skema Kolom Utama

```sql
id              BIGINT UNSIGNED PK AUTO_INCREMENT
employee_id     VARCHAR(20) UNIQUE NOT NULL
full_name       VARCHAR(150) NOT NULL
current_position TEXT
departement     VARCHAR(100)
unit            VARCHAR(100)
employment_status ENUM('Tetap','Kontrak','Relawan') NOT NULL
level           TINYINT          -- 1 s.d. 5
job_level       VARCHAR(100)
manager_id      BIGINT UNSIGNED  -- FK → pegawai.id (self-referential)
join_date       DATE NOT NULL
contract_end_date DATE
email_kantor    VARCHAR(150)
email_pribadi   VARCHAR(150)
mobile_phone    VARCHAR(20)
place_of_birth  VARCHAR(100)
date_of_birth   DATE
gender          ENUM('L','P')
marital_status  ENUM('Menikah','Single','Janda','Duda')
nik             VARCHAR(16)
nik_address     TEXT
residential_address TEXT
education_level VARCHAR(10)
institution_name VARCHAR(200)
institution_place VARCHAR(100)
graduation_date DATE
is_active       BOOLEAN DEFAULT TRUE
inactive_date   DATE
inactive_reason TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
updated_by      BIGINT UNSIGNED  -- FK → users.id
```

### Tabel: `career_histories` — Skema Kolom Utama

```sql
id              BIGINT UNSIGNED PK AUTO_INCREMENT
employee_id     BIGINT UNSIGNED NOT NULL  -- FK → pegawai.id
urutan          TINYINT
jabatan         VARCHAR(200)
departement     VARCHAR(100)
unit            VARCHAR(100)
tanggal_mulai   DATE
tanggal_selesai DATE
keterangan      TEXT
is_current      BOOLEAN DEFAULT FALSE
created_at      TIMESTAMP
updated_at      TIMESTAMP
updated_by      BIGINT UNSIGNED
```

### Tabel: `family_members` — Skema Kolom Utama

```sql
id              BIGINT UNSIGNED PK AUTO_INCREMENT
employee_id     BIGINT UNSIGNED NOT NULL  -- FK → pegawai.id
tipe            ENUM('pasangan','anak')
nama            VARCHAR(150)
tanggal_lahir   DATE
urutan_anak     TINYINT  -- null jika tipe = pasangan
created_at      TIMESTAMP
```

### Tabel: `reimbursements` — Skema Kolom Utama

```sql
id              BIGINT UNSIGNED PK AUTO_INCREMENT
klaim_id        VARCHAR(20) UNIQUE  -- Format: KLM-2026-00001
employee_id     BIGINT UNSIGNED     -- FK → pegawai.id
kategori        VARCHAR(100)
jumlah          DECIMAL(15,2)
tanggal_pengeluaran DATE
keterangan      TEXT
status          ENUM('draft','pending_l1','approved_l1','pending_l2',
                     'approved','rejected','revision')
approver_l1_id  BIGINT UNSIGNED     -- FK → users.id
approved_l1_at  TIMESTAMP
approver_l2_id  BIGINT UNSIGNED     -- FK → users.id
approved_l2_at  TIMESTAMP
rejected_by     BIGINT UNSIGNED
rejected_at     TIMESTAMP
rejection_reason TEXT
drive_folder_id VARCHAR(200)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabel: `users` — Skema Kolom Utama

```sql
id              BIGINT UNSIGNED PK AUTO_INCREMENT
email           VARCHAR(150) UNIQUE NOT NULL
full_name       VARCHAR(150)
password        VARCHAR(255)         -- bcrypt hash, null jika login Google only
google_id       VARCHAR(100)         -- null jika login Email/Password only
role_id         BIGINT UNSIGNED      -- FK → roles.id
employee_id     BIGINT UNSIGNED      -- FK → pegawai.id (nullable)
is_active       BOOLEAN DEFAULT TRUE
last_login      TIMESTAMP
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

---

## 21. Functional Requirements

### Prioritas High

| ID | Fitur | Modul |
|----|-------|-------|
| FR-001 | Import data dari Google Sheets sumber (ID baru) | Import Data |
| FR-002 | Import data via upload CSV dengan template | Import Data |
| FR-003 | Import data via upload Excel (.xlsx) dengan template | Import Data |
| FR-004 | Preview & validasi sebelum import dieksekusi | Import Data |
| FR-005 | Tampilkan widget statistik di landing page | Dashboard |
| FR-006 | Konfigurasi widget di Master Akses | Master Akses |
| FR-007 | Login via Google OAuth + Email/Password (dual-mode) | Auth |
| FR-008 | CRUD lengkap data pegawai dengan form multi-step | Data Pegawai |
| FR-009 | Auto-hitung masa kerja (tahun, bulan, hari) | Data Pegawai |
| FR-010 | Timeline riwayat karir (normalisasi dari 12 career columns) | Karir |
| FR-011 | Tambah/edit riwayat karir per karyawan | Karir |
| FR-012 | Visualisasi org chart interaktif | Struktur Org |
| FR-013 | Hierarki atasan-bawahan untuk routing approval | Struktur Org |
| FR-014 | Pengajuan klaim reimbursement dengan upload bukti | Reimbursement |
| FR-015 | Approval workflow dua level (atasan langsung → Admin HR) | Reimbursement |
| FR-016 | Filter karyawan by divisi, unit, level, status, gender | Data Pegawai |
| FR-017 | Manajemen role & permission per modul | Hak Akses |
| FR-018 | Manager Divisi hanya melihat data karyawan divisinya | Hak Akses |
| FR-019 | Audit log semua aksi CRUD | Log |
| FR-020 | Absensi online clock in/out via browser | Kehadiran |
| FR-021 | Pengajuan dan approval cuti (leave management) | Kehadiran |
| FR-022 | Pengajuan dan approval lembur (overtime) | Kehadiran |
| FR-023 | Toggle aktif/nonaktif fitur rekrutmen oleh Admin | Rekrutmen |
| FR-024 | CRUD lowongan kerja dengan status Draf/Aktif/Ditutup | Rekrutmen |
| FR-025 | ATS — tracking status kandidat per tahap seleksi | Rekrutmen |

### Prioritas Medium

| ID | Fitur | Modul |
|----|-------|-------|
| FR-026 | Export daftar karyawan ke Excel | Laporan |
| FR-027 | Export org chart ke PNG/PDF | Struktur Org |
| FR-028 | Notifikasi email kontrak akan habis (H-30, H-14, H-7) | Notifikasi |
| FR-029 | Notifikasi email approval reimbursement | Reimbursement |
| FR-030 | Notifikasi ulang tahun karyawan (harian, ke Admin HR) | Notifikasi |
| FR-031 | Upload dokumen karyawan ke Google Drive | Dokumen |
| FR-032 | Laporan rekap reimbursement per divisi & kategori | Laporan |
| FR-033 | Master data divisi, unit, level, kategori klaim | Master Data |
| FR-034 | Manajemen akun user (tambah, edit role, nonaktifkan) | Hak Akses |
| FR-035 | Input data keluarga dinamis (jumlah anak tidak dibatasi) | Data Pegawai |
| FR-036 | Download template CSV dan Excel | Import Data |
| FR-037 | Kalkulasi payroll bulanan dengan komponen gaji | Payroll |
| FR-038 | Distribusi slip gaji per karyawan (web + PDF) | Payroll |
| FR-039 | Konfigurasi komponen benefit per status kepegawaian | Payroll |
| FR-040 | Onboarding & offboarding checklist | Administrasi HR |
| FR-041 | Generate dokumen dari template (Surat Keterangan Kerja, dll.) | Administrasi HR |
| FR-042 | Manajemen aset perusahaan & pencatatan peminjaman | Administrasi HR |
| FR-043 | Timesheet / laporan waktu kerja harian | Kehadiran |
| FR-044 | Pengaturan shift dan penugasan shift per karyawan | Kehadiran |
| FR-045 | Penilaian kinerja karyawan (self-assessment + atasan) | Pengembangan |
| FR-046 | Manajemen program pelatihan & peserta (LMS) | Pengembangan |
| FR-047 | Rencana Pengembangan Individu (IDP) | Pengembangan |
| FR-048 | Manpower planning — rencana kebutuhan tenaga kerja | Rekrutmen |
| FR-049 | Assessment kandidat per tahap seleksi | Rekrutmen |

### Prioritas Low

| ID | Fitur | Modul |
|----|-------|-------|
| FR-050 | Export riwayat karir per karyawan ke PDF | Laporan |
| FR-051 | Indikator kelengkapan profil karyawan | Data Pegawai |
| FR-052 | Pengaturan aplikasi (nama org, logo, durasi sesi) | Settings |
| FR-053 | Laporan karyawan baru per periode | Laporan |
| FR-054 | Force logout pengguna aktif | Auth |
| FR-055 | Filter & export data klaim per karyawan | Reimbursement |
| FR-056 | Deteksi circular reference pada hierarki atasan | Struktur Org |
| FR-057 | HR Helpdesk — tiket pertanyaan & keluhan karyawan | Administrasi HR |
| FR-058 | Pengumuman internal dari HR ke karyawan | Administrasi HR |
| FR-059 | Talent tagging (High Potential, Need Development) | Pengembangan |
| FR-060 | Laporan rekap kehadiran & absensi per periode | Kehadiran |
| FR-061 | Ekspor data PPh 21 format e-Bupot | Payroll |
| FR-062 | Laporan rekap pelatihan per karyawan & per divisi | Pengembangan |
| FR-063 | Laporan funnel seleksi rekrutmen per lowongan | Rekrutmen |

---

## 22. Non-Functional Requirements

### Performa

- Halaman dashboard tampil dalam **< 3 detik** (untuk dataset 100–500 karyawan)
- Proses import batch (100+ baris) selesai **< 30 detik** dengan feedback progress bar
- Query filter karyawan selesai **< 2 detik**
- Org chart render **< 5 detik** untuk 200 node
- Upload file reimbursement **< 10 detik** per file (5 MB)

### Keamanan

- Semua endpoint validasi sesi dan permission sebelum memproses
- NIK, No. HP, Alamat hanya tampil untuk role yang berwenang (Admin HR ke atas)
- Data sumber (spreadsheet asli) tidak pernah dimodifikasi — hanya dibaca saat import
- File bukti reimbursement di Google Drive hanya dapat diakses oleh pemilik klaim, approver, dan Admin HR
- Validasi ukuran dan tipe file sebelum upload (server-side + client-side)

### Kompatibilitas

- Berjalan di Chrome, Firefox, Safari (versi terbaru)
- Responsif untuk mobile (penggunaan darurat dan approval cepat, bukan penggunaan utama)
- Org chart dapat dilihat di layar minimal 1024px lebar untuk pengalaman optimal

### Keandalan

- Import berat dijalankan via **Laravel Queue** (background job) agar tidak timeout — batch 50 baris per job
- Data tidak pernah dihapus permanen kecuali oleh Super Admin dengan konfirmasi berlapis (`soft delete` Laravel)
- Import yang gagal di tengah jalan tidak merusak data yang sudah masuk (MySQL **transaction** rollback)
- Backup database otomatis via cPanel Backup atau `mysqldump` terjadwal

---

## 23. Milestone Pengembangan

| Fase | Durasi | Deliverable |
|------|--------|-------------|
| **Fase 0 – Setup Infrastruktur** | 3 hari | Setup repo Laravel 11 + Astro.js, konfigurasi MySQL di cPanel, setup subdomain & SSL, konfigurasi `.htaccess`, deploy halaman placeholder, verifikasi koneksi frontend → Laravel API |
| **Fase 1 – Fondasi Backend** | 1 minggu | Laravel project structure, migrasi tabel MySQL, Sanctum auth (Google OAuth + Email/Password), middleware role & permission, seeder master data, endpoint API dasar |
| **Fase 2 – Import & Core Data** | 2 minggu | Import dari Google Sheets (Sheets API), Import CSV & Excel (maatwebsite/excel), template download, CRUD pegawai, normalisasi career path, data keluarga — semua via Astro + Laravel API |
| **Fase 3 – Dashboard & Akses** | 1 minggu | Widget statistik (Laravel query aggregation), konfigurasi widget, hak akses role & user, Sidebar & layout utama Astro |
| **Fase 4 – Struktur Org** | 1 minggu | Org chart interaktif (OrgChart.js + data dari Laravel API), hierarki self-referential di MySQL, export org chart PNG/PDF |
| **Fase 5 – Reimbursement** | 2 minggu | Form pengajuan klaim, upload bukti ke Google Drive (Flysystem), approval workflow, Laravel Mail notifikasi, laporan klaim |
| **Fase 6 – Kehadiran & Payroll** | 2 minggu | Absensi online, cuti, lembur, timesheet, shift management, kalkulasi payroll (PayrollService), slip gaji PDF (Laravel DomPDF), konfigurasi benefit |
| **Fase 7 – Administrasi HR** | 2 minggu | ESS, onboarding/offboarding checklist, generate dokumen dari template (DomPDF), manajemen aset, HR helpdesk, pengumuman internal |
| **Fase 8 – Rekrutmen** | 1,5 minggu | Toggle on/off rekrutmen (app_settings), manajemen lowongan, ATS tracking kandidat, assessment, manpower planning |
| **Fase 9 – Pengembangan Karyawan** | 1,5 minggu | Performance review, talent tagging, IDP, LMS pelatihan & peserta |
| **Fase 10 – Produktivitas & Laporan** | 1 minggu | Filter & pencarian lanjutan (Laravel Scout / query scopes), audit log, semua export Excel/PDF, laporan lintas modul |
| **Fase 11 – Otomasi** | 1 minggu | Laravel Scheduler (notifikasi kontrak, ulang tahun, klaim pending), Laravel Queue (proses import batch & email berat), e-Bupot, pengaturan app |
| **Fase 12 – QA & Deployment** | 1 minggu | UAT bersama tim HRD, bug fixing, `php artisan optimize` + `npm run build`, full deployment ke cPanel, konfigurasi GitHub Actions auto-deploy, pelatihan pengguna |

**Total Estimasi: ±17 minggu (±4 bulan)**

### Catatan Deployment Berkelanjutan

Setelah go-live, alur update kode adalah:

```
Developer edit kode Astro
      │
      ▼
git push ke branch main
      │
      ▼ (opsional: GitHub Actions)
npm run build → dist/
      │
      ▼
Upload dist/ ke cPanel via FTP / File Manager
      │
      ▼
Aplikasi live di insan-apu.alazhar.or.id
```

> Update GAS (backend) dilakukan terpisah langsung dari Google Apps Script editor — tidak memerlukan rebuild Astro.

---

## Lampiran A: Daftar Divisi & Unit

```
Sekretariat
├── Direksi
├── Kelembagaan
├── Humas, GA, dan IT
└── Diklat & Litbang

Keuangan
├── Direksi
├── Pengeluaran
├── Penerimaan
└── Anggaran & Akuntansi

LAZ Al Azhar
└── Direksi

Fundraising & Partnership
├── Internal Fundraising
└── Eksternal Fundraising

Program
└── Program

KPW (Kantor Perwakilan Wilayah)
└── [Perlu konfirmasi unit aktif]
```

> **Catatan:** Divisi KPW (mis. Sulawesi Selatan) muncul dalam riwayat karir beberapa karyawan. Perlu dikonfirmasi ke tim HRD apakah masih aktif sebagai divisi tersendiri.

---

## Lampiran B: Format Employee ID

Format: `YYYYMMNNXXX`

| Segmen | Contoh | Arti |
|--------|--------|------|
| YYYY | `2010` | Tahun bergabung |
| MM | `03` | Bulan bergabung |
| NN | `08` | Tanggal bergabung |
| XXX | `013` | Nomor urut karyawan |

Contoh: `20103008013` → bergabung 30 Maret 2010, nomor urut ke-13.
Parsing ini ditampilkan sebagai tooltip di halaman detail karyawan.

---

## Lampiran C: Template Kolom CSV / Excel

### Template CSV / Sheet "Data Pegawai"

| Kolom | Wajib | Format | Keterangan |
|-------|:-----:|--------|------------|
| `employee_id` | ❌ | Teks | Kosongkan untuk auto-generate |
| `full_name` | ✅ | Teks | Nama lengkap |
| `current_position` | ✅ | Teks | Jabatan saat ini |
| `departement` | ✅ | Teks | Harus sesuai master divisi |
| `unit` | ❌ | Teks | Harus sesuai master unit |
| `employment_status` | ✅ | Tetap / Kontrak / Relawan | |
| `job_level` | ✅ | Teks | Sesuai master job level |
| `level` | ❌ | 1 – 5 | Level jabatan |
| `join_date` | ✅ | YYYY-MM-DD | Tanggal masuk |
| `contract_end_date` | ❌ | YYYY-MM-DD | Wajib jika status Kontrak |
| `email_kantor` | ❌ | Email | |
| `mobile_phone` | ❌ | Teks | Format 08xx / +62xx |
| `place_of_birth` | ❌ | Teks | |
| `date_of_birth` | ❌ | YYYY-MM-DD | |
| `gender` | ✅ | L / P | |
| `marital_status` | ❌ | Menikah / Single / Janda / Duda | |
| `nik` | ❌ | 16 digit angka | |
| `education_level` | ❌ | SD/SMP/SMA/D3/S1/S2/S3 | |
| `institution_name` | ❌ | Teks | |
| `graduation_date` | ❌ | YYYY-MM-DD | |

---

*Dokumen ini merupakan revisi dari PRD v1.0.0 (17 Juni 2026) yang disesuaikan dengan sumber data baru dan penambahan fitur Struktur Organisasi, Manajemen Reimbursement, serta Import CSV/Excel.*  
*PRD – Insan APU · v1.1.0 · 23 Juni 2026*