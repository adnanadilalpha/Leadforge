import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import type { PricingPlan } from '../lib/types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: PricingPlan[];
}

const PricingModal = ({ isOpen, onClose, plans }: PricingModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-gray-900 rounded-xl p-6 shadow-xl overflow-y-auto max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Choose Your Plan</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-xl p-6 ${
                    plan.recommended
                      ? 'bg-gradient-to-b from-blue-500/10 to-purple-600/10 border-2 border-blue-500'
                      : 'bg-gray-800/50 border border-gray-700'
                  }`}
                >
                  {plan.recommended && (
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2">Limits</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center justify-between">
                          <span>Leads per month</span>
                          <span className="font-semibold">
                            {plan.limits.leadsPerMonth === -1 ? 'Unlimited' : plan.limits.leadsPerMonth}
                          </span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Emails per day</span>
                          <span className="font-semibold">
                            {plan.limits.emailsPerDay === -1 ? 'Unlimited' : plan.limits.emailsPerDay}
                          </span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Active campaigns</span>
                          <span className="font-semibold">
                            {plan.limits.campaigns === -1 ? 'Unlimited' : plan.limits.campaigns}
                          </span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Team members</span>
                          <span className="font-semibold">
                            {plan.limits.teamMembers === -1 ? 'Unlimited' : plan.limits.teamMembers}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Features</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-lg font-semibold ${
                      plan.recommended
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    Choose {plan.name}
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PricingModal;