import React from 'react';
import { motion } from 'framer-motion';
import type { Campaign } from '../../lib/types';

interface CampaignMetricsProps {
  campaigns: Campaign[];
}

const CampaignMetrics = ({ campaigns }: CampaignMetricsProps) => {
  const getTotalStats = () => {
    return campaigns.reduce(
      (acc, campaign) => ({
        sent: acc.sent + campaign.stats.sent,
        opened: acc.opened + campaign.stats.opened,
        replied: acc.replied + campaign.stats.replied,
        converted: acc.converted + campaign.stats.converted,
      }),
      { sent: 0, opened: 0, replied: 0, converted: 0 }
    );
  };

  const getPerformanceMetrics = () => {
    const stats = getTotalStats();
    return {
      openRate: stats.sent ? ((stats.opened / stats.sent) * 100).toFixed(1) : 0,
      replyRate: stats.sent ? ((stats.replied / stats.sent) * 100).toFixed(1) : 0,
      conversionRate: stats.sent
        ? ((stats.converted / stats.sent) * 100).toFixed(1)
        : 0,
    };
  };

  const metrics = getPerformanceMetrics();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-lg p-6"
    >
      <h3 className="text-xl font-semibold mb-6">Campaign Performance</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-sm text-gray-400">Open Rate</p>
          <p className="text-2xl font-semibold text-blue-400">
            {metrics.openRate}%
          </p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-sm text-gray-400">Reply Rate</p>
          <p className="text-2xl font-semibold text-green-400">
            {metrics.replyRate}%
          </p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-sm text-gray-400">Conversion Rate</p>
          <p className="text-2xl font-semibold text-pink-400">
            {metrics.conversionRate}%
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold mb-4">Recent Campaigns</h4>
        <div className="space-y-4">
          {campaigns.slice(0, 3).map((campaign) => (
            <div
              key={campaign.id}
              className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{campaign.name}</p>
                <p className="text-sm text-gray-400">
                  {campaign.stats.sent} emails sent
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">
                  {((campaign.stats.opened / campaign.stats.sent) * 100).toFixed(1)}% opened
                </p>
                <p className="text-sm text-green-400">
                  {campaign.stats.converted} converted
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignMetrics;