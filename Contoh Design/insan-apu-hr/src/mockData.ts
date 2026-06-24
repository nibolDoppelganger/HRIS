import { Employee, RecentActivity, StatCardData, AlertCardData } from "./types";

export const initialEmployees: Employee[] = [
  {
    id: "EMP-2015-0042",
    name: "Rahmatullah Sidik",
    email: "rahmatullah.s@alazhar.org",
    phone: "+62 812-3456-7890",
    division: "Program",
    position: "Kepala Divisi Sekretariat",
    unit: "Divisi Sekretariat Utama",
    joinedDate: "15 Jan 2015",
    status: "TETAP",
    level: "Manajer",
    levelGrade: "Level 5",
    tenure: "11 Thn, 5 Bln",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDNJprdu6mwnFRiStfPISZcOSDgOcORv17x8RTHsO_WqYOsC1FEtnt0PUvEPCssa7ZXMf9tlskypPOCnXxdLfv3CC1-ZT8PHau0axxDCIstwygUlkaCQMYMibq0xDk19h3yo6gEBVV7BVFuMSuTFN9j0SsA4PiUeqqjDBpoG4YiKgwLx3rRQGb2APXLnDTp9iGCfh33W8bje4zlDWCrLJUaE8i4bQgoZpt-i0W7CZ3ePHH4p23TGBJN7p6LhBZClHKbmRKdDe-bm8",
    birthPlace: "Jakarta",
    birthDate: "12 Agustus 1980",
    gender: "Laki-laki",
    maritalStatus: "Menikah",
    identityNumber: "3174091208800001",
    education: "S2 Manajemen, Universitas Indonesia",
    supervisorName: "Ahmad Faisal",
    directReportsCount: 12,
    careerHistory: [
      { period: "Mar 2021 - Sekarang", title: "Kepala Divisi Sekretariat", department: "Divisi Sekretariat Utama" },
      { period: "Jan 2018 - Feb 2021", title: "Wakil Kepala Divisi", department: "Divisi Sekretariat Utama" },
      { period: "Jan 2015 - Des 2017", title: "Staff Senior HR", department: "Departemen SDM" }
    ]
  },
  {
    id: "IA-2024-001",
    name: "Ahmad Faisal",
    email: "ahmad.faisal@alazhar.org",
    phone: "+62 813-9876-5432",
    division: "Fundraising",
    position: "Staf Digital",
    unit: "Zakat Center",
    joinedDate: "12 Jan 2024",
    status: "TETAP",
    level: "Staf",
    levelGrade: "Level 2",
    tenure: "2 Thn, 4 Bln",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfGTSXzauYEvQjUqLULobKyXGNTE_nUpZLhhwCwn6ZxuTnwQ45cK5lk9_Y4fpZ7x_dhpdLykrGqc94wi7SMCkTBaR8DJ6Fwb73od2o3e1kBW--bTOtbNmQv9xm6pNc4u94c1CVeYVUEun7H5sYWZF8Is138o4ZoTCCHnActubiYc4ISUrtufIVpxiURz_Fjl00jRcuDYFIV-zcv2mIm6_lZrKckK9VGsZohx9yQpRHpJziL_bMh4TbCcmGB7CXRoax_La5nDIpxJM",
    birthPlace: "Jakarta",
    birthDate: "12 Jan 1994",
    gender: "Laki-laki",
    maritalStatus: "Menikah",
    identityNumber: "3174091212940001",
    education: "S1 Teknik Informatika, BINUS",
    supervisorName: "Budi Santoso",
    directReportsCount: 0,
    careerHistory: [
      { period: "Jan 2024 - Sekarang", title: "Staf Digital Fundraising", department: "Divisi Pengumpulan" }
    ]
  },
  {
    id: "IA-2024-002",
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@alazhar.org",
    phone: "+62 857-1122-3344",
    division: "Program",
    position: "Koordinator Lapangan",
    unit: "Program Pendidikan",
    joinedDate: "05 Jan 2024",
    status: "KONTRAK",
    statusDetail: "Exp 14 Hari",
    level: "Supervisor",
    levelGrade: "Level 3",
    tenure: "11 Bln",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFqoIEamuM6eyfhyZRtSR1Rripx1askSecQrjAp4tNq3JM8sQUZ81Y-uAvPrPLDeXbbqQIJtPANcMNCJm_o391CLhUAb_M2dEvI6N0OfoUpGEAT_GiNkTmx_tVIKoq5yUt1JaM_GlcWqAys774f9lAXjsfW92G4MX-HtpnyGO9MzvK2E4493NRjR9z49klt9CWAcuPUsGL2SnwZx9Mp4qzUArZAyK7nSs1sX24X9FyaDsRFW9DYau1DKY0OhAKwlBJBm2WcII3zAo",
    birthPlace: "Bandung",
    birthDate: "05 Sep 1998",
    gender: "Perempuan",
    maritalStatus: "Belum Menikah",
    identityNumber: "3273090509980002",
    education: "S1 Hubungan Internasional, UNPAD",
    supervisorName: "Rahmatullah Sidik",
    directReportsCount: 4,
    careerHistory: [
      { period: "Jan 2024 - Sekarang", title: "Koordinator Lapangan", department: "Divisi Program" }
    ]
  },
  {
    id: "IA-2023-128",
    name: "Budi Santoso",
    email: "budi.santoso@alazhar.org",
    phone: "+62 821-4455-6677",
    division: "Keuangan",
    position: "Staf Akuntansi",
    unit: "Akuntansi",
    joinedDate: "20 Des 2023",
    status: "TETAP",
    level: "Manajer",
    levelGrade: "Level 4",
    tenure: "5 Thn, 1 Bln",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCderBNhNIYsJtqHchDpHg2SUh-F9SoX4E2J-wDDFmKheNq3PgTjizVgGVy-nPCxPc-U3jWplSkCw0Pyg6krg3bhmRr191Py6U1A8D8MsXKw_oWvXy9uWk0BWnDyquJn6m4QHvS5LCJK0-TwZblOfmQyO9b3wuw41W3xz_J1LeM8XV0wXr00yV0BWPAgn4oKpXBHQXQftHa2qJXnSatb9hqdTCcndrwsyegDNr2qprFY-nDBxyE7vDC-Xistw0_ynqIEBh0UL3GtjI",
    birthPlace: "Surabaya",
    birthDate: "18 Mei 1985",
    gender: "Laki-laki",
    maritalStatus: "Menikah",
    identityNumber: "3578091805850003",
    education: "S1 Akuntansi, Universitas Airlangga",
    supervisorName: "Direktur Keuangan",
    directReportsCount: 6,
    careerHistory: [
      { period: "Des 2023 - Sekarang", title: "Staf Akuntansi Senior", department: "Divisi Keuangan" },
      { period: "Mei 2019 - Nov 2023", title: "Staf Pembukuan", department: "Divisi Keuangan" }
    ]
  },
  {
    id: "IA-2023-127",
    name: "Dian Wulandari",
    email: "dian.wulandari@alazhar.org",
    phone: "+62 819-2233-4455",
    division: "HRD",
    position: "Staf Rekrutmen",
    unit: "Staf Rekrutmen",
    joinedDate: "15 Des 2023",
    status: "KONTRAK",
    level: "Staf",
    levelGrade: "Level 2",
    tenure: "1 Thn, 2 Bln",
    avatarUrl: "", // Initials will be used
    birthPlace: "Yogyakarta",
    birthDate: "24 April 1991",
    gender: "Perempuan",
    maritalStatus: "Menikah",
    identityNumber: "3471092404910004",
    education: "S1 Psikologi, Universitas Gadjah Mada",
    supervisorName: "Kepala HRD",
    directReportsCount: 0,
    careerHistory: [
      { period: "Des 2023 - Sekarang", title: "Staf Rekrutmen", department: "Divisi SDM" }
    ]
  },
  {
    id: "IA-2023-126",
    name: "Reza Rahadian",
    email: "reza.rahadian@alazhar.org",
    phone: "+62 811-5566-7788",
    division: "Operasional",
    position: "Driver",
    unit: "Operasional",
    joinedDate: "10 Des 2023",
    status: "RELAWAN",
    level: "Magang/Relawan",
    levelGrade: "Level 1",
    tenure: "6 Bln",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyloFoVxcf-z9WiwjcqJBsHEc4kLGNyhlrL01S4RU9b5HuzWYUp8ZfD_5agKXTOqdnmP15XkbUeQBJrve6nUfmWRL-G89FVsZ-MxLuUXxGqFuchtSKpNWdgZp9xyDyPxuwf28njGyvd0Siz7aZbBI_qbpN9WkZO1GoNQ893FLNaL9nHizn0S-1HEA6EUkSFJAHkfq4hzZwwYZh1oNe8nY6OlxpC-6XY-xaAWS3j_K7A0kNxQauwr4sRnAWblKbgupcyQHbAXZlpAw",
    birthPlace: "Bogor",
    birthDate: "01 Maret 1995",
    gender: "Laki-laki",
    maritalStatus: "Belum Menikah",
    identityNumber: "3201090103950005",
    education: "SMA Negeri 1 Bogor",
    supervisorName: "Koordinator Operasional",
    directReportsCount: 0,
    careerHistory: [
      { period: "Des 2023 - Sekarang", title: "Driver Logistik", department: "Divisi Operasional" }
    ]
  },
  {
    id: "IA-2024-003",
    name: "Hani Syarifah",
    email: "hani.syarifah@alazhar.org",
    phone: "+62 813-4455-8899",
    division: "Fundraising",
    position: "Staf Partnership",
    unit: "Zakat Center",
    joinedDate: "14 Feb 2024",
    status: "TETAP",
    level: "Staf",
    levelGrade: "Level 2",
    tenure: "1 Thn, 4 Bln",
    birthPlace: "Malang",
    birthDate: "15 Juli 1996",
    gender: "Perempuan",
    maritalStatus: "Menikah",
    identityNumber: "3507091507960003",
    education: "S1 Hubungan Masyarakat, Universitas Brawijaya",
    supervisorName: "Budi Santoso",
    directReportsCount: 0,
    careerHistory: [
      { period: "Feb 2024 - Sekarang", title: "Staf Partnership", department: "Divisi Pengumpulan" }
    ]
  },
  {
    id: "IA-2024-004",
    name: "Yusuf Mansur",
    email: "yusuf.mansur@alazhar.org",
    phone: "+62 812-7788-9900",
    division: "Program",
    position: "Konselor Sosial",
    unit: "Layanan Ummat",
    joinedDate: "01 Mar 2024",
    status: "KONTRAK",
    level: "Staf",
    levelGrade: "Level 2",
    tenure: "1 Thn",
    birthPlace: "Tangerang",
    birthDate: "22 Des 1992",
    gender: "Laki-laki",
    maritalStatus: "Menikah",
    identityNumber: "3603092212920002",
    education: "S1 Bimbingan Konseling, UIN Jakarta",
    supervisorName: "Rahmatullah Sidik",
    directReportsCount: 0,
    careerHistory: [
      { period: "Mar 2024 - Sekarang", title: "Konselor Sosial", department: "Divisi Program" }
    ]
  },
  {
    id: "IA-2024-005",
    name: "Aisyah Azzahra",
    email: "aisyah.azzahra@alazhar.org",
    phone: "+62 852-3344-5566",
    division: "HRD",
    position: "Staf Training",
    unit: "Staf HRD",
    joinedDate: "20 Mar 2024",
    status: "TETAP",
    level: "Staf",
    levelGrade: "Level 2",
    tenure: "2 Thn",
    birthPlace: "Solo",
    birthDate: "10 April 1995",
    gender: "Perempuan",
    maritalStatus: "Belum Menikah",
    identityNumber: "3311091004950001",
    education: "S1 Manajemen SDM, UNS Solo",
    supervisorName: "Kepala HRD",
    directReportsCount: 0,
    careerHistory: [
      { period: "Mar 2024 - Sekarang", title: "Staf Training & Development", department: "Divisi SDM" }
    ]
  },
  {
    id: "IA-2024-006",
    name: "Fauzi Rahman",
    email: "fauzi.rahman@alazhar.org",
    phone: "+62 813-8899-0011",
    division: "Operasional",
    position: "IT Support",
    unit: "Operasional",
    joinedDate: "01 Apr 2024",
    status: "TETAP",
    level: "Staf",
    levelGrade: "Level 2",
    tenure: "1 Thn, 2 Bln",
    birthPlace: "Depok",
    birthDate: "14 Feb 1997",
    gender: "Laki-laki",
    maritalStatus: "Belum Menikah",
    identityNumber: "3276091402970002",
    education: "S1 Sistem Informasi, Universitas Gunadarma",
    supervisorName: "Koordinator Operasional",
    directReportsCount: 0,
    careerHistory: [
      { period: "Apr 2024 - Sekarang", title: "IT Support Specialist", department: "Divisi Operasional" }
    ]
  }
];

