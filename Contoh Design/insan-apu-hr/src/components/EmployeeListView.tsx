import React, { useState, useMemo } from "react";
import { Employee } from "../types";

interface EmployeeListViewProps {
  employees: Employee[];
  searchQuery: string;
  onSelectEmployee: (id: string) => void;
  onAddEmployeeClick: () => void;
  onEditEmployeeClick: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  preselectedStatusFilter?: string;
}

export default function EmployeeListView({
  employees,
  searchQuery,
  onSelectEmployee,
  onAddEmployeeClick,
  onEditEmployeeClick,
  onDeleteEmployee,
  preselectedStatusFilter,
}: EmployeeListViewProps) {
  // Filters
  const [selectedDivision, setSelectedDivision] = useState("Divisi (Semua)");
  const [selectedUnit, setSelectedUnit] = useState("Unit (Semua)");
  const [selectedStatus, setSelectedStatus] = useState(preselectedStatusFilter || "Status (Semua)");
  const [selectedLevel, setSelectedLevel] = useState("Level (Semua)");
  const [quickFilter, setQuickFilter] = useState<"ALL" | "TETAP" | "KONTRAK" | "RELAWAN">("ALL");

  // Selection list
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Compute unique divisions, units, and levels for select filters
  const divisions = useMemo(() => {
    return ["Divisi (Semua)", ...Array.from(new Set(employees.map((e) => e.division)))];
  }, [employees]);

  const units = useMemo(() => {
    return ["Unit (Semua)", ...Array.from(new Set(employees.map((e) => e.unit)))];
  }, [employees]);

  const levels = useMemo(() => {
    return ["Level (Semua)", ...Array.from(new Set(employees.map((e) => e.level)))];
  }, [employees]);

  // Dynamic status counts for quick chips
  const baseTetapOffset = 83;
  const baseKontrakOffset = 28;
  const baseRelawanOffset = 7;

  const tetapCount = employees.filter((e) => e.status === "TETAP").length + baseTetapOffset - 6;
  const kontrakCount = employees.filter((e) => e.status === "KONTRAK").length + baseKontrakOffset - 3;
  const relawanCount = employees.filter((e) => e.status === "RELAWAN").length + baseRelawanOffset - 1;
  const totalCount = tetapCount + kontrakCount + relawanCount;

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Search text matches name or NIK or position
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase());

      // Dropdown division filter
      const matchesDivision =
        selectedDivision === "Divisi (Semua)" || emp.division === selectedDivision;

      // Dropdown unit filter
      const matchesUnit = selectedUnit === "Unit (Semua)" || emp.unit === selectedUnit;

      // Dropdown status filter
      const matchesStatusDropdown =
        selectedStatus === "Status (Semua)" || emp.status === selectedStatus;

      // Dropdown level filter
      const matchesLevel = selectedLevel === "Level (Semua)" || emp.level === selectedLevel;

      // Quick filter chips
      const matchesQuick =
        quickFilter === "ALL" ||
        (quickFilter === "TETAP" && emp.status === "TETAP") ||
        (quickFilter === "KONTRAK" && emp.status === "KONTRAK") ||
        (quickFilter === "RELAWAN" && emp.status === "RELAWAN");

      return (
        matchesSearch &&
        matchesDivision &&
        matchesUnit &&
        matchesStatusDropdown &&
        matchesLevel &&
        matchesQuick
      );
    });
  }, [
    employees,
    searchQuery,
    selectedDivision,
    selectedUnit,
    selectedStatus,
    selectedLevel,
    quickFilter,
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
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Profile Action Menu
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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
            onClick={() => {
              // Quick import mock data
              alert("Data karyawan berhasil di-import dari sistem eksternal.");
            }}
            className="bg-white hover:bg-[#eff4ff]/60 text-[#0053d0] border border-blue-100 px-5 py-2.5 rounded-full font-bold text-xs hover:shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">upload</span>
            Import
          </button>
          
          <button
            onClick={onAddEmployeeClick}
            className="bg-[#0053d0] hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-bold text-xs hover:shadow-md transition-all duration-200 flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Tambah Karyawan
          </button>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-100/50 overflow-hidden">
        {/* Filter bar */}
        <div className="p-6 border-b border-blue-50/50 bg-[#f8f9ff]/50">
          <div className="flex flex-col xl:flex-row xl:items-center gap-4 justify-between">
            {/* Left side: dropdown selects */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 max-w-3xl">
              {/* Division Dropdown */}
              <select
                value={selectedDivision}
                onChange={(e) => {
                  setSelectedDivision(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-2.5 pl-4 pr-8 bg-white border border-blue-100 rounded-full font-semibold text-xs text-[#0b1c30] focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] outline-none cursor-pointer"
              >
                {divisions.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>

              {/* Unit Dropdown */}
              <select
                value={selectedUnit}
                onChange={(e) => {
                  setSelectedUnit(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-2.5 pl-4 pr-8 bg-white border border-blue-100 rounded-full font-semibold text-xs text-[#0b1c30] focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] outline-none cursor-pointer"
              >
                {units.map((un) => (
                  <option key={un} value={un}>
                    {un}
                  </option>
                ))}
              </select>

              {/* Status Dropdown */}
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-2.5 pl-4 pr-8 bg-white border border-blue-100 rounded-full font-semibold text-xs text-[#0b1c30] focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] outline-none cursor-pointer"
              >
                <option value="Status (Semua)">Status (Semua)</option>
                <option value="TETAP">TETAP</option>
                <option value="KONTRAK">KONTRAK</option>
                <option value="RELAWAN">RELAWAN</option>
              </select>

              {/* Level Dropdown */}
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setCurrentPage(1);
                }}
                className="py-2.5 pl-4 pr-8 bg-white border border-blue-100 rounded-full font-semibold text-xs text-[#0b1c30] focus:border-[#0053d0] focus:ring-1 focus:ring-[#0053d0] outline-none cursor-pointer"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Right side: Quick filter chips */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setQuickFilter("ALL");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  quickFilter === "ALL"
                    ? "bg-[#0053d0] text-white shadow-sm"
                    : "bg-white border border-blue-100 text-[#0b1c30] hover:bg-blue-50"
                }`}
              >
                Semua {totalCount}
              </button>
              
              <button
                onClick={() => {
                  setQuickFilter("TETAP");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  quickFilter === "TETAP"
                    ? "bg-[#0053d0] text-white shadow-sm"
                    : "bg-white border border-blue-100 text-[#0b1c30] hover:bg-blue-50"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${quickFilter === "TETAP" ? "bg-white" : "bg-[#008733]"}`}></span>
                Tetap {tetapCount}
              </button>

              <button
                onClick={() => {
                  setQuickFilter("KONTRAK");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  quickFilter === "KONTRAK"
                    ? "bg-[#0053d0] text-white shadow-sm"
                    : "bg-white border border-blue-100 text-[#0b1c30] hover:bg-blue-50"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${quickFilter === "KONTRAK" ? "bg-white" : "bg-amber-500"}`}></span>
                Kontrak {kontrakCount}
              </button>

              <button
                onClick={() => {
                  setQuickFilter("RELAWAN");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  quickFilter === "RELAWAN"
                    ? "bg-[#0053d0] text-white shadow-sm"
                    : "bg-white border border-blue-100 text-[#0b1c30] hover:bg-blue-50"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${quickFilter === "RELAWAN" ? "bg-white" : "bg-[#585f6a]"}`}></span>
                Relawan {relawanCount}
              </button>
            </div>
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
                <th className="px-6 py-4">Divisi / Unit</th>
                <th className="px-6 py-4">Level</th>
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
                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-[#eff4ff]/20 transition-all duration-150 ${
                        isChecked ? "bg-blue-50/10" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-6 py-4.5 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(emp.id, e.target.checked)}
                          className="rounded border-blue-200 text-[#0053d0] focus:ring-[#0053d0] cursor-pointer"
                        />
                      </td>

                      {/* Karyawan (Profile details) */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-4">
                          {/* Image profile */}
                          <div
                            onClick={() => onSelectEmployee(emp.id)}
                            className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-blue-100 bg-blue-50 shadow-sm cursor-pointer"
                          >
                            {emp.avatarUrl ? (
                              <img
                                src={emp.avatarUrl}
                                alt={emp.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-[#0053d0]">
                                {getInitials(emp.name)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p
                              onClick={() => onSelectEmployee(emp.id)}
                              className="font-bold text-sm text-[#0b1c30] hover:text-[#0053d0] transition-colors cursor-pointer"
                            >
                              {emp.name}
                            </p>
                            <p className="font-mono text-[10px] text-[#737686] mt-0.5">
                              NIK: {emp.id.replace("IA-", "").replace("EMP-", "")}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Divisi / Unit */}
                      <td className="px-6 py-4.5">
                        <p className="font-bold text-[#0b1c30]">{emp.division}</p>
                        <p className="text-[#737686] text-[10px] mt-0.5">{emp.unit}</p>
                      </td>

                      {/* Level */}
                      <td className="px-6 py-4.5">
                        <span className="font-semibold text-[#434654]">{emp.level}</span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[10px] border ${
                            emp.status === "TETAP"
                              ? "bg-emerald-50 text-[#006b27] border-emerald-100"
                              : emp.status === "KONTRAK"
                              ? "bg-rose-50 text-rose-700 border-rose-100"
                              : "bg-slate-50 text-[#585f6a] border-slate-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              emp.status === "TETAP"
                                ? "bg-[#008733]"
                                : emp.status === "KONTRAK"
                                ? "bg-rose-600"
                                : "bg-[#585f6a]"
                            }`}
                          ></span>
                          {emp.status}
                          {emp.statusDetail && (
                            <span className="text-[9px] font-normal text-rose-500/90 ml-0.5">
                              ({emp.statusDetail})
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Masa Kerja */}
                      <td className="px-6 py-4.5 font-sans font-medium text-[#737686]">
                        {emp.tenure}
                      </td>

                      {/* Aksi */}
                      <td className="px-6 py-4.5 text-right relative">
                        <div className="flex justify-end items-center gap-1.5">
                          {/* Direct quick action buttons */}
                          <button
                            onClick={() => onSelectEmployee(emp.id)}
                            className="p-1.5 hover:bg-blue-50 text-[#0053d0] rounded-lg transition-colors cursor-pointer"
                            title="Detail Profil"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>
                          
                          <button
                            onClick={() => onEditEmployeeClick(emp)}
                            className="p-1.5 hover:bg-blue-50 text-amber-600 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus data karyawan ${emp.name}?`)) {
                                onDeleteEmployee(emp.id);
                              }
                            }}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
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
}
