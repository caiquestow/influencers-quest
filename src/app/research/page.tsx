// src/research/page.tsx
'use client';

import { ArrowLeft, Search, Settings, Key } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { normalizeInfluencerName } from '@/lib/mockData';
import { hasApiKey, getApiKey } from '@/lib/cryptoUtils';
import { analyzeWithAI } from '@/services/aiService';
import APIKeyModal from '@/components/APIKeyModal';

const INITIAL_JOURNALS = [
  { name: 'PubMed Central', selected: true },
  { name: 'Science', selected: true },
  { name: 'The Lancet', selected: true },
  { name: 'JAMA Network', selected: true },
  { name: 'Nature', selected: true },
  { name: 'Cell', selected: true },
  { name: 'New England Journal of Medicine', selected: true },
];

const TIME_RANGES = [
  { id: 'week', label: 'Last Week' },
  { id: 'month', label: 'Last Month' },
  { id: 'year', label: 'Last Year' },
  { id: 'all', label: 'All Time' },
];

export default function ResearchPage() {
  const router = useRouter();
  const {
    analyzeInfluencer,
    analysisState,
    agentProgress = [],
    addInfluencerToLeaderboard,
  } = useAnalysis();

  const [isClient, setIsClient] = useState(false);
  const [timeRange, setTimeRange] = useState<string>('month');
  const [influencerName, setInfluencerName] = useState<string>('');
  const [claimsCount, setClaimsCount] = useState<number>(3);
  const [productsCount, setProductsCount] = useState<number>(5);
  const [includeRevenue, setIncludeRevenue] = useState<boolean>(true);
  const [verifyScientific, setVerifyScientific] = useState<boolean>(true);
  const [journals, setJournals] = useState<typeof INITIAL_JOURNALS>(INITIAL_JOURNALS);
  const [notes, setNotes] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isModalLoading, setIsModalLoading] = useState<boolean>(true);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleJournal = (journalName: string) => {
    setJournals((prev) =>
      prev.map((journal) =>
        journal.name === journalName ? { ...journal, selected: !journal.selected } : journal
      )
    );
  };

  const selectAllJournals = () => {
    setJournals((prev) => prev.map((journal) => ({ ...journal, selected: true })));
  };

  const deselectAllJournals = () => {
    setJournals((prev) => prev.map((journal) => ({ ...journal, selected: false })));
  };

  const simulateProgress = async () => {
    let currentProgress = 0;
    while (currentProgress < 100) {
      currentProgress += 10;
      setProgress(currentProgress);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  const handleStartResearch = async () => {
    // Verificação de cliente
    if (!isClient) return;

    if (!influencerName.trim()) return;

    setModalOpen(true);
    setIsModalLoading(true);
    setProgress(0);

    let newInfluencer = {
      name: influencerName.trim(),
      id: normalizeInfluencerName(influencerName),
      claimsCount,
      productsCount,
      includeRevenue,
      verifyScientific,
      journals: journals.filter((journal) => journal.selected).map((journal) => journal.name),
      notes,
    };

    if (hasApiKey()) {
      try {
        const apiKey = getApiKey();
        const aiResult = await analyzeWithAI(influencerName, apiKey);

        if (aiResult.status === 'success' && aiResult.data?.instagram) {
          // Usar dados reais do Instagram
          const igData = aiResult.data.instagram;
          newInfluencer = {
            ...newInfluencer,
            name: igData.name,
            // @ts-expect-error: 'bio' não está definido na tipagem, mas é esperado aqui
            bio: igData.bio,
            role: igData.role,
            followers: igData.followers,
            socialLinks: {
              instagram: `https://instagram.com/${igData.username}`,
              website: igData.website,
            },
            postsCount: igData.posts,
            claims: aiResult.data.claims,
            profilePicture: igData.profilePicture,
          };
        }
      } catch (error) {
        console.error('AI analysis failed, falling back to mock data:', error);
      }
    }

    await simulateProgress();
    setIsModalLoading(false);

    await analyzeInfluencer(newInfluencer);

    if (analysisState === 'complete' || agentProgress.length === 0) {
      addInfluencerToLeaderboard(newInfluencer);
      setModalOpen(false);
      router.push(`/`);
    }
  };

  // Se não for cliente, não renderize nada
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <div className="mx-auto max-w-7xl p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-500">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          <button
            onClick={() => setApiKeyModalOpen(true)}
            className="inline-flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-400"
          >
            <Key className="h-4 w-4" />
            <span>Configure AI API Key</span>
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-white mb-8">Research Tasks</h1>

        <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-700">
              <Settings className="h-4 w-4 text-slate-400" />
            </div>
            <h2 className="text-lg font-medium text-white">Research Configuration</h2>
          </div>

          {/* Specific Influencer / Discovery New */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-lg bg-emerald-950/30 border-2 border-emerald-500/20 p-4">
              <h3 className="text-sm text-white">Specific Influencer</h3>
              <p className="text-sm text-white/60 mt-1">Research a known health influencer by name</p>
            </div>
            <div className="rounded-lg bg-[#0f1724] border border-slate-800/60 p-4">
              <h3 className="text-sm text-slate-400">Discover New</h3>
              <p className="text-sm text-slate-600 mt-1">Find and analyze new health influencers</p>
            </div>
          </div>

          {/* Time Range */}
          <div className="mb-8">
            <h3 className="text-sm text-slate-400 mb-3">Time Range</h3>
            <div className="grid grid-cols-4 gap-2">
              {TIME_RANGES.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id)}
                  className={`rounded-lg py-2 text-sm transition-colors ${
                    timeRange === range.id
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-slate-900/90 text-slate-400 border border-slate-800/60'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Influencer Name */}
          <div className="mb-8">
            <h3 className="text-sm text-slate-400 mb-3">Influencer Name</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
              <input
                type="text"
                value={influencerName}
                onChange={(e) => setInfluencerName(e.target.value)}
                placeholder="Enter influencer name"
                className="w-full rounded-lg bg-slate-900/90 border border-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-slate-400 placeholder-slate-600"
              />
            </div>
          </div>

          {/* Claims to Analyze */}
          <div className="mb-8">
            <h3 className="text-sm text-slate-400 mb-3">Claims to Analyze Per Influencer</h3>
            <input
              type="number"
              value={claimsCount}
              onChange={(e) => setClaimsCount(Number(e.target.value))}
              className="w-full max-w-[120px] rounded-lg bg-slate-900/90 border border-slate-800/60 px-4 py-2.5 text-sm text-slate-400"
            />
            <p className="mt-1 text-xs text-slate-600">
              Recommended: 50-100 claims for comprehensive analysis
            </p>
          </div>

          {/* Products to Find */}
          <div className="mb-8">
            <h3 className="text-sm text-slate-400 mb-3">Products to Find Per Influencer</h3>
            <input
              type="number"
              value={productsCount}
              onChange={(e) => setProductsCount(Number(e.target.value))}
              className="w-full max-w-[120px] rounded-lg bg-slate-900/90 border border-slate-800/60 px-4 py-2.5 text-sm text-slate-400"
            />
            <p className="mt-1 text-xs text-slate-600">Set to 0 to skip product research</p>
          </div>

          {/* Toggle Options */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between py-1">
              <div>
                <h3 className="text-sm text-slate-400">Include Revenue Analysis</h3>
                <p className="text-xs text-slate-600">
                  Analyze monetization methods and estimate earnings
                </p>
              </div>
              <button
                onClick={() => setIncludeRevenue(!includeRevenue)}
                className="h-6 w-11 rounded-full bg-emerald-500/20 relative"
              >
                <div
                  className={`absolute top-1 h-4 w-4 rounded-full bg-emerald-500 transition-all ${
                    includeRevenue ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <h3 className="text-sm text-slate-400">Verify with Scientific Journals</h3>
                <p className="text-xs text-slate-600">
                  Cross-reference claims with scientific literature
                </p>
              </div>
              <button
                onClick={() => setVerifyScientific(!verifyScientific)}
                className="h-6 w-11 rounded-full bg-emerald-500/20 relative"
              >
                <div
                  className={`absolute top-1 h-4 w-4 rounded-full bg-emerald-500 transition-all ${
                    verifyScientific ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Scientific Journals */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-slate-400">Scientific Journals</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={selectAllJournals}
                  className="text-xs text-emerald-500 hover:text-emerald-400"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAllJournals}
                  className="text-xs text-slate-500 hover:text-slate-400"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {journals.map((journal) => (
                <div
                  key={journal.name}
                  onClick={() => toggleJournal(journal.name)}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer ${
                    journal.selected
                      ? 'bg-emerald-950/30 border-2 border-emerald-500/20'
                      : 'bg-slate-900/90 border border-slate-800/60'
                  }`}
                >
                  <span
                    className={
                      journal.selected ? 'text-sm text-white' : 'text-sm text-slate-400'
                    }
                  >
                    {journal.name}
                  </span>
                  <div
                    className={`h-4 w-4 rounded-full ${
                      journal.selected ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  />
                </div>
              ))}
            </div>

            <button className="inline-flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-400 mb-8">
              <span className="text-lg font-medium">+</span>
              <span>Add New Journal</span>
            </button>

            <div>
              <h3 className="text-sm text-slate-400 mb-3">Notes for Research Assistant</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any specific instructions or focus areas..."
                className="w-full h-24 rounded-lg bg-slate-900/90 border border-slate-800/60 p-4 text-sm text-slate-400 placeholder-slate-600 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              onClick={handleStartResearch}
              disabled={!influencerName || analysisState === 'analyzing'}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Research
            </button>
          </div>
        </div>

        {/* Research Progress Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="rounded-lg bg-slate-800 p-6 w-[400px] text-white">
              <h3 className="text-lg font-medium mb-4">Research in Progress</h3>
              {isModalLoading ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Initializing Research</span>
                    <span className="text-sm text-gray-400">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {agentProgress.length > 0 ? (
                    agentProgress.map((agent, idx) => (
                      <li key={idx}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-400">{agent.agent}</span>
                          <span className="text-sm text-gray-400">{agent.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${agent.progress}%` }}
                          />
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-400">No agents available</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* AI API Key Configuration Modal */}
        <APIKeyModal
          isOpen={apiKeyModalOpen}
          onClose={() => setApiKeyModalOpen(false)}
        />
      </div>
    </div>
  );
}