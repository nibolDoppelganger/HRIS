// Client-side Mock API Client simulating GAS (Google Apps Script) endpoints
// Uses localStorage to persist database state across page reloads.

export interface CareerEntry {
  id: string;
  employee_id: string;
  urutan: number;
  jabatan: string;
  departement: string;
  unit: string;
  mulai: string;
  selesai: string | null;
  is_current: boolean;
  keterangan?: string;
}

export interface ChildEntry {
  nama: string;
  dob: string;
  urutan: number;
}

export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  current_position: string;
  departement: string;
  unit: string;
  employment_status: 'Tetap' | 'Kontrak' | 'Relawan';
  level: string;
  job_level: string;
  join_date: string;
  contract_end_date: string;
  email_kantor: string;
  email_pribadi: string;
  mobile_phone: string;
  place_of_birth: string;
  date_of_birth: string;
  gender: 'L' | 'P';
  marital_status: 'Menikah' | 'Single' | 'Janda' | 'Duda';
  nik: string;
  nik_address: string;
  residential_address: string;
  education_level: string;
  institution_name: string;
  institution_place: string;
  graduation_date: string;
  is_active: boolean;
  inactive_date: string;
  inactive_reason: string;
  spouse_name: string;
  spouse_dob: string;
  children: ChildEntry[];
  career_history: CareerEntry[];
  rekrutmen_id?: string;
}

export interface Volunteer {
  id: string;
  nomor_pendaftaran: string;
  nama_lengkap: string;
  email: string;
  no_hp: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  gender: 'L' | 'P';
  alamat: string;
  pendidikan_terakhir: string;
  institusi: string;
  jurusan: string;
  keahlian: string;
  motivasi: string;
  divisi_diminati: string;
  pengalaman_relawan?: string;
  tersedia_mulai: string;
  durasi_kesediaan: string;
  cv_drive_url: string;
  status: 'baru' | 'direview' | 'diterima' | 'ditolak';
  catatan_admin?: string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  converted_to_employee_id?: string | null;
  created_at: string;
}

export interface AuditLog {
  timestamp: string;
  user_email: string;
  aksi: string;
  modul: string;
  ref_id?: string;
  detail: string;
}

export interface UserAccount {
  id: string;
  email: string;
  nama: string;
  role_id: string;
  role_name: string;
  departement: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  avatar_color: string;
}

