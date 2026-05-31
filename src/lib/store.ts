import { CardKey, Announcement, AppState, SmtpConfig, EmailVerification, generateId, generateVerificationCode } from '@/lib/types';

const STORAGE_KEY = 'gpt-image2-admin';

const defaultSmtpConfig: SmtpConfig = {
  host: 'smtp.qq.com',
  port: 465,
  username: '',
  password: '',
  fromEmail: '',
  fromName: 'GPT Image2',
  enabled: false,
};

const defaultAnnouncements: Announcement[] = [
  {
    id: '1',
    title: '🎉 GPT Image2 平台正式上线！',
    content: '欢迎使用 GPT Image2 AI 图像生成平台。我们提供高质量的 AI 图像生成服务，支持多种风格和参数设置。立即领取卡密开始体验吧！',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: '2',
    title: '📢 卡密领取规则',
    content: '所有卡密均为永久有效，每个邮箱仅限领取一次。领取时需要通过邮箱验证。如有问题请联系管理员。',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
];

function getDefaultState(): AppState {
  return {
    cardKeys: [],
    announcements: defaultAnnouncements,
    adminPassword: 'admin123',
    isLoggedIn: false,
    smtpConfig: defaultSmtpConfig,
    emailVerifications: [],
  };
}

export function loadState(): AppState {
  try {
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      return getDefaultState();
    }
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all required fields exist (migration safety)
      const defaults = getDefaultState();
      return {
        cardKeys: Array.isArray(parsed.cardKeys) ? parsed.cardKeys : defaults.cardKeys,
        announcements: Array.isArray(parsed.announcements) ? parsed.announcements : defaults.announcements,
        adminPassword: typeof parsed.adminPassword === 'string' ? parsed.adminPassword : defaults.adminPassword,
        isLoggedIn: false, // Always require re-login on page load
        smtpConfig: parsed.smtpConfig && typeof parsed.smtpConfig === 'object'
          ? { ...defaults.smtpConfig, ...parsed.smtpConfig }
          : defaults.smtpConfig,
        emailVerifications: Array.isArray(parsed.emailVerifications) ? parsed.emailVerifications : defaults.emailVerifications,
      };
    }
  } catch (e) {
    console.warn('[Store] Failed to load state, using defaults:', e);
    // If corrupted data, clear it
    try { 
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY); 
      }
    } catch {}
  }
  return getDefaultState();
}

export function saveState(state: AppState): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // ignore errors
  }
}

export function getCardKeys(): CardKey[] {
  return loadState().cardKeys;
}

export function getAnnouncements(): Announcement[] {
  return loadState().announcements;
}

export function getSmtpConfig(): SmtpConfig {
  return loadState().smtpConfig;
}

// ─── Email Validation ───
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase().trim());
}

// ─── Check if email already claimed ───
export function hasEmailClaimed(email: string): boolean {
  const state = loadState();
  return state.cardKeys.some((k) => k.claimedBy?.toLowerCase() === email.toLowerCase().trim());
}

