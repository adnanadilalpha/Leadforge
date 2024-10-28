import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import type { Lead } from '../../lib/types';

interface LeadAnalyticsProps {
  leads: Lead[];
  dateRange: 'week' | 'month' | 'year';
}

const LeadAnalytics = ({ leads, dateRange }: LeadAnalyticsProps) => {
  const getChartData = () => {
    const now = new Date();
    const data = [];
    const days = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 365;

    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = format(date, 'MMM dd');
      
      const dayLeads = leads.filter(
        (lead) => format(new Date(lead.createdAt), 'MMM dd') === dateStr
      );

      data.unshift({
        date: dateStr,
        total: dayLeads.length,
        contacted: dayLeads.filter((l) => l.status === 'contacted').length,
        converted: dayLeads.filter((l) => l.status === 'converted').length,
      });
    }

    return data;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-lg p-6"
    >
      <h3 className="text-xl font-semibold mb-6">Lead Generation Overview</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#F3F4F6',
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#60A5FA"
              strokeWidth={2}
              dot={false}
              name="Total Leads"
            />
            <Line
              type="monotone"
              dataKey="contacted"
              stroke="#34D399"
              strokeWidth={2}
              dot={false}
              name="Contacted"
            />
            <Line
              type="monotone"
              dataKey="converted"
              stroke="#F472B6"
              strokeWidth={2}
              dot={false}
              name="Converted"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-sm text-gray-400">Total Leads</p>
          <p className="text-2xl font-semibold text-blue-400">
            {leads.length}
          </p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-sm text-gray-400">Contacted</p>
          <p className="text-2xl font-semibold text-green-400">
            {leads.filter((l) => l.status === 'contacted').length}
          </p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-sm text-gray-400">Converted</p>
          <p className="text-2xl font-semibold text-pink-400">
            {leads.filter((l) => l.status === 'converted').length}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LeadAnalytics;