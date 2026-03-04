import { BriefData, GeneratedVariant, ArchetypeResult } from '../models/types';

const STORAGE_KEY_BRIEF = 'ai_marketing_builder_brief';
const STORAGE_KEY_VARIANTS = 'ai_marketing_builder_variants';
const STORAGE_KEY_ARCHETYPE = 'ai_marketing_builder_archetype';

export const storageService = {
  saveBrief(brief: BriefData) {
    localStorage.setItem(STORAGE_KEY_BRIEF, JSON.stringify(brief));
  },
  getBrief(): BriefData | null {
    const data = localStorage.getItem(STORAGE_KEY_BRIEF);
    return data ? JSON.parse(data) : null;
  },
  
  saveVariants(variants: GeneratedVariant[]) {
    localStorage.setItem(STORAGE_KEY_VARIANTS, JSON.stringify(variants));
  },
  getVariants(): GeneratedVariant[] {
    const data = localStorage.getItem(STORAGE_KEY_VARIANTS);
    return data ? JSON.parse(data) : [];
  },
  addVariant(variant: GeneratedVariant) {
    const variants = this.getVariants();
    variants.unshift(variant); // Add to beginning
    this.saveVariants(variants);
  },
  
  saveArchetype(archetype: ArchetypeResult) {
    localStorage.setItem(STORAGE_KEY_ARCHETYPE, JSON.stringify(archetype));
  },
  getArchetype(): ArchetypeResult | null {
    const data = localStorage.getItem(STORAGE_KEY_ARCHETYPE);
    return data ? JSON.parse(data) : null;
  },
  
  clearAll() {
    localStorage.removeItem(STORAGE_KEY_BRIEF);
    localStorage.removeItem(STORAGE_KEY_VARIANTS);
    localStorage.removeItem(STORAGE_KEY_ARCHETYPE);
  }
};
