import React, { useState } from 'react';
import { BriefData, GeneratedVariant, ArchetypeResult } from '../models/types';
import { Card, Button, Badge } from './ui';
import { llmService } from '../services/llmService';
import { storageService } from '../services/storageService';
import { Loader2, Sparkles, History, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface TabGeneratorProps {
  brief: BriefData;
  archetype: ArchetypeResult | null;
  variants: GeneratedVariant[];
  setVariants: (v: GeneratedVariant[]) => void;
  onGoToArchetypes: () => void;
}

export const TabGenerator = ({ brief, archetype, variants, setVariants, onGoToArchetypes }: TabGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeVariantId, setActiveVariantId] = useState<string | null>(variants[0]?.id || null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const content = await llmService.generateContent(brief, archetype);
      const newVariant: GeneratedVariant = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        content,
        briefSnapshot: { ...brief },
        archetypeSnapshot: archetype ? { ...archetype } : null
      };
      
      const newVariants = [newVariant, ...variants];
      setVariants(newVariants);
      storageService.saveVariants(newVariants);
      setActiveVariantId(newVariant.id);
    } catch (error) {
      alert('Ошибка при генерации. Проверьте консоль.');
    } finally {
      setIsGenerating(false);
    }
  };

  const activeVariant = variants.find(v => v.id === activeVariantId);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#FFD1A6]/30 rounded-2xl p-6 flex items-start gap-4">
        <Sparkles className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">Генератор контента</h2>
          <p className="text-gray-700 mt-1 mb-4">
            Здесь мы превращаем Бриф в готовый текст. Вы можете сгенерировать несколько вариантов и сравнить их.
          </p>
          <div className="flex flex-wrap gap-2 items-center bg-white/50 p-3 rounded-xl border border-orange-100/50">
            <span className="text-sm text-gray-700 font-medium mr-1">Настройки для новой генерации:</span>
            <Badge variant="blue">Режим: {brief.mode}</Badge>
            <Badge variant="default">Tone: {brief.toneOfVoice}</Badge>
            {archetype ? (
              <Badge variant="orange">Архетип: {archetype.primary}</Badge>
            ) : (
              <span className="text-xs text-gray-500 italic">Архетип не выбран</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <Button onClick={handleGenerate} disabled={isGenerating} className="flex items-center gap-2 justify-center">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {variants.length > 0 ? 'Сгенерировать новый вариант' : 'Сгенерировать'}
          </Button>
          <Button variant="outline" onClick={onGoToArchetypes} className="text-sm bg-white">
            {archetype ? 'Изменить архетип' : 'Выбрать архетип'} <ArrowRight className="w-4 h-4 inline ml-1" />
          </Button>
        </div>
      </div>

      {variants.length === 0 && !isGenerating && (
        <Card className="text-center py-16 bg-gray-50 border-dashed border-2">
          <div className="text-gray-400 mb-4">
            <Sparkles className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Пока нет сгенерированных вариантов</h3>
          <p className="text-gray-500 mb-6">Нажмите кнопку "Сгенерировать", чтобы создать первый вариант на основе вашего брифа.</p>
          <Button onClick={handleGenerate}>Сгенерировать контент</Button>
        </Card>
      )}

      {variants.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* History Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <History className="w-4 h-4" /> История ({variants.length})
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {variants.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setActiveVariantId(v.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    activeVariantId === v.id 
                      ? 'bg-white border-[#FFD1A6] shadow-sm ring-1 ring-[#FFD1A6]' 
                      : 'bg-gray-50 border-gray-200 hover:bg-white'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">Вариант {variants.length - idx}</div>
                  <div className="text-xs text-gray-500 mb-2">
                    {new Date(v.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="blue">{v.briefSnapshot.mode}</Badge>
                    {v.archetypeSnapshot && <Badge variant="orange">{v.archetypeSnapshot.primary}</Badge>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeVariant && (
              <Card className="min-h-[600px]">
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Результат генерации</h3>
                  <div className="flex gap-2">
                    <Badge variant="default">Tone: {activeVariant.briefSnapshot.toneOfVoice}</Badge>
                    {activeVariant.archetypeSnapshot && (
                      <Badge variant="orange">Archetype: {activeVariant.archetypeSnapshot.primary}</Badge>
                    )}
                  </div>
                </div>

                <div className="prose prose-blue max-w-none">
                  {/* Article Body */}
                  <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
                    <ReactMarkdown>{activeVariant.content.article}</ReactMarkdown>
                  </div>

                  {/* Mode Specific Outputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeVariant.briefSnapshot.mode === 'SEO' && (
                      <>
                        <div className="bg-[#DCEEFF]/30 p-5 rounded-xl border border-blue-100">
                          <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-3">Meta Tags</h4>
                          <div className="mb-3">
                            <div className="text-xs text-gray-500 mb-1">Title ({activeVariant.content.metaTitle?.length}/65)</div>
                            <div className="font-medium text-blue-900">{activeVariant.content.metaTitle}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Description ({activeVariant.content.metaDescription?.length}/160)</div>
                            <div className="text-sm text-gray-700">{activeVariant.content.metaDescription}</div>
                          </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">FAQ Block</h4>
                          <div className="space-y-3">
                            {activeVariant.content.faq?.map((item, i) => (
                              <div key={i} className="text-sm">
                                <div className="font-semibold text-gray-900">Q: {item.q}</div>
                                <div className="text-gray-600 mt-1">A: {item.a}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {activeVariant.briefSnapshot.mode === 'Ads' && (
                      <>
                        <div className="bg-[#FFD1A6]/20 p-5 rounded-xl border border-orange-100">
                          <h4 className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-3">Headlines & CTAs</h4>
                          <div className="mb-4">
                            <div className="text-xs text-gray-500 mb-2">Headlines</div>
                            <ul className="list-disc pl-4 space-y-1 text-sm font-medium">
                              {activeVariant.content.headlines?.map((h, i) => <li key={i}>{h}</li>)}
                            </ul>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-2">CTAs</div>
                            <div className="flex flex-wrap gap-2">
                              {activeVariant.content.ctas?.map((c, i) => (
                                <span key={i} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">{c}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Objection Handling</h4>
                          <ul className="space-y-2 text-sm">
                            {activeVariant.content.objections?.map((o, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-green-500 shrink-0">✓</span>
                                <span className="text-gray-700">{o}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    {activeVariant.briefSnapshot.mode === 'PR' && (
                      <>
                        <div className="bg-[#DFF3DF]/40 p-5 rounded-xl border border-green-100">
                          <h4 className="text-sm font-bold text-green-800 uppercase tracking-wider mb-3">Key Facts</h4>
                          <div className="text-sm text-gray-800 whitespace-pre-line">
                            {activeVariant.content.facts}
                          </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                          <div>
                            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Why it matters</h4>
                            <div className="text-sm text-gray-700">{activeVariant.content.whyItMatters}</div>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2">Soft CTA</h4>
                            <div className="text-sm font-medium text-blue-600 bg-blue-50 p-2 rounded">{activeVariant.content.softCta}</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
