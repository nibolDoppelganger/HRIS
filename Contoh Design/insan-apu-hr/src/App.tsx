import React, { useState, useEffect } from "react";
import { initialEmployees, initialActivities, initialAlerts } from "./mockData";
import { Employee, RecentActivity, AlertCardData } from "./types";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import EmployeeListView from "./components/EmployeeListView";
import EmployeeDetailView from "./components/EmployeeDetailView";
import AddEmployeeModal from "./components/AddEmployeeModal";
import EditEmployeeModal from "./components/EditEmployeeModal";
import LoginView from "./components/LoginView";

export default function App() {
  // Session Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<{
    name: string;
    role: string;
    avatar: string;
  } | null>(null);

  // Layout navigation state
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Core business entity states (dynamic arrays synchronizing in real-time)
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [alerts, setAlerts] = useState<AlertCardData[]>([]);

  // Detailed selected employee tracking
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // Forms and Modals triggers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  // Global search input query
  const [searchQuery, setSearchQuery] = useState("");

  // Sub-status filters passed from dashboard alert widgets
  const [preselectedStatusFilter, setPreselectedStatusFilter] = useState<string | undefined>(undefined);

  // Load initial mock seeds on mount
  useEffect(() => {
    setEmployees(initialEmployees);
    setActivities(initialActivities);
    setAlerts(initialAlerts);
  }, []);

  const handleLoginSuccess = (name: string, role: string, avatar: string) => {
    setAdminUser({ name, role, avatar });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminUser(null);
    setActiveTab("dashboard");
  };

  // Create Employee
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);

    // Add activity record
    const newAct: RecentActivity = {
      id: `act-${Date.now()}`,
      title: "Karyawan Baru",
      description: `${newEmp.name} ditambahkan sebagai ${newEmp.position} di divisi ${newEmp.division}`,
      time: "Baru saja",
      type: "person_add",
      colorClass: "bg-[#0053d0]/10 border-[#0053d0]/20 text-[#0053d0]",
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Update Employee
  const handleSaveEmployee = (updatedEmp: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)));

    // Add activity record
    const newAct: RecentActivity = {
      id: `act-${Date.now()}`,
      title: "Profil Diubah",
      description: `Rincian data ${updatedEmp.name} telah berhasil diperbarui`,
      time: "Baru saja",
      type: "update",
      colorClass: "bg-slate-500/10 border-slate-500/20 text-slate-600",
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Delete Employee
  const handleDeleteEmployee = (id: string) => {
    const deletedEmp = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));

    // Update alerts count if matching
    if (deletedEmp && deletedEmp.status === "KONTRAK") {
      setAlerts((prev) =>
        prev.map((a) => (a.type === "contracts" ? { ...a, count: Math.max(0, a.count - 1) } : a))
      );
    }

    // Add activity record
    const newAct: RecentActivity = {
      id: `act-${Date.now()}`,
      title: "Data Dihapus",
      description: `Pegawai ${deletedEmp ? deletedEmp.name : "Karyawan"} berhasil dihapus dari database`,
      time: "Baru saja",
      type: "receipt_long",
      colorClass: "bg-rose-500/10 border-rose-500/20 text-rose-600",
    };
    setActivities((prev) => [newAct, ...prev]);

    if (selectedEmployeeId === id) {
      setSelectedEmployeeId(null);
      setActiveTab("karyawan");
    }
  };

  // Navigate to Employees and apply status filters (e.g. from dashboard alerts)
  const handleNavigateToEmployees = (filterStatus?: string) => {
    setPreselectedStatusFilter(filterStatus);
    setActiveTab("karyawan");
  };

  // Load older activities trail
  const handleLoadMoreActivities = () => {
    const historical: RecentActivity[] = [
      {
        id: `act-hist-1`,
        title: "Klaim Medis",
        description: "Reimbursement kesehatan Budi Handoko disetujui senilai Rp 350.000",
        time: "3 hari yang lalu",
        type: "receipt_long",
        colorClass: "bg-rose-500/10 border-rose-500/20 text-rose-600",
      },
      {
        id: `act-hist-2`,
        title: "Pembaruan Kontrak",
        description: "Evaluasi penilaian kinerja tahunan untuk amil Zakat Center",
        time: "5 hari yang lalu",
        type: "update",
        colorClass: "bg-slate-500/10 border-slate-500/20 text-slate-600",
      },
    ];
    setActivities((prev) => [...prev, ...historical]);
  };

  // Select employee to view detailed portfolio
  const handleSelectEmployee = (id: string) => {
    setSelectedEmployeeId(id);
    setActiveTab("detail");
  };

  // Resolve current active selected employee object
  const resolvedSelectedEmployee = employees.find((e) => e.id === selectedEmployeeId) || null;

  // Resolve Header title based on activeTab ID
  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard HR";
      case "karyawan":
        return "Daftar Karyawan";
      case "detail":
        return "Profil Karyawan";
      case "kehadiran":
        return "Kehadiran Pegawai";
      case "payroll":
        return "Payroll / Slip Gaji";
      case "rekrutmen":
        return "Rekrutmen Amil";
      case "pelatihan":
        return "Pelatihan & Kompetensi";
      case "pengaturan":
        return "Pengaturan Kebijakan";
      case "laporan":
        return "Laporan Analitik";
      default:
        return "Insan APU";
    }
  };

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] relative pl-[260px] pt-[80px]">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Reset status dropdown filter when clicking away
          if (tab !== "karyawan") {
            setPreselectedStatusFilter(undefined);
          }
        }}
        onLogout={handleLogout}
      />

      {/* Top Header section */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        adminName={adminUser?.name || "Admin HR"}
        adminRole={adminUser?.role || "Administrator"}
        adminAvatar={adminUser?.avatar || ""}
        activeTabTitle={getTabTitle()}
        onProfileClick={() => {
          // Select Rahmatullah Sidik as default to display profile
          const target = employees.find((e) => e.id === "EMP001") || employees[0];
          if (target) {
            handleSelectEmployee(target.id);
          }
        }}
      />

      {/* Main viewport area */}
      <main className="p-10 max-w-[1400px] mx-auto animate-fade-in">
        {activeTab === "dashboard" && (
          <DashboardView
            employees={employees}
            activities={activities}
            alerts={alerts}
            onSelectEmployee={handleSelectEmployee}
            onNavigateToEmployees={handleNavigateToEmployees}
            onAddEmployeeClick={() => setIsAddModalOpen(true)}
            onLoadMoreActivities={handleLoadMoreActivities}
          />
        )}

        {activeTab === "karyawan" && (
          <EmployeeListView
            employees={employees}
            searchQuery={searchQuery}
            onSelectEmployee={handleSelectEmployee}
            onAddEmployeeClick={() => setIsAddModalOpen(true)}
            onEditEmployeeClick={(emp) => {
              setEmployeeToEdit(emp);
              setIsEditModalOpen(true);
            }}
            onDeleteEmployee={handleDeleteEmployee}
            preselectedStatusFilter={preselectedStatusFilter}
          />
        )}

        {activeTab === "detail" && (
          <EmployeeDetailView
            employee={resolvedSelectedEmployee}
            onBackToList={() => {
              setActiveTab("karyawan");
              setSelectedEmployeeId(null);
            }}
            onEditClick={(emp) => {
              setEmployeeToEdit(emp);
              setIsEditModalOpen(true);
            }}
          />
        )}

        {/* Attendance (Kehadiran) Module Mockup */}
        {activeTab === "kehadiran" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">Modul Kehadiran</h2>
                <p className="text-xs text-[#737686] mt-0.5">Kelola log absen harian, keterlambatan, dan lembur amil</p>
              </div>
              <button
                onClick={() => alert("Mengunduh rekap kehadiran bulan ini...")}
                className="bg-white text-[#0053d0] border border-blue-100 px-5 py-2.5 rounded-full font-bold text-xs hover:bg-[#eff4ff]/60 cursor-pointer"
              >
                Unduh Rekap Bulanan
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-[20px] border border-blue-50/50 shadow-sm">
                <p className="text-[#737686] text-xs font-semibold">HADIR HARI INI</p>
                <p className="text-3xl font-black text-emerald-600 mt-2">112 <span className="text-xs font-normal text-[#737686]">(87.5%)</span></p>
              </div>
              <div className="bg-white p-5 rounded-[20px] border border-blue-50/50 shadow-sm">
                <p className="text-[#737686] text-xs font-semibold">IZIN / SAKIT</p>
                <p className="text-3xl font-black text-blue-600 mt-2">5 <span className="text-xs font-normal text-[#737686]">(3.9%)</span></p>
              </div>
              <div className="bg-white p-5 rounded-[20px] border border-blue-50/50 shadow-sm">
                <p className="text-[#737686] text-xs font-semibold">CUTI TERJADWAL</p>
                <p className="text-3xl font-black text-amber-600 mt-2">8 <span className="text-xs font-normal text-[#737686]">(6.2%)</span></p>
              </div>
              <div className="bg-white p-5 rounded-[20px] border border-blue-50/50 shadow-sm">
                <p className="text-[#737686] text-xs font-semibold">TERLAMBAT / ALPA</p>
                <p className="text-3xl font-black text-rose-600 mt-2">3 <span className="text-xs font-normal text-[#737686]">(2.4%)</span></p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-blue-50/50 p-6">
              <h3 className="font-bold text-sm text-[#0b1c30] mb-4">Log Masuk/Pulang Hari Ini</h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left divide-y divide-blue-50">
                  <thead>
                    <tr className="text-[#737686] font-bold">
                      <th className="py-3">Karyawan</th>
                      <th className="py-3">Jam Masuk</th>
                      <th className="py-3">Jam Pulang</th>
                      <th className="py-3">Metode Absen</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50/30 text-[#0b1c30]">
                    <tr>
                      <td className="py-3.5 font-semibold">Rahmatullah Sidik</td>
                      <td className="py-3.5 font-mono">07:28 WIB</td>
                      <td className="py-3.5 font-mono">17:05 WIB</td>
                      <td className="py-3.5">Mobile GPS (Al-Azhar Kantor Pusat)</td>
                      <td className="py-3.5"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold">TEPAT WAKTU</span></td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-semibold">Ahmad Faisal</td>
                      <td className="py-3.5 font-mono">08:15 WIB</td>
                      <td className="py-3.5 font-mono">-</td>
                      <td className="py-3.5">Presensi Wajah (FaceID Lobby)</td>
                      <td className="py-3.5"><span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-full font-bold">TERLAMBAT</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payroll Module Mockup */}
        {activeTab === "payroll" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">Modul Payroll</h2>
                <p className="text-xs text-[#737686] mt-0.5">Penghitungan gaji pokok, tunjangan amil, potongan BPJS, dan PPh 21</p>
              </div>
              <button
                onClick={() => alert("Menjalankan kalkulasi penggajian bulan ini...")}
                className="bg-[#0053d0] text-white px-5 py-2.5 rounded-full font-bold text-xs hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                Proses Payroll Mei 2026
              </button>
            </div>

            <div className="p-8 bg-white border border-blue-50/50 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#dae1ff]/20 rounded-bl-full pointer-events-none"></div>
              <h3 className="font-bold text-sm text-[#0b1c30] mb-6">Ringkasan Anggaran Gaji</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                <div>
                  <p className="text-[#737686] font-medium">TOTAL DISBURSEMENT BULANAN</p>
                  <p className="text-3xl font-black text-[#0053d0] mt-1">Rp 642.500.000</p>
                </div>
                <div>
                  <p className="text-[#737686] font-medium">POTONGAN PPH &amp; BPJS</p>
                  <p className="text-3xl font-black text-rose-600 mt-1">Rp 48.150.000</p>
                </div>
                <div>
                  <p className="text-[#737686] font-medium">SLIP GAJI TERBIT</p>
                  <p className="text-3xl font-black text-emerald-600 mt-1">128 Slip <span className="text-xs font-normal text-[#737686]">(100%)</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recruitment Module Mockup */}
        {activeTab === "rekrutmen" && (
          <div className="space-y-6">
            <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">Modul Rekrutmen</h2>
            <p className="text-xs text-[#737686] -mt-4">Pantau lowongan amil aktif, seleksi administratif, wawancara, dan onboarding</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-6 bg-white border border-blue-50/50 rounded-3xl">
                <h3 className="font-bold text-[#0b1c30] mb-4">Lowongan Aktif</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#f8f9ff] rounded-xl border border-blue-50">
                    <p className="font-bold text-[#0b1c30]">Staf Senior Fundraising Digital</p>
                    <p className="text-[10px] text-[#737686] mt-0.5">Divisi Fundraising • 18 Pelamar baru</p>
                  </div>
                  <div className="p-4 bg-[#f8f9ff] rounded-xl border border-blue-50">
                    <p className="font-bold text-[#0b1c30]">Relawan Program Kemanusiaan - Gaza &amp; Yaman</p>
                    <p className="text-[10px] text-[#737686] mt-0.5">Divisi Program • 42 Pelamar baru</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white border border-blue-50/50 rounded-3xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-[#0b1c30] mb-4">Statistik Rekrutmen</h3>
                  <p className="text-base font-semibold">Tahun Anggaran 2026</p>
                </div>
                <div className="space-y-2 mt-4">
                  <p className="font-bold">Total Pelamar Terdaftar: <span className="font-mono text-[#0053d0]">245</span></p>
                  <p className="font-bold">Lolos Tahap Wawancara: <span className="font-mono text-emerald-600">12</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Training (Pelatihan) Module Mockup */}
        {activeTab === "pelatihan" && (
          <div className="space-y-6">
            <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">Modul Pelatihan &amp; Amil Sertifikasi</h2>
            <p className="text-xs text-[#737686] -mt-4">Tingkatkan standar amil melalui kompetensi keagamaan, manajemen, dan pengelolaan zakat modern</p>
            <div className="p-6 bg-white border border-blue-50/50 rounded-3xl text-xs">
              <h3 className="font-bold text-[#0b1c30] mb-4">Kompetensi Zakat &amp; Wakaf Syariah</h3>
              <p className="text-[#434654] leading-relaxed">Sistem pelatihan wajib bagi amil LAZWaf Al Azhar bekerjasama dengan Majelis Ulama Indonesia (MUI) dan Badan Wakaf Indonesia (BWI).</p>
            </div>
          </div>
        )}

        {/* Settings (Pengaturan) Module Mockup */}
        {activeTab === "pengaturan" && (
          <div className="space-y-6">
            <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">Pengaturan Kebijakan HR</h2>
            <p className="text-xs text-[#737686] -mt-4">Konfigurasi cuti bersama, pengesahan lembur, hak akses administrator, dan alur persetujuan klaim</p>
            <div className="p-6 bg-white border border-blue-50/50 rounded-3xl text-xs space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-blue-50">
                <span className="font-semibold">Batas Cuti Tahunan Amil</span>
                <span className="font-mono font-bold text-[#0053d0]">12 Hari / Tahun</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-50">
                <span className="font-semibold">Batas Maksimal Klaim Rawat Jalan harian</span>
                <span className="font-mono font-bold text-[#0053d0]">Rp 2.500.000 / Tahun</span>
              </div>
            </div>
          </div>
        )}

        {/* Reports (Laporan) Module Mockup */}
        {activeTab === "laporan" && (
          <div className="space-y-6">
            <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">Laporan Analitik</h2>
            <p className="text-xs text-[#737686] -mt-4">Kompilasi demografis amil, perputaran karyawan (turnover), dan laporan audit internal</p>
            <div className="p-6 bg-white border border-blue-50/50 rounded-3xl text-xs">
              <p className="text-[#434654] font-medium mb-4">Sistem pelaporan otomatis yang divalidasi oleh dewan syariah nasional.</p>
              <button
                onClick={() => alert("Mengunduh modul audit internal tahunan...")}
                className="bg-[#0053d0] hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-full"
              >
                Unduh Buku Laporan Tahunan
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Forms Overlay Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEmployee}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEmployeeToEdit(null);
        }}
        employee={employeeToEdit}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}
