export type Mode = 'SEO' | 'Ads' | 'PR';

export interface BriefData {
  productName: string;
  shortDescription: string;
  targetAudience: string;
  advantages: string[];
  region: string;
  language: 'ru' | 'en';
  mode: Mode;
  toneOfVoice: string;
  claimStrength: 'low' | 'medium' | 'high';
  constraints: string;
  
  // SEO
  searchIntent?: 'informational' | 'commercial' | 'navigational' | 'transactional';
  keywords?: string[];
  serpPattern?: 'guide' | 'list' | 'faq' | 'comparison';
  
  // Ads
  adStructure?: 'AIDA' | 'PAS' | 'BAB';
  ctaGoal?: 'консультация' | 'демо' | 'расчёт' | 'скачать' | 'подписка';
  
  // PR
  prFocus?: 'announcement' | 'thought-leadership' | 'partnership' | 'case-note';
}

export interface GeneratedVariant {
  id: string;
  timestamp: number;
  content: {
    article: string;
    // SEO
    metaTitle?: string;
    metaDescription?: string;
    faq?: { q: string; a: string }[];
    // Ads
    headlines?: string[];
    ctas?: string[];
    objections?: string[];
    // PR
    facts?: string;
    whyItMatters?: string;
    softCta?: string;
  };
  briefSnapshot: BriefData;
  archetypeSnapshot?: ArchetypeResult | null;
}

export interface ArchetypeResult {
  primary: string;
  scores: Record<string, number>;
  recommendations: {
    tovModifiers: string;
    recommendedWords: string[];
    tabooWords: string[];
    ctaTemplates: string[];
  };
}
