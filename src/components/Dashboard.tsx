import React from 'react';
import { useStore } from '../lib/store';
import { Card, CardHeader, CardTitle, CardContent, Button, useToast } from '../components/ui';
import { LineChart, BarChart } from '../components/ui/charts';
import type { Lead, Campaign } from '../types';
import { leadsApi, campaignsApi } from '../lib/api';

export function Dashboard() {
  const { user } = useStore();
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsData, campaignsData] = await Promise.all([
          leadsApi.getAll(),
          campaignsApi.getAll()
        ]);
        setLeads(leadsData);
        setCampaigns(campaignsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const leadsByStatus = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const leadsBySource = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold">Total Leads</h3>
            <p className="text-3xl font-bold">{leads.length}</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold">Active Campaigns</h3>
            <p className="text-3xl font-bold">
              {campaigns.filter(c => c.status === 'active').length}
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold">Conversion Rate</h3>
            <p className="text-3xl font-bold">
              {((leads.filter(l => l.status === 'converted').length / leads.length) * 100).toFixed(1)}%
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold">New Leads (30d)</h3>
            <p className="text-3xl font-bold">
              {leads.filter(l => {
                const date = new Date(l.createdAt);
                return date >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
              }).length}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Leads by Status</h3>
            <BarChart
              data={Object.entries(leadsByStatus).map(([status, count]) => ({
                name: status,
                value: count
              }))}
            />
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Leads by Source</h3>
            <BarChart
              data={Object.entries(leadsBySource).map(([source, count]) => ({
                name: source,
                value: count
              }))}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

// Add default export
export default Dashboard;
