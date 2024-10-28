import React from 'react';
import { Send } from 'lucide-react';

interface CommandBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const CommandBar = ({ value, onChange, placeholder }: CommandBarProps) => {
  return (
    <div className="relative max-w-2xl mx-auto">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-6 py-4 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white placeholder-gray-500 pr-12"
      />
      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CommandBar;