import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui';
import { useToast } from '../ui/use-toast';
import { Mail, Phone, Building, Calendar, Tag, Star, ArrowLeft } from 'lucide-react';
import type { Lead } from '../../types';
import { leadsApi } from '../../lib/api';
import { useStore } from '../../lib/store';

export function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = React.useState<Lead | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const { user } = useStore();

  React.useEffect(() => {
    const fetchLead = async () => {
      try {
        if (!id) return;
        const data = await leadsApi.getById(id);
        setLead(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load lead details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleStatusUpdate = async (newStatus: Lead['status']) => {
    try {
      if (!lead) return;
      await leadsApi.update(lead.id, { status: newStatus });
      setLead({ ...lead, status: newStatus });
      toast({
        title: 'Status Updated',
        description: `Lead status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (!lead) return;
      await leadsApi.toggleFavorite(lead.id);
      setLead({ ...lead, isFavorite: !lead.isFavorite });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorite status',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-400">Loading lead details...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Lead not found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-white">Lead Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl text-white">
                {lead.firstName} {lead.lastName}
              </CardTitle>
              <p className="text-sm text-gray-400">{lead.company}</p>
            </div>
            <Button
              variant="ghost"
              onClick={handleToggleFavorite}
              className={lead.isFavorite ? 'text-yellow-400' : 'text-gray-400'}
            >
              <Star className="h-5 w-5" fill={lead.isFavorite ? 'currentColor' : 'none'} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${lead.email}`} className="hover:text-white">
                    {lead.email}
                  </a>
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${lead.phone}`} className="hover:text-white">
                      {lead.phone}
                    </a>
                  </div>
                )}
              </div>

              {lead.company && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Building className="h-4 w-4" />
                  <span>{lead.company}</span>
                </div>
              )}

              {lead.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {lead.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {lead.notes && (
                <div className="mt-4 p-4 rounded-lg bg-[#2D3B4E]">
                  <h4 className="font-medium text-white mb-2">Notes</h4>
                  <p className="text-gray-400">{lead.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status and Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['new', 'contacted', 'qualified', 'proposal', 'converted', 'lost'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status as Lead['status'])}
                    className={`w-full px-4 py-2 rounded-lg border text-left capitalize ${
                      lead.status === status
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-[#334155] text-gray-400 hover:border-blue-500/50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => {}}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full" onClick={() => {}}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Follow-up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Add default export
export default LeadDetailPage;
