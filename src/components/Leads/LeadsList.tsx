import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Star, Mail, Phone, Calendar } from 'lucide-react';
import type { Lead } from '../../types';
import { Link } from 'react-router-dom';

interface LeadsListProps {
  leads: Lead[];
  selectedLeads?: string[];
  onSelectLead?: (leadId: string) => void;
  onToggleFavorite?: (leadId: string) => void;
  showActions?: boolean;
  isLoading?: boolean;
}

export function LeadsList({
  leads,
  selectedLeads = [],
  onSelectLead,
  onToggleFavorite,
  showActions = false,
  isLoading = false
}: LeadsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-lg text-gray-400">Loading leads...</div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No leads found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map(lead => (
        <Card key={lead.id} className="hover:shadow-lg transition-shadow">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {onSelectLead && (
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => onSelectLead(lead.id)}
                    className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">
                      {lead.firstName} {lead.lastName}
                    </h3>
                    {lead.isFavorite && (
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{lead.company}</p>
                  <div className="mt-1 flex items-center gap-4">
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3" />
                      {lead.email}
                    </a>
                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {showActions && (
                <div className="flex items-center gap-2">
                  {onToggleFavorite && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onToggleFavorite(lead.id)}
                      className={lead.isFavorite ? 'text-yellow-400' : 'text-gray-400'}
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Link to={`/leads/${lead.id}`}>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {lead.notes && (
              <p className="mt-2 text-sm text-gray-400 border-t border-[#334155] pt-2">
                {lead.notes}
              </p>
            )}

            {lead.nextFollowUpDate && (
              <div className="mt-2 flex items-center gap-1 text-sm text-blue-400">
                <Calendar className="h-3 w-3" />
                Follow up: {new Date(lead.nextFollowUpDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
