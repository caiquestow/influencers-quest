// src/services/aiService.ts
import { generateMockClaims } from '@/lib/mockData';

interface InstagramData {
  name: string;
  username: string;
  bio?: string;
  followers: string;
  role: string;
  posts: number;
  website?: string;
  error?: string;
  profilePicture?: string;
}

interface AIAnalysisResult {
  status: string;
  data?: {
    claims: Array<{
      text: string;
      category: string;
      trust_score: number;
      evidence: string;
    }>;
    metadata: {
      total_claims: number;
      average_trust_score: number;
    };
    instagram?: InstagramData;
  };
  error?: string;
}

export const analyzeWithAI = async (
  influencerName: string,
  apiKey: string
): Promise<AIAnalysisResult> => {
  try {
    // Enviar a API key junto com o nome do influencer
    const instagramResponse = await fetch('/api/instagram-agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        influencerName,
        apiKey  // Enviando a API key para o backend
      })
    });

    const instagramData = await instagramResponse.json();

    if (instagramData.error) {
      console.warn('Instagram fetch failed:', instagramData.error);
      return {
        status: 'error',
        error: instagramData.error
      };
    }

    // Gerar claims baseadas no role
    const category = inferCategoryFromRole(instagramData.role);
    const mockClaims = generateMockClaims(category, 5);

    return {
      status: 'success',
      data: {
        claims: mockClaims,
        metadata: {
          total_claims: mockClaims.length,
          average_trust_score: Math.floor(
            mockClaims.reduce((sum, claim) => sum + claim.score, 0) / mockClaims.length
          )
        },
        instagram: instagramData
      }
    };

  } catch (error) {
    console.error('Analysis error:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

function inferCategoryFromRole(role: string): string {
  const roleNormalized = role.toLowerCase();

  if (roleNormalized.includes('tech') || roleNormalized.includes('software') ||
      roleNormalized.includes('developer')) {
    return 'Technology';
  }
  if (roleNormalized.includes('health') || roleNormalized.includes('wellness') ||
      roleNormalized.includes('nutrition')) {
    return 'Health';
  }
  if (roleNormalized.includes('market') || roleNormalized.includes('content') ||
      roleNormalized.includes('digital')) {
    return 'Marketing';
  }

  return 'Technology';
}