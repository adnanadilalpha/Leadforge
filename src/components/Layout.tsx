import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  Settings,
  LogOut
} from 'lucide-react';
import { useStore } from '../lib/store';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/generate', icon: Users, label: 'Generate Leads' },
  { path: '/email', icon: Mail, label: 'Email Automation' },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { logout, user } = useStore();

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <nav className="w-64 border-r border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-8">
          <span className="font-bold text-xl">LeadForge AI</span>
        </div>

        <div className="mb-4">
          <div className="px-4 py-2">
            <p className="text-sm text-gray-400">Welcome back,</p>
            <p className="font-semibold">{user?.name}</p>
          </div>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                    isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <Link to="/settings">
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Settings className="w-5 h-5" />
              Settings
            </motion.div>
          </Link>
          <motion.button
            whileHover={{ x: 4 }}
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </motion.button>
        </div>
      </nav>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};