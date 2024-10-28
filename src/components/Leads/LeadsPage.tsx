import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui';
import { useToast } from '../ui/use-toast';
import { Plus, FolderPlus, Star, Search } from 'lucide-react';
import { LeadsList } from './LeadsList';
import { CreateLeadGroupDialog } from './CreateLeadGroupDialog';
import type { Lead, LeadGroup } from '../../types';
import { leadsApi } from '../../lib/api';

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [groups, setGroups] = useState<LeadGroup[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
    fetchGroups();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await leadsApi.getAll();
      setLeads(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load leads',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const data = await leadsApi.getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const handleCreateGroup = async (name: string) => {
    try {
      await leadsApi.createGroup(name, selectedLeads);
      toast({
        title: 'Success',
        description: 'Lead group created successfully',
      });
      fetchGroups();
      setSelectedLeads([]);
      setIsCreateGroupOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create group',
        variant: 'destructive',
      });
    }
  };

  const handleToggleFavorite = async (leadId: string) => {
    try {
      await leadsApi.toggleFavorite(leadId);
      fetchLeads(); // Refresh leads to get updated favorite status
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorite status',
        variant: 'destructive',
      });
    }
  };

  const filteredLeads = leads.filter(lead => {
    const searchLower = searchQuery.toLowerCase();
    return (
      lead.firstName.toLowerCase().includes(searchLower) ||
      lead.lastName.toLowerCase().includes(searchLower) ||
      lead.company?.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Leads Management</h1>
        <div className="flex gap-3">
          <Button
            onClick={() => window.location.href = '/generate'}
            className="bg-gradient-to-r from-blue-500 to-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate Leads
          </Button>
          <Button
            onClick={() => setIsCreateGroupOpen(true)}
            disabled={selectedLeads.length === 0}
            variant="secondary"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with groups */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Lead Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              {groups.map(group => (
                <button
                  key={group.id}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#2D3B4E] transition-colors"
                >
                  {group.name}
                  <span className="text-sm text-gray-400 ml-2">
                    ({group.leadIds.length})
                  </span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and filters */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                />
              </div>
            </CardContent>
          </Card>

          {/* Leads list */}
          <LeadsList
            leads={filteredLeads}
            selectedLeads={selectedLeads}
            onSelectLead={(leadId) => {
              setSelectedLeads(prev => 
                prev.includes(leadId)
                  ? prev.filter(id => id !== leadId)
                  : [...prev, leadId]
              );
            }}
            onToggleFavorite={handleToggleFavorite}
            showActions
            isLoading={isLoading}
          />
        </div>
      </div>

      <CreateLeadGroupDialog
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onCreate={handleCreateGroup}
      />
    </div>
  );
}
