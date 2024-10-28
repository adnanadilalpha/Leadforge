import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { Card, CardHeader, CardTitle, CardContent, Button } from './ui';
import { useToast } from './ui/use-toast';
import { Mail, Send, Clock, Settings } from 'lucide-react';
import type { Campaign, Lead } from '../types';
import { campaignsApi, leadsApi, emailApi } from '../lib/api';

export function EmailCampaign() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [emailTemplate, setEmailTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useStore();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsData, leadsData] = await Promise.all([
          campaignsApi.getAll(),
          leadsApi.getAll()
        ]);
        setCampaigns(campaignsData);
        setLeads(leadsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load campaigns and leads',
          variant: 'destructive',
        });
      }
    };

    fetchData();
  }, []);

  const handleCreateCampaign = async () => {
    try {
      setIsLoading(true);
      const campaign = await campaignsApi.create({
        name: 'New Campaign',
        status: 'draft',
        type: 'email',
        userId: user!.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setCampaigns([...campaigns, campaign]);
      toast({
        title: 'Success',
        description: 'Campaign created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create campaign',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Email Campaigns</h1>
          <p className="text-gray-400">Create and manage your email campaigns</p>
        </div>
        <Button
          onClick={handleCreateCampaign}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-purple-600"
        >
          <Mail className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaigns List */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map(campaign => (
                <div
                  key={campaign.id}
                  className="p-4 rounded-lg bg-[#2D3B4E] hover:bg-[#3D4B5E] transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-white">{campaign.name}</h3>
                      <p className="text-sm text-gray-400">
                        Status: {campaign.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        disabled={selectedLeads.length === 0}
                        className="bg-gradient-to-r from-blue-500 to-purple-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {campaigns.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No campaigns yet. Create your first campaign to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Leads Selection */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white">Select Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.map(lead => (
                <div
                  key={lead.id}
                  className="flex items-center p-4 rounded-lg bg-[#2D3B4E] hover:bg-[#3D4B5E] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLeads([...selectedLeads, lead.id]);
                      } else {
                        setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                      }
                    }}
                    className="mr-4 h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                  <div>
                    <h3 className="font-semibold text-white">
                      {lead.firstName} {lead.lastName}
                    </h3>
                    <p className="text-sm text-gray-400">{lead.email}</p>
                  </div>
                </div>
              ))}

              {leads.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No leads available. Generate some leads first.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Template Editor */}
      {emailTemplate && (
        <Card className="mt-6 bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white">Email Template</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              className="w-full h-64 p-4 bg-[#0F172A] border border-[#334155] rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
