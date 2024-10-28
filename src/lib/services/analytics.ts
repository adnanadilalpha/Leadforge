import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  try {
    logEvent(analytics, eventName, params);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', { page_name: pageName });
};

export const trackLeadGeneration = (leadCount: number, searchCriteria: string) => {
  trackEvent('generate_leads', {
    lead_count: leadCount,
    search_criteria: searchCriteria,
  });
};

export const trackEmailSent = (campaignId: string, leadCount: number) => {
  trackEvent('send_campaign', {
    campaign_id: campaignId,
    lead_count: leadCount,
  });
};

export const trackSubscription = (planId: string, amount: number) => {
  trackEvent('subscribe', {
    plan_id: planId,
    amount,
  });
};