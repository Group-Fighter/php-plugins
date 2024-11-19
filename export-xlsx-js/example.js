document.addEventListener('DOMContentLoaded', () => {
	const exportManager = new ExportManager({
	  exportUrl: '/dashboard/invoice/export', // URL untuk proses ekspor
	  triggerSelector: '.btn-export', // Selector untuk tombol yang memicu ekspor
	  dataProvider: () => {
		// Fungsi untuk menyediakan data input secara dinamis
		const dateRange = document.querySelector('.reportrange span')?.innerHTML || '';
		if (!dateRange) {
		  alert('Filter tanggal harus diisi');
		  return null;
		}
  
		const dates = dateRange.split(' - ');
		const startDate = moment(dates[0], 'MMMM D, YYYY').format('YYYY-MM-DD');
		const endDate = moment(dates[1], 'MMMM D, YYYY').format('YYYY-MM-DD');
  
		return {
		  StartDate: startDate,
		  EndDate: endDate,
		  SearchData: document.querySelector('#SearchData')?.value || '',
		  Status: document.querySelector('#Status')?.value || '',
		};
	  },
	  alertCallback: () => {
		return new Promise(resolve => {
		  Swal.fire({
			title: 'Apakah anda yakin akan mengunduh data?',
			text: 'Data akan diunduh setelah konfirmasi!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Ya!',
			cancelButtonText: 'Batal',
		  }).then(result => {
			resolve(result.isConfirmed);
		  });
		});
	  },
	});
  });
  