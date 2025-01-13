// src/leaderboard/page.tsx
'use client';

import { useAnalysis } from '@/contexts/AnalysisContext';
import { MOCK_CATEGORIES, normalizeInfluencerName } from '@/lib/mockData';
import { Users, CheckCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { formatNumber } from '@/lib/utils';
import ProfilePicture from '@/components/ProfilePicture';

export default function LeaderboardPage() {
  const { leaderboard } = useAnalysis();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortDescending, setSortDescending] = useState(true);

  const defaultInfluencer = {
    name: 'Unknown',
    category: 'Uncategorized',
    trustScore: 0,
    followers: 0,
    claims: [],
    trend: 'stable',
  };

  // Filtra os influenciadores por categoria
  const filteredInfluencers = selectedCategory === 'All'
    ? leaderboard
    : leaderboard.filter((influencer) => influencer.category === selectedCategory);

  // Ordena os influenciadores por Trust Score
  const sortedInfluencers = [...filteredInfluencers].sort((a, b) => {
    return sortDescending
      ? b.trustScore - a.trustScore
      : a.trustScore - b.trustScore;
  });

  // Calcula as métricas dinâmicas
  const activeInfluencers = filteredInfluencers.length;
  const claimsVerified = filteredInfluencers.reduce(
    (total, influencer) => total + (influencer.claims?.length || 0),
    0
  );
  const averageTrustScore = filteredInfluencers.length
    ? (
        filteredInfluencers.reduce((sum, influencer) => sum + influencer.trustScore, 0) /
        filteredInfluencers.length
      ).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-100">
      <div className="mx-auto max-w-7xl p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            Influencer Trust Leaderboard
          </h1>
          <p className="mt-1 text-sm md:text-lg text-gray-400">
            Real-time rankings of health influencers based on scientific accuracy, credibility, and transparency. Updated daily using AI-powered analysis.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <Users className="h-6 w-6 text-emerald-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(activeInfluencers)}
                </p>
                <p className="text-sm text-gray-400">Active Influencers</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-6 w-6 text-emerald-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {formatNumber(claimsVerified)}
                </p>
                <p className="text-sm text-gray-400">Claims Verified</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-6 w-6 text-emerald-500" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {averageTrustScore}%
                </p>
                <p className="text-sm text-gray-400">Average Trust Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters and Sorting Button */}
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {['All', ...MOCK_CATEGORIES.filter((category) => category !== 'All')].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSortDescending(!sortDescending)}
            className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-2 text-sm font-medium text-gray-400 transition hover:border-gray-700 hover:bg-gray-800 hover:text-white"
          >
            <TrendingUp
              className={`h-4 w-4 transition-transform ${sortDescending ? 'rotate-0' : 'rotate-180'}`}
            />
            {sortDescending ? 'Highest First' : 'Lowest First'}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="w-[100px] px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Influencer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Trust Score
                </th>
                <th className="w-[100px] px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Followers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Verified Claims
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedInfluencers.map((influencer, index) => (
                <tr key={influencer.name} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    <Link
                      href={`/influencer/${normalizeInfluencerName(influencer.name)}`}
                      className="flex items-center gap-3"
                    >
                      <ProfilePicture
                        influencer={{
                          name: influencer.name,
                          profilePicture: influencer.profilePicture
                        }}
                        size={40}
                      />
                      {influencer.name || defaultInfluencer.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {influencer.category || defaultInfluencer.category}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    influencer.trustScore >= 90 ? 'text-emerald-500' : 'text-yellow-500'
                  }`}>
                    {influencer.trustScore ?? defaultInfluencer.trustScore}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-emerald-500" strokeWidth={1.5} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {influencer.followers ?? defaultInfluencer.followers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {influencer.claims?.length ?? defaultInfluencer.claims.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}