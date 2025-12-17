# Deployment Next.js di aaPanel (Ubuntu)

Dokumen ini menjelaskan langkah **deployment project Next.js (mode production)** menggunakan **aaPanel Node Project + Nginx reverse proxy**, berdasarkan setup yang sudah terbukti berjalan stabil.

---

## 1. Prasyarat

- OS: Ubuntu 22.04 / 24.04
- aaPanel terinstall
- Node.js (disarankan LTS / sesuai kebutuhan project)
- Domain sudah mengarah ke server
- SSL aktif (Let’s Encrypt / Custom)
- Project Next.js **bukan static export**

---

## 2. Struktur Project

Contoh lokasi project:

```
/www/wwwroot/disbed/
├─ app/
├─ public/
├─ package.json
├─ node_modules/
├─ .next/
```

---

## 3. Konfigurasi package.json

Pastikan script **production** tersedia:

```json
{
  "scripts": {
    "dev": "next dev -p 54321",
    "build": "next build",
    "start": "next start"
  }
}
```

Catatan:
- Port **tidak** ditentukan di script `start`
- Port dikontrol oleh **aaPanel + Nginx reverse proxy**

---

## 4. Build Production di Server

Jalankan perintah berikut:

```bash
cd /www/wwwroot/disbed
npm install
npm run build
```

Pastikan:
- Build sukses
- Folder `.next/` terbentuk

---

## 5. Setup Node Project di aaPanel

Menu: **Node Project → Add Project**

Konfigurasi:
- Path: `/www/wwwroot/disbed`
- Run opt: `start (next start)`
- Port: `3000`
- User: `www`
- Node version: sesuai project
- Boot: ✔ Enable

Verifikasi port aktif:

```bash
ss -lntp | grep 3000
```

---

## 6. Konfigurasi Nginx

### 6.1 HTTP ke HTTPS Redirect

```nginx
server {
    listen 80;
    server_name bed.rsudhabdulazizmarabahan.com;
    return 301 https://$host$request_uri;
}
```

---

### 6.2 HTTPS Reverse Proxy (FINAL & BENAR)

```nginx
server {
    listen 443 ssl http2;
    server_name bed.rsudhabdulazizmarabahan.com;

    ssl_certificate     /www/server/panel/vhost/cert/DisBed/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/DisBed/privkey.pem;

    # Proxy khusus asset Next.js (WAJIB)
    location /_next/ {
        proxy_pass http://127.0.0.1:3000/_next/;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy utama aplikasi
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
```

PENTING:
- `/_next/` **HARUS** diproxy ke `/_next/`
- Wajib pakai trailing slash `/`
- Tanpa ini CSS & JS akan **404**

---

## 7. Reload Nginx

```bash
nginx -t
systemctl reload nginx
```

---

## 8. Verifikasi

### 8.1 Dari Server

```bash
curl -I http://127.0.0.1:3000
curl -I https://bed.rsudhabdulazizmarabahan.com/_next/static/
```

### 8.2 Dari Browser

- Tidak ada error `/_next/static` di DevTools
- CSS & JS termuat
- Tampilan sama dengan localhost

---

## 9. Catatan Penting

- Jangan gunakan `root` untuk Next.js
- Jangan campur config PHP
- Jangan biarkan Nginx listen di port Node
- Semua request domain **harus lewat reverse proxy**
- aaPanel Node Project **cukup tanpa PM2 manual**

---

## 10. Troubleshooting

### CSS / JS 404
- Salah konfigurasi `/_next/` proxy

### Error EADDRINUSE
- Port sudah dipakai service lain
- Cek dengan `ss -lntp`

### Domain putih, IP:3000 normal
- Reverse proxy `_next` tidak benar

---

## 11. Status Deployment

✔ Production Ready
✔ Reverse Proxy Correct
✔ Multi Next.js Project Ready
✔ Auto start on reboot

---

Deployment selesai dan stabil.

