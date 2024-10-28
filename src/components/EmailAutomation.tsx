import { Mail } from 'lucide-react';
import { useStore } from '../lib/store';
import { aiService } from '../lib/ai';
import { useState } from 'react';
import { motion } from 'framer-motion';

const EmailAutomation = () => {
  const { leads, campaigns, addCampaign, user } = useStore();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [campaignName, setCampaignName] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleCreateCampaign = async () => {
    if (!selectedLeads.length || !user) return;
    
    setGenerating(true);
    try {
      const lead = leads.find(l => l.id === selectedLeads[0]);
      if (!lead) throw new Error('Selected lead not found');

      const emailTemplate = await aiService.generateEmail(lead, user);

      await addCampaign({
        name: campaignName,
        status: 'active',
        leads: selectedLeads,
        emailTemplate,
        stats: { sent: 0, opened: 0, replied: 0, converted: 0 },
        userId: user.id,
        createdAt: new Date().toISOString()
      });

      setCampaignName('');
      setSelectedLeads([]);
    } catch (error) {
      console.error('Failed to create campaign:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Email Automation</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Create Campaign</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 outline-none"
                placeholder="e.g., March Outreach"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Leads
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {leads.map((lead) => (
                  <label key={lead.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={(e) => {
                        setSelectedLeads(
                          e.target.checked
                            ? [...selectedLeads, lead.id]
                            : selectedLeads.filter(id => id !== lead.id)
                        );
                      }}
                      className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-300">{lead.companyName}</span>
                  </label>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateCampaign}
              disabled={generating || !campaignName || selectedLeads.length === 0}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Mail className="w-5 h-5" />
              Create Campaign
            </motion.button>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Active Campaigns</h3>
          
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                whileHover={{ y: -2 }}
                className="bg-gray-700/50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{campaign.name}</h4>
                  <span className="text-sm text-green-400">
                    {campaign.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm text-gray-400">
                  <div>
                    <p className="text-xs">Sent</p>
                    <p className="font-semibold text-white">
                      {campaign.stats.sent}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs">Opened</p>
                    <p className="font-semibold text-white">
                      {campaign.stats.opened}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs">Replied</p>
                    <p className="font-semibold text-white">
                      {campaign.stats.replied}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs">Converted</p>
                    <p className="font-semibold text-white">
                      {campaign.stats.converted}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAutomation;