export const initialActivities: RecentActivity[] = [
  {
    id: "act-1",
    type: "check_circle",
    title: "Cuti Disetujui",
    description: "Ahmad Faisal (Fundraising)",
    time: "2 jam yang lalu",
    colorClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
  },
  {
    id: "act-2",
    type: "person_add",
    title: "Data Baru",
    description: "Profil Siti Nurhaliza ditambahkan ke sistem.",
    time: "4 jam yang lalu",
    colorClass: "bg-[#0053d0]/10 border-[#0053d0]/20 text-[#0053d0]"
  },
  {
    id: "act-3",
    type: "update",
    title: "Pembaruan Kontrak",
    description: "Masa kontrak Budi Santoso akan habis 30 hari lagi.",
    time: "Kemarin, 14:30",
    colorClass: "bg-slate-500/10 border-slate-500/20 text-slate-600"
  },
  {
    id: "act-4",
    type: "receipt_long",
    title: "Klaim Medis",
    description: "Dian Wulandari mengajukan klaim rawat jalan.",
    time: "Kemarin, 09:15",
    colorClass: "bg-rose-500/10 border-rose-500/20 text-rose-600"
  },
  {
    id: "act-5",
    type: "cake",
    title: "Ulang Tahun",
    description: "Notifikasi otomatis dikirim ke Reza Rahadian.",
    time: "2 hari yang lalu",
    colorClass: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600"
  }
];

export const initialAlerts: AlertCardData[] = [
  {
    id: "alert-1",
    title: "Kontrak Habis",
    subtitle: "< 30 hari",
    count: 3,
    icon: "timer",
    colorClass: "border-rose-100 shadow-rose-500/5 text-rose-600 bg-rose-50/10",
    actionText: "Tinjau",
    type: "contracts"
  },
  {
    id: "alert-2",
    title: "Ulang Tahun",
    subtitle: "Minggu Ini",
    count: 2,
    icon: "cake",
    colorClass: "border-emerald-100 shadow-emerald-500/5 text-emerald-600 bg-emerald-50/10",
    actionText: "Lihat",
    type: "birthdays"
  },
  {
    id: "alert-3",
    title: "Klaim Pending",
    subtitle: "Menunggu Approval",
    count: 5,
    icon: "pending_actions",
    colorClass: "border-slate-100 shadow-slate-500/5 text-slate-600 bg-slate-50/10",
    actionText: "Proses",
    type: "claims"
  }
];
