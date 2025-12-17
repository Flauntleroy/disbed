# DISBED - Display Bed Occupancy Dashboard

Dashboard real-time untuk menampilkan informasi ketersediaan tempat tidur rumah sakit per ruangan/bangsal. Dioptimalkan untuk tampilan TV/monitor besar.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange?logo=mysql)

## ✨ Fitur

- 📺 **TV Mode** - Tampilan full-screen untuk TV/monitor besar
- 🔄 **Auto Refresh** - Data otomatis diperbarui setiap 30 detik
- 🏥 **Per Bangsal** - Informasi terisi/kosong per ruangan
- 📊 **Ringkasan** - Total bed tersedia, terisi, dan kosong
- 🌙 **Dark Theme** - Tampilan gelap nyaman untuk monitoring

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19
- **Database:** MySQL (via mysql2)
- **Styling:** CSS Modules

## 📦 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/username/disbed.git
cd disbed
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

Buat file `.env.local` di root project:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nama_database
DB_USER=username
DB_PASSWORD=password
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:54321](http://localhost:54321) di browser.

## 🚀 Deployment

### Build Production

```bash
npm run build
npm run start
```

### Deploy ke Server (Ubuntu + aaPanel)

Lihat dokumentasi lengkap di [Dep.md](./Dep.md) untuk panduan deployment dengan:
- aaPanel Node Project
- Nginx Reverse Proxy
- SSL/HTTPS

## 📁 Struktur Project

```
disbed/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── rooms/       # API data ruangan
│   │   │   └── bangsal/     # API data bangsal
│   │   ├── tv/              # Halaman TV mode
│   │   ├── page.js          # Halaman utama
│   │   └── layout.js
│   ├── components/
│   │   ├── TVDashboard.js   # Komponen dashboard TV
│   │   ├── RoomCard.js      # Kartu ruangan
│   │   └── WardSummaryCard.js
│   ├── lib/
│   │   └── db.js            # Koneksi database
│   └── config/
└── public/
```

## 🔌 API Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/rooms` | GET | Data semua ruangan dengan status bed |
| `/api/bangsal` | GET | Data per bangsal |

## ⚙️ Environment Variables

| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `DB_HOST` | Host database MySQL | - |
| `DB_PORT` | Port database | `3306` |
| `DB_NAME` | Nama database | - |
| `DB_USER` | Username database | - |
| `DB_PASSWORD` | Password database | - |

## 📄 License

MIT License