// Initial Seed Data
const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'emp_1',
    employee_id: '20100308013',
    full_name: 'Rahmatullah Sidik',
    current_position: 'Kepala Divisi Sekretariat',
    departement: 'Sekretariat',
    unit: 'Direksi',
    employment_status: 'Tetap',
    level: '5A',
    job_level: 'Kepala Divisi',
    join_date: '2010-03-08',
    contract_end_date: '',
    email_kantor: 'rahmat.sidik@alazhar.or.id',
    email_pribadi: 'rahmat.sidik@gmail.com',
    mobile_phone: '081280571098',
    place_of_birth: 'Bekasi',
    date_of_birth: '1977-08-21',
    gender: 'L',
    marital_status: 'Menikah',
    nik: '3674052108770003',
    nik_address: 'Jl. Melati Raya No. 45, Bekasi Timur',
    residential_address: 'Jl. Melati Raya No. 45, Bekasi Timur',
    education_level: 'S1',
    institution_name: 'Universitas Islam Indonesia',
    institution_place: 'Yogyakarta',
    graduation_date: '1999-10-12',
    is_active: true,
    inactive_date: '',
    inactive_reason: '',
    spouse_name: 'Siti Aminah',
    spouse_dob: '1981-05-14',
    children: [
      { nama: 'Ahmad Rafli Sidik', dob: '2008-11-20', urutan: 1 },
      { nama: 'Nadia Aulia Sidik', dob: '2012-07-05', urutan: 2 }
    ],
    career_history: [
      { id: 'c_1', employee_id: '20100308013', urutan: 1, jabatan: 'Staf Program Charity', departement: 'Program', unit: 'Program', mulai: '2010-03-08', selesai: '2012-01-01', is_current: false },
      { id: 'c_2', employee_id: '20100308013', urutan: 2, jabatan: 'Manager Program', departement: 'Program', unit: 'Program', mulai: '2012-01-01', selesai: '2018-06-01', is_current: false },
      { id: 'c_3', employee_id: '20100308013', urutan: 3, jabatan: 'Kepala Divisi Sekretariat', departement: 'Sekretariat', unit: 'Direksi', mulai: '2018-06-01', selesai: null, is_current: true }
    ]
  },
  {
    id: 'emp_2',
    employee_id: '20200801045',
    full_name: 'Annisa Fitriani',
    current_position: 'Manager Akuntansi',
    departement: 'Keuangan',
    unit: 'Anggaran & Akuntansi',
    employment_status: 'Tetap',
    level: '4B',
    job_level: 'Manager',
    join_date: '2020-08-01',
    contract_end_date: '',
    email_kantor: 'annisa.fitri@alazhar.or.id',
    email_pribadi: 'annisa.fitri@yahoo.com',
    mobile_phone: '085698765432',
    place_of_birth: 'Jakarta',
    date_of_birth: '1992-04-12',
    gender: 'P',
    marital_status: 'Single',
    nik: '3174091204920005',
    nik_address: 'Jl. Kramat Raya No. 12, Senen, Jakarta Pusat',
    residential_address: 'Kuningan Residence Apt. 4B, Jakarta Selatan',
    education_level: 'S1',
    institution_name: 'Universitas Indonesia',
    institution_place: 'Depok',
    graduation_date: '2014-08-25',
    is_active: true,
    inactive_date: '',
    inactive_reason: '',
    spouse_name: '',
    spouse_dob: '',
    children: [],
    career_history: [
      { id: 'c_4', employee_id: '20200801045', urutan: 1, jabatan: 'Staf Keuangan', departement: 'Keuangan', unit: 'Anggaran & Akuntansi', mulai: '2020-08-01', selesai: '2022-10-01', is_current: false },
      { id: 'c_5', employee_id: '20200801045', urutan: 2, jabatan: 'Manager Akuntansi', departement: 'Keuangan', unit: 'Anggaran & Akuntansi', mulai: '2022-10-01', selesai: null, is_current: true }
    ]
  },
  {
    id: 'emp_3',
    employee_id: '20250601009',
    full_name: 'Farhan Maulana',
    current_position: 'Koordinator Eksternal Fundraising',
    departement: 'Fundraising & Partnership',
    unit: 'Eksternal Fundraising',
    employment_status: 'Kontrak',
    level: '3B',
    job_level: 'Koordinator',
    join_date: '2025-06-01',
    contract_end_date: '2026-07-01', // Expiring soon! (Within ~30 days relative to June 2026)
    email_kantor: 'farhan.m@alazhar.or.id',
    email_pribadi: 'farhan.maulana@gmail.com',
    mobile_phone: '081312345678',
    place_of_birth: 'Bandung',
    date_of_birth: '1996-12-05',
    gender: 'L',
    marital_status: 'Menikah',
    nik: '3273050512960002',
    nik_address: 'Jl. Dago No. 100, Bandung',
    residential_address: 'Kos Pondok Indah, Jakarta Selatan',
    education_level: 'S1',
    institution_name: 'Universitas Padjadjaran',
    institution_place: 'Jatinangor',
    graduation_date: '2019-02-15',
    is_active: true,
    inactive_date: '',
    inactive_reason: '',
    spouse_name: 'Dewi Sartika',
    spouse_dob: '1997-03-20',
    children: [],
    career_history: [
      { id: 'c_6', employee_id: '20250601009', urutan: 1, jabatan: 'Koordinator Eksternal Fundraising', departement: 'Fundraising & Partnership', unit: 'Eksternal Fundraising', mulai: '2025-06-01', selesai: null, is_current: true }
    ]
  },
  {
    id: 'emp_4',
    employee_id: '20260115002',
    full_name: 'Siti Rahmawati',
    current_position: 'Relawan Humas & Media',
    departement: 'Sekretariat',
    unit: 'Humas, GA, dan IT',
    employment_status: 'Relawan',
    level: '1',
    job_level: 'Non Staf',
    join_date: '2026-01-15',
    contract_end_date: '2026-07-15', // Expiring soon!
    email_kantor: 'siti.rahma@alazhar.or.id',
    email_pribadi: 'siti.rahma@gmail.com',
    mobile_phone: '087755556666',
    place_of_birth: 'Surabaya',
    date_of_birth: '2001-09-18',
    gender: 'P',
    marital_status: 'Single',
    nik: '3578011809010004',
    nik_address: 'Jl. Manyar No. 2, Surabaya',
    residential_address: 'Kost Kemang, Jakarta Selatan',
    education_level: 'S1',
    institution_name: 'Universitas Airlangga',
    institution_place: 'Surabaya',
    graduation_date: '2023-08-30',
    is_active: true,
    inactive_date: '',
    inactive_reason: '',
    spouse_name: '',
    spouse_dob: '',
    children: [],
    career_history: [
      { id: 'c_7', employee_id: '20260115002', urutan: 1, jabatan: 'Relawan Humas & Media', departement: 'Sekretariat', unit: 'Humas, GA, dan IT', mulai: '2026-01-15', selesai: null, is_current: true }
    ]
  }
];

