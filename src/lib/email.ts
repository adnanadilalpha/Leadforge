import { Resend } from 'resend';
import type { Campaign, Lead, User } from './types';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const emailService = {
  async sendCampaignEmail(
    campaign: Campaign,
    lead: Lead,
    user: User,
    template: string
  ) {
    const html = template
      .replace(/{{lead.name}}/g, lead.contactName)
      .replace(/{{lead.company}}/g, lead.companyName)
      .replace(/{{user.name}}/g, user.name)
      .replace(/{{user.signature}}/g, user.emailSignature || '');

    await resend.emails.send({
      from: `${user.name} <${user.email}>`,
      to: lead.email,
      subject: campaign.name,
      html,
      tags: [
        { name: 'campaign_id', value: campaign.id },
        { name: 'lead_id', value: lead.id },
      ],
    });
  },

  async scheduleFollowUp(
    campaign: Campaign,
    lead: Lead,
    user: User,
    template: string,
    sendAt: Date
  ) {
    // Implementation for scheduling follow-up emails
  },

  async trackEmailOpen(emailId: string) {
    // Implementation for tracking email opens
  },

  async trackEmailClick(emailId: string, linkId: string) {
    // Implementation for tracking email link clicks
  },
};