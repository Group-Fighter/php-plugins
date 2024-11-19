
# RFIDInputDetector Library

## Overview

RFIDInputDetector adalah library JavaScript yang membantu mendeteksi apakah input pada elemen HTML berasal dari RFID reader atau input manual. Library ini menggunakan prinsip bahwa input dari RFID reader biasanya memiliki kecepatan yang lebih tinggi daripada input manual.

## Instalasi

Untuk menggunakan library ini, Anda dapat menambahkan kode berikut pada file HTML Anda:
```html
<script src="RFIDInputDetector.js"></script>
```
Atau, jika Anda menggunakan npm, Anda dapat menjalankan perintah berikut:
```bash
npm install rfid-input-detector
```
## Penggunaan

Untuk menggunakan library ini, Anda perlu membuat instance dari kelas `RFIDInputDetector` dan memasukkan elemen input yang ingin Anda deteksi. Contoh:
```javascript
const inputElement = document.getElementById('myInput');
const rfidDetector = new RFIDInputDetector(inputElement, {
  frequencyType: 'UHF',
  minLength: 10,
  onRFIDDetected: (value) => console.log('RFID detected:', value),
  onManualInputDetected: (value) => console.log('Manual input detected:', value),
});
```
## Konfigurasi

Library ini memiliki beberapa konfigurasi yang dapat Anda atur:

* `frequencyType`: Jenis frekuensi RFID yang digunakan. Nilai default adalah `'UHF'`.
* `minLength`: Panjang minimum input yang dianggap sebagai input RFID. Nilai default adalah `10`.
* `onRFIDDetected`: Fungsi yang akan dipanggil ketika input RFID terdeteksi.
* `onManualInputDetected`: Fungsi yang akan dipanggil ketika input manual terdeteksi.

## Metode

Library ini memiliki beberapa metode yang dapat Anda gunakan:

* `autoSelectInput()`: Memilih semua teks pada elemen input.
* `clearInput()`: Menghapus semua teks pada elemen input.

## Contoh Penggunaan

Contoh penggunaan library ini dapat dilihat pada kode berikut:
```html
<html>
  <head>
    <script src="RFIDInputDetector.js"></script>
  </head>
  <body>
    <input id="myInput" type="text">
    <script>
      const inputElement = document.getElementById('myInput');
      const rfidDetector = new RFIDInputDetector(inputElement, {
        frequencyType: 'UHF',
        minLength: 10,
        onRFIDDetected: (value) => console.log('RFID detected:', value),
        onManualInputDetected: (value) => console.log('Manual input detected:', value),
      });
    </script>
  </body>
</html>
```
Dengan menggunakan library ini, Anda dapat dengan mudah mendeteksi apakah input pada elemen HTML berasal dari RFID reader atau input manual.