// ─── Send Verification Email ───
// 如配置了 SMTP 则通过后端代理发送，失败时直接报错（不再降级）
// 未配置 SMTP 时使用开发模式（验证码显示在页面）
export async function sendVerificationEmail(email: string): Promise<{ success: boolean; error?: string }> {
  const state = loadState();
  const smtp = state.smtpConfig;
  const trimmedEmail = email.toLowerCase().trim();

  // Check if email already claimed
  if (hasEmailClaimed(trimmedEmail)) {
    return { success: false, error: '该邮箱已领取过卡密，每个邮箱仅限领取一次' };
  }

  // Check if there are available keys
  const availableCount = state.cardKeys.filter((k) => k.status === 'unused').length;
  if (availableCount === 0) {
    return { success: false, error: '暂无可用卡密，请联系管理员' };
  }

  // Generate verification code
  const code = generateVerificationCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

  // Store verification code (remove old ones for same email)
  state.emailVerifications = state.emailVerifications.filter((v) => v.email !== trimmedEmail);
  state.emailVerifications.push({
    id: generateId(),
    email: trimmedEmail,
    code,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  });
  saveState(state);

  // If SMTP enabled and configured, send via proxy (no fallback on failure)
  if (smtp.enabled && smtp.host && smtp.username && smtp.password && smtp.fromEmail) {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtp: {
            host: smtp.host,
            port: smtp.port,
            username: smtp.username,
            password: smtp.password,
            fromEmail: smtp.fromEmail,
            fromName: smtp.fromName,
          },
          to: trimmedEmail,
          subject: `【GPT Image2】邮箱验证码：${code}`,
          html: `
            <div style="max-width:600px;margin:0 auto;padding:40px 20px;font-family:Arial,sans-serif;background:#0f172a;color:#e2e8f0;">
              <div style="text-align:center;margin-bottom:30px;">
                <h1 style="color:#06b6d4;font-size:28px;margin:0;">GPT Image2</h1>
                <p style="color:#94a3b8;margin:8px 0 0;">AI 图像生成平台</p>
              </div>
              <div style="background:#1e293b;border-radius:12px;padding:30px;border:1px solid #334155;">
                <h2 style="color:#e2e8f0;font-size:20px;margin:0 0 16px;">邮箱验证码</h2>
                <p style="color:#94a3b8;line-height:1.6;margin:0 0 20px;">您正在进行卡密领取操作，请使用以下验证码完成验证：</p>
                <div style="text-align:center;margin:24px 0;">
                  <span style="display:inline-block;background:#0f172a;border:2px solid #06b6d4;border-radius:8px;padding:12px 32px;font-size:32px;font-weight:bold;color:#06b6d4;letter-spacing:8px;font-family:monospace;">${code}</span>
                </div>
                <p style="color:#64748b;font-size:13px;margin:0 0 8px;">验证码有效期为 <strong style="color:#94a3b8;">5 分钟</strong>，请尽快使用。</p>
                <p style="color:#64748b;font-size:13px;margin:0;">如非本人操作，请忽略此邮件。</p>
              </div>
              <div style="text-align:center;margin-top:24px;">
                <p style="color:#475569;font-size:12px;margin:0;">© ${new Date().getFullYear()} GPT Image2. All rights reserved.</p>
              </div>
            </div>
          `,
        }),
      });

      if (response.ok) {
        console.log('[Email] Sent via SMTP to', trimmedEmail);
        return { success: true };
      }

      const data = await response.json().catch(() => ({}));
      return { success: false, error: data.error || '邮件发送失败，请稍后重试' };
    } catch {
      return { success: false, error: '邮件服务不可用，请联系管理员' };
    }
  }

  // Dev mode: code stored locally and shown on page
  console.log(`[Email] Dev mode: code for ${trimmedEmail} is ${code}`);
  return { success: true };
}

// ─── Get available card key count ───
export function getAvailableKeyCount(): number {
  const state = loadState();
  return state.cardKeys.filter((k) => k.status === 'unused').length;
}

// ─── Verify Email Code ───
export function verifyEmailCode(email: string, code: string): boolean {
  const state = loadState();
  const trimmedEmail = email.toLowerCase().trim();

  const verification = state.emailVerifications.find(
    (v) => v.email === trimmedEmail && v.code === code.trim()
  );

  if (!verification) return false;

  // Check expiry
  if (new Date(verification.expiresAt) < new Date()) {
    // Remove expired
    state.emailVerifications = state.emailVerifications.filter((v) => v.id !== verification.id);
    saveState(state);
    return false;
  }

  // Remove used verification
  state.emailVerifications = state.emailVerifications.filter((v) => v.email !== trimmedEmail);
  saveState(state);
  return true;
}

// ─── Claim Card Key (after email verification) ───
export function claimCardKey(email: string): CardKey | null {
  const state = loadState();
  const trimmedEmail = email.toLowerCase().trim();

  // Check if already claimed
  if (state.cardKeys.some((k) => k.claimedBy?.toLowerCase() === trimmedEmail)) {
    return null;
  }

  const availableKey = state.cardKeys.find((k) => k.status === 'unused');
  if (!availableKey) return null;

  availableKey.status = 'used';
  availableKey.claimedBy = trimmedEmail;
  availableKey.claimedAt = new Date().toISOString();

  saveState(state);
  return availableKey;
}

// ─── Query by email ───
export function searchCardKeyByEmail(email: string): CardKey | undefined {
  const state = loadState();
  return state.cardKeys.find((k) => k.claimedBy?.toLowerCase() === email.toLowerCase().trim());
}

// ─── Query by code (keep for backward compat) ───
export function searchCardKey(code: string): CardKey | undefined {
  const state = loadState();
  return state.cardKeys.find((k) => k.code === code.toUpperCase().trim());
}

