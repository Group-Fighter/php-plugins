class RFIDInputDetector {
  constructor(inputElement, options = {}) {
    this.inputElement = inputElement;
    this.frequencyType = options.frequencyType || 'UHF';
    this.threshold = this.setThresholdByFrequency(this.frequencyType);
    this.minLength = options.minLength || 10;
    this.startTime = null;
    this.lastKeystrokeTime = 0;

    this.onRFIDDetected = options.onRFIDDetected || function () {};
    this.onManualInputDetected = options.onManualInputDetected || function () {};

    this.inputElement.addEventListener('input', event => this.detectInputType(event));

    // Cegah pengiriman form saat tombol Enter ditekan
    this.inputElement.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Mencegah submit form
      }
    });
  }

  // Menentukan threshold berdasarkan jenis frekuensi
  setThresholdByFrequency(frequencyType) {
    switch (frequencyType) {
      case 'LF':
        return 500; // 0.5 detik atau 500ms
      case 'HF':
        return 200; // 0.2 detik atau 200ms
      case 'UHF':
        return 20; // 0.02 detik atau 20ms
      default:
        return parseInt(frequencyType); // Default jika tidak ada tipe yang cocok
    }
  }

  detectInputType(event) {
    const currentTime = new Date().getTime();

    if (this.startTime === null) {
      this.startTime = currentTime; // Waktu input pertama dimulai
    }

    const timeDifference = currentTime - this.lastKeystrokeTime;
    this.lastKeystrokeTime = currentTime;

    // Ambil nilai input dan batasi panjangnya
    let value = event.target.value;
    if (value.length > this.minLength) {
      value = value.slice(0, this.minLength);
      this.inputElement.value = value;
    }

    if (value.length === this.minLength) {
      const totalInputTime = currentTime - this.startTime; // Hitung waktu total
      this.startTime = null; // Reset untuk input berikutnya

      if (totalInputTime < this.threshold * this.minLength) {
        this.onRFIDDetected(value);
      } else {
        this.onManualInputDetected(value);
      }
    }
  }

  autoSelectInput() {
    this.inputElement.select();
  }

  clearInput() {
    this.inputElement.value = '';
  }
}
