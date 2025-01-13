// src/contexts/AnalysisContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  MOCK_METRICS,
  Influencer,
  generateMockInfluencer,
  generateMockClaims,
  normalizeInfluencerName
} from '@/lib/mockData';

interface AgentProgress {
  agent: string;
  progress: number;
}

interface AnalysisContextType {
  loading: boolean;
  currentInfluencer: Influencer | null;
  analysisState: 'idle' | 'searching' | 'analyzing' | 'complete' | 'not_found';
  searchResults: Influencer[];
  metrics: typeof MOCK_METRICS;
  agentProgress: AgentProgress[];
  analyzeInfluencer: (influencer: Influencer) => Promise<void>;
  searchInfluencers: (query: string) => Promise<void>;
  addInfluencerToLeaderboard: (influencer: Influencer) => void;
  leaderboard: Influencer[];
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [currentInfluencer, setCurrentInfluencer] = useState<Influencer | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisContextType['analysisState']>('idle');
  const [searchResults, setSearchResults] = useState<Influencer[]>([]);
  const [leaderboard, setLeaderboard] = useState<Influencer[]>([]);
  const [agentProgress, setAgentProgress] = useState<AgentProgress[]>([]);
  const [metrics, setMetrics] = useState({ ...MOCK_METRICS });

  const analyzeInfluencer = async (influencer: Influencer) => {
    setLoading(true);
    setAnalysisState('analyzing');
    setAgentProgress([]);

    const agents = [
      { agent: 'Content Fetcher', duration: 1000 },
      { agent: 'Claims Extractor', duration: 1500 },
      { agent: 'Scientific Validator', duration: 2000 },
    ];

    for (const [index, { agent, duration }] of agents.entries()) {
      setAgentProgress((prev) => [
        ...prev.slice(0, index),
        { agent, progress: 0 },
      ]);

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setAgentProgress((prev) => {
          const updated = [...prev];
          updated[index] = { agent, progress: Math.min(progress, 100) };
          return updated;
        });
      }, duration / 10);

      await new Promise((resolve) => setTimeout(resolve, duration));
      clearInterval(interval);
    }

   // Gera dados mockados para o influenciador
  const mockData = generateMockInfluencer(influencer.name);
  const claims = generateMockClaims(mockData.category || 'Medicine', influencer.claimsCount || 10);

  const newInfluencer = {
    ...influencer,
    ...mockData,
    claims,
    id: normalizeInfluencerName(influencer.name), // Garantir que o ID está normalizado
    name: influencer.name.trim() // Garantir que o nome está limpo
  };

  setCurrentInfluencer(newInfluencer);
  setAnalysisState('complete');
  setLoading(false);

  setMetrics((prev) => ({
    ...prev,
    totalInfluencers: prev.totalInfluencers + 1,
    claimsVerified: prev.claimsVerified + (influencer.claimsCount || 0),
  }));

  addInfluencerToLeaderboard(newInfluencer);
};

  const searchInfluencers = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setAnalysisState('searching');
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Como não temos mais MOCK_INFLUENCERS, retornamos array vazio
    setSearchResults([]);
    setAnalysisState('idle');
  };

const addInfluencerToLeaderboard = (influencer: Influencer) => {
  setLeaderboard((prev) => {
    const exists = prev.some((item) =>
      normalizeInfluencerName(item.name) === normalizeInfluencerName(influencer.name)
    );
    if (exists) {
      return prev.map((item) =>
        normalizeInfluencerName(item.name) === normalizeInfluencerName(influencer.name)
          ? { ...item, ...influencer }
          : item
      );
    }
    return [...prev, {
      ...influencer,
      id: normalizeInfluencerName(influencer.name) // Garante que o ID está normalizado
    }];
  });
};

  return (
    <AnalysisContext.Provider
      value={{
        loading,
        currentInfluencer,
        analysisState,
        searchResults,
        metrics,
        agentProgress,
        analyzeInfluencer,
        searchInfluencers,
        addInfluencerToLeaderboard,
        leaderboard,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}