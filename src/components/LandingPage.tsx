import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Rocket, Target, Zap } from 'lucide-react';
import { useStore } from '../lib/store';
import AuthModal from './AuthModal';

const LandingPage = () => {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login',
  });

  const features = [
    {
      icon: <Target className="w-6 h-6 text-blue-400" />,
      title: 'AI-Powered Lead Generation',
      description: 'Find your ideal clients with our intelligent lead generation system.',
    },
    {
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      title: 'Automated Outreach',
      description: 'Personalized email campaigns that convert leads into clients.',
    },
    {
      icon: <Rocket className="w-6 h-6 text-pink-400" />,
      title: 'Smart Analytics',
      description: 'Track and optimize your outreach performance in real-time.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <nav className="fixed w-full bg-gray-900/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-400" />
              <span className="font-bold text-xl">LeadForge AI</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg font-semibold"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Generate Leads with
              <span className="gradient-text"> AI Magic</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              Automate your client outreach with AI-powered lead generation and smart email campaigns.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-lg font-semibold text-lg"
            >
              Start Free Trial
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 3) }}
                className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-700/50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
      />
    </div>
  );
};

export default LandingPage;