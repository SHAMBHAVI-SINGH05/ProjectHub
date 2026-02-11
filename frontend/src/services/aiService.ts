// src/services/aiService.ts
const API_BASE = 'http://localhost:5000/api';

export class AIService {
  private static async callBackendAI(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE}/ai/improve-proposal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea: prompt })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle both the new backend response and fallback to mock
      if (data.feedback) {
        return data.feedback;
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Backend AI service failed, using mock:', error);
      return this.getMockResponse(prompt);
    }
  }

  private static getMockResponse(prompt: string): string {
    // Your existing mock responses as fallback
    const responses: { [key: string]: string } = {
      'study platform': `🚀 **Elevator Pitch**: "StudySync - An AI-powered platform that creates personalized study plans and connects students with compatible study partners based on courses, learning styles, and schedules."

🎯 **Problem-Solution**: 
- **Problem**: Students struggle with consistent study habits and finding reliable study partners
- **Solution**: AI-driven matching system + personalized study roadmap

💡 **Key Value Propositions**:
1. Smart matching algorithm for study partners
2. AI-generated study schedules
3. Progress tracking and analytics
4. Campus-focused community`,

      'marketplace': `🚀 **Elevator Pitch**: "CampusTrade - A peer-to-peer marketplace exclusively for college students to buy, sell, and trade textbooks, electronics, and campus essentials safely within their university ecosystem."

🎯 **Problem-Solution**:
- **Problem**: Students overpay for textbooks and struggle to sell used items
- **Solution**: Campus-verified marketplace with secure transactions

💡 **Key Value Propositions**:
1. University email verification for safety
2. Price comparison with campus bookstore
3. Delivery coordination for large items
4. Semester-based timing alerts`,

      'food delivery': `🚀 **Elevator Pitch**: "DormEats - A late-night food delivery service operated by students for students, focusing on campus locations and student budget-friendly options when regular services are closed."

🎯 **Problem-Solution**:
- **Problem**: Limited late-night food options on campus
- **Solution**: Student-run delivery with campus dining partnerships

💡 **Key Value Propositions**:
1. Student employment opportunities
2. Late-night service (10 PM - 2 AM)
3. Campus dining integration
4. Affordable student pricing`
    };

    // Find the best matching response based on keywords
    const lowerPrompt = prompt.toLowerCase();
    let bestMatch = 'study platform'; // default
    
    if (lowerPrompt.includes('marketplace') || lowerPrompt.includes('buy') || lowerPrompt.includes('sell')) {
      bestMatch = 'marketplace';
    } else if (lowerPrompt.includes('food') || lowerPrompt.includes('delivery') || lowerPrompt.includes('eat')) {
      bestMatch = 'food delivery';
    } else if (lowerPrompt.includes('study') || lowerPrompt.includes('learn') || lowerPrompt.includes('education')) {
      bestMatch = 'study platform';
    }

    return responses[bestMatch] || `Based on your idea "${prompt}", here's my analysis:

🚀 **Refined Pitch**: Focus on solving a specific problem for college students with a clear, scalable solution.

🎯 **Key Recommendations**:
1. Clearly define your target user persona
2. Identify your unique competitive advantage
3. Outline a realistic monetization strategy
4. Consider campus-specific challenges and opportunities

💡 **Next Steps**:
- Conduct market research with fellow students
- Create a minimum viable product (MVP)
- Test your assumptions with real users`;
  }

  static async improveProposal(idea: string): Promise<string> {
    const prompt = `As a startup mentor, improve this college student's project idea and provide a structured pitch: ${idea}`;
    return this.callBackendAI(prompt);
  }

  static async validateIdea(idea: string): Promise<{score: number; feedback: string; strengths: string[]; improvements: string[]}> {
    // First get AI feedback from the backend
    const feedback = await this.improveProposal(idea);
    
    // Generate scores and analysis based on the AI feedback
    const strengths = [
      "Solves a clear problem for students",
      "Has campus-specific relevance", 
      "Scalable business model potential",
      "Low initial investment required",
      "Clear target market",
      "Innovative approach"
    ];

    const improvements = [
      "Define target market more specifically",
      "Research existing competitors",
      "Outline customer acquisition strategy", 
      "Plan for initial funding needs",
      "Consider technical feasibility",
      "Validate with user testing"
    ];

    // Calculate a more realistic score based on feedback content
    let score = 7; // base score
    if (feedback.includes('🚀') || feedback.includes('innovative') || feedback.includes('unique')) score += 1;
    if (feedback.includes('clear') || feedback.includes('specific')) score += 1;
    if (feedback.length > 500) score += 1; // More detailed feedback suggests better idea

    return {
      score: Math.min(score, 10), // Cap at 10
      feedback,
      strengths: this.shuffleArray(strengths).slice(0, 3),
      improvements: this.shuffleArray(improvements).slice(0, 3)
    };
  }

  static async generateBusinessName(idea: string): Promise<string[]> {
    // For now, keep this as mock - you can create a backend endpoint later
    return new Promise((resolve) => {
      setTimeout(() => {
        const words = idea.split(' ').filter(word => word.length > 3);
        const baseWord = words[0] || 'Campus';
        
        const names = [
          `Campus${baseWord}`,
          `Uni${baseWord}`,
          `${baseWord}Sync`,
          `Edu${baseWord}`,
          `${baseWord}Hub`,
          `Study${baseWord}`,
          `${baseWord}Space`
        ].filter(name => name.length > 0);
        
        resolve(this.shuffleArray(names).slice(0, 3));
      }, 1000);
    });
  }

  // Helper function to shuffle arrays for random selection
  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // New method to check if backend is available
  static async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}