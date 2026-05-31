import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect, Component, type ReactNode, type ErrorInfo } from 'react';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import ClaimPage from '@/pages/ClaimPage';
import QueryPage from '@/pages/QueryPage';
import AnnouncementsPage from '@/pages/AnnouncementsPage';
import DrawPage from '@/pages/DrawPage';
import AdminPageContent from '@/pages/AdminPageContent';

class AppErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[App] Render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-destructive mb-2">页面加载失败</h1>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function SpaRouteInitializer() {
  useEffect(() => {
    const redirectPath = sessionStorage.getItem('spa-redirect-path');
    if (redirectPath) {
      sessionStorage.removeItem('spa-redirect-path');
      window.history.replaceState(null, '', redirectPath);
    }
  }, []);

  return null;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {children}
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: 'hsl(228 20% 12%)',
            border: '1px solid hsl(228 15% 25%)',
            color: 'hsl(210 40% 96%)',
            backdropFilter: 'blur(20px)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <SpaRouteInitializer />
        <Routes>
          <Route path="/draw" element={<AppLayout><DrawPage /></AppLayout>} />
          <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
          <Route path="/claim" element={<AppLayout><ClaimPage /></AppLayout>} />
          <Route path="/query" element={<AppLayout><QueryPage /></AppLayout>} />
          <Route path="/announcements" element={<AppLayout><AnnouncementsPage /></AppLayout>} />
          <Route path="/admin" element={<AppLayout><AdminPageContent /></AppLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
