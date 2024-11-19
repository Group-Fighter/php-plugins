class TempDataManager {
	constructor() {
		this.data = [];
		this.listeners = [];
	}

	// Tambah listener untuk perubahan data
	addListener(callback) {
		if (typeof callback === "function") {
			this.listeners.push(callback);
		}
	}

	// Hapus listener tertentu
	removeListener(callback) {
		this.listeners = this.listeners.filter(listener => listener !== callback);
	}

	// Panggil semua listener saat data berubah
	_notifyListeners() {
		this.listeners.forEach(callback => callback(this.data));
	}

	// Reset data
	reset() {
		this.data = [];
		this._notifyListeners();
	}

	// Tambah data baru secara dinamis
	set(data = {}) {
		if (typeof data === "object" && !Array.isArray(data)) {
			this.data.push(data);
			this._notifyListeners();
		} else {
			console.warn("Data harus berupa object.");
		}
	}

	// Hapus data berdasarkan key dinamis
	delete(key, value) {
		this.data = this.data.filter(element => element[key] !== value);
		this._notifyListeners();
	}

	// Ambil semua data
	getData() {
		return this.data;
	}

	// Cari data berdasarkan key dinamis
	getDataByKey(key, value) {
		return this.data.find(element => element[key] === value) || null;
	}

	// Update data berdasarkan key dinamis
	update(key, value, newData = {}) {
		const index = this.data.findIndex(element => element[key] === value);
		if (index !== -1) {
			this.data[index] = { ...this.data[index], ...newData };
			this._notifyListeners();
		} else {
			console.warn(`Data dengan ${key}: ${value} tidak ditemukan.`);
		}
	}
}
