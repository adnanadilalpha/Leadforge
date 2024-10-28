import React from 'react';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  avatar: string;
  name: string;
  role: string;
  quote: string;
}

const TestimonialCard = ({ avatar, name, role, quote }: TestimonialCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 rounded-xl bg-gray-800/50 border border-gray-700"
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={avatar}
          alt={name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-gray-400 text-sm">{role}</div>
        </div>
      </div>
      <p className="text-gray-300 italic">&ldquo;{quote}&rdquo;</p>
    </motion.div>
  );
};

export default TestimonialCard;