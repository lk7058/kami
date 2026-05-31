import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, CheckCircle, XCircle, Copy, Calendar, User, Infinity, Mail, Key } from 'lucide-react';
import { searchCardKeyByEmail, searchCardKey, isValidEmail } from '@/lib/store';
import { CardKey } from '@/lib/types';
import { cn, safeCopyToClipboard } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';

export default function QueryPage() {
  const [queryMode, setQueryMode] = useState<'email' | 'code'>('email');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<CardKey | null | undefined>(undefined);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error('请输入查询内容');
      return;
    }

    if (queryMode === 'email' && !isValidEmail(query)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const key = queryMode === 'email'
        ? searchCardKeyByEmail(query)
        : searchCardKey(query);
      setResult(key || null);
      setSearched(true);
      setLoading(false);
    }, 500);
  };

  const copyCode = async () => {
    if (result?.code) {
      const success = await safeCopyToClipboard(result.code);
      if (success) {
        toast.success('卡密已复制');
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
            <Search className="w-4 h-4" />
            卡密查询中心
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-gradient-cyan">查询卡密状态</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            通过邮箱或卡密代码查询详细信息
          </p>
        </div>

        {/* Search Card */}
        <Card className="glass-card border-border/30 animate-fade-in-up stagger-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              查询卡密
            </CardTitle>
            <CardDescription>选择查询方式并输入查询内容</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="email" onValueChange={(v) => { setQueryMode(v as 'email' | 'code'); setSearched(false); setResult(undefined); setQuery(''); }}>
              <TabsList className="grid grid-cols-2 w-full bg-secondary/50">
                <TabsTrigger value="email" className="gap-1">
                  <Mail className="w-4 h-4" />
                  邮箱查询
                </TabsTrigger>
                <TabsTrigger value="code" className="gap-1">
                  <Key className="w-4 h-4" />
                  卡密查询
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="mt-4 space-y-3">
                <Label htmlFor="email-query">邮箱地址</Label>
                <div className="flex gap-3">
                  <Input
                    id="email-query"
                    type="email"
                    placeholder="输入领取卡密的邮箱地址"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 bg-secondary/50 border-border/50 focus:border-primary/50 h-12"
                  />
                  <Button onClick={handleSearch} disabled={loading} className="gap-2 px-6 glow-cyan hover:glow-cyan h-12">
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    查询
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="code" className="mt-4 space-y-3">
                <Label htmlFor="code-query">卡密代码</Label>
                <div className="flex gap-3">
                  <Input
                    id="code-query"
                    placeholder="输入卡密代码"
                    value={query}
                    onChange={(e) => setQuery(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1 font-mono tracking-widest bg-secondary/50 border-border/50 focus:border-primary/50 h-12"
                  />
                  <Button onClick={handleSearch} disabled={loading} className="gap-2 px-6 glow-cyan hover:glow-cyan h-12">
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    查询
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Result */}
        {searched && (
          <div className="mt-6 animate-scale-in">
            {result ? (
              <Card className="glass-card border-primary/20 glow-cyan">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CheckCircle className="w-5 h-5" />
                    查询结果
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Code */}
                  <div className="bg-secondary/50 rounded-xl p-5 text-center border border-border/30">
                    <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">卡密</div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-gradient-cyan tracking-widest select-all">
                      {result.code}
                    </div>
                    <Button variant="ghost" size="sm" onClick={copyCode} className="mt-2 gap-1 text-muted-foreground">
                      <Copy className="w-3 h-3" />
                      复制
                    </Button>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Status */}
                    <div className={cn(
                      'rounded-xl p-4 border',
                      result.status === 'unused'
                        ? 'bg-yellow-400/10 border-yellow-400/30'
                        : 'bg-green-400/10 border-green-400/30'
                    )}>
                      <div className="text-xs text-muted-foreground mb-1">状态</div>
                      <Badge variant="outline" className={cn(
                        result.status === 'unused'
                          ? 'text-yellow-400 border-yellow-400/30'
                          : 'text-green-400 border-green-400/30'
                      )}>
                        {result.status === 'unused' ? '未使用' : '已使用'}
                      </Badge>
                    </div>

                    {/* Permanent */}
                    <div className="rounded-xl p-4 bg-primary/10 border border-primary/30">
                      <div className="text-xs text-muted-foreground mb-1">有效期</div>
                      <Badge variant="outline" className="text-primary border-primary/30">
                        <Infinity className="w-3 h-3 mr-1" />
                        永久
                      </Badge>
                    </div>

                    {/* Email */}
                    <div className="rounded-xl p-4 bg-secondary/30 border border-border/30">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        领取邮箱
                      </div>
                      <div className="text-sm font-medium text-foreground break-all">
                        {result.claimedBy || '未领取'}
                      </div>
                    </div>

                    {/* Created */}
                    <div className="rounded-xl p-4 bg-secondary/30 border border-border/30">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        创建时间
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {format(new Date(result.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                      </div>
                    </div>
                  </div>

                  {/* Claimed Time */}
                  {result.claimedAt && (
                    <div className="rounded-xl p-4 bg-secondary/30 border border-border/30">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        领取时间
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {format(new Date(result.claimedAt), 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })}
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  {result.note && (
                    <div className="rounded-xl p-4 bg-secondary/30 border border-border/30">
                      <div className="text-xs text-muted-foreground mb-1">备注</div>
                      <div className="text-sm text-foreground">{result.note}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card border-destructive/30">
                <CardContent className="p-8 text-center">
                  <XCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-foreground mb-1">未找到卡密</h3>
                  <p className="text-muted-foreground">
                    {queryMode === 'email' ? '该邮箱未领取过卡密' : '请检查输入的卡密是否正确'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
