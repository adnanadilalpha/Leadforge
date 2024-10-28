import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../lib/store';
import { format } from 'date-fns';

const Dashboard = () => {
  const { leads, campaigns } = useStore();

  const leadsByStatus = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentActivity = [
    ...leads.map(lead => ({
      type: 'lead',
      date: new Date(lead.lastContact),
      title: `New lead: ${lead.companyName}`,
    })),
    ...campaigns.map(campaign => ({
      type: 'campaign',
      date: new Date(),
      title: `Campaign: ${campaign.name}`,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())
   .slice(0, 5);

  const chartData = Array.from({ length: 7 }, (_, i) => ({
    date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'MMM dd'),
    leads: Math.floor(Math.random() * 10),
    responses: Math.floor(Math.random() * 5),
  })).reverse();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {Object.entries(leadsByStatus).map(([status, count]) => (
          <motion.div
            key={status}
            whileHover={{ y: -2 }}
            className="bg-gray-800/50 rounded-lg p-6"
          >
            <h3 className="text-gray-400 mb-2 capitalize">{status} Leads</h3>
            <p className="text-3xl font-bold">{count}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Lead Generation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#60A5FA" />
                <Line type="monotone" dataKey="responses" stroke="#34D399" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'lead' ? 'bg-blue-400' : 'bg-purple-400'
                }`} />
                <div>
                  <p className="text-sm text-gray-300">{activity.title}</p>
                  <p className="text-xs text-gray-500">
                    {format(activity.date, 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;