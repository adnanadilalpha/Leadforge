import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../ui';
import { useToast } from '../ui/use-toast';
import { Mail, Building, Calendar, Tag, Star, ArrowLeft, Globe, Send } from 'lucide-react';
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

  // Updated parseNotes function to handle the string format
  const parseNotes = (notes: string) => {
    // Split by spaces and newlines to handle both formats
    const parts = notes.split(/[\s\n]+/);
    
    // Find indices of key markers
    const evidenceIndex = parts.indexOf('Evidence:');
    const companyNewsIndex = parts.indexOf('Company');
    const jobPostingsIndex = parts.indexOf('Job');
    const lastVerifiedIndex = parts.indexOf('Last');
    const linkedInIndex = parts.indexOf('LinkedIn:');
    const websiteIndex = parts.indexOf('Website:');

    // Extract values between markers
    const evidence = evidenceIndex >= 0 && companyNewsIndex >= 0 
      ? parts.slice(evidenceIndex + 1, companyNewsIndex).join(' ')
      : '';

    const companyNews = companyNewsIndex >= 0 && jobPostingsIndex >= 0
      ? parts.slice(companyNewsIndex + 2, jobPostingsIndex).join(' ')
      : '';

    const jobPostings = jobPostingsIndex >= 0 && lastVerifiedIndex >= 0
      ? parts.slice(jobPostingsIndex + 2, lastVerifiedIndex).join(' ')
      : '';

    const lastVerified = lastVerifiedIndex >= 0 && linkedInIndex >= 0
      ? parts.slice(lastVerifiedIndex + 2, linkedInIndex).join(' ')
      : '';

    const linkedInUrl = linkedInIndex >= 0 && websiteIndex >= 0
      ? parts.slice(linkedInIndex + 1, websiteIndex).join(' ')
      : '';

    const websiteUrl = websiteIndex >= 0
      ? parts.slice(websiteIndex + 1).join(' ')
      : '';

    return {
      evidence,
      companyNews,
      jobPostings,
      lastVerified,
      linkedInUrl,
      websiteUrl
    };
  };

  if (!lead) return null;

  const { evidence, companyNews, jobPostings, lastVerified, linkedInUrl, websiteUrl } = parseNotes(lead.notes || '');

  return (
    <div className="p-6">
      {/* Header */}
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
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Card */}
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {lead.firstName} {lead.lastName}
                  </h2>
                  <p className="text-gray-400 mt-1">{lead.title}</p>
                </div>
                <Button
                  variant="ghost"
                  className={lead.isFavorite ? 'text-yellow-400' : 'text-gray-400'}
                >
                  <Star className="h-5 w-5" fill={lead.isFavorite ? 'currentColor' : 'none'} />
                </Button>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                  <Building className="h-5 w-5" />
                  <span>{lead.company}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="h-5 w-5" />
                  <a href={`mailto:${lead.email}`} className="hover:text-white">
                    {lead.email}
                  </a>
                </div>
                {lead.website && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <Globe className="h-5 w-5" />
                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      {lead.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {lead.companySize && (
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
                    {lead.companySize}
                  </span>
                )}
                {lead.industry && (
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm">
                    {lead.industry}
                  </span>
                )}
              </div>

              {/* Project Details */}
              {lead.projectType && (
                <div className="mt-6 p-4 rounded-lg bg-[#0F172A] border border-[#334155]">
                  <h3 className="text-sm font-semibold text-blue-400 mb-2">Project Details</h3>
                  <p className="text-gray-300 mb-3">{lead.projectType}</p>
                  {lead.requirements && (
                    <p className="text-gray-400 text-sm">{lead.requirements}</p>
                  )}
                  {lead.budget && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm text-gray-400">Budget:</span>
                      <span className="text-green-400">
                        ${lead.budget.min.toLocaleString()} - ${lead.budget.max.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Research & Verification Card */}
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Research & Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Evidence Section */}
                <div className="rounded-lg bg-[#0F172A] p-4 border border-[#334155]">
                  <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Evidence
                  </h3>
                  <a 
                    href={evidence}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white block"
                  >
                    {evidence}
                  </a>
                </div>

                {/* Company News Section */}
                <div className="rounded-lg bg-[#0F172A] p-4 border border-[#334155]">
                  <h3 className="text-sm font-semibold text-purple-400 mb-2 flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
                      />
                    </svg>
                    Company News
                  </h3>
                  <a 
                    href={companyNews}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white block"
                  >
                    {companyNews}
                  </a>
                </div>

                {/* Job Postings Section */}
                <div className="rounded-lg bg-[#0F172A] p-4 border border-[#334155]">
                  <h3 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Job Postings
                  </h3>
                  <a 
                    href={jobPostings}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white block"
                  >
                    {jobPostings}
                  </a>
                </div>

                {/* Verification Info */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#0F172A] rounded-lg border border-[#334155]">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-yellow-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm text-gray-400">Last Verified:</span>
                  </div>
                  <span className="text-sm text-yellow-400">
                    {lastVerified}
                  </span>
                </div>

                {/* Social Links */}
                <div className="flex flex-col gap-2 mt-4">
                  {linkedInUrl && (
                    <a
                      href={linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn Profile
                    </a>
                  )}
                  {websiteUrl && (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                    >
                      <Globe className="h-4 w-4" />
                      Company Website
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <Card className="bg-[#1E293B] border-[#334155]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lead Status */}
          <Card className="bg-[#1E293B] border-[#334155]">
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

          {/* Quick Actions */}
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LeadDetailPage;
