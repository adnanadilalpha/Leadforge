import React from 'react';
import { useStore } from '../lib/store';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { LineChart, BarChart } from './ui/charts';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import type { Lead } from '../types';
import { leadsApi } from '../lib/api';

export function FreelancerDashboard() {
  const { user } = useStore();
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const leadsData = await leadsApi.getAll();
        setLeads(leadsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const potentialRevenue = leads
    .filter(lead => lead.status !== 'lost')
    .reduce((total, lead) => total + (lead.budget?.min || 0), 0);

  const activeLeads = leads.filter(
    lead => ['new', 'contacted', 'qualified'].includes(lead.status)
  );

  const followUpsNeeded = leads.filter(lead => {
    if (!lead.nextFollowUpDate) return false;
    const followUpDate = new Date(lead.nextFollowUpDate);
    return followUpDate <= new Date();
  });

  // Prepare chart data
  const leadsByStatus = Object.entries(
    leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const leadsBySource = Object.entries(
    leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-400 mt-1">
            Here's your freelance business overview
          </p>
        </div>
        <Button
          onClick={() => window.location.href = '/generate'}
          className="bg-gradient-to-r from-blue-500 to-purple-600"
        >
          Generate Leads
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-400">Total Leads</h3>
            <p className="text-3xl font-bold text-white mt-2">{leads.length}</p>
            <p className="text-sm text-gray-500 mt-1">Active: {activeLeads.length}</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-400">Potential Revenue</h3>
            <p className="text-3xl font-bold text-white mt-2">
              ${potentialRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">From active leads</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-400">Follow-ups</h3>
            <p className="text-3xl font-bold text-white mt-2">{followUpsNeeded.length}</p>
            <p className="text-sm text-gray-500 mt-1">Due today</p>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-full -mr-16 -mt-16" />
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-400">Conversion Rate</h3>
            <p className="text-3xl font-bold text-white mt-2">
              {leads.length ? 
                ((leads.filter(l => l.status === 'converted').length / leads.length) * 100).toFixed(1) 
                : '0'}%
            </p>
            <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.slice(0, 5).map(lead => (
                <div
                  key={lead.id}
                  className="flex justify-between items-center p-4 rounded-lg bg-[#2D3B4E] hover:bg-[#3D4B5E] transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-white">{lead.firstName} {lead.lastName}</h4>
                    <p className="text-sm text-gray-400">{lead.projectType}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">${lead.budget?.min || 0}</p>
                    <p className="text-sm text-gray-400">{lead.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Lead Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={leadsBySource}
              height={300}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FreelancerDashboard;
