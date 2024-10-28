import { useState } from 'react';
import { useStore } from '../lib/store';
import { 
  Settings as SettingsIcon, 
  Mail, 
  User, 
  Shield, 
  Save
} from 'lucide-react';
import type { EmailSettings } from '../lib/types';

type SettingsKey = keyof EmailSettings;
type NestedSettingsKey = 'sendingSchedule' | 'aiSettings' | 'notifications';

export const Settings = () => {
  const { emailSettings, updateEmailSettings, user } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  
  const [localSettings, setLocalSettings] = useState<EmailSettings>({
    userId: user?.id || '',
    email: user?.email || '',
    name: user?.name || '',
    signature: emailSettings?.signature || '',
    sendingSchedule: {
      maxPerDay: emailSettings?.sendingSchedule?.maxPerDay || 50,
      maxPerHour: emailSettings?.sendingSchedule?.maxPerHour || 10,
      preferredTimes: emailSettings?.sendingSchedule?.preferredTimes || [],
      timezone: emailSettings?.sendingSchedule?.timezone || 
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      workingDays: emailSettings?.sendingSchedule?.workingDays || 
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    aiSettings: {
      tone: emailSettings?.aiSettings?.tone || 'Professional',
      language: emailSettings?.aiSettings?.language || 'English',
      creativity: emailSettings?.aiSettings?.creativity || 0.7,
      maxTokens: emailSettings?.aiSettings?.maxTokens || 2000
    },
    notifications: {
      emailNotifications: emailSettings?.notifications?.emailNotifications || true,
      desktopNotifications: emailSettings?.notifications?.desktopNotifications || true,
      dailyDigest: emailSettings?.notifications?.dailyDigest || true
    },
    templates: emailSettings?.templates || [],
    createdAt: emailSettings?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setLocalSettings(prev => {
      if (name.includes('.')) {
        const [category, field] = name.split('.') as [NestedSettingsKey, string];
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [field]: type === 'number' ? Number(value) : value
          }
        };
      }
      
      // For top-level properties
      return {
        ...prev,
        [name as SettingsKey]: value
      };
    });
  };


  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      if (!localSettings.email || !localSettings.name) {
        throw new Error("Email and name are required.");
      }

      await updateEmailSettings(localSettings);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-gray-800">
          <SettingsIcon className="w-6 h-6" />
          LeadForge AI Settings
        </h2>

        {/* Profile Settings */}
        <section className="mb-8 bg-white/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <User className="w-5 h-5" />
            Profile Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">Full Name</label>
              <input 
                type="text"
                name="name"
                value={localSettings.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">Email Address</label>
              <input 
                type="email"
                name="email"
                value={localSettings.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </section>

        {/* Email Settings */}
        <section className="mb-8 bg-white/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <Mail className="w-5 h-5" />
            Email Settings
          </h3>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">Email Signature</label>
            <textarea
              name="signature"
              value={localSettings.signature}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="Enter your email signature"
            />
          </div>
        </section>

        {/* AI Settings */}
        <section className="mb-8 bg-white/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
            <Shield className="w-5 h-5" />
            AI Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">Writing Tone</label>
              <select
                name="aiSettings.tone"
                value={localSettings.aiSettings.tone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">Language</label>
              <select
                name="aiSettings.language"
                value={localSettings.aiSettings.language}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4">
          {showSavedMessage && (
            <span className="text-green-600 text-sm">Settings saved successfully!</span>
          )}
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};
