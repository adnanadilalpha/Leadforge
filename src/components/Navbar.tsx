import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-gray-900/80 backdrop-blur-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-400" />
            <span className="font-bold text-xl">LeadForge AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-300 hover:text-white transition-colors">
              Sign In
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg font-semibold"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;