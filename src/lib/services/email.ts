import { Resend } from 'resend';
import type { Campaign, Lead, User } from '../types';
import { trackEmailSent } from './analytics';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const emailService = {
  async sendCampaignEmails(
    campaign: Campaign,
    leads: Lead[],
    user: User,
    template: string
  ) {
    const results = await Promise.allSettled(
      leads.map(async (lead) => {
        const personalizedTemplate = template
          .replace(/{{lead.name}}/g, lead.contactName)
          .replace(/{{lead.company}}/g, lead.companyName)
          .replace(/{{user.name}}/g, user.name)
          .replace(/{{user.role}}/g, user.role || '')
          .replace(/{{user.signature}}/g, user.emailSignature || '');

        try {
          await resend.emails.send({
            from: `${user.name} <${user.email}>`,
            to: lead.email,
            subject: campaign.name,
            html: personalizedTemplate,
            tags: [
              { name: 'campaign_id', value: campaign.id },
              { name: 'lead_id', value: lead.id },
            ],
          });

          return { leadId: lead.id, status: 'sent' };
        } catch (error) {
          console.error(`Failed to send email to ${lead.email}:`, error);
          return { leadId: lead.id, status: 'failed', error };
        }
      })
    );

    const successfulSends = results.filter(
      (result) => result.status === 'fulfilled'
    ).length;

    trackEmailSent(campaign.id, successfulSends);

    return results;
  },

  async scheduleFollowUp(
    lead: Lead,
    template: string,
    sendAt: Date,
    user: User
  ) {
    try {
      const scheduledEmail = await resend.emails.send({
        from: `${user.name} <${user.email}>`,
        to: lead.email,
        subject: 'Following up',
        html: template,
        scheduled_for: sendAt.toISOString(),
      });

      return scheduledEmail;
    } catch (error) {
      console.error('Failed to schedule follow-up:', error);
      throw error;
    }
  },

  async getEmailAnalytics(campaignId: string) {
    // Implementation would depend on your email service provider's API
    // This is a placeholder for the actual implementation
    return {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
    };
  }
};