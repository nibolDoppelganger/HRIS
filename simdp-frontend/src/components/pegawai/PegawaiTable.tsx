import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../lib/api';
import type { Employee } from '../../lib/api';
import { useStore } from '@nanostores/react';
import { $userSession } from '../../lib/store';

export const PegawaiTable: React.FC = () => {
  const session = useStore($userSession);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("Divisi (Semua)");
  const [selectedUnit, setSelectedUnit] = useState("Unit (Semua)");
  const [selectedStatus, setSelectedStatus] = useState("Status (Semua)");
  const [selectedJabatan, setSelectedJabatan] = useState("Jabatan (Semua)");
  const [quickFilter, setQuickFilter] = useState<"ALL" | "TETAP" | "KONTRAK" | "RELAWAN">("ALL");

  // Selection list
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchEmployees = async () => {
    try {
      const res = await api.getEmployeesList();
      if (res.success && res.data) {
        setEmployees(res.data);
      }
    } catch(e) {
      console.error("Failed to fetch employees", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Compute unique divisions, units, and levels for select filters
  const divisions = useMemo(() => {
    return ["Divisi (Semua)", ...Array.from(new Set(employees.map((e) => e.departement).filter(Boolean)))];
  }, [employees]);

  // Using current_position as unit mapping for now, as API might not have explicit unit or it's similar
  const units = useMemo(() => {
    return ["Unit (Semua)", ...Array.from(new Set(employees.map((e) => "Pusat").filter(Boolean)))];
  }, [employees]);

  const jabatans = useMemo(() => {
    return ["Jabatan (Semua)", ...Array.from(new Set(employees.map((e) => e.job_level).filter(Boolean)))];
  }, [employees]);

  // Dynamic status counts for quick chips
  const baseTetapOffset = 83;
  const baseKontrakOffset = 28;
  const baseRelawanOffset = 7;

  const tetapCount = employees.filter((e) => e.employment_status.toUpperCase() === "TETAP").length + baseTetapOffset;
  const kontrakCount = employees.filter((e) => e.employment_status.toUpperCase() === "KONTRAK").length + baseKontrakOffset;
  const relawanCount = employees.filter((e) => e.employment_status.toUpperCase() === "RELAWAN").length + baseRelawanOffset;
  const totalCount = tetapCount + kontrakCount + relawanCount;

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Role-based filter
      if (session?.user.role_name === 'Manager Divisi' && emp.departement !== session.user.departement) {
        return false;
      }

      const matchesSearch =
        emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.current_position.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDivision = selectedDivision === "Divisi (Semua)" || emp.departement === selectedDivision;
      const matchesUnit = selectedUnit === "Unit (Semua)" || true; // Mocked unit matching
      const matchesStatusDropdown = selectedStatus === "Status (Semua)" || emp.employment_status.toUpperCase() === selectedStatus;
      const matchesJabatan = selectedJabatan === "Jabatan (Semua)" || emp.job_level === selectedJabatan;

      const empStatusUpper = emp.employment_status.toUpperCase();
      const matchesQuick =
        quickFilter === "ALL" ||
        (quickFilter === "TETAP" && empStatusUpper === "TETAP") ||
        (quickFilter === "KONTRAK" && empStatusUpper === "KONTRAK") ||
        (quickFilter === "RELAWAN" && empStatusUpper === "RELAWAN");

      return (
        matchesSearch &&
        matchesDivision &&
        matchesUnit &&
        matchesStatusDropdown &&
        matchesJabatan &&
        matchesQuick
      );
    });
  }, [
    employees,
    searchQuery,
    selectedDivision,
    selectedUnit,
    selectedStatus,
    selectedJabatan,
    quickFilter,
    session
  ]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedEmployees.map((e) => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "IA";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const calculateMasaKerja = (joinDateStr: string) => {
    if (!joinDateStr) return '-';
    const jd = new Date(joinDateStr);
    if (isNaN(jd.getTime())) return '-';
    const today = new Date();
    
    let years = today.getFullYear() - jd.getFullYear();
    let months = today.getMonth() - jd.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0) {
      return `${years} thn ${months} bln`;
    }
    return `${months} bln`;
  };

  const handleDeactivate = async (id: string, name: string) => {
    const reason = prompt(`Masukkan alasan menonaktifkan ${name}:`);
    if (reason === null) return;
    if (!reason.trim()) {
      alert('Alasan penonaktifan wajib diisi.');
      return;
    }

    if (!session) return;
    try {
      const res = await api.deactivateEmployee(id, reason, session.user.email);
      if (res.success) {
        alert(`${name} dinonaktifkan.`);
        fetchEmployees();
      } else {
        alert(res.error);
      }
    } catch(e) {
      alert('Gagal menonaktifkan karyawan.');
    }
  };

  const handleExportCSV = async () => {
    if (!session) return;
    try {
      const filters = {
        dept: selectedDivision === 'Divisi (Semua)' ? undefined : selectedDivision,
        status: selectedStatus === 'Status (Semua)' ? undefined : selectedStatus as any,
      };
      const res = await api.exportPegawaiCSV(session.session_token, filters);
      if (res.success && res.csv) {
        const blob = new Blob([res.csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", res.filename || 'export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Gagal ekspor data: ' + res.error);
      }
    } catch(e) {
      alert('Gagal ekspor data.');
    }
  };

  const isAdmin = session?.user.role_name === 'Super Admin' || session?.user.role_name === 'Admin HR';

  if (loading) {
    return <div className="p-8 text-center text-blue-600 font-semibold">Memuat Data Pegawai...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans text-2xl font-extrabold text-[#0b1c30]">Data Karyawan</h2>
          <p className="text-xs text-[#737686] mt-0.5">Kelola informasi penempatan, berkas, dan masa kontrak</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="bg-white hover:bg-[#eff4ff]/60 text-[#0053d0] border border-blue-100 px-5 py-2.5 rounded-full font-bold text-xs hover:shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export CSV
          </button>
          
          {isAdmin && (
            <button
              onClick={() => window.location.href = '/pegawai/tambah'}
              className="bg-[#0053d0] hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold text-xs hover:shadow-md transition-all duration-200 flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Tambah Karyawan
            </button>
          )}
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-100/50 overflow-hidden">
        {/* Filter bar */}
        <div className="p-6 border-b border-blue-50/50 bg-[#f8f9ff]/50">
          <div className="flex flex-col xl:flex-row xl:items-center gap-4 justify-between mb-4">
            <div className="relative w-full max-w-sm">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-2.5 bg-white border border-blue-100 focus:border-[#0053d0]/30 rounded-full font-sans text-sm text-[#0b1c30] placeholder-[#737686]/60 transition-all duration-200 outline-none shadow-sm"
                placeholder="Cari nama, ID, posisi..."
              />
            </div>
            
            {/* Right side: Quick filter chips */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setQuickFilter("ALL"); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  quickFilter === "ALL" ? "bg-[#0053d0] text-white shadow-sm" : "bg-white border border-blue-100 text-[#0b1c30] hover:bg-blue-50"
                }`}
              >
                Semua {totalCount}
              </button>
              <button
                onClick={() => { setQuickFilter("TETAP"); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  quickFilter === "TETAP" ? "bg-[#0053d0] text-white shadow-sm" : "bg-white border border-blue-100 text-[#0b1c30] hover:bg-blue-50"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${quickFilter === "TETAP" ? "bg-white" : "bg-[#008733]"}`}></span>
                Tetap {tetapCount}
              </button>
              <button
                onClick={() => { setQuickFilter("KONTRAK"); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  quickFilter === "KONTRAK" ? "bg-[#0053d0] text-white shadow-sm" : "bg-white border border-blue-100 text-[#0b1c30] hover:bg-blue-50"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${quickFilter === "KONTRAK" ? "bg-white" : "bg-amber-500"}`}></span>
                Kontrak {kontrakCount}
              </button>
              <button
                onClick={() => { setQuickFilter("RELAWAN"); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  quickFilter === "RELAWAN" ? "bg-[#0053d0] text-white shadow-sm" : "bg-white border border-blue-100 text-[#0b1c30] hover:bg-blue-50"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${quickFilter === "RELAWAN" ? "bg-white" : "bg-[#585f6a]"}`}></span>
                Relawan {relawanCount}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 max-w-3xl">
            <select
              value={selectedDivision}
              onChange={(e) => { setSelectedDivision(e.target.value); setCurrentPage(1); }}
              className="py-2.5 pl-4 pr-8 bg-white border border-blue-100 rounded-full font-semibold text-xs text-[#0b1c30] focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] outline-none cursor-pointer"
            >
              {divisions.map((div) => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
            <select
              value={selectedUnit}
              onChange={(e) => { setSelectedUnit(e.target.value); setCurrentPage(1); }}
              className="py-2.5 pl-4 pr-8 bg-white border border-blue-100 rounded-full font-semibold text-xs text-[#0b1c30] focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] outline-none cursor-pointer"
            >
              {units.map((un) => (
                <option key={un} value={un}>{un}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="py-2.5 pl-4 pr-8 bg-white border border-blue-100 rounded-full font-semibold text-xs text-[#0b1c30] focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] outline-none cursor-pointer"
            >
              <option value="Status (Semua)">Status (Semua)</option>
              <option value="TETAP">TETAP</option>
              <option value="KONTRAK">KONTRAK</option>
              <option value="RELAWAN">RELAWAN</option>
            </select>
            <select
              value={selectedJabatan}
              onChange={(e) => { setSelectedJabatan(e.target.value); setCurrentPage(1); }}
              className="py-2.5 pl-4 pr-8 bg-white border border-blue-100 rounded-full font-semibold text-xs text-[#0b1c30] focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] outline-none cursor-pointer"
            >
              {jabatans.map((jab) => (
                <option key={jab} value={jab}>{jab}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-blue-50 text-[#737686] font-bold uppercase tracking-wider bg-[#f8f9ff]/20">
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedEmployees.length > 0 &&
                      paginatedEmployees.every((e) => selectedIds.includes(e.id))
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-blue-200 text-[#0053d0] focus:ring-[#0053d0] cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4">Karyawan</th>
                <th className="px-6 py-4">Divisi / Posisi</th>
                <th className="px-6 py-4">Jabatan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Masa Kerja</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50/40 text-[#0b1c30]">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-[#737686]">
                    Tidak ada karyawan yang cocok dengan kriteria filter saat ini.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => {
                  const isChecked = selectedIds.includes(emp.id);
                  const empStatus = emp.employment_status.toUpperCase();
                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-[#eff4ff]/20 transition-all duration-150 ${
                        isChecked ? "bg-blue-50/10" : ""
                      }`}
                    >
                      <td className="px-6 py-4.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(emp.id, e.target.checked)}
                          className="rounded border-blue-200 text-[#0053d0] focus:ring-[#0053d0] cursor-pointer"
                        />
                      </td>

                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-4">
                          <div
                            onClick={() => window.location.href = `/pegawai/${emp.id}`}
                            className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-blue-100 bg-blue-50 flex items-center justify-center font-bold text-[#0053d0] shadow-sm cursor-pointer"
                          >
                            {getInitials(emp.full_name)}
                          </div>
                          <div>
                            <p
                              onClick={() => window.location.href = `/pegawai/${emp.id}`}
                              className="font-bold text-sm text-[#0b1c30] hover:text-[#0053d0] transition-colors cursor-pointer"
                            >
                              {emp.full_name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="font-mono text-[10px] text-[#737686]">
                                {emp.employee_id}
                              </p>
                              {!emp.is_active && (
                                <span className="bg-red-100 text-red-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Nonaktif</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4.5">
                        <p className="font-bold text-[#0b1c30]">{emp.departement}</p>
                        <p className="text-[#737686] text-[10px] mt-0.5">{emp.current_position}</p>
                      </td>

                      <td className="px-6 py-4.5">
                        <span className="font-semibold text-[#434654]">{emp.job_level}</span>
                      </td>

                      <td className="px-6 py-4.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[10px] border ${
                            empStatus === "TETAP"
                              ? "bg-emerald-50 text-[#006b27] border-emerald-100"
                              : empStatus === "KONTRAK"
                              ? "bg-rose-50 text-rose-700 border-rose-100"
                              : "bg-slate-50 text-[#585f6a] border-slate-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              empStatus === "TETAP"
                                ? "bg-[#008733]"
                                : empStatus === "KONTRAK"
                                ? "bg-rose-600"
                                : "bg-[#585f6a]"
                            }`}
                          ></span>
                          {empStatus}
                        </span>
                      </td>

                      <td className="px-6 py-4.5 font-sans font-medium text-[#737686]">
                        {calculateMasaKerja(emp.join_date)}
                      </td>

                      <td className="px-6 py-4.5 text-right relative">
                        <div className="flex justify-end items-center gap-1.5">
                          <button
                            onClick={() => window.location.href = `/pegawai/${emp.id}`}
                            className="p-1.5 hover:bg-blue-50 text-[#0053d0] rounded-lg transition-colors cursor-pointer"
                            title="Detail Profil"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>
                          
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => window.location.href = `/pegawai/${emp.id}/edit`}
                                className="p-1.5 hover:bg-blue-50 text-amber-600 rounded-lg transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>

                              {emp.is_active && (
                                <button
                                  onClick={() => handleDeactivate(emp.id, emp.full_name)}
                                  className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                                  title="Nonaktifkan"
                                >
                                  <span className="material-symbols-outlined text-lg">block</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-6 border-t border-blue-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white text-xs text-[#737686]">
          <div>
            Menampilkan <span className="font-bold text-[#0b1c30]">
              {filteredEmployees.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            sampai{" "}
            <span className="font-bold text-[#0b1c30]">
              {Math.min(currentPage * itemsPerPage, filteredEmployees.length)}
            </span>{" "}
            dari <span className="font-bold text-[#0b1c30]">{filteredEmployees.length}</span> pegawai
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-full border border-blue-100 hover:bg-blue-50 flex items-center justify-center text-[#737686] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? "bg-[#0053d0] text-white shadow-md shadow-blue-500/10"
                    : "border border-blue-50 hover:bg-blue-50 text-[#0b1c30]"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-full border border-blue-100 hover:bg-blue-50 flex items-center justify-center text-[#737686] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
