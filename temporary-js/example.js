const manager = new TempDataManager();

// Tambah listener
manager.addListener(data => console.log("Data berubah:", data));

// Tambah data
manager.set({ NoKartu: "123", TglRegister: "2024-11-19", JenisKartu: "Gold" });
manager.set({ NoKartu: "124", TglRegister: "2024-11-18", JenisKartu: "Silver" });

// Cari data
console.log(manager.getDataByKey("NoKartu", "123"));

// Update data
manager.update("NoKartu", "123", { JenisKartu: "Platinum" });

// Hapus data
manager.delete("NoKartu", "124");

// Reset data
manager.reset();
