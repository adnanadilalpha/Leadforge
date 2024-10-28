import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Lead, User } from './types';
import { auth } from './firebase';

const genAI = new GoogleGenerativeAI('AIzaSyD6xGk0uEAd881hKz-SQHxS4WMlGsESuEE');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const aiService = {
  async generateLeads(prompt: string): Promise<Lead[]> {
    try {
      const result = await model.generateContent(`
        You are an expert lead researcher. Generate 3-5 verified leads matching: ${prompt}
        
        STRICT VERIFICATION REQUIREMENTS:
        1. LinkedIn Profile Verification:
           - Contact's LinkedIn profile MUST show current employment at the specified company
           - Title on LinkedIn MUST match their current role
           - Profile must be active within last 30 days
           - Do NOT include if unable to verify current employment

        2. Company Verification:
           - Company LinkedIn page must be official and active
           - Company size must match specified filter
           - Recent activity (posts, updates) within last 30 days
           - Website must be active and match company details

        3. Project Verification:
           - Only include if company shows clear signs of needing specified services
           - Verify through recent job posts, company updates, or news
           - Must have active technical projects or initiatives

        Return ONLY verified leads in this exact format:
        {
          "leads": [
            {
              "companyName": "string",
              "contactName": "string",
              "contactTitle": "string",
              "email": "string",
              "industry": "string",
              "employeeCount": "string",
              "website": "string",
              "notes": "string",
              "socialProfiles": {
                "contactLinkedIn": "verified_profile_url",
                "companyLinkedIn": "verified_company_url"
              },
              "techStack": ["string"],
              "lastFunding": "string",
              "potentialProject": "string",
              "verificationDetails": {
                "lastVerified": "date",
                "currentEmploymentConfirmed": true
              }
            }
          ]
        }
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

      console.log('Current user ID:', auth.currentUser?.uid);
      
      return parsed.leads.map((lead: any) => ({
        id: crypto.randomUUID(),
        companyName: lead.companyName || '',
        contactName: lead.contactName || '',
        contactTitle: lead.contactTitle || '',
        email: lead.email || '',
        status: 'new',
        industry: lead.industry || '',
        employeeCount: lead.employeeCount || '',
        website: lead.website || '',
        notes: lead.notes || '',
        isFavorite: false,
        userId: auth.currentUser?.uid || '', // Ensure userId is set correctly
        verificationDate: lead.verificationDetails?.lastVerified || new Date().toISOString(),
        lastFunding: lead.lastFunding ? {
          amount: lead.lastFunding.amount || '',
          date: lead.lastFunding.date || '',
          round: lead.lastFunding.round || ''
        } : null,
        socialProfiles: {
          contactLinkedIn: lead.socialProfiles?.contactLinkedIn,
          companyLinkedIn: lead.socialProfiles?.companyLinkedIn,
          twitter: lead.socialProfiles?.twitter,
          github: lead.socialProfiles?.github,
          blog: lead.socialProfiles?.blog
        },
        techStack: lead.techStack || [],
        potentialProject: lead.potentialProject || null,
        createdAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Lead Generation Error:', error);
      throw new Error('Failed to generate leads. Please try again.');
    }
  },

  async generateEmail(lead: Lead, userProfile: User) {
    try {
      const result = await model.generateContent(`
        Write a personalized cold email to ${lead.contactName} at ${lead.companyName}.
        
        About the sender:
        - Name: ${userProfile.name}
        - Role: ${userProfile.role}
        - Skills: ${userProfile.skills?.join(', ')}
        
        Company context:
        - Industry: ${lead.industry}
        - Size: ${lead.employeeCount} employees
        - Tech Stack: ${lead.techStack?.join(', ')}
        - Potential Project: ${lead.potentialProject}
        
        Write a compelling email that:
        1. Shows understanding of their business
        2. References their tech stack or recent company news
        3. Proposes specific value based on their needs
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
      
      return JSON.parse(result.response.text());
    } catch (error) {
      console.error('Response Analysis Error:', error);
      throw new Error('Failed to analyze response. Please try again.');
    }
  }
};
