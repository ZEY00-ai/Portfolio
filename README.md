This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Menghubungkan Galeri Google Drive

Galeri memakai Google Drive API key untuk membaca foto dari tiga folder Drive. Pengunjung tidak perlu login, dan API key hanya dipakai server. Pratinjau gambar disajikan melalui route server galeri yang mencoba beberapa URL thumbnail publik, sehingga browser tidak perlu membuka URL Google Drive langsung. Tidak ada fitur tambah, ubah, atau hapus foto.

1. Pastikan **Google Drive API** aktif di project Google Cloud.
2. Buat **API key** lewat **APIs & Services → Credentials → Create credentials → API key**. Pada API restrictions, pilih **Restrict key** dan centang **Google Drive API**. Untuk penggunaan lokal, Application restrictions dapat sementara dipilih **None**.
3. Bagikan setiap folder sebagai **Siapa saja yang memiliki link — Viewer/Pelihat**.
4. Tambahkan API key dan URL folder berikut ke `.env.local` di root project:

   ```env
   GOOGLE_DRIVE_API_KEY=API_KEY_ANDA
   SMA_GDRIVE_URL=https://drive.google.com/drive/folders/ID_FOLDER_SMA
   KULIAH_GDRIVE_URL=https://drive.google.com/drive/folders/ID_FOLDER_KULIAH
   PRIBADI_GDRIVE_URL=https://drive.google.com/drive/folders/ID_FOLDER_PRIBADI
   ```

5. Restart server lokal dengan `npm run dev`. Untuk deployment, tambahkan keempat environment variable ke pengaturan hosting lalu deploy ulang.

Halaman Galeri menampilkan folder SMA, Kuliah, dan Pribadi sebagai bagian terpisah. Pastikan file gambar berada langsung di setiap folder.

### Jika galeri menampilkan HTTP 403

- Pastikan `GOOGLE_DRIVE_API_KEY` adalah API key, bukan OAuth Client ID/Secret.
- Pastikan Google Drive API aktif pada project yang sama dengan key dan key mengizinkan Google Drive API.
- Request dibuat dari server, jadi jangan gunakan batasan **Websites/HTTP referrers**; pilih **None** untuk tes lokal.
- Pastikan setiap folder dibagikan sebagai **Siapa saja yang memiliki link — Viewer/Pelihat**.
- Setelah mengubah `.env.local`, restart server pengembangan.
- Jangan kirim API key ke chat atau commit ke Git.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
