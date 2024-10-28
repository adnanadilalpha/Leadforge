import React from 'react';
import { useStore } from '../lib/store';
import { FREELANCER_PRICING_PLANS } from '../lib/constants';
import { Button, useToast } from '../components/ui';

export function Pricing() {
  const { user, subscribe } = useStore();
  const { toast } = useToast();

  const handleSubscribe = async (planId: string) => {
    try {
      if (!user) {
        toast({
          title: 'Please login first',
          description: 'You need to be logged in to subscribe to a plan.',
          variant: 'destructive',
        });
        return;
      }

      await subscribe(planId);
      toast({
        title: 'Subscription successful',
        description: 'Thank you for subscribing to LeadForge!',
      });
    } catch (error: unknown) {
      toast({
        title: 'Subscription failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple pricing for freelancers
          </p>
          <p className="mt-4 text-lg text-gray-600">
            Start generating high-quality leads for your freelance business
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {FREELANCER_PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                plan.recommended ? 'bg-gray-900 text-white ring-gray-900' : 'bg-white'
              }`}
            >
              <h3 className="text-lg font-semibold leading-8">{plan.name}</h3>
              <p className="mt-4 text-sm leading-6 text-gray-400">{plan.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight">${plan.price}</span>
                <span className="text-sm font-semibold leading-6">/month</span>
              </p>
              <Button
                onClick={() => handleSubscribe(plan.id)}
                className={`mt-6 w-full ${
                  plan.recommended ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
                }`}
              >
                Get started
              </Button>
              <ul className="mt-8 space-y-3 text-sm leading-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <svg
                      className={`h-6 w-5 flex-none ${
                        plan.recommended ? 'text-white' : 'text-indigo-600'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
