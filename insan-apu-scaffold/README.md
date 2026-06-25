# Insan APU Backend (Laravel Scaffold)

Ini adalah struktur dasar dan file-file utama (scaffold) untuk memulai pengembangan API Laravel 11 Anda sesuai dengan dokumen PRD. Karena PHP dan Composer belum tersedia di sistem lokal saat ini, Anda bisa menyalin struktur ini ke server (seperti cPanel) atau workspace Anda yang sudah memiliki Laravel.

## Cara Menggunakan

1. **Buat Project Laravel Baru:**
   Di environment atau server Anda (yang memiliki PHP 8.3 dan Composer), jalankan:
   ```bash
   composer create-project laravel/laravel insan-apu-backend
   ```
2. **Salin File:**
   Timpa atau pindahkan file-file dari folder ini ke dalam direktori project Laravel yang baru Anda buat:
   - `routes/api.php`
   - `app/Http/Controllers/Api/`
   - `app/Models/`
   - `database/migrations/`

3. **Konfigurasi Environment:**
   Edit file `.env` di project Laravel Anda, pastikan:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=nama_db_anda
   DB_USERNAME=user_db
   DB_PASSWORD=password_db
   ```

4. **Jalankan Migrasi & Server:**
   ```bash
   php artisan migrate
   php artisan serve
   ```

5. **Hubungkan ke Frontend:**
   Buka file `.env` pada project `simdp-frontend` dan arahkan URL ke backend Laravel:
   ```env
   VITE_GAS_API_URL=http://localhost:8000/api
   ```
   *(Catatan: Anda mungkin perlu mengubah endpoint di `src/lib/api.ts` frontend jika sebelumnya menggunakan format GAS yang berbeda, karena Laravel menggunakan struktur RESTful standar `/api/pegawai` dsb).*
