import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $userSession } from '../../lib/store';

export const ImportDataPanel: React.FC = () => {
  const session = useStore($userSession);
  const [importMethod, setImportMethod] = useState<'csv' | 'sheets'>('csv');
  const [file, setFile] = useState<File | null>(null);
  const [sheetUrl, setSheetUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setParsedData([]); // Reset parsed data
      setUploadSuccess(false);
    }
  };

  const handleParse = () => {
    if (importMethod === 'csv' && !file) {
      alert('Pilih file CSV terlebih dahulu.');
      return;
    }
    if (importMethod === 'sheets' && !sheetUrl) {
      alert('Masukkan URL Google Sheets terlebih dahulu.');
      return;
    }

    setIsParsing(true);
    // Simulate parsing delay
    setTimeout(() => {
      setParsedData([
        { id: 1, name: 'Budi Santoso', email: 'budi@example.com', dept: 'Program', status: 'Valid' },
        { id: 2, name: 'Siti Aminah', email: 'siti@example.com', dept: 'Keuangan', status: 'Valid' },
        { id: 3, name: 'Andi Wijaya', email: 'andi@example.com', dept: 'Fundraising', status: 'Valid' },
        { id: 4, name: 'Rina Gunawan', email: 'rina.g@example.com', dept: 'Sekretariat', status: 'Warning: Missing NIK' },
      ]);
      setIsParsing(false);
    }, 1500);
  };

  const handleUpload = () => {
    if (parsedData.length === 0) return;
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">Import Data Masal</h2>
        <p className="text-xs text-[#737686] mt-0.5">Migrasi data karyawan dan struktur organisasi dari sumber eksternal.</p>
      </div>

      {uploadSuccess ? (
        <div className="bg-emerald-50 rounded-[24px] border border-emerald-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#0b1c30] mb-2">Import Berhasil!</h3>
          <p className="text-sm text-[#434654] mb-8">Sebanyak {parsedData.length} baris data karyawan berhasil ditambahkan ke dalam sistem database.</p>
          <button
            onClick={() => {
              setUploadSuccess(false);
              setFile(null);
              setSheetUrl('');
              setParsedData([]);
            }}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full text-sm transition-colors shadow-md shadow-emerald-600/20"
          >
            Import Data Lain
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Method Selection */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-6">
              <h3 className="font-sans text-[10px] text-[#0053d0] font-bold uppercase tracking-wider bg-[#dae1ff]/50 inline-block px-4 py-1.5 rounded-full mb-6">
                METODE IMPORT
              </h3>

              <div className="space-y-4">
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  importMethod === 'csv' ? 'border-[#0053d0] bg-blue-50/30' : 'border-slate-200 hover:border-blue-200'
                }`}>
                  <input
                    type="radio"
                    name="method"
                    checked={importMethod === 'csv'}
                    onChange={() => setImportMethod('csv')}
                    className="mt-1"
                  />
                  <div>
                    <span className="block font-bold text-sm text-[#0b1c30]">File CSV / Excel</span>
                    <span className="block text-xs text-[#737686] mt-0.5">Upload file format .csv, .xlsx, atau .xls</span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  importMethod === 'sheets' ? 'border-[#0053d0] bg-blue-50/30' : 'border-slate-200 hover:border-blue-200'
                }`}>
                  <input
                    type="radio"
                    name="method"
                    checked={importMethod === 'sheets'}
                    onChange={() => setImportMethod('sheets')}
                    className="mt-1"
                  />
                  <div>
                    <span className="block font-bold text-sm text-[#0b1c30]">Google Sheets</span>
                    <span className="block text-xs text-[#737686] mt-0.5">Tautkan langsung menggunakan URL</span>
                  </div>
                </label>
              </div>

              <div className="mt-8 space-y-4">
                {importMethod === 'csv' ? (
                  <div>
                    <label className="block text-xs font-bold text-[#434654] uppercase tracking-wider mb-2">Pilih File</label>
                    <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:bg-blue-50/50 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <span className="material-symbols-outlined text-3xl text-[#c0c7d4] mb-2">upload_file</span>
                      <p className="text-sm font-bold text-[#0b1c30]">{file ? file.name : 'Klik atau Tarik File'}</p>
                      {!file && <p className="text-[10px] text-[#737686] mt-1">Maks. 5MB</p>}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-[#434654] uppercase tracking-wider mb-2">URL Google Sheets</label>
                    <input
                      type="url"
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      className="w-full px-4 py-2.5 bg-[#f8f9ff] border border-blue-100 rounded-xl focus:border-[#0053d0]/40 outline-none text-xs text-[#0b1c30]"
                    />
                    <p className="text-[10px] text-[#737686] mt-1.5">*Pastikan akses *Share* telah diset ke *Anyone with the link*.</p>
                  </div>
                )}

                <button
                  onClick={handleParse}
                  disabled={isParsing || (importMethod === 'csv' ? !file : !sheetUrl)}
                  className="w-full px-6 py-3 bg-[#0053d0] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isParsing ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Parsing...</>
                  ) : (
                    <><span className="material-symbols-outlined text-sm">search</span> Pratinjau Data</>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-[#eff4ff] rounded-[24px] border border-blue-100 p-6">
              <h4 className="font-bold text-sm text-[#0053d0] mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">info</span> Panduan Import
              </h4>
              <ul className="text-xs text-[#434654] space-y-2 list-disc pl-4">
                <li>Gunakan template CSV/Excel yang telah disediakan untuk mencegah error struktur kolom.</li>
                <li>Baris dengan status peringatan (Warning) akan tetap disimpan namun disarankan untuk diperbarui secara manual nanti.</li>
                <li>Maksimal baris dalam 1 kali import adalah 500 baris.</li>
              </ul>
              <a href="#" className="inline-flex items-center gap-1 text-xs font-bold text-[#0053d0] hover:underline mt-4">
                <span className="material-symbols-outlined text-sm">download</span> Download Template
              </a>
            </div>
          </div>

          {/* Right Column: Preview & Upload */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[24px] shadow-sm border border-blue-50/50 p-6 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-sans text-[10px] text-[#0053d0] font-bold uppercase tracking-wider bg-[#dae1ff]/50 inline-block px-4 py-1.5 rounded-full">
                  PRATINJAU DATA
                </h3>
                
                {parsedData.length > 0 && (
                  <span className="text-xs font-bold text-[#0b1c30] bg-[#f8f9ff] px-3 py-1 rounded-lg border border-blue-50">
                    {parsedData.length} Baris Ditemukan
                  </span>
                )}
              </div>

              {parsedData.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#c0c7d4]">
                    <span className="material-symbols-outlined text-4xl">table_view</span>
                  </div>
                  <p className="font-bold text-[#0b1c30]">Belum Ada Data</p>
                  <p className="text-xs text-[#737686] mt-1 max-w-sm">Pilih file atau masukkan URL Google Sheets, lalu klik "Pratinjau Data" untuk memeriksa kolom yang terdeteksi.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto border border-blue-50 rounded-xl mb-6">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-blue-50 text-[#737686] font-bold uppercase tracking-wider bg-[#f8f9ff]/50">
                          <th className="px-4 py-3">Nama</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Departemen</th>
                          <th className="px-4 py-3">Validasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-50/40">
                        {parsedData.map((row, i) => (
                          <tr key={i} className="hover:bg-[#eff4ff]/20">
                            <td className="px-4 py-3 font-semibold text-[#0b1c30]">{row.name}</td>
                            <td className="px-4 py-3 text-[#434654]">{row.email}</td>
                            <td className="px-4 py-3 text-[#434654]">{row.dept}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                row.status.includes('Warning') 
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              }`}>
                                {row.status.includes('Warning') ? <span className="material-symbols-outlined text-[12px]">warning</span> : <span className="material-symbols-outlined text-[12px]">check_circle</span>}
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-auto flex justify-end">
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="px-8 py-3 bg-[#008733] hover:bg-emerald-700 text-white font-bold rounded-full text-sm transition-colors shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isUploading ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Menyimpan...</>
                      ) : (
                        <><span className="material-symbols-outlined text-lg">cloud_upload</span> Jalankan Import</>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
