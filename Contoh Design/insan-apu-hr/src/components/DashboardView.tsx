import React, { useState } from "react";
import { Employee, RecentActivity, StatCardData, AlertCardData } from "../types";

interface DashboardViewProps {
  employees: Employee[];
  activities: RecentActivity[];
  alerts: AlertCardData[];
  onSelectEmployee: (id: string) => void;
  onNavigateToEmployees: (filterStatus?: string) => void;
  onAddEmployeeClick: () => void;
  onLoadMoreActivities: () => void;
}

export default function DashboardView({
  employees,
  activities,
  alerts,
  onSelectEmployee,
  onNavigateToEmployees,
  onAddEmployeeClick,
  onLoadMoreActivities,
}: DashboardViewProps) {
  // We calculate dynamic statistics based on the base initial counts + new ones in state
  const baseTetapOffset = 83; // 83 base + 6 in default state = 89
  const baseKontrakOffset = 28; // 28 base + 3 in default state = 31
  const baseRelawanOffset = 7; // 7 base + 1 in default state = 8

  const tetapCount = employees.filter((e) => e.status === "TETAP").length + baseTetapOffset - 6;
  const kontrakCount = employees.filter((e) => e.status === "KONTRAK").length + baseKontrakOffset - 3;
  const relawanCount = employees.filter((e) => e.status === "RELAWAN").length + baseRelawanOffset - 1;
  const totalCount = tetapCount + kontrakCount + relawanCount;

  // Gender statistics
  const maleBaseOffset = 70; // Offset to match 55%
  const femaleBaseOffset = 58; // Offset to match 45%
  const maleCount = employees.filter((e) => e.gender === "Laki-laki").length + maleBaseOffset - 4;
  const femaleCount = employees.filter((e) => e.gender === "Perempuan").length + femaleBaseOffset - 2;
  const malePercentage = Math.round((maleCount / totalCount) * 100) || 55;
  const femalePercentage = 100 - malePercentage;

  // Divisions mapping (calculated dynamically from offsets and employees)
  const baseDivisions = {
    Program: 39,
    Fundraising: 33,
    Operasional: 26,
    Keuangan: 13,
    HRD: 7,
  };

  const getDivisionCount = (div: keyof typeof baseDivisions) => {
    const stateCount = employees.filter((e) => e.division === div).length;
    // initial employees counts for div: Program: 3, Fundraising: 2, Operasional: 2, Keuangan: 1, HRD: 2
    let initialCountInState = 0;
    if (div === "Program") initialCountInState = 3;
    else if (div === "Fundraising") initialCountInState = 2;
    else if (div === "Operasional") initialCountInState = 2;
    else if (div === "Keuangan") initialCountInState = 1;
    else if (div === "HRD") initialCountInState = 2;

    return baseDivisions[div] + (stateCount - initialCountInState);
  };

  const programCount = getDivisionCount("Program");
  const fundraisingCount = getDivisionCount("Fundraising");
  const operasionalCount = getDivisionCount("Operasional");
  const keuanganCount = getDivisionCount("Keuangan");
  const hrdCount = getDivisionCount("HRD");

  // Division max for progress scaling
  const maxDivCount = Math.max(programCount, fundraisingCount, operasionalCount, keuanganCount, hrdCount);

  // Line Chart monthly data (interactive tooltips)
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const chartData = [
    { month: "Agu", value: 4, heightPct: 30 },
    { month: "Sep", value: 7, heightPct: 50 },
    { month: "Okt", value: 5, heightPct: 40 },
    { month: "Nov", value: 12, heightPct: 80 },
    { month: "Des", value: 9, heightPct: 60 },
    { month: "Jan", value: 10, heightPct: 70 },
  ];

  // Map icons to labels
  const getIcon = (iconName: string) => {
    return <span className="material-symbols-outlined text-2xl">{iconName}</span>;
  };

  // Profile picture fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-10">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-3xl font-extrabold text-[#0b1c30] tracking-tight">
            Dashboard
          </h2>
          <p className="font-sans text-sm text-[#434654] mt-1">
            Ringkasan data kepegawaian Insan APU LAZWaf Al Azhar.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => {
              // Trigger CSV download
              const headers = "ID,Name,Email,Division,Position,Status,Level,Tenure\n";
              const rows = employees
                .map((e) => `"${e.id}","${e.name}","${e.email}","${e.division}","${e.position}","${e.status}","${e.level}","${e.tenure}"`)
                .join("\n");
              const blob = new Blob([headers + rows], { type: "text/csv" });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.setAttribute("href", url);
              a.setAttribute("download", `Laporan_Karyawan_InsanAPU_${new Date().toISOString().split('T')[0]}.csv`);
              a.click();
            }}
            className="bg-white hover:bg-blue-50/50 border border-blue-100 text-[#434654] font-semibold text-xs px-5 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Unduh Laporan
          </button>
          
          <button
            onClick={onAddEmployeeClick}
            className="bg-[#0053d0] hover:bg-blue-700 text-white font-semibold text-xs px-5 py-3 rounded-full shadow-md shadow-blue-500/15 hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Tambah Karyawan
          </button>
        </div>
      </div>

      {/* Row 1: Stat Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1: Total Aktif */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm shadow-blue-500/5 hover:shadow-md border border-blue-50/40 transition-all duration-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-[#0053d0]">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
            <span className="bg-emerald-500/10 text-emerald-600 font-bold text-[10px] tracking-wide px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +12%
            </span>
          </div>
          <div className="mt-5">
            <h3 className="font-sans text-xs font-semibold text-[#434654] uppercase tracking-wider">
              Total Aktif
            </h3>
            <p className="font-sans text-4xl font-extrabold text-[#0b1c30] mt-1">
              {totalCount}
            </p>
          </div>
        </div>

        {/* Stat 2: Karyawan Tetap */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm shadow-blue-500/5 hover:shadow-md border border-blue-50/40 transition-all duration-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-[#585f6a]/10 flex items-center justify-center text-[#585f6a]">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="font-sans text-xs font-semibold text-[#434654] uppercase tracking-wider">
              Karyawan Tetap
            </h3>
            <p className="font-sans text-4xl font-extrabold text-[#0b1c30] mt-1">
              {tetapCount}
            </p>
          </div>
        </div>

        {/* Stat 3: Karyawan Kontrak */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm shadow-blue-500/5 hover:shadow-md border border-blue-50/40 transition-all duration-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-blue-400/10 flex items-center justify-center text-blue-500">
              <span className="material-symbols-outlined text-2xl">assignment_ind</span>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="font-sans text-xs font-semibold text-[#434654] uppercase tracking-wider">
              Karyawan Kontrak
            </h3>
            <p className="font-sans text-4xl font-extrabold text-[#0b1c30] mt-1">
              {kontrakCount}
            </p>
          </div>
        </div>

        {/* Stat 4: Relawan */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm shadow-blue-500/5 hover:shadow-md border border-blue-50/40 transition-all duration-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
            </div>
          </div>
          <div className="mt-5">
            <h3 className="font-sans text-xs font-semibold text-[#434654] uppercase tracking-wider">
              Relawan
            </h3>
            <p className="font-sans text-4xl font-extrabold text-[#0b1c30] mt-1">
              {relawanCount}
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Alert Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-[20px] p-5 border border-blue-50/50 shadow-sm shadow-blue-500/5 hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  alert.type === "contracts"
                    ? "bg-rose-50 text-rose-600"
                    : alert.type === "birthdays"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {alert.icon}
                </span>
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold text-[#0b1c30] tracking-tight">
                  {alert.title}{" "}
                  <span className="text-[#434654] font-normal text-[11px] ml-1">
                    {alert.subtitle}
                  </span>
                </h4>
                <p
                  className={`font-sans text-2xl font-black mt-0.5 ${
                    alert.type === "contracts"
                      ? "text-rose-600"
                      : alert.type === "birthdays"
                      ? "text-emerald-600"
                      : "text-slate-700"
                  }`}
                >
                  {alert.count}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onNavigateToEmployees(alert.type === "contracts" ? "KONTRAK" : undefined)}
              className="text-[#0053d0] font-bold text-xs hover:underline cursor-pointer focus:outline-none"
            >
              {alert.actionText}
            </button>
          </div>
        ))}
      </div>

      {/* Row 3: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart Component (Tren Karyawan Baru) */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-500/5 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-sans text-base font-bold text-[#0b1c30]">
                Tren Karyawan Baru (6 bln)
              </h3>
              <p className="text-[11px] text-[#737686] mt-0.5">Analisis pendaftaran karyawan baru</p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f8f9ff] px-3 py-1.5 rounded-full text-xs text-[#737686] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#0053d0]"></span>
              Jumlah Pegawai
            </div>
          </div>

          {/* Interactive Responsive SVG Graph */}
          <div className="flex-1 relative min-h-[220px] w-full flex flex-col justify-end">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-blue-50/50 w-full"></div>
              <div className="border-b border-blue-50/50 w-full"></div>
              <div className="border-b border-blue-50/50 w-full"></div>
              <div className="border-b border-blue-50/50 w-full"></div>
              <div className="border-b border-blue-100/40 w-full"></div>
            </div>

            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[#737686] font-mono text-[10px] w-5 pointer-events-none z-10">
              <span>15</span>
              <span>10</span>
              <span>5</span>
              <span>0</span>
            </div>

            {/* SVG Plot Overlay */}
            <div className="flex-1 ml-6 relative h-full">
              {/* Tooltip Overlay */}
              {hoveredPoint !== null && (
                <div
                  className="absolute bg-[#0b1c30] text-white px-2 py-1.5 rounded-lg text-[11px] shadow-lg z-20 pointer-events-none"
                  style={{
                    left: `${(hoveredPoint / (chartData.length - 1)) * 90 + 3}%`,
                    top: `${80 - chartData[hoveredPoint].heightPct}%`,
                    transform: "translate(-50%, -120%)",
                  }}
                >
                  <p className="font-bold">{chartData[hoveredPoint].value} Karyawan</p>
                  <p className="text-[9px] text-blue-200">{chartData[hoveredPoint].month} 2026</p>
                </div>
              )}

              {/* Vector Lines */}
              <svg className="absolute inset-0 w-full h-[90%] overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0053d0" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area path */}
                <path
                  d="M 10 150 Q 30 110 50 110 T 90 120 T 130 50 T 170 90 T 210 70 L 210 180 L 10 180 Z"
                  className="w-full h-full"
                  fill="url(#chart-grad)"
                  style={{ transform: "scale(1.5, 0.7)", transformOrigin: "0 50px" }}
                />
                {/* Curve path */}
                <path
                  d="M 10 150 Q 30 110 50 110 T 90 120 T 130 50 T 170 90 T 210 70"
                  fill="none"
                  stroke="#0053d0"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  style={{ transform: "scale(1.5, 0.7)", transformOrigin: "0 50px" }}
                />
              </svg>

              {/* Plot interactive nodes */}
              <div className="absolute inset-x-0 bottom-0 top-0 flex justify-between px-3 z-10">
                {chartData.map((d, index) => (
                  <div
                    key={d.month}
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="flex flex-col items-center justify-end h-full relative cursor-pointer group"
                    style={{ width: `${100 / chartData.length}%` }}
                  >
                    {/* Anchor Node */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-md absolute transition-all duration-300 ${
                        hoveredPoint === index || index === chartData.length - 1
                          ? "bg-[#0053d0] scale-125"
                          : "bg-blue-300 group-hover:bg-[#0053d0]"
                      }`}
                      style={{ bottom: `${d.heightPct * 0.9}%`, transform: "translateY(50%)" }}
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between pl-8 pr-2 mt-2 border-t border-blue-50/55 pt-2">
              {chartData.map((d, index) => (
                <span
                  key={d.month}
                  className={`font-sans text-[10px] font-bold ${
                    index === chartData.length - 1 ? "text-[#0053d0]" : "text-[#737686]"
                  }`}
                >
                  {d.month}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Gender Donut Chart Component */}
        <div className="bg-white rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-500/5 p-6 flex flex-col justify-between items-center relative">
          <h3 className="font-sans text-base font-bold text-[#0b1c30] self-start w-full">
            Rasio Gender
          </h3>
          <p className="text-[11px] text-[#737686] self-start -mt-0.5">Komposisi gender SDM</p>

          {/* SVG Donut */}
          <div className="relative w-44 h-44 my-5 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#585f6a"
                strokeWidth="11"
                className="opacity-15"
              />
              {/* Male segment: 55% -> strokeDasharray="55 45" */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#0053d0"
                strokeWidth="11"
                strokeDasharray={`${malePercentage} ${100 - malePercentage}`}
                strokeLinecap="round"
              />
              {/* Female segment: 45% */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#585f6a"
                strokeWidth="10"
                strokeDasharray={`${femalePercentage} ${100 - femalePercentage}`}
                strokeDashoffset={`-${malePercentage}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-6 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
              <span className="font-sans text-3xl font-black text-[#0b1c30]">
                {totalCount}
              </span>
              <span className="font-sans text-[10px] text-[#737686] font-bold uppercase tracking-wider">
                Total
              </span>
            </div>
          </div>

          {/* Legend Table */}
          <div className="w-full flex justify-center gap-6 mt-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0053d0]"></div>
              <div>
                <p className="font-sans text-[11px] text-[#737686] font-semibold leading-none">
                  Laki-laki
                </p>
                <p className="font-sans text-sm font-extrabold text-[#0b1c30] mt-1">
                  {malePercentage}%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#585f6a]"></div>
              <div>
                <p className="font-sans text-[11px] text-[#737686] font-semibold leading-none">
                  Perempuan
                </p>
                <p className="font-sans text-sm font-extrabold text-[#0b1c30] mt-1">
                  {femalePercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Distribution Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizontal Bar Chart: Divisi */}
        <div className="bg-white rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-500/5 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-sans text-base font-bold text-[#0b1c30]">
                Karyawan per Divisi
              </h3>
              <p className="text-[11px] text-[#737686] mt-0.5">Pembagian staf di setiap divisi utama</p>
            </div>
            <button
              onClick={() => onNavigateToEmployees()}
              className="font-sans text-xs font-bold text-[#0053d0] hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {/* Division 1: Program */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#434654]">Program</span>
                <span className="font-mono font-bold text-[#0b1c30]">{programCount}</span>
              </div>
              <div className="w-full h-2.5 bg-[#f8f9ff] rounded-full overflow-hidden border border-blue-50/50">
                <div
                  className="h-full bg-[#0053d0] rounded-full transition-all duration-500"
                  style={{ width: `${(programCount / maxDivCount) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Division 2: Fundraising */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#434654]">Fundraising</span>
                <span className="font-mono font-bold text-[#0b1c30]">{fundraisingCount}</span>
              </div>
              <div className="w-full h-2.5 bg-[#f8f9ff] rounded-full overflow-hidden border border-blue-50/50">
                <div
                  className="h-full bg-[#585f6a] rounded-full transition-all duration-500"
                  style={{ width: `${(fundraisingCount / maxDivCount) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Division 3: Operasional */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#434654]">Operasional</span>
                <span className="font-mono font-bold text-[#0b1c30]">{operasionalCount}</span>
              </div>
              <div className="w-full h-2.5 bg-[#f8f9ff] rounded-full overflow-hidden border border-blue-50/50">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${(operasionalCount / maxDivCount) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Division 4: Keuangan */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#434654]">Keuangan</span>
                <span className="font-mono font-bold text-[#0b1c30]">{keuanganCount}</span>
              </div>
              <div className="w-full h-2.5 bg-[#f8f9ff] rounded-full overflow-hidden border border-blue-50/50">
                <div
                  className="h-full bg-[#326deb] rounded-full transition-all duration-500"
                  style={{ width: `${(keuanganCount / maxDivCount) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Division 5: HRD */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-[#434654]">HRD</span>
                <span className="font-mono font-bold text-[#0b1c30]">{hrdCount}</span>
              </div>
              <div className="w-full h-2.5 bg-[#f8f9ff] rounded-full overflow-hidden border border-blue-50/50">
                <div
                  className="h-full bg-[#737686] rounded-full transition-all duration-500"
                  style={{ width: `${(hrdCount / maxDivCount) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Level Jabatan distribution */}
        <div className="bg-white rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-500/5 p-6 flex flex-col">
          <div>
            <h3 className="font-sans text-base font-bold text-[#0b1c30]">
              Distribusi Level Jabatan
            </h3>
            <p className="text-[11px] text-[#737686] mt-0.5">Analisis berjenjang pangkat kepangkatan</p>
          </div>
          
          <div className="overflow-x-auto mt-4 flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-blue-50 pb-2">
                  <th className="py-2.5 font-bold text-[#737686] uppercase tracking-wider">
                    Level Jabatan
                  </th>
                  <th className="py-2.5 font-bold text-[#737686] uppercase tracking-wider text-right">
                    Jumlah
                  </th>
                  <th className="py-2.5 font-bold text-[#737686] uppercase tracking-wider text-right">
                    Persentase (%)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50/30 text-[#0b1c30]">
                <tr className="hover:bg-blue-50/15 transition-colors">
                  <td className="py-3 font-semibold">Direksi</td>
                  <td className="py-3 text-right font-mono font-bold text-sm">3</td>
                  <td className="py-3 text-right text-[#434654]">2.3%</td>
                </tr>
                <tr className="hover:bg-blue-50/15 transition-colors">
                  <td className="py-3 font-semibold">Manajer</td>
                  <td className="py-3 text-right font-mono font-bold text-sm">12</td>
                  <td className="py-3 text-right text-[#434654]">9.3%</td>
                </tr>
                <tr className="hover:bg-blue-50/15 transition-colors">
                  <td className="py-3 font-semibold">Supervisor</td>
                  <td className="py-3 text-right font-mono font-bold text-sm">25</td>
                  <td className="py-3 text-right text-[#434654]">19.5%</td>
                </tr>
                <tr className="hover:bg-blue-50/15 transition-colors">
                  <td className="py-3 font-semibold">Staf</td>
                  <td className="py-3 text-right font-mono font-bold text-sm">80</td>
                  <td className="py-3 text-right text-[#434654]">62.5%</td>
                </tr>
                <tr className="hover:bg-blue-50/15 transition-colors">
                  <td className="py-3 font-semibold">Magang/Relawan</td>
                  <td className="py-3 text-right font-mono font-bold text-sm">8</td>
                  <td className="py-3 text-right text-[#434654]">6.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 5: Karyawan Terbaru & Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Karyawan Terbaru Masuk Table */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-500/5 p-0 overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-blue-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-sans text-base font-bold text-[#0b1c30]">
                Karyawan Terbaru Masuk
              </h3>
              <p className="text-[11px] text-[#737686] mt-0.5">Penambahan anggota tim terakhir</p>
            </div>
            
            <button
              onClick={() => onNavigateToEmployees()}
              className="flex items-center gap-1 text-[#0053d0] font-bold text-xs hover:underline cursor-pointer"
            >
              Semua Data{" "}
              <span className="material-symbols-outlined text-sm leading-none">arrow_forward</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#f8f9ff]/80 text-[#737686]">
                  <th className="py-3 px-6 font-bold uppercase tracking-wider">Profil</th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider">Divisi/Posisi</th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider">Tanggal Masuk</th>
                  <th className="py-3 px-6 font-bold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50/30">
                {employees.slice(0, 5).map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => onSelectEmployee(emp.id)}
                    className="hover:bg-[#eff4ff]/30 transition-colors cursor-pointer group"
                  >
                    {/* Profil cell */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {emp.avatarUrl ? (
                          <img
                            src={emp.avatarUrl}
                            alt={emp.name}
                            className="w-9 h-9 rounded-full object-cover border border-blue-100"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-50 text-[#0053d0] border border-blue-100 flex items-center justify-center font-bold text-xs">
                            {getInitials(emp.name)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-[#0b1c30] group-hover:text-[#0053d0] transition-colors">
                            {emp.name}
                          </p>
                          <p className="font-mono text-[10px] text-[#737686]">ID: {emp.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Divisi/Posisi */}
                    <td className="py-4 px-6">
                      <p className="font-semibold text-[#0b1c30]">{emp.division}</p>
                      <p className="text-[#737686] text-[10px]">{emp.position}</p>
                    </td>

                    {/* Tanggal Masuk */}
                    <td className="py-4 px-6 font-mono text-[#434654]">{emp.joinedDate}</td>

                    {/* Status badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          emp.status === "TETAP"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : emp.status === "KONTRAK"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-slate-50 text-slate-700 border-slate-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            emp.status === "TETAP"
                              ? "bg-emerald-600"
                              : emp.status === "KONTRAK"
                              ? "bg-amber-600"
                              : "bg-slate-600"
                          }`}
                        ></span>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-[24px] border border-blue-50/50 shadow-sm shadow-blue-500/5 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-sans text-base font-bold text-[#0b1c30]">
                Aktivitas Terkini
              </h3>
              <p className="text-[11px] text-[#737686] mt-0.5">Riwayat tindakan kepegawaian terbaru</p>
            </div>
            <button className="text-[#737686] hover:text-[#0b1c30] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-xl">filter_list</span>
            </button>
          </div>

          {/* Activity items with timeline lines */}
          <div className="relative pl-6 space-y-6 flex-1">
            {/* Vertical connector line */}
            <div className="absolute left-3.5 top-2 bottom-6 w-0.5 bg-blue-50/60 pointer-events-none"></div>

            {activities.map((act) => (
              <div key={act.id} className="relative flex gap-4 items-start text-xs">
                {/* Icon Circle */}
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 absolute -left-6 bg-white z-10 ${
                    act.type === "check_circle"
                      ? "border-emerald-100 text-emerald-600 shadow-sm shadow-emerald-500/5"
                      : act.type === "person_add"
                      ? "border-blue-100 text-[#0053d0] shadow-sm shadow-blue-500/5"
                      : act.type === "update"
                      ? "border-slate-100 text-slate-600 shadow-sm shadow-slate-500/5"
                      : act.type === "receipt_long"
                      ? "border-rose-100 text-rose-600 shadow-sm shadow-rose-500/5"
                      : "border-indigo-100 text-indigo-600 shadow-sm shadow-indigo-500/5"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {act.type}
                  </span>
                </div>

                <div className="pl-4">
                  <p className="font-sans text-[#0b1c30] leading-relaxed">
                    <span className="font-bold">{act.title}:</span> {act.description}
                  </p>
                  <p className="font-sans text-[10px] text-[#737686] mt-1 font-medium">{act.time}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onLoadMoreActivities}
            className="mt-6 w-full py-2.5 font-semibold text-[#0053d0] hover:bg-[#eff4ff] rounded-xl transition-colors border border-transparent hover:border-blue-100/50 text-xs cursor-pointer focus:outline-none"
          >
            Muat Lebih Banyak
          </button>
        </div>
      </div>
    </div>
  );
}
