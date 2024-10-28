'use client';

import { useEffect, useState } from 'react';
import { Card, Grid, Text, Metric, Title, DonutChart } from '@tremor/react';
import { Lead } from '@/types';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const leadsByStatus = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6">
      <Title>Dashboard</Title>
      
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6 mt-6">
        <Card>
          <Text>Total Leads</Text>
          <Metric>{leads.length}</Metric>
        </Card>
        <Card>
          <Text>Conversion Rate</Text>
          <Metric>
            {((leads.filter(l => l.status === 'converted').length / leads.length) * 100).toFixed(1)}%
          </Metric>
        </Card>
        <Card>
          <Text>Active Leads</Text>
          <Metric>{leads.filter(l => l.status !== 'lost' && l.status !== 'converted').length}</Metric>
        </Card>
      </Grid>

      <div className="mt-6">
        <Card>
          <Title>Leads by Status</Title>
          <DonutChart
            className="mt-6"
            data={Object.entries(leadsByStatus).map(([name, value]) => ({
              name,
              value,
            }))}
            category="value"
            index="name"
          />
        </Card>
      </div>
    </div>
  );
}
