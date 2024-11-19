# Dokumen Implementasi Dynamic SPA

## Pendahuluan

Dokumen ini menjelaskan cara implementasi Dynamic SPA pada aplikasi web. Dynamic SPA adalah library yang memungkinkan pengembangan aplikasi web single-page dengan mudah dan efisien.

## Instalasi

Untuk menggunakan Dynamic SPA, Anda perlu memasukkan script berikut pada halaman web Anda:
```html
<script src="spa.js"></script>
```
## Inisialisasi

Untuk memulai menggunakan Dynamic SPA, Anda perlu membuat instance dari kelas `DynamicSPA` dan mengatur konfigurasi awal. Contoh:
```javascript
const spa = new DynamicSPA({
  container: "#content",
  routes: routes,
  menuTagAttribute: "page",
});
```
## Konfigurasi

Berikut adalah konfigurasi yang dapat Anda atur pada Dynamic SPA:

* `container`: ID dari elemen HTML yang akan digunakan sebagai container untuk aplikasi.
* `routes`: Objek yang berisi rute-rute aplikasi.
* `menuTagAttribute`: Atribut yang digunakan untuk menandai elemen menu.
* `eventAttribute`: Atribut yang digunakan untuk menandai elemen event.
* `htmlFail`: HTML yang akan ditampilkan jika terjadi kesalahan.
* `htmlNotFound`: HTML yang akan ditampilkan jika halaman tidak ditemukan.

## Menambahkan Rute

Untuk menambahkan rute pada aplikasi, Anda dapat menggunakan metode `addPage`. Contoh:
```javascript
spa.addPage("/about", {
  component: "http://127.0.0.1:5500/pages/about.html",
  scripts: ["http://127.0.0.1:5500/assets/about.js"],
});
```
## Navigasi

Untuk melakukan navigasi ke halaman lain, Anda dapat menggunakan metode `navigateTo`. Contoh:
```javascript
spa.navigateTo("/about");
```
## Elemen Menu

Untuk membuat elemen menu, Anda perlu menambahkan atribut `page` pada elemen HTML atau `menuTagAttribute` yang ada di option. Contoh:
```html
<div href="/" page>Home</div>
<a data-url="/about" page>About</a>
```
## Elemen Event

Untuk membuat elemen event, Anda perlu menambahkan atribut `event-handler` pada elemen HTML atau `eventAttribute` yang ada di option. Contoh:
```html
<button id="home-button" event-handler>Click Me id</button>
```
