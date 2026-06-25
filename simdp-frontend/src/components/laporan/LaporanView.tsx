import React, { useState } from "react";

// Types for our reports structure
interface ReportItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  format: 'Excel' | 'PDF';
  color: string;
}

interface ReportCategory {
  title: string;
  icon: string;
  reports: ReportItem[];
}

const reportCategories: ReportCategory[] = [
  {
    title: "Kepegawaian & HR",
    icon: "badge",
    reports: [
      {
        id: "hr-1",
        title: "Statistik Demografis",
        description: "Rentang usia, pendidikan, gender, dan persebaran divisi.",
        icon: "pie_chart",
        format: "Excel",
        color: "blue"
      },
      {
        id: "hr-2",
        title: "Perputaran Karyawan (Turnover)",
        description: "Laju resign, pensiun, pemecatan, dan rekrutmen baru.",
        icon: "moving",
        format: "PDF",
        color: "rose"
      },
      {
        id: "hr-3",
        title: "Karyawan Baru per Periode",
        description: "Daftar pegawai yang bergabung berdasarkan rentang waktu.",
        icon: "person_add",
        format: "Excel",
        color: "emerald"
      }
    ]
  },
  {
    title: "Kehadiran & Waktu Kerja",
    icon: "event_available",
    reports: [
      {
        id: "att-1",
        title: "Rekap Kehadiran & Absensi",
        description: "Total hadir, izin, sakit, cuti bulanan per divisi.",
        icon: "calendar_month",
        format: "Excel",
        color: "blue"
      },
      {
        id: "att-2",
        title: "Laporan Keterlambatan",
        description: "Akumulasi waktu dan frekuensi keterlambatan jam masuk.",
        icon: "history_toggle_off",
        format: "Excel",
        color: "amber"
      },
      {
        id: "att-3",
        title: "Rekap Timesheet Harian",
        description: "Log aktivitas jam kerja harian, lembur, dan tugas.",
        icon: "assignment",
        format: "Excel",
        color: "purple"
      }
    ]
  },
  {
    title: "Kompensasi & Finansial",
    icon: "account_balance_wallet",
    reports: [
      {
        id: "fin-1",
        title: "Laporan PPh 21 & BPJS",
        description: "Data potongan pajak dan asuransi untuk keperluan setor/pajak.",
        icon: "account_balance",
        format: "Excel",
        color: "emerald"
      },
      {
        id: "fin-2",
        title: "Rekap Reimbursement",
        description: "Total klaim pengeluaran per kategori, status, dan divisi.",
        icon: "receipt_long",
        format: "Excel",
        color: "amber"
      },
      {
        id: "fin-3",
        title: "Export Buku Gaji (Payroll)",
        description: "Master data komponen gaji pokok, tunjangan, potongan.",
        icon: "payments",
        format: "Excel",
        color: "blue"
      }
    ]
  },
  {
    title: "Rekrutmen & Pengembangan",
    icon: "model_training",
    reports: [
      {
        id: "rec-1",
        title: "Funnel Seleksi Rekrutmen",
        description: "Rasio konversi dari pelamar masuk, review, hingga diterima.",
        icon: "filter_alt",
        format: "PDF",
        color: "purple"
      },
      {
        id: "rec-2",
        title: "Rekap Pelatihan (LMS)",
        description: "Daftar kursus/pelatihan yang diselesaikan per karyawan.",
        icon: "local_library",
        format: "Excel",
        color: "emerald"
      },
      {
        id: "rec-3",
        title: "Laporan Kinerja (KPI)",
        description: "Skor pencapaian tahunan/semester per departemen.",
        icon: "trending_up",
        format: "PDF",
        color: "rose"
      }
    ]
  }
];