// ─── Admin: Add Card Key ───
export function addCardKey(code: string, note?: string): CardKey | null {
  const state = loadState();
  const trimmedCode = code.toUpperCase().trim();
  if (state.cardKeys.some((k) => k.code === trimmedCode)) return null;

  const newKey: CardKey = {
    id: generateId(),
    code: trimmedCode,
    status: 'unused',
    createdAt: new Date().toISOString(),
    note,
  };
  state.cardKeys.push(newKey);
  saveState(state);
  return newKey;
}

export function batchAddCardKeys(codesText: string, note?: string): { success: number; failed: number; duplicates: string[] } {
  const lines = codesText.split('\n').map((l) => l.trim().toUpperCase()).filter(Boolean);
  const state = loadState();
  let success = 0;
  let failed = 0;
  const duplicates: string[] = [];

  for (const code of lines) {
    if (code.length < 3) { failed++; continue; }
    if (state.cardKeys.some((k) => k.code === code)) { duplicates.push(code); failed++; continue; }
    state.cardKeys.push({
      id: generateId(),
      code,
      status: 'unused',
      createdAt: new Date().toISOString(),
      note,
    });
    success++;
  }
  saveState(state);
  return { success, failed, duplicates };
}

// ─── Announcement Management ───
export function addAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Announcement {
  const state = loadState();
  const newAnnouncement: Announcement = {
    ...announcement,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.announcements.unshift(newAnnouncement);
  saveState(state);
  return newAnnouncement;
}

export function updateAnnouncement(id: string, updates: Partial<Announcement>): Announcement | null {
  const state = loadState();
  const idx = state.announcements.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  state.announcements[idx] = { ...state.announcements[idx], ...updates, updatedAt: new Date().toISOString() };
  saveState(state);
  return state.announcements[idx];
}

export function deleteAnnouncement(id: string): boolean {
  const state = loadState();
  const idx = state.announcements.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  state.announcements.splice(idx, 1);
  saveState(state);
  return true;
}

// ─── Admin Auth ───
export function verifyAdmin(password: string): boolean {
  const state = loadState();
  return password === state.adminPassword;
}

export function changeAdminPassword(newPassword: string): void {
  const state = loadState();
  state.adminPassword = newPassword;
  saveState(state);
}

export function deleteCardKey(id: string): boolean {
  const state = loadState();
  const idx = state.cardKeys.findIndex((k) => k.id === id);
  if (idx === -1) return false;
  state.cardKeys.splice(idx, 1);
  saveState(state);
  return true;
}

export function resetCardKey(id: string): boolean {
  const state = loadState();
  const key = state.cardKeys.find((k) => k.id === id);
  if (!key) return false;
  key.status = 'unused';
  key.claimedBy = undefined;
  key.claimedAt = undefined;
  saveState(state);
  return true;
}

// ─── SMTP Config ───
export function updateSmtpConfig(config: Partial<SmtpConfig>): void {
  const state = loadState();
  state.smtpConfig = { ...state.smtpConfig, ...config };
  saveState(state);
}

// ─── Test SMTP ───
// 通过后端代理测试 SMTP 连接，失败时给出明确提示
export async function testSmtpConfig(): Promise<{ success: boolean; error?: string }> {
  const state = loadState();
  const smtp = state.smtpConfig;

  if (!smtp.host || !smtp.username || !smtp.password || !smtp.fromEmail) {
    return { success: false, error: '请填写完整的 SMTP 配置信息' };
  }

  try {
    const response = await fetch('/api/test-smtp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: smtp.host,
        port: smtp.port,
        username: smtp.username,
        password: smtp.password,
        fromEmail: smtp.fromEmail,
        fromName: smtp.fromName,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { success: false, error: data.error || 'SMTP 连接测试失败，请检查配置' };
    }
    return { success: true };
  } catch {
    return { success: false, error: '无法连接到邮件服务，请确认后端服务已启动（cd server && npm start）' };
  }
}

// ─── Dev helper: get pending verification code (for dev mode) ───
export function getDevVerificationCode(email: string): string | null {
  const state = loadState();
  const trimmedEmail = email.toLowerCase().trim();
  const verification = state.emailVerifications.find(
    (v) => v.email === trimmedEmail && new Date(v.expiresAt) > new Date()
  );
  return verification?.code || null;
}
