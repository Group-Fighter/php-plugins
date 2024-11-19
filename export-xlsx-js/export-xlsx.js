class ExportManager {
	constructor(config) {
	  this.exportUrl = config.exportUrl || ''; // URL untuk ekspor data
	  this.triggerSelector = config.triggerSelector || '.btn-export';
	  this.dataProvider = config.dataProvider || (() => ({})); // Fungsi untuk menyediakan data dinamis
	  this.alertCallback = config.alertCallback || this.defaultalertCallback;
  
	  // Attach event listener
	  this.init();
	}
  
	init() {
	  document.addEventListener('click', async event => {
		if (event.target.matches(this.triggerSelector)) {
		  await this.handleExport();
		}
	  });
	}
  
	async handleExport() {
	  // Ambil data dari dataProvider
	  const requestData = this.dataProvider();
	  if (!requestData || typeof requestData !== 'object') {
		this.alertError('Data yang diberikan tidak valid');
		return;
	  }
  
	  // Konfirmasi menggunakan SweetAlert
	  const confirm = await this.alertCallback();
	  if (!confirm) return;
  
	  // Kirim permintaan AJAX
	  this.sendAjaxRequest(this.exportUrl, requestData);
	}
  
	async sendAjaxRequest(url, data) {
	  try {
		const response = await fetch(url, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(data),
		});
  
		if (!response.ok) throw new Error('Request failed');
  
		const responseData = await response.json();
		this.alertSuccess(responseData.data.message);
  
		// Unduh file dengan parameter dinamis dari server
		this.downloadXLSX(
		  responseData.data.link,
		  responseData.data.file || 'export.xlsx',
		  responseData.data.delete
		);
	  } catch (error) {
		this.alertError('Terjadi kesalahan saat mengunduh data.');
	  }
	}
  
	async downloadXLSX(url, fileName = 'export.xlsx', afterDownloadUrl = '') {
	  try {
		const response = await fetch(url);
		if (!response.ok) throw new Error('File download failed');
  
		const blob = await response.blob();
		const downloadUrl = window.URL.createObjectURL(blob);
  
		const link = document.createElement('a');
		link.href = downloadUrl;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(downloadUrl);
  
		if (afterDownloadUrl) {
		  await fetch(afterDownloadUrl, { method: 'GET' });
		}
	  } catch (error) {
		this.alertError('Unduhan gagal.');
	  }
	}
  
	defaultalertCallback() {
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
	}
  
	alertError(message) {
	  console.error(message);
	  alert(message); // Ganti dengan sistem notifikasi yang digunakan
	}
  
	alertSuccess(message) {
	  console.log(message);
	  alert(message); // Ganti dengan sistem notifikasi yang digunakan
	}
  }
  