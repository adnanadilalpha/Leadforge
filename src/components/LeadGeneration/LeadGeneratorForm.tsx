import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { useStore } from '../../lib/store';
import { leadsApi } from '../../lib/api';
import type { Lead } from '../../types';
import { Sparkles } from 'lucide-react';
import { LeadsList } from '../Leads/LeadsList';

export function LeadGeneratorForm() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useStore();
  const { toast } = useToast();
  const [generatedLeads, setGeneratedLeads] = useState<Lead[]>([]);

  const generatePrompt = (preferences: any) => {
    const industries = preferences?.industries?.join(', ') || '';
    const projectTypes = preferences?.projectTypes?.join(', ') || '';
    const budget = preferences?.budgetRange 
      ? `with budget between $${preferences.budgetRange.min} and $${preferences.budgetRange.max}`
      : '';

    return `Find potential clients ${industries ? `in ${industries}` : ''} 
      ${projectTypes ? `looking for ${projectTypes}` : ''} 
      ${budget} who might need freelance services.
      Include specific company details, contact person, and potential project requirements.`;
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const basePrompt = prompt || generatePrompt(user?.settings?.leadPreferences);
      const leads = await leadsApi.generate(basePrompt);
      
      setGeneratedLeads(leads);
      toast({
        title: 'Leads Generated Successfully',
        description: `Generated ${leads.length} new leads based on your preferences`,
      });
      setPrompt('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate leads',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Lead Generator</h1>
            <p className="text-gray-400">Generate highly targeted leads based on your preferences</p>
          </div>
        </div>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Describe Your Ideal Client
                </label>
                <textarea
                  className="w-full h-32 p-3 bg-[#0F172A] border border-[#334155] rounded-lg text-white placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  placeholder={`Example: Tech startups in the US with 10-50 employees,
looking for web development and API integration services,
with a budget of $5,000-$20,000 per project.`}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Leave blank to use your saved preferences
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#334155]">
                <div className="text-sm text-gray-400">
                  {user?.settings?.leadPreferences?.industries?.length ? (
                    <div className="flex flex-wrap gap-2">
                      <span>Using preferences:</span>
                      {user.settings.leadPreferences.industries.map((industry: string) => (
                        <span
                          key={industry}
                          className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  ) : (
                    'No industry preferences set'
                  )}
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Leads
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#1E293B] border-[#334155]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Tips for Better Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Be specific about industry and location
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  Include company size and budget range
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                  Specify required technologies or services
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Add any specific exclusion criteria
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-[#1E293B] border-[#334155]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white">Your Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-300">
                <div>
                  <span className="text-sm text-gray-400">Industries:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user?.settings?.leadPreferences?.industries?.map((industry: string) => (
                      <span
                        key={industry}
                        className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Project Types:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user?.settings?.leadPreferences?.projectTypes?.map((type: string) => (
                      <span
                        key={type}
                        className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                {user?.settings?.leadPreferences?.budgetRange && (
                  <div>
                    <span className="text-sm text-gray-400">Budget Range:</span>
                    <p className="mt-1 text-green-400">
                      ${user.settings.leadPreferences.budgetRange.min.toLocaleString()} - 
                      ${user.settings.leadPreferences.budgetRange.max.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Show generated leads */}
          {generatedLeads.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Generated Leads</h2>
              <LeadsList leads={generatedLeads} showActions />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
