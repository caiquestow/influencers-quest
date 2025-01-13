// src/influencer/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, Users, Search, Filter } from 'lucide-react';
import { normalizeInfluencerName } from '@/lib/mockData';
import ProfilePicture from '@/components/ProfilePicture';

const CATEGORIES = [
  'All Categories', 'Sleep', 'Performance', 'Hormones', 'Nutrition',
  'Exercise', 'Stress', 'Cognition', 'Motivation', 'Recovery', 'Mental Health'
];

const STATUSES = ['All Statuses', 'Verified', 'Questionable', 'Debunked'];

export default function InfluencerProfilePage() {
  const { leaderboard } = useAnalysis();
  const params = useParams();

  // Normaliza o ID da URL e procura o influencer correspondente
  const influencer = leaderboard.find((inf) =>
    normalizeInfluencerName(inf.name) === normalizeInfluencerName(params.id as string)
  );

  const [activeTab, setActiveTab] = useState('claims-analysis');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('Date');

  // Debug logs
  useEffect(() => {
    if (influencer) {
      console.log('Influencer found:', {
        name: influencer.name,
        profilePicture: influencer.profilePicture,
        hasProfilePicture: !!influencer.profilePicture
      });
    }
  }, [influencer]);

  if (!influencer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C] text-gray-100">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredClaims = influencer.claims
    ?.filter((claim) => selectedCategory === 'All Categories' || claim.category === selectedCategory)
    ?.filter((claim) => selectedStatus === 'All Statuses' || claim.status === selectedStatus)
    ?.filter((claim) => claim.text.toLowerCase().includes(searchTerm.toLowerCase()))
    ?.sort((a, b) => (sortBy === 'Date' ? new Date(b.date).getTime() - new Date(a.date).getTime() : b.score - a.score)) || [];

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-100">
      <div className="mx-auto max-w-7xl p-8">
        <div className="mb-12">
          <div className="flex items-center gap-6">
            <ProfilePicture
              influencer={{
                name: influencer.name,
                profilePicture: influencer.profilePicture
              }}
              size={80}
            />
            <div>
              <h1 className="text-3xl font-semibold text-white mb-2">{influencer.name}</h1>
              <p className="text-sm text-gray-400 mb-4">{influencer.role || 'Digital Influencer'}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {influencer.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-400">{influencer.bio || 'No biography provided.'}</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Trust Score</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <span className={`text-2xl font-bold ${influencer.trustScore >= 90 ? 'text-emerald-500' : 'text-yellow-500'}`}>{influencer.trustScore}%</span>
              <p className="mt-1 text-xs text-gray-500">Based on {influencer.claims?.length || 0} verified claims</p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Yearly Revenue</span>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <span className="text-2xl font-bold text-emerald-500">{influencer.yearlyRevenue}</span>
              <p className="mt-1 text-xs text-gray-500">Estimated earnings</p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Products</span>
              <Package className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <span className="text-2xl font-bold text-emerald-500">{influencer.products || 0}</span>
              <p className="mt-1 text-xs text-gray-500">Recommended products</p>
            </div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Followers</span>
              <Users className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <span className="text-2xl font-bold text-emerald-500">{influencer.followers}</span>
              <p className="mt-1 text-xs text-gray-500">Total following</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-8">
          <div className="flex gap-8">
            {['Claims Analysis', 'Recommended Products', 'Monetization'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                className={`border-b-2 pb-4 text-sm font-medium transition-colors ${
                  activeTab === tab.toLowerCase().replace(' ', '-')
                    ? 'border-emerald-500 text-white'
                    : 'border-transparent text-gray-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        {activeTab === 'claims-analysis' && (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-gray-900 py-2 pl-10 pr-4 text-sm text-gray-400 placeholder-gray-600"
              />
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3 py-1 text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Verification Status</span>
                <div className="flex gap-2">
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`rounded-full px-3 py-1 text-sm transition-colors ${
                        selectedStatus === status
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-1 text-sm text-gray-400"
                >
                  <option>Date</option>
                  <option>Trust Score</option>
                </select>
                <button className="rounded-lg border border-gray-800 p-1">
                  <Filter className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Claims List */}
        {activeTab === 'claims-analysis' && (
          <div className="space-y-6">
            {filteredClaims.map((claim) => (
              <div key={claim.id} className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        claim.status === 'Verified'
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : claim.status === 'Questionable'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {claim.status}
                    </span>
                    <span className="text-xs text-gray-500">{claim.date}</span>
                  </div>
                  <h3 className="text-white">{claim.text}</h3>
                </div>
                <div className="flex items-start justify-between">
                  <button className="text-sm text-emerald-500 hover:text-emerald-400">View Source →</button>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${claim.score >= 90 ? 'text-emerald-500' : 'text-yellow-500'}`}>{claim.score}%</span>
                    <p className="text-xs text-gray-500">Trust Score</p>
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-800 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-700">🤖</span>
                    <span className="text-gray-400">AI Analysis</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">{claim.evidence}</p>
                  <button className="mt-2 text-sm text-emerald-500 hover:text-emerald-400">View Research →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}