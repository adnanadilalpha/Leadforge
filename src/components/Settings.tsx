import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { Card, CardHeader, CardTitle, CardContent, Button, useToast } from './ui';
import { Settings as SettingsIcon, CreditCard, Bell, Shield, Loader2, UserCircle, Route } from 'lucide-react';
import { PRICING_PLANS } from '../lib/constants';
import type { UserSettings, PricingPlan } from '../types';

const defaultSettings: UserSettings = {
  notifications: {
    email: true,
    browser: false,
    leadAlerts: true,
    weeklyReport: true
  },
  privacy: {
    shareData: false,
    allowMarketing: true
  }
};

export function Settings() {
  const { user, updateSettings, cancelSubscription } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    if (user?.settings) {
      setSettings({
        ...defaultSettings,
        ...user.settings
      });
    }
  }, [user]);

  const currentPlan = PRICING_PLANS[user?.subscription?.planId as keyof typeof PRICING_PLANS];

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateSettings(settings);
      toast({
        title: 'Settings saved',
        description: 'Your settings have been updated successfully.',
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

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      await cancelSubscription();
      toast({
        title: 'Subscription cancelled',
        description: 'Your subscription will end at the end of the current billing period.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <SettingsIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-blue-400" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  disabled
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-400" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-lg bg-[#0F172A] border border-[#334155]">
                <div>
                  <h3 className="font-semibold text-white">{currentPlan?.name || 'Free Plan'}</h3>
                  <p className="text-sm text-gray-400">
                    {user?.subscription?.status === 'active' 
                      ? `$${currentPlan?.price}/month`
                      : 'No active subscription'}
                  </p>
                </div>
                {user?.subscription?.status === 'active' ? (
                  <Button
                    variant="destructive"
                    onClick={handleCancelSubscription}
                    disabled={isLoading}
                  >
                    Cancel Subscription
                  </Button>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                    onClick={() => window.location.href = '/pricing'}
                  >
                    Upgrade
                  </Button>
                )}
              </div>
              <div className="text-sm text-gray-400">
                {currentPlan?.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(settings.notifications || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        [key]: e.target.checked
                      }
                    })}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(settings.privacy || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </label>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: {
                        ...settings.privacy,
                        [key]: e.target.checked
                      }
                    })}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600"
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

export default Settings;
