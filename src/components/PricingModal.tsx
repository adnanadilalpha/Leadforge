import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useStore } from '../lib/store';
import { useToast } from './ui/use-toast';
import { Check, Loader2 } from 'lucide-react';
import { PRICING_PLANS } from '../lib/constants';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: keyof typeof PRICING_PLANS;
}

const PricingModal = ({ isOpen, onClose, selectedPlan = 'FREELANCER' }: PricingModalProps) => {
  const { user, subscribe } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (planId: string) => {
    try {
      setIsLoading(true);
      await subscribe(planId);
      toast({
        title: 'Success',
        description: 'Subscription updated successfully.',
      });
      onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#1E293B] border-[#334155] text-white">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {Object.entries(PRICING_PLANS).map(([key, plan]) => (
            <div
              key={plan.id}
              className={`rounded-lg p-4 border ${
                key === selectedPlan
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-[#334155] hover:border-blue-500/50'
              }`}
            >
              <div className="text-lg font-semibold mb-2">{plan.name}</div>
              <div className="text-2xl font-bold mb-4">
                ${plan.price}
                <span className="text-sm text-gray-400">/month</span>
              </div>
              <div className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading || user?.subscription?.planId === plan.id}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : user?.subscription?.planId === plan.id ? (
                  'Current Plan'
                ) : (
                  'Select Plan'
                )}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
