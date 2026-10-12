import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Public pages
import { LandingPage } from './components/pages/LandingPage';
import { PublicInfoPage } from './components/pages/PublicInfoPages';
import { AuthPages } from './components/pages/AuthPages';
import { ArchitectureView } from './components/pages/ArchitectureView';

// Patient pages
import { PatientDashboard } from './components/patient/PatientDashboard';
import { PatientProfile } from './components/patient/PatientProfile';
import { PatientRecords } from './components/patient/PatientRecords';
import { PatientDocuments } from './components/patient/PatientDocuments';
import { PatientAppointments } from './components/patient/PatientAppointments';
import { PatientDoctors } from './components/patient/PatientDoctors';
import { PatientPrescriptions } from './components/patient/PatientPrescriptions';
import { PatientAIAssistant } from './components/patient/PatientAIAssistant';

// Doctor pages
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { DoctorPatients } from './components/doctor/DoctorPatients';
import { DoctorRecords } from './components/doctor/DoctorRecords';
import { DoctorAppointments } from './components/doctor/DoctorAppointments';

// Admin pages
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminAppointments } from './components/admin/AdminAppointments';
import { AdminReports } from './components/admin/AdminReports';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';

// Common pages
import { SettingsView } from './components/common/SettingsView';
import { NotificationsCenter } from './components/common/NotificationsCenter';
import { MessagesView } from './components/common/MessagesView';
import { AccessDenied } from './components/common/AccessDenied';
import { StorageService } from './lib/storage';

