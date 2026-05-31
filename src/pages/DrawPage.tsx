import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';

const DRAW_URL = 'https://2api.icefile.cn';

export default function DrawPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="min-h-screen grid-bg pt-16">
      {/* iframe container */}
      <div className="w-full" style={{ height: 'calc(100vh - 4rem)' }}>
        {/* Loading overlay */}
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10" style={{ top: '4rem', left: 0, right: 0, bottom: 0 }}>
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">正在加载画图页面...</p>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="flex items-center justify-center bg-background" style={{ height: 'calc(100vh - 4rem)' }}>
            <div className="text-center max-w-md px-6">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">页面加载失败</h3>
              <p className="text-muted-foreground text-sm mb-4">
                无法连接到画图服务
              </p>
              <p className="text-muted-foreground text-xs mb-6">
                请检查网络连接或目标服务是否正常运行
              </p>
              <Button onClick={() => { setError(false); setLoading(true); window.location.reload(); }}>
                重试
              </Button>
            </div>
          </div>
        )}

        {!error && (
          <iframe
            src={DRAW_URL}
            style={{ width: '100%', height: 'calc(100vh - 4rem)', border: 'none' }}
            title="GPT Image2 Drawing"
            allow="clipboard-write"
            onLoad={() => setLoading(false)}
            onError={() => { setError(true); setLoading(false); }}
          />
        )}
      </div>
    </div>
  );
}