const DEFAULT_VOLUNTEERS: Volunteer[] = [
  {
    id: 'vol_1',
    nomor_pendaftaran: 'REK-2026-0001',
    nama_lengkap: 'Siti Rahayu',
    email: 'siti.rahayu@gmail.com',
    no_hp: '081234567890',
    tempat_lahir: 'Bandung',
    tanggal_lahir: '2000-05-15',
    gender: 'P',
    alamat: 'Jl. Merdeka No. 10, Jakarta Pusat',
    pendidikan_terakhir: 'S1',
    institusi: 'Universitas Indonesia',
    jurusan: 'Komunikasi',
    keahlian: 'Desain grafis, copywriting, media sosial, Adobe Illustrator',
    motivasi: 'Ingin memberikan kontribusi nyata dalam pemberdayaan sosial masyarakat melalui keahlian komunikasi publik saya di LAZWaf Al Azhar.',
    divisi_diminati: 'Fundraising & Partnership',
    pengalaman_relawan: 'Pernah menjadi relawan media di PKPU selama 6 bulan pada tahun 2023.',
    tersedia_mulai: '2026-08-01',
    durasi_kesediaan: '6 bulan',
    cv_drive_url: 'https://drive.google.com/file/d/mock_cv_1/view',
    status: 'baru',
    created_at: '2026-06-15T10:30:00Z'
  },
  {
    id: 'vol_2',
    nomor_pendaftaran: 'REK-2026-0002',
    nama_lengkap: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@gmail.com',
    no_hp: '089876543210',
    tempat_lahir: 'Bogor',
    tanggal_lahir: '1998-11-22',
    gender: 'L',
    alamat: 'Jl. Padjadjaran No. 54, Bogor Utara',
    pendidikan_terakhir: 'S1',
    institusi: 'Institut Pertanian Bogor',
    jurusan: 'Agribisnis',
    keahlian: 'Project management, fasilitator lapangan, Microsoft Excel',
    motivasi: 'Membantu menyukseskan program-program pemberdayaan zakat dan wakaf produktif di sektor pertanian masyarakat binaan LAZWaf.',
    divisi_diminati: 'Program',
    pengalaman_relawan: 'Ketua Divisi Pengabdian Masyarakat BEM IPB 2020.',
    tersedia_mulai: '2026-07-01',
    durasi_kesediaan: '12 bulan',
    cv_drive_url: 'https://drive.google.com/file/d/mock_cv_2/view',
    status: 'direview',
    created_at: '2026-06-14T09:15:00Z'
  }
];

const DEFAULT_SETTINGS = {
  landing_tagline: 'Membangun Kemandirian Umat Melalui Zakat & Wakaf Produktif',
  landing_deskripsi: 'LAZWaf Al Azhar berkomitmen untuk mengelola dana Ziswaf secara profesional, amanah, dan transparan guna mewujudkan keadilan sosial bagi seluruh masyarakat.',
  landing_show_stats: 'true',
  rekrutmen_is_open: 'true',
  rekrutmen_info: 'Pendaftaran Relawan Batch 2 dibuka s/d 31 Juli 2026',
  rekrutmen_divisi: 'Program,Fundraising & Partnership,Sekretariat',
  rekrutmen_email_notif: 'hrd@alazhar.or.id',
  app_name: 'SIMDP LAZWaf Al Azhar'
};

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'usr_1',
    email: 'admin@alazhar.or.id',
    nama: 'Roni Hermawan',
    role_id: 'super_admin',
    role_name: 'Super Admin',
    departement: 'Direksi',
    is_active: true,
    created_at: '2024-01-15T08:00:00Z',
    last_login: '2026-06-18T07:30:00Z',
    avatar_color: '#1e3a7a'
  },
  {
    id: 'usr_2',
    email: 'hr@alazhar.or.id',
    nama: 'Siti Aminah',
    role_id: 'admin_hr',
    role_name: 'Admin HR',
    departement: 'HRD',
    is_active: true,
    created_at: '2024-03-10T09:00:00Z',
    last_login: '2026-06-17T14:20:00Z',
    avatar_color: '#059669'
  },
  {
    id: 'usr_3',
    email: 'manager@alazhar.or.id',
    nama: 'Budi Santoso',
    role_id: 'manager_divisi',
    role_name: 'Manager Divisi',
    departement: 'Sekretariat',
    is_active: true,
    created_at: '2024-06-01T10:00:00Z',
    last_login: '2026-06-15T09:45:00Z',
    avatar_color: '#d97706'
  },
  {
    id: 'usr_4',
    email: 'keuangan@alazhar.or.id',
    nama: 'Annisa Fitriani',
    role_id: 'admin_hr',
    role_name: 'Admin HR',
    departement: 'Keuangan',
    is_active: true,
    created_at: '2025-01-20T08:30:00Z',
    last_login: '2026-06-16T11:10:00Z',
    avatar_color: '#7c3aed'
  },
  {
    id: 'usr_5',
    email: 'viewer@alazhar.or.id',
    nama: 'Dedi Kurniawan',
    role_id: 'staf_viewer',
    role_name: 'Staf Viewer',
    departement: 'Program',
    is_active: false,
    created_at: '2025-04-05T13:00:00Z',
    last_login: '2026-05-20T16:00:00Z',
    avatar_color: '#dc2626'
  }
];

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    timestamp: '2026-06-17T09:45:22Z',
    user_email: 'admin.hr@alazhar.or.id',
    aksi: 'LOGIN_GOOGLE',
    modul: 'Auth',
    detail: 'Login via Google OAuth berhasil.'
  }
];

