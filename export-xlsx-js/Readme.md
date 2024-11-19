# ExportManager Library
==========================

## Overview

ExportManager adalah library JavaScript yang memungkinkan Anda untuk mengunduh data dalam format XLSX dengan mudah. Library ini menyediakan fungsi untuk mengirim permintaan AJAX ke server dan mengunduh file XLSX yang dihasilkan.

## Instalasi

Untuk menggunakan ExportManager, Anda perlu memasukkan library ini ke dalam proyek Anda. Anda dapat melakukannya dengan cara memasukkan tag script berikut ke dalam file HTML Anda:

```html
<script src="export-manager.js"></script>
```

## Penggunaan

Untuk menggunakan ExportManager, Anda perlu membuat instance dari kelas `ExportManager` dan memanggil metode `init` untuk menginisialisasi library. Berikut adalah contoh penggunaan:

```javascript
const exportManager = new ExportManager({
  exportUrl: 'https://example.com/export', // URL untuk ekspor data
  triggerSelector: '.btn-export', // Selector untuk tombol ekspor
  dataProvider: () => ({ // Fungsi untuk menyediakan data dinamis
    nama: 'John Doe',
    alamat: 'Jalan ABC',
  }),
  alertCallback: () => { // Fungsi untuk menampilkan konfirmasi
    return new Promise(resolve => {
      Swal.fire({
        title: 'Apakah anda yakin akan mengunduh data?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya!',
        cancelButtonText: 'Batal',
      }).then(result => {
        resolve(result.isConfirmed);
      });
    });
  },
});

exportManager.init();
```

## Konfigurasi

ExportManager memiliki beberapa konfigurasi yang dapat Anda atur untuk menyesuaikan dengan kebutuhan Anda. Berikut adalah daftar konfigurasi yang tersedia:

* `exportUrl`: URL untuk ekspor data
* `triggerSelector`: Selector untuk tombol ekspor
* `dataProvider`: Fungsi untuk menyediakan data dinamis
* `alertCallback`: Fungsi untuk menampilkan konfirmasi

## Metode

ExportManager memiliki beberapa metode yang dapat Anda gunakan untuk mengunduh data. Berikut adalah daftar metode yang tersedia:

* `init`: Menginisialisasi library
* `handleExport`: Mengunduh data
* `sendAjaxRequest`: Mengirim permintaan AJAX ke server
* `downloadXLSX`: Mengunduh file XLSX
* `defaultalertCallback`: Fungsi konfirmasi default
* `alertError`: Fungsi untuk menampilkan notifikasi error
* `alertSuccess`: Fungsi untuk menampilkan notifikasi sukses

## Contoh Penggunaan

Berikut adalah contoh penggunaan ExportManager dalam sebuah aplikasi:

```html
<!-- index.html -->
<button class="btn-export">Ekspor Data</button>

<script src="export-manager.js"></script>
<script>
  const exportManager = new ExportManager({
    exportUrl: 'https://example.com/export',
    triggerSelector: '.btn-export',
    dataProvider: () => ({
      nama: 'John Doe',
      alamat: 'Jalan ABC',
    }),
    alertCallback: () => {
      return new Promise(resolve => {
        Swal.fire({
          title: 'Apakah anda yakin akan mengunduh data?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya!',
          cancelButtonText: 'Batal',
        }).then(result => {
          resolve(result.isConfirmed);
        });
      });
    },
  });

  exportManager.init();
</script>
```

Dengan menggunakan ExportManager, Anda dapat dengan mudah mengunduh data dalam format XLSX dan menampilkan konfirmasi kepada pengguna.
