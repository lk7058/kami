import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { claimCardKey, sendVerificationEmail, verifyEmailCode, isValidEmail, hasEmailClaimed, getDevVerificationCode, getSmtpConfig, getAvailableKeyCount } from '@/lib/store';
import { Gift, Sparkles, Copy, Check, Infinity, Mail, Shield, ArrowRight, Code, KeyRound } from 'lucide-react';
import { cn, safeCopyToClipboard } from '@/lib/utils';

type Step = 'email' | 'verify' | 'claimed';

export default function ClaimPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [claimedKey, setClaimedKey] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [availableCount, setAvailableCount] = useState(getAvailableKeyCount());

  // Refresh available count on mount
  useEffect(() => {
    setAvailableCount(getAvailableKeyCount());
  }, []);

  const handleSendCode = async () => {
    if (!email.trim()) {
      toast.error('请输入邮箱地址');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }
    if (hasEmailClaimed(email)) {
      toast.error('该邮箱已领取过卡密，每个邮箱仅限领取一次');
      return;
    }

    setSendingEmail(true);
    const result = await sendVerificationEmail(email);
    setSendingEmail(false);

    if (result.success) {
      setStep('verify');
      setCountdown(60);
      // Check if SMTP is properly configured
      const smtp = getSmtpConfig();
      const smtpEnabled = smtp.enabled && smtp.host && smtp.username && smtp.password && smtp.fromEmail;

      if (smtpEnabled) {
        // SMTP configured: code sent to email
        toast.success('验证码已发送到你的邮箱，请查收');
      } else {
        // Dev mode: show verification code on page
        const code = getDevVerificationCode(email);
        if (code) {
          setDevCode(code);
        }
        toast.success('验证码已生成，请在下方查看');
      }

      // Countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      toast.error(result.error || '发送失败，请稍后重试');
    }
  };

  const handleVerifyAndClaim = () => {
    if (!verifyCode.trim()) {
      toast.error('请输入验证码');
      return;
    }

    if (!verifyEmailCode(email, verifyCode)) {
      toast.error('验证码错误或已过期');
      return;
    }

    const key = claimCardKey(email);
    if (key) {
      setClaimedKey(key.code);
      setStep('claimed');
      setAvailableCount(getAvailableKeyCount());
      toast.success('🎉 卡密领取成功！');
    } else {
      toast.error('暂无可用卡密，请联系管理员');
    }
  };

  const copyToClipboard = async () => {
    if (claimedKey) {
      const success = await safeCopyToClipboard(claimedKey);
      if (success) {
        toast.success('卡密已复制到剪贴板');
      } else {
        toast.error('复制失败，请手动选择复制');
      }
    }
  };

  return (
    <div className="min-h-screen grid-bg pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Gift className="w-4 h-4" />
            卡密领取中心
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-gradient-cyan">领取你的专属卡密</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            通过邮箱验证领取永久有效卡密，每个邮箱仅限一次
          </p>
        </div>

        {/* Available Keys Count */}
        <div className="flex items-center justify-center mb-8 animate-fade-in-up stagger-1">
          <div className={cn(
            'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all',
            availableCount > 0
              ? 'bg-green-500/10 border-green-400/30 text-green-400'
              : 'bg-red-500/10 border-red-400/30 text-red-400'
          )}>
            <KeyRound className="w-4 h-4" />
            {availableCount > 0 ? `剩余卡密：${availableCount} 张` : '暂无可用卡密'}
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in-up">
          {[
            { label: '输入邮箱', icon: Mail, active: step === 'email' },
            { label: '验证邮箱', icon: Shield, active: step === 'verify' },
            { label: '领取卡密', icon: Gift, active: step === 'claimed' },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                s.active ? 'bg-primary text-primary-foreground glow-cyan' : 'bg-secondary text-muted-foreground'
              )}>
                {i + 1}
              </div>
              <span className={cn('text-sm hidden sm:inline', s.active ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                {s.label}
              </span>
              {i < 2 && <ArrowRight className="w-4 h-4 text-muted-foreground/50" />}
            </div>
          ))}
        </div>

        {/* Step 1: Email Input */}
        {step === 'email' && (
          <Card className="glass-card border-border/30 animate-fade-in-up stagger-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                输入邮箱地址
              </CardTitle>
              <CardDescription>输入你的邮箱，我们将发送验证码</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center">
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 px-4 py-2 text-sm gap-2">
                  <Infinity className="w-4 h-4" />
                  永久有效 · 每邮箱限领一次
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/50 border-border/50 focus:border-primary/50 h-12 text-base"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                />
              </div>

              <Button
                onClick={handleSendCode}
                disabled={sendingEmail || availableCount === 0}
                className="w-full py-6 text-base glow-cyan hover:glow-cyan transition-all duration-300 gap-2"
              >
                {sendingEmail ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
                {availableCount === 0 ? '暂无可用卡密' : sendingEmail ? '发送中...' : '发送验证码'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Verify Code */}
        {step === 'verify' && (
          <Card className="glass-card border-border/30 animate-fade-in-up stagger-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                验证邮箱
              </CardTitle>
              <CardDescription>
                {devCode ? '验证码已生成，请在下方查看' : `请输入发送到 ${email} 的验证码`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="verify-code">验证码</Label>
                <Input
                  id="verify-code"
                  placeholder="输入6位验证码"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="bg-secondary/50 border-border/50 focus:border-primary/50 h-12 text-2xl text-center tracking-[0.5em] font-mono"
                  maxLength={6}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyAndClaim()}
                />
              </div>

              {/* Dev mode: show code prominently */}
              {devCode && (
                <div className="rounded-xl p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <p className="text-xs text-cyan-400 font-medium uppercase tracking-wider">开发模式 · 你的验证码</p>
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                  <p className="text-3xl font-mono font-bold text-gradient-cyan tracking-[0.4em] select-all">{devCode}</p>
                  <p className="text-xs text-muted-foreground mt-2">验证码有效期 5 分钟，请复制后在上方输入</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => { setStep('email'); setVerifyCode(''); setDevCode(null); }}
                  className="flex-1"
                >
                  返回修改
                </Button>
                <Button
                  onClick={handleVerifyAndClaim}
                  className="flex-1 gap-2 glow-cyan hover:glow-cyan"
                >
                  <Gift className="w-4 h-4" />
                  验证并领取
                </Button>
              </div>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-muted-foreground">{countdown}秒后可重新发送</p>
                ) : (
                  <button
                    onClick={handleSendCode}
                    className="text-sm text-primary hover:underline"
                  >
                    没收到？重新发送
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Claimed */}
        {step === 'claimed' && claimedKey && (
          <Card className="glass-card border-primary/30 glow-cyan animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                领取成功！
              </CardTitle>
              <CardDescription>以下是你的专属卡密，请妥善保管</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/50 rounded-xl p-6 text-center border border-primary/20">
                <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">你的卡密</div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-gradient-cyan tracking-widest mb-4 select-all">
                  {claimedKey}
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-primary/30 hover:bg-primary/10"
                >
                  <Copy className="w-4 h-4" />
                  复制卡密
                </Button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                  <Infinity className="w-3 h-3 mr-1" />
                  永久有效
                </Badge>
                <span>邮箱: {email}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card className="glass-card border-border/30 mt-6 animate-fade-in-up stagger-3">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">💡 温馨提示</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• 每张卡密永久有效，每个邮箱仅限领取一次</li>
              <li>• 验证码有效期为5分钟，请及时使用</li>
              <li>• 卡密仅限使用一次，请妥善保管</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
