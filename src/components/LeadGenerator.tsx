import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import type { Lead } from '../types';
import { leadsApi } from '../lib/api';

export function LeadGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a search criteria',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsGenerating(true);
      const leads = await leadsApi.generate(prompt);
      toast({
        title: 'Success',
        description: `Generated ${leads.length} new leads`,
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
        <h1 className="text-2xl font-bold mb-6">AI Lead Generator</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Criteria
            </label>
            <textarea
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your ideal leads (e.g., 'Tech startups in California with 10-50 employees, focused on AI/ML')"
            />
          </div>
          
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate Leads'}
          </Button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Tips for better results:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Be specific about industry, location, and company size</li>
            <li>Include relevant technologies or services</li>
            <li>Specify decision-maker roles you want to target</li>
            <li>Add any specific exclusion criteria</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
