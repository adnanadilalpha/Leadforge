import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Lead, User } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const aiService = {
  async generateLeadDescription(companyInfo: string): Promise<string> {
    try {
      const result = await model.generateContent(`
        Generate a concise, professional description for a potential lead based on this information:
        ${companyInfo}
        
        Focus on:
        1. Value proposition
        2. Pain points they might have
        3. How our services could help them
        
        Keep it under 100 words and professional in tone.
      `);
      
      return result.response.text();
    } catch (error) {
      console.error('Error generating lead description:', error);
      throw error;
    }
  },

  async analyzeCompanyWebsite(url: string): Promise<{
    technologies: string[];
    opportunities: string[];
    recommendedApproach: string;
  }> {
    try {
      const result = await model.generateContent(`
        Analyze this company website and provide insights:
        ${url}
        
        Return analysis in this JSON format:
        {
          "technologies": ["list of technologies used"],
          "opportunities": ["potential pain points or needs"],
          "recommendedApproach": "suggestion for outreach"
        }
      `);
      
      return JSON.parse(result.response.text());
    } catch (error) {
      console.error('Error analyzing website:', error);
      throw error;
    }
  },

  async generateEmailTemplate(lead: Lead, user: User): Promise<string> {
    try {
      const result = await model.generateContent(`
        Write a personalized email to ${lead.contactName} at ${lead.companyName}.
        
        Context:
        - Sender: ${user.name} (${user.role})
        - Company Industry: ${lead.industry}
        - Company Size: ${lead.employeeCount}
        - Recent Technology: ${lead.techStack.join(', ')}
        
        Guidelines:
        1. Professional but conversational tone
        2. Reference specific company details
        3. Clear value proposition
        4. Soft call to action
        5. Keep it under 150 words
      `);
      
      return result.response.text();
    } catch (error) {
      console.error('Error generating email template:', error);
      throw error;
    }
  },

  async suggestFollowUpStrategy(
    previousInteractions: string[],
    leadProfile: Lead
  ): Promise<{
    timing: string;
    approach: string;
    template: string;
  }> {
    try {
      const result = await model.generateContent(`
        Suggest a follow-up strategy based on these previous interactions:
        ${previousInteractions.join('\n')}
        
        Lead Profile:
        ${JSON.stringify(leadProfile, null, 2)}
        
        Return strategy in this JSON format:
        {
          "timing": "when to follow up",
          "approach": "recommended approach",
          "template": "follow-up message template"
        }
      `);
      
      return JSON.parse(result.response.text());
    } catch (error) {
      console.error('Error suggesting follow-up strategy:', error);
      throw error;
    }
  }
};