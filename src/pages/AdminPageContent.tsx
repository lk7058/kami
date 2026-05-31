import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { cn, safeCopyToClipboard } from '@/lib/utils';
import { format } from 'date-fns';
import {
  verifyAdmin,
  getCardKeys,
  getAnnouncements,
  getSmtpConfig,
  getEmailJsConfig,
  getVerificationMode,
  addCardKey,
  batchAddCardKeys,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  deleteCardKey,
  changeAdminPassword,
  resetCardKey,
  updateSmtpConfig,
  updateEmailJsConfig,
  updateVerificationMode,
  testSmtpConfig,
} from '@/lib/store';
import { CardKey, Announcement, SmtpConfig, EmailJsConfig, VerificationMode } from '@/lib/types';
import {
  Lock,
  LogOut,
  Key,
  Megaphone,
  Settings,
  Plus,
  Trash2,
  Edit,
  Search,
  Shield,
  Copy,
  BarChart3,
  Eye,
  EyeOff,
  Infinity,
  RotateCcw,
  ListPlus,
  Mail,
  Server,
  CheckCircle2,
  XCircle,
  Code,
  Zap,
  Users,
} from 'lucide-react';

export default function AdminPageContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  // Data
  const [cardKeys, setCardKeys] = useState<CardKey[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Verification mode
  const [verificationMode, setVerificationMode] = useState<VerificationMode>(() => {
    try {
      return getVerificationMode();
    } catch {
      return 'none';
    }
  });

  // SMTP
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>(() => {
    try {
      return getSmtpConfig();
    } catch {
      return {
        host: '',
        port: 465,
        username: '',
        password: '',
        fromEmail: '',
        fromName: 'GPT Image2',
        enabled: false,
      };
    }
  });
  const [testingSmtp, setTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // EmailJS
  const [emailJsConfig, setEmailJsConfig] = useState<EmailJsConfig>(() => {
    try {
      return getEmailJsConfig();
    } catch {
      return {
        serviceId: '',
        templateId: '',
        publicKey: '',
        enabled: false,
      };
    }
  });

  // Single add
  const [newCode, setNewCode] = useState('');
  const [newNote, setNewNote] = useState('');

  // Batch add
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [batchCodes, setBatchCodes] = useState('');
  const [batchNote, setBatchNote] = useState('');

  // Announcement
  const [showAnnounceDialog, setShowAnnounceDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceContent, setAnnounceContent] = useState('');
  const [announcePriority, setAnnouncePriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Dialogs
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);

  useEffect(() => {
    if (isLoggedIn) refreshData();
  }, [isLoggedIn]);

  const refreshData = () => {
    try {
      setCardKeys(getCardKeys());
      setAnnouncements(getAnnouncements());
      setSmtpConfig(getSmtpConfig());
      setEmailJsConfig(getEmailJsConfig());
      setVerificationMode(getVerificationMode());
      setError(null);
    } catch (err) {
      console.error('[Admin] Failed to refresh data:', err);
      setError('数据加载失败，请刷新页面重试');
    }
  };

  const handleSaveVerificationMode = (mode: VerificationMode) => {
    updateVerificationMode(mode);
    setVerificationMode(mode);
    toast.success('验证模式已更新');
  };

  const handleSaveSmtp = () => {
    updateSmtpConfig(smtpConfig);
    toast.success('SMTP 配置已保存');
    refreshData();
  };

  const handleSaveEmailJs = () => {
    updateEmailJsConfig(emailJsConfig);
    toast.success('EmailJS 配置已保存');
    refreshData();
  };

  const handleTestSmtp = async () => {
    if (!smtpConfig.host || !smtpConfig.username || !smtpConfig.password || !smtpConfig.fromEmail) {
      toast.error('请填写完整的 SMTP 配置信息');
      return;
    }
    updateSmtpConfig(smtpConfig);

    setTestingSmtp(true);
    setSmtpTestResult(null);

    const result = await testSmtpConfig();
    setTestingSmtp(false);

    if (result.success) {
      setSmtpTestResult({ success: true, message: 'SMTP 连接成功！测试邮件已发送到你的邮箱' });
      toast.success('SMTP 测试成功');
    } else {
      setSmtpTestResult({ success: false, message: result.error || '测试失败，请检查配置' });
      toast.error(result.error || '测试失败');
    }
  };

  const handleLogin = () => {
    try {
      if (verifyAdmin(password)) {
        setIsLoggedIn(true);
        setError(null);
        toast.success('登录成功');
      } else {
        setError('密码错误');
        toast.error('密码错误');
      }
    } catch (err) {
      console.error('[Admin] Login error:', err);
      setError('登录失败，请刷新页面重试');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    toast.info('已退出登录');
  };

  const handleAddSingleKey = () => {
    if (!newCode.trim()) {
      toast.error('请输入卡密');
      return;
    }
    const result = addCardKey(newCode.trim(), newNote.trim() || undefined);
    if (result) {
      toast.success('卡密添加成功');
      setNewCode('');
      setNewNote('');
      refreshData();
    } else {
      toast.error('该卡密已存在');
    }
  };

  const handleBatchAdd = () => {
    if (!batchCodes.trim()) {
      toast.error('请输入卡密');
      return;
    }
    const result = batchAddCardKeys(batchCodes, batchNote.trim() || undefined);
    if (result.success > 0) {
      toast.success(`成功添加 ${result.success} 张卡密${result.failed > 0 ? `，${result.failed} 张重复或无效` : ''}`);
    } else {
      toast.error('所有卡密都已存在或格式无效');
    }
    setBatchCodes('');
    setBatchNote('');
    setShowBatchDialog(false);
    refreshData();
  };

  const handleSaveAnnouncement = () => {
    if (!announceTitle.trim() || !announceContent.trim()) {
      toast.error('请填写完整信息');
      return;
    }
    if (editingAnnouncement) {
      updateAnnouncement(editingAnnouncement.id, {
        title: announceTitle,
        content: announceContent,
        priority: announcePriority,
      });
      toast.success('公告已更新');
    } else {
      addAnnouncement({
        title: announceTitle,
        content: announceContent,
        priority: announcePriority,
        isActive: true,
      });
      toast.success('公告已发布');
    }
    setShowAnnounceDialog(false);
    setEditingAnnouncement(null);
    setAnnounceTitle('');
    setAnnounceContent('');
    setAnnouncePriority('medium');
    refreshData();
  };

  const handleEditAnnouncement = (a: Announcement) => {
    setEditingAnnouncement(a);
    setAnnounceTitle(a.title);
    setAnnounceContent(a.content);
    setAnnouncePriority(a.priority);
    setShowAnnounceDialog(true);
  };

  const handleDeleteAnnouncement = (id: string) => {
    deleteAnnouncement(id);
    refreshData();
    setShowDeleteConfirm(null);
    toast.success('公告已删除');
  };

  const handleDeleteKey = (id: string) => {
    deleteCardKey(id);
    refreshData();
    setShowDeleteConfirm(null);
    toast.success('卡密已删除');
  };

  const handleResetKey = (id: string) => {
    resetCardKey(id);
    refreshData();
    toast.success('卡密已重置为未使用状态');
  };

  const handleChangePassword = () => {
    if (newPassword.length < 4) {
      toast.error('密码至少4个字符');
      return;
    }
    changeAdminPassword(newPassword);
    setShowPasswordDialog(false);
    setNewPassword('');
    toast.success('密码已修改');
  };

  const filteredKeys = cardKeys.filter((k) =>
    k.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.claimedBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.note?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: cardKeys.length,
    unused: cardKeys.filter((k) => k.status === 'unused').length,
    used: cardKeys.filter((k) => k.status === 'used').length,
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center px-4">
        <Card className="glass-card border-border/30 w-full max-w-md animate-scale-in">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 glow-cyan">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">后台管理登录</CardTitle>
            <CardDescription>输入管理员密码以继续</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="admin-password">管理员密码</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPasswordText ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="pr-10 bg-secondary/50 border-border/50 focus:border-primary/50 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button onClick={handleLogin} className="w-full gap-2 glow-cyan hover:glow-cyan h-12">
              <Lock className="w-4 h-4" />
              登录
            </Button>
            <p className="text-xs text-muted-foreground text-center">默认密码: admin123</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              <span className="text-gradient-cyan">后台管理</span>
            </h1>
            <p className="text-muted-foreground mt-1">管理卡密、公告和系统设置</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPasswordDialog(true)} className="gap-1 border-border/30">
              <Settings className="w-4 h-4" />
              修改密码
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1 border-destructive/30 text-destructive hover:bg-destructive/10">
              <LogOut className="w-4 h-4" />
              退出
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: '总卡密数', value: stats.total, color: 'text-primary' },
            { label: '未使用', value: stats.unused, color: 'text-yellow-400' },
            { label: '已使用', value: stats.used, color: 'text-green-400' },
          ].map((stat, i) => (
            <Card key={stat.label} className={cn('glass-card border-border/30 animate-fade-in-up', `stagger-${i + 1}`)}>
              <CardContent className="p-5 text-center">
                <div className={cn('text-3xl font-bold', stat.color)}>{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-lg bg-secondary/50 mb-6">
            <TabsTrigger value="overview" className="gap-1">
              <BarChart3 className="w-4 h-4" />
              概览
            </TabsTrigger>
            <TabsTrigger value="keys" className="gap-1">
              <Key className="w-4 h-4" />
              卡密管理
            </TabsTrigger>
            <TabsTrigger value="announcements" className="gap-1">
              <Megaphone className="w-4 h-4" />
              公告管理
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-1">
              <Mail className="w-4 h-4" />
              邮件设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="animate-fade-in">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle>系统概览</CardTitle>
                <CardDescription>当前系统运行状态和数据统计</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl p-5 bg-secondary/30 border border-border/30">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      <Key className="w-4 h-4 text-primary" />
                      卡密统计
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">总卡密数</span>
                        <span className="text-foreground font-medium">{stats.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">未使用</span>
                        <span className="text-yellow-400 font-medium">{stats.unused}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">已使用</span>
                        <span className="text-green-400 font-medium">{stats.used}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">有效期</span>
                        <Badge variant="outline" className="text-primary border-primary/30 text-xs">
                          <Infinity className="w-3 h-3 mr-1" />
                          永久
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl p-5 bg-secondary/30 border border-border/30">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      <Megaphone className="w-4 h-4 text-primary" />
                      公告统计
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">总公告数</span>
                        <span className="text-foreground font-medium">{announcements.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">重要公告</span>
                        <span className="text-red-400 font-medium">{announcements.filter(a => a.priority === 'high').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">活跃公告</span>
                        <span className="text-green-400 font-medium">{announcements.filter(a => a.isActive).length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keys" className="animate-fade-in space-y-6">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  添加卡密
                </CardTitle>
                <CardDescription>手动输入卡密代码添加到系统中，所有卡密均为永久有效</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 items-end">
                  <div className="space-y-2 flex-1 min-w-[200px]">
                    <Label>卡密代码</Label>
                    <Input
                      placeholder="输入卡密代码，如 VIP-XXXX-XXXX"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSingleKey()}
                      className="bg-secondary/50 border-border/50 focus:border-primary/50 font-mono"
                    />
                  </div>
                  <div className="space-y-2 flex-1 min-w-[160px]">
                    <Label>备注（可选）</Label>
                    <Input
                      placeholder="备注信息"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="bg-secondary/50 border-border/50 focus:border-primary/50"
                    />
                  </div>
                  <Button onClick={handleAddSingleKey} className="gap-2 glow-cyan hover:glow-cyan h-10">
                    <Plus className="w-4 h-4" />
                    添加
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowBatchDialog(true)}
                    className="gap-2 border-primary/30 hover:bg-primary/10 h-10"
                  >
                    <ListPlus className="w-4 h-4" />
                    批量添加
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="text-lg">
                  卡密列表 ({filteredKeys.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索卡密、邮箱或备注..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-secondary/50 border-border/50 focus:border-primary/50"
                  />
                </div>

                <div className="overflow-x-auto scrollbar-thin rounded-lg border border-border/30">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>卡密</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>使用者</TableHead>
                        <TableHead>备注</TableHead>
                        <TableHead>创建时间</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredKeys.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                            暂无卡密，请在上方添加
                          </TableCell>
                        </TableRow>
                      )}
                      {[...filteredKeys].reverse().map((key) => (
                        <TableRow key={key.id} className="border-border/20">
                          <TableCell className="font-mono text-sm tracking-wider">
                            <div className="flex items-center gap-2">
                              <span>{key.code}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 shrink-0"
                                onClick={() => {
                                  safeCopyToClipboard(key.code).then((success) => {
                                    toast[success ? 'success' : 'error'](success ? '已复制' : '复制失败');
                                  }).catch(() => {
                                    toast.error('复制失败');
                                  });
                                }}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              key.status === 'unused'
                                ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                                : 'text-green-400 border-green-400/30 bg-green-400/10'
                            )}>
                              {key.status === 'unused' ? '未使用' : '已使用'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{key.claimedBy || '-'}</TableCell>
                          <TableCell className="text-muted-foreground text-sm max-w-[120px] truncate">{key.note || '-'}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(key.createdAt), 'MM-dd HH:mm')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {key.status === 'used' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-7 h-7 text-blue-400 hover:bg-blue-400/10"
                                  onClick={() => handleResetKey(key.id)}
                                  title="重置为未使用"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-7 h-7 text-destructive hover:bg-destructive/10"
                                onClick={() => setShowDeleteConfirm(key.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="animate-fade-in space-y-6">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <CardTitle>公告管理</CardTitle>
                    <CardDescription>发布和管理系统公告</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingAnnouncement(null);
                    setAnnounceTitle('');
                    setAnnounceContent('');
                    setAnnouncePriority('medium');
                    setShowAnnounceDialog(true);
                  }} className="gap-2 glow-cyan hover:glow-cyan">
                    <Plus className="w-4 h-4" />
                    发布公告
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">暂无公告</div>
                  )}
                  {announcements.map((a) => (
                    <div key={a.id} className="rounded-xl p-4 bg-secondary/30 border border-border/30 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold text-foreground text-sm">{a.title}</h4>
                          <Badge variant="outline" className={cn(
                            'text-xs',
                            a.priority === 'high' ? 'text-red-400 border-red-400/30' :
                            a.priority === 'medium' ? 'text-yellow-400 border-yellow-400/30' :
                            'text-blue-400 border-blue-400/30'
                          )}>
                            {a.priority === 'high' ? '重要' : a.priority === 'medium' ? '一般' : '普通'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{a.content}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {format(new Date(a.createdAt), 'yyyy-MM-dd HH:mm')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleEditAnnouncement(a)}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:bg-destructive/10" onClick={() => setShowDeleteConfirm(`announce-${a.id}`)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="animate-fade-in space-y-6">
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  验证模式设置
                </CardTitle>
                <CardDescription>选择用户领取卡密时的验证方式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      className={cn(
                        'p-4 rounded-xl border cursor-pointer transition-all',
                        verificationMode === 'none'
                          ? 'bg-primary/10 border-primary/30'
                          : 'bg-secondary/30 border-border/30 hover:border-border/60'
                      )}
                      onClick={() => handleSaveVerificationMode('none')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Users className={cn('w-5 h-5', verificationMode === 'none' ? 'text-primary' : 'text-muted-foreground')} />
                        <span className="font-semibold text-sm">无需验证</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        用户输入邮箱后直接领取卡密，无需验证码验证。最简单的方式。
                      </p>
                    </div>
                    <div
                      className={cn(
                        'p-4 rounded-xl border cursor-pointer transition-all',
                        verificationMode === 'dev'
                          ? 'bg-primary/10 border-primary/30'
                          : 'bg-secondary/30 border-border/30 hover:border-border/60'
                      )}
                      onClick={() => handleSaveVerificationMode('dev')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Code className={cn('w-5 h-5', verificationMode === 'dev' ? 'text-primary' : 'text-muted-foreground')} />
                        <span className="font-semibold text-sm">页面显示验证码</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        验证码直接显示在页面上，用户复制输入即可。无需配置邮件服务。
                      </p>
                    </div>
                    <div
                      className={cn(
                        'p-4 rounded-xl border cursor-pointer transition-all',
                        verificationMode === 'emailjs'
                          ? 'bg-primary/10 border-primary/30'
                          : 'bg-secondary/30 border-border/30 hover:border-border/60'
                      )}
                      onClick={() => handleSaveVerificationMode('emailjs')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className={cn('w-5 h-5', verificationMode === 'emailjs' ? 'text-primary' : 'text-muted-foreground')} />
                        <span className="font-semibold text-sm">EmailJS 发送</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        使用 EmailJS 服务发送邮件验证码。免费额度，无需部署后端。
                      </p>
                    </div>
                    <div
                      className={cn(
                        'p-4 rounded-xl border cursor-pointer transition-all',
                        verificationMode === 'smtp'
                          ? 'bg-primary/10 border-primary/30'
                          : 'bg-secondary/30 border-border/30 hover:border-border/60'
                      )}
                      onClick={() => handleSaveVerificationMode('smtp')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Server className={cn('w-5 h-5', verificationMode === 'smtp' ? 'text-primary' : 'text-muted-foreground')} />
                        <span className="font-semibold text-sm">SMTP 发送</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        配置自己的 SMTP 服务器发送邮件。需要部署后端服务。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {verificationMode === 'emailjs' && (
              <Card className="glass-card border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    EmailJS 配置
                  </CardTitle>
                  <CardDescription>配置 EmailJS 以发送邮件验证码</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-xl p-4 bg-secondary/30 border border-border/30">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">配置步骤</p>
                    <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
                      <li>访问 <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">emailjs.com</a> 注册账号</li>
                      <li>添加邮箱服务（如 Gmail、QQ 邮箱等）获取 Service ID</li>
                      <li>创建邮件模板，模板参数名使用 <code className="px-1 bg-background rounded">to_email</code> 和 <code className="px-1 bg-background rounded">verification_code</code></li>
                      <li>获取 Public Key</li>
                      <li>在下方填入信息并保存</li>
                    </ol>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label>Service ID</Label>
                      <Input
                        placeholder="service_xxx"
                        value={emailJsConfig.serviceId}
                        onChange={(e) => setEmailJsConfig(c => ({ ...c, serviceId: e.target.value }))}
                        className="bg-secondary/50 border-border/50 focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Template ID</Label>
                      <Input
                        placeholder="template_xxx"
                        value={emailJsConfig.templateId}
                        onChange={(e) => setEmailJsConfig(c => ({ ...c, templateId: e.target.value }))}
                        className="bg-secondary/50 border-border/50 focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Public Key</Label>
                      <Input
                        placeholder="public key"
                        value={emailJsConfig.publicKey}
                        onChange={(e) => setEmailJsConfig(c => ({ ...c, publicKey: e.target.value }))}
                        className="bg-secondary/50 border-border/50 focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveEmailJs} className="gap-2 glow-cyan hover:glow-cyan">
                    <CheckCircle2 className="w-4 h-4" />
                    保存配置
                  </Button>
                </CardContent>
              </Card>
            )}

            {verificationMode === 'smtp' && (
              <Card className="glass-card border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-primary" />
                    SMTP 配置
                  </CardTitle>
                  <CardDescription>配置 SMTP 服务器以发送邮件验证码</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-xl p-4 bg-secondary/30 border border-border/30">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">部署说明</p>
                    <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
                      <li>启动后端邮件服务：<code className="px-1.5 py-0.5 bg-background/80 rounded text-primary text-[11px]">cd server && npm start</code></li>
                      <li>在下方填写 SMTP 服务器信息并保存</li>
                      <li>点击「测试连接」确认配置正确</li>
                    </ol>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP 服务器</Label>
                      <Input
                        placeholder="smtp.qq.com"
                        value={smtpConfig.host}
                        onChange={(e) => setSmtpConfig(c => ({ ...c, host: e.target.value }))}
                        className="bg-secondary/50 border-border/50 focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>端口</Label>
                      <Input
                        type="number"
                        placeholder="465"
                        value={smtpConfig.port}
                        onChange={(e) => setSmtpConfig(c => ({ ...c, port: parseInt(e.target.value) || 0 }))}
                        className="bg-secondary/50 border-border/50 focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>发件邮箱</Label>
                      <Input
                        placeholder="your@email.com"
                        value={smtpConfig.fromEmail}
                        onChange={(e) => setSmtpConfig(c => ({ ...c, fromEmail: e.target.value }))}
                        className="bg-secondary/50 border-border/50 focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>发件人名称</Label>
                      <Input
                        placeholder="GPT Image2"
                        value={smtpConfig.fromName}
                        onChange={(e) => setSmtpConfig(c => ({ ...c, fromName: e.target.value }))}
                        className="bg-secondary/50 border-border/50 focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>邮箱账号</Label>
                      <Input
                        placeholder="SMTP 登录用户名"
                        value={smtpConfig.username}
                        onChange={(e) => setSmtpConfig(c => ({ ...c, username: e.target.value }))}
                        className="bg-secondary/50 border-border/50 focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>邮箱密码 / 授权码</Label>
                      <Input
                        type="password"
                        placeholder="SMTP 登录密码或授权码"
                        value={smtpConfig.password}
                        onChange={(e) => setSmtpConfig(c => ({ ...c, password: e.target.value }))}
                        className="bg-secondary/50 border-border/50 focus:border-primary/50"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-lg border border-border/30">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">常用 SMTP 参考</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Server className="w-3 h-3" />
                        <span>QQ邮箱: smtp.qq.com:465</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Server className="w-3 h-3" />
                        <span>网易163: smtp.163.com:465</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Server className="w-3 h-3" />
                        <span>Gmail: smtp.gmail.com:465</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSaveSmtp} className="gap-2 glow-cyan hover:glow-cyan">
                      <CheckCircle2 className="w-4 h-4" />
                      保存配置
                    </Button>
                    <Button variant="outline" onClick={handleTestSmtp} disabled={testingSmtp} className="gap-2 border-border/30">
                      {testingSmtp ? (
                        <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4" />
                      )}
                      {testingSmtp ? '测试中...' : '测试连接'}
                    </Button>
                  </div>
                  {smtpTestResult && (
                    <div className={cn(
                      'flex items-center gap-2 p-3 rounded-lg text-sm',
                      smtpTestResult.success
                        ? 'bg-green-400/10 border border-green-400/30 text-green-400'
                        : 'bg-destructive/10 border border-destructive/30 text-destructive'
                    )}>
                      {smtpTestResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                      {smtpTestResult.message}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
          <DialogContent className="glass-card border-border/30 max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ListPlus className="w-5 h-5 text-primary" />
                批量添加卡密
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>卡密列表（每行一个）</Label>
                <Textarea
                  placeholder={"VIP-XXXX-XXXX\nVIP-YYYY-YYYY\nVIP-ZZZZ-ZZZZ"}
                  value={batchCodes}
                  onChange={(e) => setBatchCodes(e.target.value.toUpperCase())}
                  rows={8}
                  className="bg-secondary/50 border-border/50 focus:border-primary/50 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">每行输入一个卡密代码，空行将被忽略</p>
              </div>
              <div className="space-y-2">
                <Label>备注（可选，统一应用于所有卡密）</Label>
                <Input
                  placeholder="备注信息"
                  value={batchNote}
                  onChange={(e) => setBatchNote(e.target.value)}
                  className="bg-secondary/50 border-border/50 focus:border-primary/50"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowBatchDialog(false)}>取消</Button>
                <Button onClick={handleBatchAdd} className="glow-cyan">批量添加</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showAnnounceDialog} onOpenChange={(v) => { setShowAnnounceDialog(v); if (!v) setEditingAnnouncement(null); }}>
          <DialogContent className="glass-card border-border/30 max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? '编辑公告' : '发布公告'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>标题</Label>
                <Input value={announceTitle} onChange={(e) => setAnnounceTitle(e.target.value)} placeholder="公告标题" className="bg-secondary/50 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label>优先级</Label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <Button
                      key={p}
                      variant={announcePriority === p ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAnnouncePriority(p)}
                      className={cn(
                        announcePriority === p ? '' : 'border-border/30',
                        p === 'high' && announcePriority === p && 'bg-destructive hover:bg-destructive/90',
                        p === 'medium' && announcePriority === p && 'bg-yellow-500 hover:bg-yellow-500/90 text-black',
                        p === 'low' && announcePriority === p && 'bg-blue-500 hover:bg-blue-500/90',
                      )}
                    >
                      {p === 'high' ? '重要' : p === 'medium' ? '一般' : '普通'}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>内容</Label>
                <Textarea value={announceContent} onChange={(e) => setAnnounceContent(e.target.value)} placeholder="公告内容" rows={4} className="bg-secondary/50 border-border/50" />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowAnnounceDialog(false)}>取消</Button>
                <Button onClick={handleSaveAnnouncement} className="glow-cyan">{editingAnnouncement ? '更新' : '发布'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
          <AlertDialogContent className="glass-card border-border/30">
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>此操作不可撤销，确定要继续吗？</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (showDeleteConfirm?.startsWith('announce-')) {
                    handleDeleteAnnouncement(showDeleteConfirm.replace('announce-', ''));
                  } else if (showDeleteConfirm) {
                    handleDeleteKey(showDeleteConfirm);
                  }
                }}
                className="bg-destructive hover:bg-destructive/90"
              >
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent className="glass-card border-border/30">
            <DialogHeader>
              <DialogTitle>修改管理员密码</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>新密码</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="输入新密码（至少4个字符）"
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>取消</Button>
                <Button onClick={handleChangePassword} className="glow-cyan">确认修改</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