// Helper to initialize and retrieve database
class MockDB {
  private get(key: string, defaultValue: any): any {
    if (typeof window === 'undefined') return defaultValue;
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data);
  }

  private set(key: string, value: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  getEmployees(): Employee[] {
    return this.get('db_employees', DEFAULT_EMPLOYEES);
  }

  saveEmployees(emps: Employee[]): void {
    this.set('db_employees', emps);
  }

  getVolunteers(): Volunteer[] {
    return this.get('db_volunteers', DEFAULT_VOLUNTEERS);
  }

  saveVolunteers(vols: Volunteer[]): void {
    this.set('db_volunteers', vols);
  }

  getSettings(): typeof DEFAULT_SETTINGS {
    return this.get('db_settings', DEFAULT_SETTINGS);
  }

  saveSettings(settings: typeof DEFAULT_SETTINGS): void {
    this.set('db_settings', settings);
  }

  getAuditLogs(): AuditLog[] {
    return this.get('db_audit_logs', DEFAULT_AUDIT_LOGS);
  }

  saveAuditLogs(logs: AuditLog[]): void {
    this.set('db_audit_logs', logs);
  }

  getUsers(): UserAccount[] {
    return this.get('db_users', DEFAULT_USERS);
  }

  saveUsers(users: UserAccount[]): void {
    this.set('db_users', users);
  }
}

export const mockDB = new MockDB();

// ============================================================
// GAS API BRIDGE + CLIENT-SIDE CACHE
// ============================================================
const GAS_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GAS_API_URL) || '';
const CACHE_PREFIX = 'simdp_cache_';
const CACHE_TTL = {
  users: 3 * 60 * 1000,       // 3 minutes
  dashboard: 2 * 60 * 1000,   // 2 minutes
  pegawai: 3 * 60 * 1000,     // 3 minutes
  audit: 60 * 1000,           // 1 minute
  settings: 5 * 60 * 1000,    // 5 minutes
};

// Client-side cache with TTL
const clientCache = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return null;
      const { data, expiresAt } = JSON.parse(raw);
      if (Date.now() > expiresAt) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
      return data as T;
    } catch { return null; }
  },
  set(key: string, data: any, ttlMs: number): void {
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
        data,
        expiresAt: Date.now() + ttlMs,
      }));
    } catch { /* quota exceeded */ }
  },
  invalidate(key: string): void {
    try { localStorage.removeItem(CACHE_PREFIX + key); } catch {}
  },
  invalidateAll(): void {
    try {
      Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX)).forEach(k => localStorage.removeItem(k));
    } catch {}
  }
};

