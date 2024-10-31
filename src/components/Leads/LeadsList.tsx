import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Star, Mail, Link as LinkIcon, Building, Globe, Tag, ChevronRight } from 'lucide-react';
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
    <div className="space-y-1">
      {leads.map(lead => (
        <Card key={lead.id} className="hover:bg-[#1E293B] transition-colors bg-[#1E293B]/50 border-[#334155]">
          <div className="p-4">
            <div className="flex items-start gap-4">
              {/* Selection checkbox */}
              {onSelectLead && (
                <div className="pt-1">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => onSelectLead(lead.id)}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Main content */}
              <div className="flex-1">
                {/* Name and title */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {lead.firstName} {lead.lastName}
                    </h3>
                    <p className="text-sm text-gray-400">{lead.title || 'No title'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {onToggleFavorite && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onToggleFavorite(lead.id)}
                        className={lead.isFavorite ? 'text-yellow-400' : 'text-gray-400'}
                      >
                        <Star className="h-4 w-4" fill={lead.isFavorite ? 'currentColor' : 'none'} />
                      </Button>
                    )}
                    <Link to={`/leads/${lead.id}`}>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Company and contact info */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Building className="h-4 w-4" />
                    <span>{lead.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${lead.email}`} className="hover:text-white">
                      {lead.email}
                    </a>
                  </div>
                  {lead.website && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <Globe className="h-4 w-4" />
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                        {lead.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Company details */}
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                  {lead.companySize && (
                    <span>{lead.companySize}</span>
                  )}
                  {lead.industry && (
                    <span>{lead.industry}</span>
                  )}
                </div>

                {/* Project details */}
                {lead.projectType && (
                  <div className="mt-3 p-3 rounded bg-[#2D3B4E]">
                    <h4 className="font-medium text-white mb-1">{lead.projectType}</h4>
                    {lead.budget && (
                      <p className="text-green-400 text-sm">
                        Budget: ${lead.budget.min.toLocaleString()} - ${lead.budget.max.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Tags */}
                {lead.tags && lead.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {lead.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
