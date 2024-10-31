import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Lead, User } from '../types';  // Fix import path

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error('Google API key is not configured');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Helper function to validate URLs
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export const aiService = {
  async generateLeads(prompt: string): Promise<Lead[]> {
    try {
      const result = await model.generateContent(`
        You are an expert B2B lead researcher with access to LinkedIn Sales Navigator, Apollo.io, and Hunter.io.
        Research and verify 3-5 REAL leads matching: ${prompt}

        RESEARCH PROCESS:
        1. Find real companies that match criteria using LinkedIn
        2. Verify company details on their website and social media
        3. Identify real decision makers from LinkedIn/company pages
        4. Verify email formats using Hunter.io patterns
        5. Check recent company news and job postings
        6. Verify project needs from public announcements/posts

        VERIFICATION REQUIREMENTS:
        1. Company:
           - Must have active LinkedIn company page
           - Must have working website
           - Must show recent activity (< 30 days)
           - Must have clear service needs matching criteria

        2. Contact Person:
           - Must be real person with active LinkedIn profile
           - Must have decision-making authority
           - Must be currently employed (verify via LinkedIn)
           - Must have activity in last 30 days

        3. Project Details:
           - Must be from public announcements/posts
           - Must have clear budget indicators
           - Must show actual project requirements
           - Must be current/upcoming (not past)

        4. Verification Sources:
           - Include LinkedIn URLs
           - Include company website
           - Include news/announcement links
           - Include evidence of project needs

        Return ONLY 100% verified leads with this exact data:
        {
          "leads": [
            {
              "firstName": "verified first name",
              "lastName": "verified last name",
              "title": "verified current title",
              "email": "verified business email",
              "company": "verified company name",
              "website": "verified company website",
              "companySize": "verified employee count",
              "industry": "verified industry",
              "projectType": "specific verified project need",
              "budget": {
                "min": number (no currency symbols),
                "max": number (no currency symbols)
              },
              "requirements": "verified project requirements",
              "linkedIn": {
                "personal": "verified personal profile URL",
                "company": "verified company page URL"
              },
              "evidence": {
                "projectSource": "URL/description of project evidence",
                "companyNews": "relevant company announcement",
                "jobPostings": "relevant job posts showing needs",
                "verificationDate": "YYYY-MM-DD"
              },
              "tags": ["relevant", "verified", "tags"]
            }
          ]
        }

        IMPORTANT:
        - Only include 100% verified leads with real evidence
        - All URLs must be active and verifiable
        - All information must be current and accurate
        - Include specific project details from public sources
        - Budget must be based on company size/industry standards
        - Do not generate or guess any information
      `);

      const response = result.response;
      const text = await response.text();
      
      let parsed;
      try {
        parsed = JSON.parse(text);

        if (!parsed.leads || !Array.isArray(parsed.leads)) {
          throw new Error('Invalid response format: missing leads array');
        }

        return parsed.leads.map((lead: any) => ({
          id: crypto.randomUUID(),
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          company: lead.company,
          title: lead.title,
          website: lead.website,
          companySize: lead.companySize,
          industry: lead.industry,
          status: 'new' as const,
          source: 'ai-generated',
          projectType: lead.projectType,
          budget: {
            min: typeof lead.budget?.min === 'number' ? lead.budget.min :
              parseInt(String(lead.budget?.min).replace(/[^0-9]/g, '')),
            max: typeof lead.budget?.max === 'number' ? lead.budget.max :
              parseInt(String(lead.budget?.max).replace(/[^0-9]/g, ''))
          },
          requirements: lead.requirements,
          linkedIn: lead.linkedIn?.personal || '',
          notes: `
            Evidence: ${lead.evidence.projectSource}
            
            Company News: ${lead.evidence.companyNews}
            
            Job Postings: ${lead.evidence.jobPostings}
            
            Last Verified: ${lead.evidence.verificationDate}
            
            LinkedIn: ${lead.linkedIn?.company}
            Website: ${lead.website}
          `.trim(),
          tags: [
            ...(lead.tags || []),
            lead.industry,
            `size:${lead.companySize}`,
            `verified:${lead.evidence.verificationDate}`
          ].filter(Boolean),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Failed to parse AI response:', text);
        throw new Error('Invalid AI response format');
      }
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
