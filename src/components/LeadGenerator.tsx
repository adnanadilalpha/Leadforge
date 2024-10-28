import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader, Search, Filter } from 'lucide-react';
import { useStore } from '../lib/store';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'react-toastify';

const searchSchema = z.object({
  prompt: z.string().min(10, 'Please provide a more detailed description'),
  industry: z.string().optional(),
  location: z.string().optional(),
  companySize: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const LeadGenerator = () => {
  const { generateLeads, leads, isLoading, error, addLeadToList, removeLead } = useStore();
  const [showFilters, setShowFilters] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SearchForm>();

  const onSubmit = async (data: SearchForm) => {
    try {
      const prompt = `Find ${data.industry ? data.industry + ' ' : ''}companies
        ${data.location ? 'in ' + data.location : ''}
        ${data.companySize ? 'with ' + data.companySize + ' employees' : ''}
        ${data.prompt}`;
      
      await generateLeads(prompt);
      reset();
    } catch (error) {
      console.error('Failed to generate leads:', error);
    }
  };

  const handleAddToList = async (leadId: string) => {
    try {
      setActionLoading(leadId);
      await addLeadToList(leadId);
      toast.success('Lead added to list');
    } catch (error) {
      toast.error('Failed to add lead to list');
      console.error('Failed to add lead to list:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveLead = async (leadId: string) => {
    try {
      setActionLoading(leadId);
      await removeLead(leadId);
      toast.success('Lead removed');
    } catch (error) {
      toast.error('Failed to remove lead');
      console.error('Failed to remove lead:', error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Generate Leads</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <textarea
              {...register('prompt')}
              placeholder="Describe your ideal client (e.g., 'Find tech startups that need UI/UX design services')"
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white placeholder-gray-500 min-h-[120px]"
            />
            {errors.prompt && (
              <p className="text-red-400 text-sm mt-1">{errors.prompt.message}</p>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Industry
                </label>
                <input
                  {...register('industry')}
                  placeholder="e.g., Technology"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Location
                </label>
                <input
                  {...register('location')}
                  placeholder="e.g., San Francisco"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Company Size
                </label>
                <select
                  {...register('companySize')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white"
                >
                  <option value="">Any size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501+">501+ employees</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <Filter size={16} />
              Filters
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Generate Leads
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {leads.map((lead) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div>
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      {lead.companyName}
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                        lead.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                        lead.status === 'responded' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {lead.status}
                      </span>
                      {lead.verificationDate && (
                        <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2 text-gray-400 mt-1">
                      <span className="font-medium">{lead.contactName}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-500">{lead.contactTitle}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <a 
                      href={`mailto:${lead.email}`} 
                      className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {lead.email}
                    </a>
                    <span className="text-gray-500">{lead.industry}</span>
                    <span className="text-gray-500">{lead.employeeCount} employees</span>
                  </div>

                  {/* Social Links */}
                  {lead.socialProfiles && (
                    <div className="flex flex-wrap gap-3">
                      {lead.socialProfiles.contactLinkedIn && (
                        <a
                          href={lead.socialProfiles.contactLinkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/5 px-2.5 py-1 rounded-md"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                          </svg>
                          Profile
                        </a>
                      )}
                      {lead.socialProfiles.companyLinkedIn && (
                        <a
                          href={lead.socialProfiles.companyLinkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/5 px-2.5 py-1 rounded-md"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                          </svg>
                          Company
                        </a>
                      )}
                      {lead.socialProfiles.twitter && (
                        <a
                          href={lead.socialProfiles.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/5 px-2.5 py-1 rounded-md"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                          </svg>
                          Twitter
                        </a>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleAddToList(lead.id)}
                      disabled={actionLoading === lead.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                    >
                      {actionLoading === lead.id ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                      Add to List
                    </button>
                    <button
                      onClick={() => handleRemoveLead(lead.id)}
                      disabled={actionLoading === lead.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                    >
                      {actionLoading === lead.id ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadGenerator;
