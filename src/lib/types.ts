export interface CardKey {
  id: string;
  code: string;
  status: 'unused' | 'used';
  claimedBy?: string;
  claimedAt?: string;
  createdAt: string;
  note?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface SmtpConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  enabled: boolean;
}

export interface EmailVerification {
  id: string;
  email: string;
  code: string;
  createdAt: string;
  expiresAt: string;
}

export interface AppState {
  cardKeys: CardKey[];
  announcements: Announcement[];
  adminPassword: string;
  isLoggedIn: boolean;
  smtpConfig: SmtpConfig;
  emailVerifications: EmailVerification[];
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
