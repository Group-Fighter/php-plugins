
# RFIDInputDetector Library
==========================

## Overview

RFIDInputDetector adalah library yang dirancang untuk mendeteksi input RFID dan mengelola data terkait. Library ini menyediakan fitur-fitur seperti menambah, menghapus, dan mengupdate data RFID.

## Instalasi

Untuk menggunakan library ini, Anda dapat menginstalnya dengan cara menambahkan kode berikut ke dalam proyek Anda:

```javascript
const TempDataManager = require('./TempDataManager');
```

## Penggunaan

Berikut adalah contoh penggunaan library ini:

```javascript
const tempDataManager = new TempDataManager();

// Menambah listener untuk perubahan data
tempDataManager.addListener((data) => {
  console.log('Data telah berubah:', data);
});

// Menambah data baru
tempDataManager.set({ id: 1, name: 'John Doe' });

// Menghapus data berdasarkan key dinamis
tempDataManager.delete('id', 1);

// Mengupdate data berdasarkan key dinamis
tempDataManager.update('id', 1, { name: 'Jane Doe' });

// Mengambil semua data
const data = tempDataManager.getData();
console.log('Semua data:', data);

// Mencari data berdasarkan key dinamis
const dataByKey = tempDataManager.getDataByKey('id', 1);
console.log('Data dengan id 1:', dataByKey);
```

## Metode

Berikut adalah metode-metode yang tersedia dalam library ini:

### `addListener(callback)`

Menambah listener untuk perubahan data.

* `callback`: Fungsi yang akan dipanggil saat data berubah.

### `removeListener(callback)`

Menghapus listener tertentu.

* `callback`: Fungsi yang ingin dihapus.

### `reset()`

Mengreset data.

### `set(data)`

Menambah data baru.

* `data`: Objek yang ingin ditambahkan.

### `delete(key, value)`

Menghapus data berdasarkan key dinamis.

* `key`: Key yang ingin dihapus.
* `value`: Nilai yang ingin dihapus.

### `update(key, value, newData)`

Mengupdate data berdasarkan key dinamis.

* `key`: Key yang ingin diupdate.
* `value`: Nilai yang ingin diupdate.
* `newData`: Objek yang ingin diupdate.

### `getData()`

Mengambil semua data.

### `getDataByKey(key, value)`

Mencari data berdasarkan key dinamis.

* `key`: Key yang ingin dicari.
* `value`: Nilai yang ingin dicari.

## Lisensi

Library ini dirilis di bawah lisensi MIT. Anda dapat menggunakan, memodifikasi, dan mendistribusikan library ini secara bebas.
