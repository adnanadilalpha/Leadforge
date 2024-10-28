import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { Card, CardHeader, CardTitle, CardContent, Button, useToast } from '../components/ui';
import type { FreelancerSettings } from '../types';
import { Settings, User, Target, Loader2 } from 'lucide-react';

export function FreelancerSettings() {
  const { user, updateSettings } = useStore();
  const [settings, setSettings] = useState<FreelancerSettings>({
    hourlyRate: 0,
    availability: 'available',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferredCommunication: 'email',
    autoResponder: false,
    leadPreferences: {
      industries: [],
      projectTypes: [],
      budgetRange: {
        min: 0,
        max: 0
      }
    }
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.settings) {
      setSettings(user.settings);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateSettings(settings);
      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMinBudgetChange = (value: string) => {
    setSettings({
      ...settings,
      leadPreferences: {
        ...settings.leadPreferences,
        budgetRange: {
          min: Number(value),
          max: settings.leadPreferences?.budgetRange?.max || 0
        }
      }
    });
  };

  const handleMaxBudgetChange = (value: string) => {
    setSettings({
      ...settings,
      leadPreferences: {
        ...settings.leadPreferences,
        budgetRange: {
          min: settings.leadPreferences?.budgetRange?.min || 0,
          max: Number(value)
        }
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Settings className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Customize your lead generation preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              Business Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Hourly Rate (USD)
                  </label>
                  <input
                    type="number"
                    value={settings.hourlyRate}
                    onChange={(e) => setSettings({
                      ...settings,
                      hourlyRate: Number(e.target.value)
                    })}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Availability
                  </label>
                  <select
                    value={settings.availability}
                    onChange={(e) => setSettings({
                      ...settings,
                      availability: e.target.value as FreelancerSettings['availability']
                    })}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  >
                    <option value="available">Available for Work</option>
                    <option value="busy">Busy</option>
                    <option value="not_available">Not Available</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Preferred Communication
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['email', 'phone', 'messaging'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setSettings({
                        ...settings,
                        preferredCommunication: method as FreelancerSettings['preferredCommunication']
                      })}
                      className={`px-4 py-2 rounded-lg border ${
                        settings.preferredCommunication === method
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-[#334155] text-gray-400 hover:border-blue-500/50'
                      }`}
                    >
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              Lead Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Industries
                </label>
                <div className="flex flex-wrap gap-2">
                  {settings.leadPreferences?.industries?.map((industry) => (
                    <span
                      key={industry}
                      className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm"
                    >
                      {industry}
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add industry (press Enter)"
                    className="flex-1 px-3 py-1 bg-[#0F172A] border border-[#334155] rounded-full text-white placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent min-w-[200px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        setSettings({
                          ...settings,
                          leadPreferences: {
                            ...settings.leadPreferences,
                            industries: [...(settings.leadPreferences?.industries || []), e.currentTarget.value]
                          }
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {settings.leadPreferences?.projectTypes?.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm"
                    >
                      {type}
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add project type (press Enter)"
                    className="flex-1 px-3 py-1 bg-[#0F172A] border border-[#334155] rounded-full text-white placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent min-w-[200px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        setSettings({
                          ...settings,
                          leadPreferences: {
                            ...settings.leadPreferences,
                            projectTypes: [...(settings.leadPreferences?.projectTypes || []), e.currentTarget.value]
                          }
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Budget Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Minimum</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        value={settings.leadPreferences?.budgetRange?.min || 0}
                        onChange={(e) => handleMinBudgetChange(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white
                          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Maximum</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        value={settings.leadPreferences?.budgetRange?.max || 0}
                        onChange={(e) => handleMaxBudgetChange(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white
                          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
