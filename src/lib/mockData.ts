export interface Claim {
  id: string;
  text: string;
  status: 'Verified' | 'Questionable' | 'Debunked';
  category: string;
  score: number;
  date: string;
  evidence: string;
}

export interface Influencer {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  category: string;
  trustScore: number;
  followers?: string;
  yearlyRevenue: string;
  products: number;
  tags: string[];
  claims: Claim[];
  profilePicture?: string;
  claimsCount?: number;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
  };
}

// Mock data pools
const ROLES = [
  "Longevity Specialist",
  "Nutrition Expert",
  "Performance Coach",
  "Medical Doctor",
  "Health Researcher",
  "Wellness Consultant",
  "Fitness Expert",
  "Sleep Specialist",
  "Neuroscientist",
  "Mental Health Expert"
];

const BIO_TEMPLATES = [
  "Leading expert in {category}, focusing on evidence-based approaches to health optimization.",
  "Renowned {category} specialist with extensive research experience in health and wellness.",
  "Pioneering researcher in {category}, dedicated to translating science into practical health solutions.",
  "Distinguished {category} professional helping people achieve optimal health through science-based methods.",
  "Innovative {category} expert combining cutting-edge research with practical applications."
];

const TAG_POOLS: Record<string, string[]> = {
  "Medicine": ["Medicine", "Health", "Longevity", "Research", "Clinical Practice"],
  "Nutrition": ["Nutrition", "Diet", "Metabolism", "Supplements", "Whole Foods"],
  "Fitness": ["Exercise", "Strength", "Performance", "Movement", "Athletic Training"],
  "Mental Health": ["Psychology", "Wellness", "Mindfulness", "Therapy", "Stress Management"],
  "Sleep": ["Sleep Science", "Circadian Rhythm", "Recovery", "Rest", "Sleep Hygiene"],
  "Performance": ["Optimization", "Peak Performance", "Productivity", "Training", "Recovery"],
  "Neuroscience": ["Brain Health", "Cognition", "Neuroplasticity", "Mental Performance", "Neurology"]
};

// Utility functions
export function normalizeInfluencerName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function generateMockInfluencer(name: string): Partial<Influencer> {
  const category = Object.keys(TAG_POOLS)[Math.floor(Math.random() * Object.keys(TAG_POOLS).length)];
  const role = ROLES[Math.floor(Math.random() * ROLES.length)];
  const bioTemplate = BIO_TEMPLATES[Math.floor(Math.random() * BIO_TEMPLATES.length)];
  const bio = bioTemplate.replace("{category}", category);

  const categoryTags = TAG_POOLS[category] || [];
  const tags = [...new Set([
    category,
    ...categoryTags.slice(0, 3 + Math.floor(Math.random() * 2))
  ])];

  const followers = `${(Math.random() * 5 + 0.1).toFixed(1)}M+`;
  const yearlyRevenue = `$${(Math.random() * 10 + 1).toFixed(1)}M`;
  const trustScore = Math.floor(Math.random() * (98 - 85)) + 85;

  return {
    id: normalizeInfluencerName(name),
    name,
    role,
    bio,
    category,
    trustScore,
    followers,
    yearlyRevenue,
    products: Math.floor(Math.random() * 5) + 1,
    tags
  };
}

export function generateMockClaims(category: string, count: number): Claim[] {
  const ACTIVITIES = ["exercise", "meditation", "stretching", "walking"];
  const CONDITIONS = ["heart disease", "anxiety", "inflammation", "chronic pain"];
  const SUPPLEMENTS = ["vitamin D", "omega-3", "magnesium", "zinc"];
  const HEALTH_METRICS = ["blood pressure", "insulin sensitivity", "cognitive function", "immune response"];
  const FOODS = ["leafy greens", "fatty fish", "berries", "nuts"];
  const NUTRIENTS = ["protein", "antioxidants", "fiber", "healthy fats"];
  const BENEFITS = ["muscle recovery", "brain function", "energy levels", "immune system"];
  const TREATMENTS = ["lifestyle intervention", "dietary changes", "stress management", "sleep optimization"];

  const claimTemplates = {
    "Medicine": [
      "Regular {activity} reduces risk of {condition}",
      "Daily {supplement} intake improves {healthMetric}",
      "New research shows {treatment} effectiveness for {condition}"
    ],
    "Nutrition": [
      "{food} consumption increases {nutrient} levels",
      "Regular {diet} improves {healthMetric}",
      "{nutrient} supplementation enhances {benefit}"
    ],
    "Fitness": [
      "{activity} training improves {healthMetric}",
      "Regular {activity} boosts {benefit}",
      "Consistent {activity} reduces {condition} risk"
    ],
    "Mental Health": [
      "Daily {activity} reduces {condition} symptoms",
      "{treatment} shows promising results for {condition}",
      "Regular {activity} improves {healthMetric}"
    ],
    "Sleep": [
      "Optimal sleep improves {healthMetric}",
      "{activity} before bed enhances sleep quality",
      "Poor sleep increases risk of {condition}"
    ],
    "Performance": [
      "{activity} enhances {benefit}",
      "{supplement} supplementation improves {healthMetric}",
      "Proper {treatment} optimization boosts {benefit}"
    ],
    "Neuroscience": [
      "{activity} increases brain plasticity",
      "{treatment} improves {healthMetric}",
      "{supplement} supplementation enhances {benefit}"
    ]
  };

  const templates = claimTemplates[category] || claimTemplates["Medicine"];
  const claims: Claim[] = [];

  const replaceVariables = (template: string) => {
    return template
      .replace("{activity}", ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)])
      .replace("{condition}", CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)])
      .replace("{supplement}", SUPPLEMENTS[Math.floor(Math.random() * SUPPLEMENTS.length)])
      .replace("{healthMetric}", HEALTH_METRICS[Math.floor(Math.random() * HEALTH_METRICS.length)])
      .replace("{food}", FOODS[Math.floor(Math.random() * FOODS.length)])
      .replace("{nutrient}", NUTRIENTS[Math.floor(Math.random() * NUTRIENTS.length)])
      .replace("{benefit}", BENEFITS[Math.floor(Math.random() * BENEFITS.length)])
      .replace("{treatment}", TREATMENTS[Math.floor(Math.random() * TREATMENTS.length)])
      .replace("{diet}", "balanced diet");
  };

  for (let i = 0; i < count; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const score = Math.floor(Math.random() * (100 - 70)) + 70;
    const date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    claims.push({
      id: `claim-${Date.now()}-${i}`,
      text: replaceVariables(template),
      status: score > 90 ? "Verified" : score > 80 ? "Questionable" : "Debunked",
      category,
      score,
      date,
      evidence: `Scientific evidence supporting this claim includes multiple peer-reviewed studies and clinical trials.`
    });
  }

  return claims;
}

export const MOCK_METRICS = {
  totalInfluencers: 1234,
  claimsVerified: 25431,
  averageTrustScore: 85.7
};

export const MOCK_CATEGORIES = [
  "All",
  "Nutrition",
  "Fitness",
  "Medicine",
  "Mental Health",
  "Sleep",
  "Performance",
  "Neuroscience"
];
