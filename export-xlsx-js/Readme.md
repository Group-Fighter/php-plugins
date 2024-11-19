 # ExportManager Library
==========================

## Overview

ExportManager adalah library JavaScript yang memungkinkan Anda untuk mengunduh data dalam format XLSX dengan mudah. Library ini menyediakan fungsi untuk mengirim permintaan AJAX ke server dan mengunduh file XLSX yang dihasilkan.

## Instalasi

Untuk menggunakan ExportManager, Anda dapat memasukkan kode berikut ke dalam proyek Anda:
```javascript
const exportManager = new ExportManager(config);
```
## Konfigurasi

ExportManager memerlukan konfigurasi berikut:

* `exportUrl`: URL untuk ekspor data
* `triggerSelector`: Selektor elemen yang akan dijadikan trigger untuk mengunduh data
* `dataProvider`: Fungsi yang menyediakan data dinamis untuk diunduh
* `alertCallback`: Fungsi yang digunakan untuk menampilkan konfirmasi sebelum mengunduh data

Contoh konfigurasi:
```javascript
const config = {
  exportUrl: 'https://example.com/export',
  triggerSelector: '.btn-export',
  dataProvider: () => ({ /* data dinamis */ }),
  alertCallback: () => {
    // Fungsi konfirmasi
  }
};
```
## Fungsi

ExportManager menyediakan beberapa fungsi untuk mengunduh data:

* `handleExport`: Fungsi yang dijalankan ketika trigger diaktifkan
* `sendAjaxRequest`: Fungsi yang mengirim permintaan AJAX ke server
* `downloadXLSX`: Fungsi yang mengunduh file XLSX dari server

## Contoh Penggunaan

Berikut adalah contoh penggunaan ExportManager:
```javascript
const exportManager = new ExportManager(config);

// Tambahkan event listener ke trigger
document.addEventListener('click', async event => {
  if (event.target.matches(config.triggerSelector)) {
    await exportManager.handleExport();
  }
});
```
## API

### `handleExport()`

Fungsi yang dijalankan ketika trigger diaktifkan.

### `sendAjaxRequest(url, data)`

Fungsi yang mengirim permintaan AJAX ke server.

* `url`: URL untuk ekspor data
* `data`: Data yang akan diunduh

### `downloadXLSX(url, fileName, afterDownloadUrl)`

Fungsi yang mengunduh file XLSX dari server.

* `url`: URL file XLSX
* `fileName`: Nama file XLSX
* `afterDownloadUrl`: URL yang akan diakses setelah file diunduh

## Lisensi

ExportManager library adalah perangkat lunak bebas dan terbuka yang dilisensikan di bawah Lisensi MIT.
