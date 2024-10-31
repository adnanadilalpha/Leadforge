import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/constants';
import { useStore } from '@/lib/store';
import { useToast } from '../../components/ui/use-toast';
import type { PricingPlan } from '../../types';

export function PricingPage() {
  const { user, subscribe } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Convert PRICING_PLANS object to array
  const pricingPlansArray = Object.entries(PRICING_PLANS).map(([key, plan]) => ({
    ...plan,
    key: key as keyof typeof PRICING_PLANS
  }));

  const handleSubscribe = async (planId: string) => {
    try {
      setIsLoading(true);
      await subscribe(planId);
      toast({
        title: 'Success',
        description: 'Subscription updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update subscription',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Choose Your Plan
          </h1>
          <p className="text-gray-400 text-lg">
            Start with our free plan and upgrade as you grow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlansArray.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -10 }}
              className={`rounded-xl p-6 ${
                plan.key === 'FREELANCER'
                  ? 'bg-gradient-to-b from-blue-500/10 to-purple-600/10 border-2 border-blue-500'
                  : 'bg-[#1E293B] border border-[#334155]'
              }`}
            >
              {plan.key === 'FREELANCER' && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature: string) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-300">
                    <Check className="w-5 h-5 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-sm text-gray-400 mb-6">
                <div className="flex justify-between mb-2">
                  <span>Leads per month</span>
                  <span>{plan.limits.leadsPerMonth === -1 ? 'Unlimited' : plan.limits.leadsPerMonth}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Emails per day</span>
                  <span>{plan.limits.emailsPerDay === -1 ? 'Unlimited' : plan.limits.emailsPerDay}</span>
                </div>
                <div className="flex justify-between">
                  <span>Team members</span>
                  <span>{plan.limits.teamMembers === -1 ? 'Unlimited' : plan.limits.teamMembers}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading || user?.subscription?.planId === plan.id}
                className={`w-full py-3 rounded-lg font-semibold ${
                  plan.key === 'FREELANCER'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                } ${
                  (isLoading || user?.subscription?.planId === plan.id) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                {user?.subscription?.planId === plan.id ? (
                  'Current Plan'
                ) : (
                  'Get Started'
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Need a custom plan?
          </h2>
          <p className="text-gray-400 mb-6">
            Contact us for enterprise pricing and custom features
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = 'mailto:support@leadforge.com'}
            className="bg-[#1E293B] border border-[#334155] px-8 py-3 rounded-lg font-semibold text-white hover:bg-[#2D3B4E]"
          >
            Contact Sales
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
