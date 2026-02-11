// src/services/fundingService.ts
import type { FundingOpportunity, FundingApplication, Investor } from '../types/index.ts';

// Mock data - in real app, this would come from your backend
const mockFundingOpportunities: FundingOpportunity[] = [
  {
    id: '1',
    title: 'College Innovation Grant',
    provider: 'University Entrepreneurship Center',
    amount: '$10,000 - $25,000',
    deadline: new Date('2024-06-30'),
    eligibility: ['Current students', 'Early-stage startups', 'Campus-focused solutions'],
    description: 'Funding for student-led startups that solve campus challenges. Priority given to projects with social impact and innovative technology.',
    category: 'grant',
    stage: 'ideation',
    tags: ['Grant', 'University', 'Early-stage'],
    website: 'https://university.edu/innovation-grant'
  },
  {
    id: '2',
    title: 'TechStars Student Competition',
    provider: 'TechStars',
    amount: '$50,000 + Mentorship',
    deadline: new Date('2024-05-15'),
    eligibility: ['Student teams', 'Tech startups', 'Prototype stage'],
    description: 'National competition for student tech startups. Winners receive funding and 3-month mentorship program.',
    category: 'competition',
    stage: 'prototype',
    tags: ['Competition', 'Tech', 'Mentorship'],
    website: 'https://techstars.com/student-comp'
  },
  {
    id: '3',
    title: 'Alumni Angel Network',
    provider: 'University Alumni Association',
    amount: '$25,000 - $100,000',
    deadline: new Date('2024-07-31'),
    eligibility: ['Student founders', 'Revenue-generating', 'Scalable business model'],
    description: 'Angel investment from successful university alumni. Focus on scalable businesses with strong teams.',
    category: 'investor',
    stage: 'launched',
    tags: ['Angel Investment', 'Alumni', 'Growth-stage']
  },
  {
    id: '4',
    title: 'Campus Crowdfunding Match',
    provider: 'ProjectHub Platform',
    amount: '1:1 Matching up to $10,000',
    deadline: new Date('2024-08-31'),
    eligibility: ['All students', 'Platform projects', 'Community support'],
    description: 'We match funds raised through our platform crowdfunding. Perfect for validating your idea with community support.',
    category: 'crowdfunding',
    stage: 'ideation',
    tags: ['Crowdfunding', 'Matching', 'Community']
  }
];

const mockInvestors: Investor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    company: 'EduTech Ventures',
    focusAreas: ['Education Technology', 'AI Learning', 'Student Tools'],
    investmentRange: '$50K - $500K',
    website: 'https://edutech.ventures',
    contactEmail: 'sarah@edutech.ventures',
    bio: 'Former professor turned investor. Focused on transformative education technology.',
    previousInvestments: ['StudySync', 'CampusConnect', 'LearnAI']
  },
  {
    id: '2',
    name: 'Mark Rodriguez',
    company: 'Campus Capital',
    focusAreas: ['Student Market', 'Campus Solutions', 'Early-stage'],
    investmentRange: '$25K - $250K',
    website: 'https://campus.capital',
    contactEmail: 'mark@campus.capital',
    bio: 'Specializing in student and campus-focused startups. Believes in the power of young entrepreneurs.',
    previousInvestments: ['DormEats', 'TextbookSwap', 'CampusJobs']
  }
];

export class FundingService {
  static async getFundingOpportunities(filters?: {
    category?: string;
    stage?: string;
    search?: string;
  }): Promise<FundingOpportunity[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        let opportunities = [...mockFundingOpportunities];
        
        if (filters?.category) {
          opportunities = opportunities.filter(opp => opp.category === filters.category);
        }
        
        if (filters?.stage) {
          opportunities = opportunities.filter(opp => opp.stage === filters.stage);
        }
        
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          opportunities = opportunities.filter(opp => 
            opp.title.toLowerCase().includes(searchLower) ||
            opp.provider.toLowerCase().includes(searchLower) ||
            opp.tags.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
        
        resolve(opportunities);
      }, 500);
    });
  }

  static async getInvestors(): Promise<Investor[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockInvestors);
      }, 300);
    });
  }

  static async submitApplication(application: Omit<FundingApplication, 'id' | 'createdAt'>): Promise<FundingApplication> {
    // Simulate API submission
    return new Promise((resolve) => {
      setTimeout(() => {
        const newApplication: FundingApplication = {
          ...application,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          status: 'submitted',
          submittedAt: new Date()
        };
        resolve(newApplication);
      }, 1000);
    });
  }

  static async getMyApplications(userId: string): Promise<FundingApplication[]> {
    // Mock user applications
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'app1',
            opportunityId: '1',
            applicantId: userId,
            projectId: '1',
            status: 'submitted',
            proposal: 'AI Study Assistant platform for personalized learning...',
            requestedAmount: 15000,
            submittedAt: new Date('2024-03-01'),
            createdAt: new Date('2024-02-28')
          },
          {
            id: 'app2',
            opportunityId: '2',
            applicantId: userId,
            projectId: '2',
            status: 'draft',
            proposal: 'Campus marketplace for student commerce...',
            requestedAmount: 25000,
            createdAt: new Date('2024-03-15')
          }
        ]);
      }, 500);
    });
  }
}