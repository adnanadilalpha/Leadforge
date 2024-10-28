import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../lib/store';
import { 
  LayoutGrid, 
  Users, 
  Mail, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutGrid },
    { name: 'Lead Generation', href: '/generate', icon: Sparkles },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Email Campaigns', href: '/email', icon: Mail },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 
        bg-[#1E293B] border-r border-[#334155] hidden lg:block">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-[#334155]">
          <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <span className="font-bold text-xl">L</span>
          </div>
          <span className="font-bold text-xl">LeadForge</span>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${location.pathname === item.href 
                    ? 'bg-blue-500/10 text-blue-500' 
                    : 'text-gray-400 hover:bg-[#2D3B4E] hover:text-white'}`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-500 font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
            <button
              onClick={() => logout()}
              className="p-1 rounded-lg hover:bg-[#2D3B4E] text-gray-400 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1E293B] border-b border-[#334155]">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="font-bold text-xl">L</span>
            </div>
            <span className="font-bold text-xl">LeadForge</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-[#2D3B4E]"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-[#1E293B] p-4">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${location.pathname === item.href 
                        ? 'bg-blue-500/10 text-blue-500' 
                        : 'text-gray-400 hover:bg-[#2D3B4E] hover:text-white'}`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen p-4 lg:p-8 pt-20 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