export const LaporanView: React.FC = () => {
  const [periodFilter, setPeriodFilter] = useState("Bulan Ini");
  const [deptFilter, setDeptFilter] = useState("Semua Departemen");
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = (reportId: string, format: string) => {
    setIsExporting(reportId);
    // Mock export delay
    setTimeout(() => {
      setIsExporting(null);
      alert(`Berhasil menyiapkan laporan dalam format ${format}. (Integrasi backend sedang dalam pengembangan)`);
    }, 1500);
  };

  const getBadgeColorClasses = (color: string) => {
    switch(color) {
      case 'blue': return 'bg-blue-50 text-[#0053d0]';
      case 'rose': return 'bg-rose-50 text-rose-600';
      case 'emerald': return 'bg-emerald-50 text-emerald-600';
      case 'amber': return 'bg-amber-50 text-amber-600';
      case 'purple': return 'bg-purple-50 text-purple-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="font-sans text-3xl font-extrabold text-[#0b1c30] tracking-tight">Reporting Hub</h2>
          <p className="font-sans text-sm text-[#434654] mt-1">Pusat unduhan dan kompilasi laporan analitik lintas modul</p>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="bg-white rounded-[24px] border border-blue-50/50 p-6 shadow-sm shadow-blue-500/5">
        <h3 className="text-sm font-bold text-[#0b1c30] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0053d0] text-[20px]">filter_list</span>
          Filter Global Laporan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#737686] uppercase tracking-wider mb-1.5">Periode Data</label>
            <select 
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] text-xs font-semibold focus:outline-none focus:border-[#0053d0]"
            >
              <option value="Bulan Ini">Bulan Ini</option>
              <option value="Bulan Lalu">Bulan Lalu</option>
              <option value="Kuartal Ini">Kuartal Ini</option>
              <option value="Tahun Ini">Tahun Ini</option>
              <option value="Tahun Lalu">Tahun Lalu</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-[#737686] uppercase tracking-wider mb-1.5">Departemen / Unit Kerja</label>
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-blue-100 bg-[#f8f9ff] text-xs font-semibold focus:outline-none focus:border-[#0053d0]"
            >
              <option value="Semua Departemen">Semua Departemen</option>
              <option value="Program">Program</option>
              <option value="Fundraising & Partnership">Fundraising & Partnership</option>
              <option value="Keuangan">Keuangan</option>
              <option value="Sekretariat">Sekretariat</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-[#f8f9ff] hover:bg-blue-50 text-[#0053d0] border border-blue-100 font-bold px-4 py-2.5 rounded-xl transition-colors text-xs flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">sync</span>
              Terapkan Filter
            </button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-50 flex items-center gap-2 text-[10px] text-[#737686]">
          <span className="material-symbols-outlined text-sm text-[#0053d0]">info</span>
          Filter ini akan memengaruhi parameter data laporan yang Anda unduh dari kategori di bawah ini.
        </div>
      </div>

      {/* Report Categories */}
      <div className="space-y-8 mt-8">
        {reportCategories.map((category) => (
          <div key={category.title} className="space-y-4">
            <h3 className="font-bold text-lg text-[#0b1c30] flex items-center gap-2 pb-2 border-b border-blue-50/50">
              <span className="material-symbols-outlined text-[#0053d0]">{category.icon}</span>
              {category.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {category.reports.map((report) => (
                <div key={report.id} className="bg-white rounded-2xl border border-blue-50/50 p-5 shadow-sm shadow-blue-500/5 hover:shadow-md hover:border-blue-100 transition-all duration-200 group flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getBadgeColorClasses(report.color)}`}>
                        <span className="material-symbols-outlined text-xl">{report.icon}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                        report.format === 'Excel' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        Format {report.format}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#0b1c30] text-sm mb-1.5 group-hover:text-[#0053d0] transition-colors">{report.title}</h4>
                    <p className="text-[#737686] text-xs leading-relaxed mb-5">
                      {report.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleExport(report.id, report.format)}
                    disabled={isExporting !== null}
                    className="w-full bg-white hover:bg-[#f8f9ff] border border-blue-100 text-[#0053d0] font-bold px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs"
                  >
                    {isExporting === report.id ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0053d0]"></div>
                        Menyiapkan...
                      </div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Generate & Unduh
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