// GAS API client - returns null if GAS_URL not set (triggers mock fallback)
const gasClient = {
  isAvailable: () => !!GAS_URL,

  async get(action: string, params?: Record<string, string>): Promise<any | null> {
    if (!GAS_URL) return null;
    try {
      const url = new URL(GAS_URL);
      url.searchParams.set('action', action);
      if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
      const res = await fetch(url.toString());
      if (!res.ok) return null;
      return await res.json();
    } catch { return null; }
  },

  async post(action: string, body: Record<string, any>): Promise<any | null> {
    if (!GAS_URL) return null;
    try {
      const sessionRaw = localStorage.getItem('simdp_session');
      const token = sessionRaw ? (JSON.parse(sessionRaw).session_token || '') : '';
      const res = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({ action, token, ...body }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch { return null; }
  }
};

// Mock API Client mimicking fetch wrapper
export const api = {
  // Public
  getLandingStats: async () => {
    // Simulate CacheService & delay
    await new Promise((r) => setTimeout(r, 200));
    const emps = mockDB.getEmployees().filter(e => e.is_active);
    const divisions = new Set(emps.map(e => e.departement));
    const units = new Set(emps.map(e => e.unit));
    const males = emps.filter(e => e.gender === 'L').length;
    const females = emps.filter(e => e.gender === 'P').length;

    return {
      success: true,
      data: {
        total_karyawan: emps.length,
        total_divisi: divisions.size,
        total_unit: units.size,
        jumlah_pria: males,
        jumlah_wanita: females,
        updated_at: new Date().toISOString()
      }
    };
  },

  getRecruitmentStatus: async () => {
    await new Promise((r) => setTimeout(r, 100));
    const settings = mockDB.getSettings();
    return {
      success: true,
      data: {
        is_open: settings.rekrutmen_is_open === 'true',
        info: settings.rekrutmen_info,
        divisi_tersedia: settings.rekrutmen_divisi.split(',')
      }
    };
  },

  submitVolunteerApplication: async (payload: Omit<Volunteer, 'id' | 'nomor_pendaftaran' | 'status' | 'created_at' | 'cv_drive_url'>) => {
    await new Promise((r) => setTimeout(r, 400));
    const settings = mockDB.getSettings();
    if (settings.rekrutmen_is_open !== 'true') {
      return { success: false, error: 'Pendaftaran relawan sedang ditutup.' };
    }

    const vols = mockDB.getVolunteers();
    const currentYear = new Date().getFullYear();
    const countThisYear = vols.filter(v => v.nomor_pendaftaran.includes(`REK-${currentYear}`)).length;
    const ticketNum = `REK-${currentYear}-${(countThisYear + 1).toString().padStart(4, '0')}`;
    const uuid = 'vol_' + Math.random().toString(36).substring(2, 11);

    const newVol: Volunteer = {
      ...payload,
      id: uuid,
      nomor_pendaftaran: ticketNum,
      status: 'baru',
      cv_drive_url: 'https://drive.google.com/file/d/mock_' + uuid + '/view',
      created_at: new Date().toISOString()
    };

    vols.push(newVol);
    mockDB.saveVolunteers(vols);

    // Add Audit Log
    const logs = mockDB.getAuditLogs();
    logs.unshift({
      timestamp: new Date().toISOString(),
      user_email: 'sistem.publik@alazhar.or.id',
      aksi: 'REKRUTMEN_DAFTAR',
      modul: 'Rekrutmen Relawan',
      ref_id: ticketNum,
      detail: `Pendaftar baru: ${newVol.nama_lengkap} (Divisi: ${newVol.divisi_diminati})`
    });
    mockDB.saveAuditLogs(logs);

    return {
      success: true,
      data: {
        id: uuid,
        nomor_pendaftaran: ticketNum,
        message: 'Pendaftaran berhasil. Kami akan menghubungi Anda via email.'
      }
    };
  },

  // Auth
  login: async (email: string) => {
    await new Promise((r) => setTimeout(r, 200));
    // Check in users (here simulated)
    const normalizedEmail = email.toLowerCase().trim();
    let role = 'Staf Viewer';
    let name = 'Tamu Viewer';
    let dept = '';

    if (normalizedEmail === 'admin@alazhar.or.id' || normalizedEmail === 'superadmin') {
      role = 'Super Admin';
      name = 'Roni Hermawan (Super Admin)';
    } else if (normalizedEmail === 'hr@alazhar.or.id' || normalizedEmail === 'hrd') {
      role = 'Admin HR';
      name = 'Siti Aminah (HRD)';
    } else if (normalizedEmail === 'manager@alazhar.or.id' || normalizedEmail === 'manager') {
      role = 'Manager Divisi';
      name = 'Budi Santoso (Manager Sekretariat)';
      dept = 'Sekretariat';
    }

    const token = 'session_' + Math.random().toString(36).substring(2, 11);
    const expiresAt = Date.now() + 8 * 3600 * 1000; // 8 hours

    return {
      success: true,
      data: {
        session_token: token,
        expires_at: expiresAt,
        user: {
          email: normalizedEmail,
          nama: name,
          role_id: role.toLowerCase().replace(' ', '_'),
          role_name: role,
          departement: dept,
          permissions: getRolePermissions(role)
        }
      }
    };
  },

  // Internal Dashboard
  getDashboardStats: async () => {
    await new Promise((r) => setTimeout(r, 200));
    const emps = mockDB.getEmployees();
    const active = emps.filter(e => e.is_active);
    const volunteers = mockDB.getVolunteers();

    // Grouping stats
    const perDivisi: Record<string, number> = {};
    const perUnit: Record<string, number> = {};
    const perLevel: Record<string, number> = {};

    active.forEach(e => {
      perDivisi[e.departement] = (perDivisi[e.departement] || 0) + 1;
      perUnit[e.unit] = (perUnit[e.unit] || 0) + 1;
      perLevel[e.level] = (perLevel[e.level] || 0) + 1;
    });

    // Check expiring contracts (< 30 days)
    const today = new Date();
    let expiringCount = 0;
    active.forEach(e => {
      if (e.employment_status === 'Kontrak' && e.contract_end_date) {
        const diff = (new Date(e.contract_end_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        if (diff >= 0 && diff <= 30) expiringCount++;
      }
    });

    // Birthdays this month
    const thisMonth = today.getMonth();
    const birthdaysCount = active.filter(e => {
      if (!e.date_of_birth) return false;
      return new Date(e.date_of_birth).getMonth() === thisMonth;
    }).length;

    // Average age calculation
    let totalAge = 0;
    let ageCount = 0;
    active.forEach(e => {
      if (e.date_of_birth) {
        const dob = new Date(e.date_of_birth);
        const age = (today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        if (age > 0 && age < 100) {
          totalAge += age;
          ageCount++;
        }
      }
    });
    const avgAge = ageCount > 0 ? Math.round(totalAge / ageCount * 10) / 10 : 0;

    return {
      success: true,
      data: {
        total_aktif: active.length,
        total_tetap: active.filter(e => e.employment_status === 'Tetap').length,
        total_kontrak: active.filter(e => e.employment_status === 'Kontrak').length,
        total_relawan: active.filter(e => e.employment_status === 'Relawan').length,
        jk_pria: active.filter(e => e.gender === 'L').length,
        jk_wanita: active.filter(e => e.gender === 'P').length,
        per_divisi: Object.entries(perDivisi).map(([nama, jumlah]) => ({ nama, jumlah })),
        per_unit: Object.entries(perUnit).map(([nama, jumlah]) => ({ nama, jumlah })),
        per_level: Object.entries(perLevel).map(([level, jumlah]) => ({ level, jumlah })),
        kontrak_30_hari: expiringCount,
        join_bulan_ini: active.filter(e => {
          if (!e.join_date) return false;
          const jd = new Date(e.join_date);
          return jd.getMonth() === thisMonth && jd.getFullYear() === today.getFullYear();
        }).length,
        ultah_minggu_ini: birthdaysCount,
        rekrutmen_baru: volunteers.filter(v => v.status === 'baru').length,
        rata_rata_usia: avgAge,
        updated_at: new Date().toISOString()
      }
    };
  },

  // Employees CRUD
  getEmployeesList: async () => {
    await new Promise((r) => setTimeout(r, 200));
    return {
      success: true,
      data: mockDB.getEmployees()
    };
  },

  getEmployeeDetail: async (id: string) => {
    await new Promise((r) => setTimeout(r, 150));
    const emp = mockDB.getEmployees().find(e => e.id === id || e.employee_id === id);
    if (!emp) return { success: false, error: 'Karyawan tidak ditemukan.' };
    return { success: true, data: emp };
  },

  saveEmployee: async (employee: Employee, userEmail: string) => {
    await new Promise((r) => setTimeout(r, 300));
    const emps = mockDB.getEmployees();
    const idx = emps.findIndex(e => e.id === employee.id);

    if (idx !== -1) {
      const old = emps[idx];
      emps[idx] = employee;
      mockDB.saveEmployees(emps);

      // Log changes
      const logs = mockDB.getAuditLogs();
      logs.unshift({
        timestamp: new Date().toISOString(),
        user_email: userEmail,
        aksi: 'EDIT',
        modul: 'Data Pegawai',
        ref_id: employee.employee_id,
        detail: `Ubah data karyawan: ${employee.full_name}`
      });
      mockDB.saveAuditLogs(logs);
    } else {
      emps.push(employee);
      mockDB.saveEmployees(emps);

      const logs = mockDB.getAuditLogs();
      logs.unshift({
        timestamp: new Date().toISOString(),
        user_email: userEmail,
        aksi: 'ADD',
        modul: 'Data Pegawai',
        ref_id: employee.employee_id,
        detail: `Tambah karyawan baru: ${employee.full_name}`
      });
      mockDB.saveAuditLogs(logs);
    }
    return { success: true };
  },

  deactivateEmployee: async (employeeId: string, reason: string, userEmail: string) => {
    await new Promise((r) => setTimeout(r, 200));
    const emps = mockDB.getEmployees();
    const emp = emps.find(e => e.employee_id === employeeId);
    if (!emp) return { success: false, error: 'Karyawan tidak ditemukan.' };

    emp.is_active = false;
    emp.inactive_date = new Date().toISOString().split('T')[0];
    emp.inactive_reason = reason;

    mockDB.saveEmployees(emps);

    const logs = mockDB.getAuditLogs();
    logs.unshift({
      timestamp: new Date().toISOString(),
      user_email: userEmail,
      aksi: 'DEACTIVATE',
      modul: 'Data Pegawai',
      ref_id: employeeId,
      detail: `Nonaktifkan karyawan: ${emp.full_name}. Alasan: ${reason}`
    });
    mockDB.saveAuditLogs(logs);

    return { success: true };
  },

  // Recruitment Admin
  getVolunteersList: async () => {
    await new Promise((r) => setTimeout(r, 200));
    return {
      success: true,
      data: mockDB.getVolunteers()
    };
  },

  updateVolunteerStatus: async (id: string, status: Volunteer['status'], catatanAdmin: string, userEmail: string) => {
    await new Promise((r) => setTimeout(r, 250));
    const vols = mockDB.getVolunteers();
    const vol = vols.find(v => v.id === id);
    if (!vol) return { success: false, error: 'Pendaftar tidak ditemukan.' };

    const oldStatus = vol.status;
    vol.status = status;
    vol.catatan_admin = catatanAdmin;
    vol.reviewed_by = userEmail;
    vol.reviewed_at = new Date().toISOString();

    mockDB.saveVolunteers(vols);

    // Add audit log
    const logs = mockDB.getAuditLogs();
    logs.unshift({
      timestamp: new Date().toISOString(),
      user_email: userEmail,
      aksi: `REKRUTMEN_${status.toUpperCase()}`,
      modul: 'Rekrutmen Relawan',
      ref_id: vol.nomor_pendaftaran,
      detail: `Ubah status ${vol.nama_lengkap} dari ${oldStatus} menjadi ${status}`
    });
    mockDB.saveAuditLogs(logs);

    return { success: true, message: `Status diperbarui menjadi ${status}.` };
  },

  convertToEmployee: async (rekrutmenId: string, payload: { join_date: string; departement: string; unit: string; job_level: string; level: string }, userEmail: string) => {
    await new Promise((r) => setTimeout(r, 300));
    const vols = mockDB.getVolunteers();
    const vol = vols.find(v => v.id === rekrutmenId);
    if (!vol) return { success: false, error: 'Pendaftar tidak ditemukan.' };

    const emps = mockDB.getEmployees();
    const joinDateObj = new Date(payload.join_date);
    const year = joinDateObj.getFullYear();
    const month = (joinDateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = joinDateObj.getDate().toString().padStart(2, '0');
    const seq = (emps.filter(e => e.join_date === payload.join_date).length + 1).toString().padStart(3, '0');
    const employeeId = `${year}${month}${day}${seq}`;
    const empUuid = 'emp_' + Math.random().toString(36).substring(2, 11);

    const newEmp: Employee = {
      id: empUuid,
      employee_id: employeeId,
      full_name: vol.nama_lengkap,
      current_position: `Relawan ${payload.departement}`,
      departement: payload.departement,
      unit: payload.unit,
      employment_status: 'Relawan',
      level: payload.level,
      job_level: payload.job_level,
      join_date: payload.join_date,
      contract_end_date: '',
      email_kantor: `${vol.nama_lengkap.toLowerCase().replace(/[^a-z]/g, '')}@alazhar.or.id`,
      email_pribadi: vol.email,
      mobile_phone: vol.no_hp,
      place_of_birth: vol.tempat_lahir,
      date_of_birth: vol.tanggal_lahir,
      gender: vol.gender,
      marital_status: 'Single',
      nik: '3273' + Math.floor(100000000000 + Math.random() * 900000000000),
      nik_address: vol.alamat,
      residential_address: vol.alamat,
      education_level: vol.pendidikan_terakhir,
      institution_name: vol.institusi,
      institution_place: vol.tempat_lahir,
      graduation_date: '',
      is_active: true,
      inactive_date: '',
      inactive_reason: '',
      spouse_name: '',
      spouse_dob: '',
      children: [],
      career_history: [
        {
          id: 'c_' + empUuid + '_1',
          employee_id: employeeId,
          urutan: 1,
          jabatan: `Relawan ${payload.departement}`,
          departement: payload.departement,
          unit: payload.unit,
          mulai: payload.join_date,
          selesai: null,
          is_current: true,
          keterangan: 'Penerimaan relawan dari pendaftaran rekrutmen'
        }
      ],
      rekrutmen_id: rekrutmenId
    };

    // Save employee and update volunteer status
    emps.push(newEmp);
    mockDB.saveEmployees(emps);

    vol.converted_to_employee_id = employeeId;
    vol.status = 'diterima';
    mockDB.saveVolunteers(vols);

    const logs = mockDB.getAuditLogs();
    logs.unshift({
      timestamp: new Date().toISOString(),
      user_email: userEmail,
      aksi: 'REKRUTMEN_KONVERSI',
      modul: 'Rekrutmen Relawan',
      ref_id: vol.nomor_pendaftaran,
      detail: `Konversi pendaftar ${vol.nama_lengkap} ke Karyawan Relawan dengan ID ${employeeId}`
    });
    mockDB.saveAuditLogs(logs);

    return {
      success: true,
      data: {
        employee_id: employeeId
      }
    };
  },

  updateRecruitmentSettings: async (settings: Partial<typeof DEFAULT_SETTINGS>, userEmail: string) => {
    await new Promise((r) => setTimeout(r, 100));
    const current = mockDB.getSettings();
    const updated = { ...current, ...settings };
    mockDB.saveSettings(updated);

    const logs = mockDB.getAuditLogs();
    logs.unshift({
      timestamp: new Date().toISOString(),
      user_email: userEmail,
      aksi: 'CONFIG_REKRUTMEN',
      modul: 'App Settings',
      detail: 'Pembaruan konfigurasi rekrutmen.'
    });
    mockDB.saveAuditLogs(logs);

    return { success: true };
  },

  getAuditLogs: async () => {
    await new Promise((r) => setTimeout(r, 100));
    return {
      success: true,
      data: mockDB.getAuditLogs()
    };
  },

  // User Account Management CRUD (GAS bridge + cache + mock fallback)
  getUsersList: async () => {
    // 1. Try client cache
    const cached = clientCache.get<UserAccount[]>('users_list');
    if (cached) return { success: true, data: cached, _fromCache: true };

    // 2. Try GAS API
    const gasResult = await gasClient.get('users.list');
    if (gasResult?.success && gasResult.data) {
      const mapped: UserAccount[] = gasResult.data.map((u: any) => ({
        id: u.username || u.email,
        email: u.email || '',
        nama: u.fullname || u.nama,
        role_id: (u.role || '').toLowerCase().replace(/\s+/g, '_'),
        role_name: u.role || '',
        departement: u.departement || '',
        is_active: u.is_active,
        created_at: u.created_at || '',
        last_login: u.last_login || '',
        avatar_color: u.avatar_color || '#1e3a7a',
      }));
      clientCache.set('users_list', mapped, CACHE_TTL.users);
      return { success: true, data: mapped };
    }

    // 3. Fallback to mock
    await new Promise((r) => setTimeout(r, 200));
    const mockData = mockDB.getUsers();
    clientCache.set('users_list', mockData, CACHE_TTL.users);
    return { success: true, data: mockData };
  },

  getUserDetail: async (id: string) => {
    const res = await api.getUsersList();
    if (!res.success) return { success: false, error: 'Gagal memuat data.' };
    const user = res.data.find(u => u.id === id);
    if (!user) return { success: false, error: 'User tidak ditemukan.' };
    return { success: true, data: user };
  },

  saveUser: async (user: UserAccount, actorEmail: string) => {
    // Try GAS first
    const gasResult = await gasClient.post('users.save', {
      data: {
        username: user.id,
        fullname: user.nama,
        role: user.role_name,
        departement: user.departement,
        email: user.email,
        is_active: user.is_active,
      }
    });
    clientCache.invalidate('users_list');

    if (gasResult?.success) {
      return { success: true };
    }

    // Mock fallback
    await new Promise((r) => setTimeout(r, 300));
    const users = mockDB.getUsers();
    const idx = users.findIndex(u => u.id === user.id);

    if (idx !== -1) {
      users[idx] = user;
      mockDB.saveUsers(users);
      const logs = mockDB.getAuditLogs();
      logs.unshift({ timestamp: new Date().toISOString(), user_email: actorEmail, aksi: 'EDIT', modul: 'Manajemen Akun', ref_id: user.email, detail: `Ubah akun user: ${user.nama} (${user.role_name})` });
      mockDB.saveAuditLogs(logs);
    } else {
      users.push(user);
      mockDB.saveUsers(users);
      const logs = mockDB.getAuditLogs();
      logs.unshift({ timestamp: new Date().toISOString(), user_email: actorEmail, aksi: 'ADD', modul: 'Manajemen Akun', ref_id: user.email, detail: `Tambah akun baru: ${user.nama} (${user.role_name})` });
      mockDB.saveAuditLogs(logs);
    }
    return { success: true };
  },

  toggleUserStatus: async (id: string, actorEmail: string) => {
    // Try GAS first
    const gasResult = await gasClient.post('users.toggle_status', { user_id: id });
    clientCache.invalidate('users_list');

    if (gasResult?.success) return { success: true };

    // Mock fallback
    await new Promise((r) => setTimeout(r, 200));
    const users = mockDB.getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return { success: false, error: 'User tidak ditemukan.' };

    user.is_active = !user.is_active;
    mockDB.saveUsers(users);
    const logs = mockDB.getAuditLogs();
    logs.unshift({ timestamp: new Date().toISOString(), user_email: actorEmail, aksi: user.is_active ? 'ACTIVATE' : 'DEACTIVATE', modul: 'Manajemen Akun', ref_id: user.email, detail: `${user.is_active ? 'Aktifkan' : 'Nonaktifkan'} akun: ${user.nama}` });
    mockDB.saveAuditLogs(logs);
    return { success: true };
  },

  deleteUser: async (id: string, actorEmail: string) => {
    // Try GAS first
    const gasResult = await gasClient.post('users.delete', { user_id: id });
    clientCache.invalidate('users_list');

    if (gasResult?.success) return { success: true };
    if (gasResult && !gasResult.success) return { success: false, error: gasResult.message || 'Gagal menghapus.' };

    // Mock fallback
    await new Promise((r) => setTimeout(r, 250));
    const users = mockDB.getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return { success: false, error: 'User tidak ditemukan.' };

    const filtered = users.filter(u => u.id !== id);
    mockDB.saveUsers(filtered);
    const logs = mockDB.getAuditLogs();
    logs.unshift({ timestamp: new Date().toISOString(), user_email: actorEmail, aksi: 'DELETE', modul: 'Manajemen Akun', ref_id: user.email, detail: `Hapus akun: ${user.nama} (${user.role_name})` });
    mockDB.saveAuditLogs(logs);
    return { success: true };
  }
};

function getRolePermissions(role: string) {
  const all = { view: true, create: true, edit: true, delete: true, export: true };
  const viewOnly = { view: true, create: false, edit: false, delete: false, export: false };
  const limited = { view: true, create: false, edit: false, delete: false, export: true };

  switch (role) {
    case 'Super Admin':
      return {
        landing_page: all,
        rekrutmen: all,
        dashboard: all,
        pegawai: all,
        karir: all,
        master: all,
        laporan: all,
        hak_akses: all,
        audit_log: all,
        settings: all
      };
    case 'Admin HR':
      return {
        landing_page: viewOnly,
        rekrutmen: all,
        dashboard: all,
        pegawai: { ...all, delete: false },
        karir: all,
        master: { ...all, delete: false },
        laporan: all,
        hak_akses: viewOnly,
        audit_log: viewOnly,
        settings: viewOnly
      };
    case 'Manager Divisi':
      return {
        landing_page: viewOnly,
        rekrutmen: viewOnly,
        dashboard: { ...viewOnly, view: true },
        pegawai: limited,
        karir: viewOnly,
        master: viewOnly,
        laporan: limited,
        hak_akses: viewOnly,
        audit_log: viewOnly,
        settings: viewOnly
      };
    default:
      return {
        landing_page: viewOnly,
        rekrutmen: viewOnly,
        dashboard: viewOnly,
        pegawai: viewOnly,
        karir: viewOnly,
        master: viewOnly,
        laporan: viewOnly,
        hak_akses: viewOnly,
        audit_log: viewOnly,
        settings: viewOnly
      };
  }
}
