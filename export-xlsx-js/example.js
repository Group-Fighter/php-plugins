document.addEventListener('DOMContentLoaded', () => {
	const exportManager = new ExportManager({
	  exportUrl: '/dashboard/invoice/export',
	  triggerSelector: '.btn-export',
	  dataProvider: () => {
		const dateRange = document.querySelector('.reportrange').textContent;
		const dates = dateRange.split(' - ');
		const startDate = moment(dates[0], 'MMMM D, YYYY').format('YYYY-MM-DD');
		const endDate = moment(dates[1], 'MMMM D, YYYY').format('YYYY-MM-DD');

		return {
		  StartDate: startDate,
		  EndDate: endDate,
		  SearchData: document.querySelector('#SearchData').value || '',
		  Status: document.querySelector('#Status').value || '',
		  FileName: `export_${startDate}_${endDate}.xlsx`, // Nama file dinamis
		  DownloadURL: '/download/path/to/file.xlsx', // URL untuk file
		  DeleteURL: '/delete/path/after/download', // URL delete setelah unduh
		};
	  },
	  alertCallback: () => {
		return Swal.fire({
		  title: 'Apakah anda yakin akan mengunduh data?',
		  text: 'Data akan diunduh setelah konfirmasi!',
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonText: 'Ya!',
		  cancelButtonText: 'Batal'
		}).then(result => result.isConfirmed);
	  }
	});
  });