const AppContent: React.FC = () => {
  const { isAuthenticated, role, currentUser } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Sync browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadNotifsCount = currentUser
    ? StorageService.getNotifications().filter(n => n.userId === currentUser.id && !n.read).length
    : 0;

  const unreadMsgsCount = currentUser
    ? StorageService.getMessages().filter(m => m.receiverId === currentUser.id && !m.read).length
    : 0;

  // Render view by path
  const renderCurrentView = () => {
    // Public routes
    if (currentPath === '/') return <LandingPage onNavigate={navigate} />;
    if (currentPath === '/features') return <PublicInfoPage type="features" onNavigate={navigate} />;
    if (currentPath === '/about') return <PublicInfoPage type="about" onNavigate={navigate} />;
    if (currentPath === '/security') return <PublicInfoPage type="security" onNavigate={navigate} />;
    if (currentPath === '/architecture') return <ArchitectureView />;
    if (currentPath.startsWith('/login')) {
      let initRole: 'patient' | 'doctor' | 'admin' | undefined;
      if (currentPath.includes('role=doctor')) initRole = 'doctor';
      else if (currentPath.includes('role=admin')) initRole = 'admin';
      else if (currentPath.includes('role=patient')) initRole = 'patient';
      return <AuthPages mode="login" onNavigate={navigate} initialRole={initRole} />;
    }
    if (currentPath === '/register') return <AuthPages mode="register" onNavigate={navigate} />;
    if (currentPath === '/forgot-password') return <AuthPages mode="forgot-password" onNavigate={navigate} />;
    if (currentPath === '/reset-password') return <AuthPages mode="reset-password" onNavigate={navigate} />;

    // Common routes
    if (currentPath === '/settings') return <SettingsView />;
    if (currentPath === '/notifications') return <NotificationsCenter onNavigate={navigate} />;
    if (currentPath === '/messages') return <MessagesView />;

    // Access Control Checks
    if (currentPath.startsWith('/admin')) {
      if (!isAuthenticated) return <AuthPages mode="login" onNavigate={navigate} />;
      if (role !== 'admin') return <AccessDenied onNavigate={navigate} requiredRole="admin" />;
    }

    if (currentPath.startsWith('/doctor')) {
      if (!isAuthenticated) return <AuthPages mode="login" onNavigate={navigate} />;
      if (role !== 'doctor' && role !== 'admin') return <AccessDenied onNavigate={navigate} requiredRole="doctor" />;
    }

    if (currentPath.startsWith('/patient')) {
      if (!isAuthenticated) return <AuthPages mode="login" onNavigate={navigate} />;
    }

    // Patient Routes
    if (currentPath === '/patient/dashboard') return <PatientDashboard onNavigate={navigate} />;
    if (currentPath === '/patient/profile') return <PatientProfile />;
    if (currentPath === '/patient/records') return <PatientRecords />;
    if (currentPath === '/patient/documents') return <PatientDocuments />;
    if (currentPath === '/patient/appointments') return <PatientAppointments />;
    if (currentPath === '/patient/doctors') return <PatientDoctors onNavigate={navigate} />;
    if (currentPath === '/patient/prescriptions') return <PatientPrescriptions />;
    if (currentPath === '/patient/ai-assistant') return <PatientAIAssistant onNavigate={navigate} />;
    if (currentPath === '/patient/messages') return <MessagesView />;
    if (currentPath === '/patient/notifications') return <NotificationsCenter onNavigate={navigate} />;

    // Doctor Routes
    if (currentPath === '/doctor/dashboard') return <DoctorDashboard onNavigate={navigate} />;
    if (currentPath === '/doctor/patients') return <DoctorPatients onNavigate={navigate} />;
    if (currentPath === '/doctor/records') return <DoctorRecords />;
    if (currentPath === '/doctor/appointments') return <DoctorAppointments onNavigate={navigate} />;
    if (currentPath === '/doctor/prescriptions') return <PatientPrescriptions />;
    if (currentPath === '/doctor/messages') return <MessagesView />;
    if (currentPath === '/doctor/notifications') return <NotificationsCenter onNavigate={navigate} />;
    if (currentPath === '/doctor/profile') return <SettingsView />;

    // Admin Routes
    if (currentPath === '/admin/dashboard') return <AdminDashboard onNavigate={navigate} />;
    if (currentPath === '/admin/users') return <AdminUsers />;
    if (currentPath === '/admin/appointments') return <AdminAppointments />;
    if (currentPath === '/admin/records') return <DoctorRecords />;
    if (currentPath === '/admin/reports') return <AdminReports />;
    if (currentPath === '/admin/audit-logs') return <AdminAuditLogs />;
    if (currentPath === '/admin/settings') return <SettingsView />;

    // Default Fallback: Redirect based on role or home
    if (isAuthenticated) {
      if (role === 'doctor') return <DoctorDashboard onNavigate={navigate} />;
      if (role === 'admin') return <AdminDashboard onNavigate={navigate} />;
      return <PatientDashboard onNavigate={navigate} />;
    }
    return <LandingPage onNavigate={navigate} />;
  };

  const isPublicRoute =
    currentPath === '/' ||
    currentPath.startsWith('/features') ||
    currentPath.startsWith('/about') ||
    currentPath.startsWith('/security') ||
    currentPath.startsWith('/architecture') ||
    currentPath.startsWith('/login') ||
    currentPath.startsWith('/register') ||
    currentPath.startsWith('/forgot-password') ||
    currentPath.startsWith('/reset-password');

  // If public route or unauthenticated, show public full-width container
  if (isPublicRoute && !isAuthenticated) {
    return (
      <>
        {renderCurrentView()}
        <GlobalSearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onNavigate={navigate}
        />
      </>
    );
  }

  // Authenticated Dashboard Layout
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          currentPath={currentPath}
          onNavigate={navigate}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          unreadNotifsCount={unreadNotifsCount}
          unreadMsgsCount={unreadMsgsCount}
        />
      </div>

      {/* Mobile Sliding Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-950/60 backdrop-blur-xs flex">
          <div className="w-64 h-full bg-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar
              currentPath={currentPath}
              onNavigate={navigate}
              collapsed={false}
              onToggleCollapse={() => setMobileMenuOpen(false)}
              unreadNotifsCount={unreadNotifsCount}
              unreadMsgsCount={unreadMsgsCount}
            />
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Top Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        collapsed={sidebarCollapsed}
      />

      {/* Main Viewport Content Area */}
      <main
        className={`pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto w-full">
          {renderCurrentView()}
        </div>
      </main>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
