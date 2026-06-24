export interface CareerStage {
  period: string;
  title: string;
  department: string;
}

export interface Employee {
  id: string; // NIK, e.g., "IA-2024-001"
  name: string;
  email: string;
  phone: string;
  division: "Program" | "Fundraising" | "Operasional" | "Keuangan" | "HRD";
  position: string;
  unit: string;
  joinedDate: string; // e.g. "12 Jan 2024"
  status: "TETAP" | "KONTRAK" | "RELAWAN";
  statusDetail?: string; // e.g. "Exp 14 Hari"
  level: "Direksi" | "Manajer" | "Supervisor" | "Staf" | "Magang/Relawan";
  levelGrade?: string; // e.g. "Level 5"
  tenure: string; // e.g. "2 Thn, 4 Bln"
  avatarUrl?: string; // URL or empty for initials
  birthPlace: string;
  birthDate: string;
  gender: "Laki-laki" | "Perempuan";
  maritalStatus: "Menikah" | "Belum Menikah" | "Duda/Janda";
  identityNumber: string; // NIK KTP
  education: string;
  supervisorName?: string;
  directReportsCount?: number;
  careerHistory: CareerStage[];
}

export interface RecentActivity {
  id: string;
  type: "check_circle" | "person_add" | "update" | "receipt_long" | "cake";
  title: string;
  description: string;
  time: string;
  colorClass: string;
}

export interface StatCardData {
  title: string;
  value: number;
  trend?: string;
  icon: string;
  bgIconColor: string;
  textColor: string;
}

export interface AlertCardData {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  icon: string;
  colorClass: string;
  actionText: string;
  type: "contracts" | "birthdays" | "claims";
}
