import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Lead, User } from '../types';  // Fix import path
import { auth } from './firebase';

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error('Google API key is not configured');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const aiService = {
  async generateLeads(prompt: string): Promise<Lead[]> {
    try {
      const result = await model.generateContent(`
        You are an expert lead researcher. Generate 3-5 REAL leads matching: ${prompt}
        
        STRICT REQUIREMENTS:
        1. Use ONLY real companies that exist - verify on LinkedIn
        2. Find real decision-makers from these companies
        3. Use real company websites and LinkedIn profiles
        4. Generate business email formats based on company's email pattern
        5. Include accurate company sizes and industries from LinkedIn
        6. Research actual projects or needs from company news/posts
        7. Set realistic budgets based on company size and industry standards
        8. Add specific technologies or tools they use
        9. Include recent company news or developments
        10. Add relevant social proof (awards, recognition, etc.)
        
        For each lead, provide:
        - Company: Real company name, website, size, industry
        - Contact: Real decision-maker name, title, LinkedIn URL
        - Email: Business email following company's format
        - Phone: Business phone if publicly available
        - Project Details: Specific needs based on company's current situation
        - Budget: Realistic range based on company size and project scope
        - Technologies: Current tech stack and tools
        - Recent News: Latest company developments
        - Social Proof: Awards, recognition, growth metrics
        
        Format each lead as a detailed JSON object with all these fields.
        Ensure 100% accuracy and verifiability of all information.
      `);

      const response = result.response;
      const text = await response.text();
      
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (error) {
        console.error('Failed to parse AI response:', text);
        throw new Error('Invalid AI response format');
      }

      if (!parsed.leads || !Array.isArray(parsed.leads)) {
        throw new Error('Invalid AI response format');
      }

      return parsed.leads.map((lead: any) => ({
        id: crypto.randomUUID(),
        firstName: lead.firstName || '',
        lastName: lead.lastName || '',
        email: lead.email || '',
        company: lead.company || '',
        phone: lead.phone || '',
        status: 'new' as const,
        source: 'ai-generated',
        projectType: lead.projectType || '',
        budget: lead.budget || { min: 0, max: 0 },
        notes: lead.notes || '',
        tags: lead.tags || [],
        requirements: lead.requirements || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Lead Generation Error:', error);
      throw new Error('Failed to generate leads. Please try again.');
    }
  },

  async generateEmail(lead: Lead, userProfile: User): Promise<string> {
    try {
      const result = await model.generateContent(`
        Write a personalized cold email to ${lead.firstName} ${lead.lastName} at ${lead.company}.
        
        About the sender:
        - Name: ${userProfile.name}
        - Role: ${userProfile.role}
        - Expertise: ${userProfile.expertise?.join(', ')}
        
        Lead context:
        - Company: ${lead.company}
        - Project Type: ${lead.projectType}
        - Requirements: ${lead.requirements}
        - Budget Range: $${lead.budget?.min} - $${lead.budget?.max}
        
        Write a compelling email that:
        1. Shows understanding of their business needs
        2. References their specific project requirements
        3. Demonstrates relevant expertise
        4. Includes a clear call to action
        
        Keep it under 200 words, professional but conversational.
      `);
      
      return result.response.text();
    } catch (error) {
      console.error('Email Generation Error:', error);
      throw new Error('Failed to generate email. Please try again.');
    }
  },

  async analyzeResponse(email: string) {
    try {
      const result = await model.generateContent(`
        Analyze this email response and provide:
        1. Sentiment analysis (positive/neutral/negative)
        2. Key points mentioned
        3. Potential objections
        4. Recommended follow-up strategy
        5. Best time to follow up
        
        Email: ${email}
        
        Return analysis in this JSON format:
        {
          "sentiment": "string",
          "keyPoints": ["string"],
          "objections": ["string"],
          "followUpStrategy": "string",
          "followUpTiming": "string"
        }
      `);
      
      return JSON.parse(await result.response.text());
    } catch (error) {
      console.error('Response Analysis Error:', error);
      throw new Error('Failed to analyze response. Please try again.');
    }
  }
};
