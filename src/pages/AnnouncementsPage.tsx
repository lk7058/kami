import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Pin, Clock, AlertTriangle, Info } from 'lucide-react';
import { getAnnouncements } from '@/lib/store';
import { Announcement } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

function getPriorityInfo(priority: Announcement['priority']) {
  switch (priority) {
    case 'high':
      return { label: '重要', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' };
    case 'medium':
      return { label: '一般', icon: Pin, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' };
    case 'low':
      return { label: '普通', icon: Info, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' };
  }
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    setAnnouncements(getAnnouncements().filter((a) => a.isActive));
  }, []);

  return (
    <div className="min-h-screen grid-bg pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Megaphone className="w-4 h-4" />
            公告中心
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-gradient-cyan">最新公告</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            了解平台最新动态和重要通知
          </p>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <Card className="glass-card border-border/30 animate-fade-in-up stagger-1">
              <CardContent className="p-12 text-center">
                <Megaphone className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-muted-foreground">暂无公告</h3>
              </CardContent>
            </Card>
          ) : (
            announcements.map((announcement, i) => {
              const priorityInfo = getPriorityInfo(announcement.priority);
              const PriorityIcon = priorityInfo.icon;
              return (
                <Card
                  key={announcement.id}
                  className={cn(
                    'glass-card border-border/30 hover:border-primary/20 transition-all duration-300 animate-fade-in-up',
                    announcement.priority === 'high' && 'border-red-400/20',
                    `stagger-${i + 1}`
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg text-foreground flex-1">
                        {announcement.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={cn(priorityInfo.color, priorityInfo.border, priorityInfo.bg, 'shrink-0')}
                      >
                        <PriorityIcon className="w-3 h-3 mr-1" />
                        {priorityInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      {announcement.content}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                      <Clock className="w-3 h-3" />
                      {format(new Date(announcement.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
