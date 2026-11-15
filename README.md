# Personal Website

Template personal website responsif berbasis HTML, CSS, dan JavaScript murni (tanpa build step).

## Struktur File

- `index.html` — Konten utama halaman (Hero, Tentang, Proyek, Pengalaman, Kontak)
- `styles.css` — Styling responsif + dukungan mode terang/gelap
- `script.js` — Toggle tema, menu mobile, filter proyek, animasi scroll, dan validasi form kontak

## Cara Menjalankan

Cukup buka `index.html` langsung di browser, atau jalankan server lokal:

```powershell
npx serve .
```

## Cara Kustomisasi

1. Ganti `Nama Anda`, bio, link media sosial, dan email di `index.html`.
2. Ganti inisial `NA` pada `.avatar-placeholder` dengan foto profil Anda (`<img>`).
3. Sesuaikan daftar keahlian, proyek, dan pengalaman kerja sesuai profil Anda.
4. Untuk membuat form kontak mengirim email sungguhan, hubungkan `<form>` ke layanan seperti Formspree atau Web3Forms.
