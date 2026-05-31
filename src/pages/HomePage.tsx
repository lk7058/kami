import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Zap,
  Image,
  Palette,
  Layers,
  Wand2,
  ArrowRight,
  Cpu,
  Globe,
  Shield,
  Rocket,
  Gift,
  Megaphone,
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: '极速生成',
    description: '基于先进的 AI 模型，秒级响应，快速生成高质量图像',
    color: 'text-yellow-400',
    glow: 'glow-cyan',
  },
  {
    icon: Palette,
    title: '多样风格',
    description: '支持写实、动漫、油画、水彩等多种艺术风格自由切换',
    color: 'text-pink-400',
    glow: 'glow-purple',
  },
  {
    icon: Layers,
    title: '精细控制',
    description: '丰富的参数调节选项，精确控制生成结果的每一个细节',
    color: 'text-cyan-400',
    glow: 'glow-cyan',
  },
  {
    icon: Wand2,
    title: '智能优化',
    description: '内置智能优化引擎，自动提升图像质量和细节表现',
    color: 'text-purple-400',
    glow: 'glow-purple',
  },
  {
    icon: Cpu,
    title: '强大算力',
    description: '部署在高性能 GPU 集群，确保稳定流畅的使用体验',
    color: 'text-green-400',
    glow: 'glow-cyan',
  },
  {
    icon: Shield,
    title: '安全可靠',
    description: '用户数据加密存储，生成内容安全审核，放心使用',
    color: 'text-blue-400',
    glow: 'glow-purple',
  },
];

const stats = [
  { label: '生成图像', value: '100万+', icon: Image },
  { label: '活跃用户', value: '5万+', icon: Globe },
  { label: '风格模板', value: '200+', icon: Palette },
  { label: '满意度', value: '99.2%', icon: Sparkles },
];

export default function HomePage() {
  return (
    <div className="min-h-screen grid-bg pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in-up">
              <Rocket className="w-4 h-4" />
              <span>GPT Image2 全新升级</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up stagger-1">
              <span className="text-gradient-mixed">AI 驱动的</span>
              <br />
              <span className="text-foreground">图像生成平台</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-2 leading-relaxed">
              利用最先进的 GPT Image2 模型，将你的文字描述转化为令人惊叹的视觉作品。
              无论是创意设计还是艺术创作，这里都能满足你的想象力。
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
              <Link to="#/draw">
                <Button size="lg" className="gap-2 text-base px-8 py-6 glow-cyan hover:glow-cyan transition-all duration-300">
                  <Palette className="w-5 h-5" />
                  开始画图
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="#/claim">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 py-6 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                  <Sparkles className="w-5 h-5" />
                  领取卡密
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className={cn(
                    'glass-card border-border/30 hover:border-primary/30 transition-all duration-500 animate-fade-in-up',
                    `stagger-${i + 3}`
                  )}
                >
                  <CardContent className="p-6 text-center">
                    <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gradient-cyan">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-primary/30 text-primary mb-4">
              核心功能
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient-cyan">为什么选择 GPT Image2</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              我们提供最全面的 AI 图像生成工具，让每个人都能成为创作者
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className={cn(
                    'glass-card border-border/30 hover:border-primary/20 group transition-all duration-500 hover:-translate-y-1 animate-fade-in-up',
                    `stagger-${i + 1}`
                  )}
                >
                  <CardContent className="p-8">
                    <div className={cn('w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300', feature.glow)}>
                      <Icon className={cn('w-6 h-6', feature.color)} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="glass-card border-primary/20 glow-cyan overflow-hidden">
            <CardContent className="p-12 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-6 animate-float" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="text-gradient-cyan">准备好开始创作了吗？</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                领取你的专属卡密，立即体验 GPT Image2 的强大功能
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="#/claim">
                  <Button size="lg" className="gap-2 px-8 glow-cyan hover:glow-cyan transition-all">
                    <Gift className="w-5 h-5" />
                    领取卡密
                  </Button>
                </Link>
                <Link to="#/announcements">
                  <Button size="lg" variant="outline" className="gap-2 px-8 border-border/30 hover:bg-secondary/50">
                    <Megaphone className="w-5 h-5" />
                    查看公告
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} GPT Image2. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
