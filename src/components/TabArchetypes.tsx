import React, { useState } from 'react';
import { ArchetypeResult } from '../models/types';
import { ARCHETYPES_INFO } from '../utils/constants';
import { Card, Button, Textarea } from './ui';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TabArchetypesProps {
  archetype: ArchetypeResult | null;
  setArchetype: (a: ArchetypeResult) => void;
  onApply: () => void;
}

export const TabArchetypes = ({ archetype, setArchetype, onApply }: TabArchetypesProps) => {
  const [mode, setMode] = useState<'quiz' | 'text'>('quiz');
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simplified mock quiz/analysis for MVP
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Mock logic: pick random archetype or based on text length
      const keys = Object.keys(ARCHETYPES_INFO);
      const primary = keys[Math.floor(Math.random() * keys.length)];
      
      const result: ArchetypeResult = {
        primary,
        scores: {
          [primary]: 65,
          [keys[(keys.indexOf(primary) + 1) % keys.length]]: 25,
          [keys[(keys.indexOf(primary) + 2) % keys.length]]: 10,
        },
        recommendations: ARCHETYPES_INFO[primary]
      };
      
      setArchetype(result);
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#FFD1A6]/20 rounded-2xl p-6 flex items-start gap-4">
        <Sparkles className="w-6 h-6 text-orange-600 shrink-0 mt-1" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Архетип бренда</h2>
          <p className="text-gray-700 mt-1">
            Архетипы помогают создать цельный и узнаваемый образ бренда. Выберите способ определения архетипа 
            и посмотрите, как он изменит tone of voice и лексику в генераторе.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'quiz' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setMode('quiz')}
            >
              Опросник (Mock)
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'text' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setMode('text')}
            >
              Анализ текста
            </button>
          </div>

          <Card>
            {mode === 'quiz' ? (
              <div className="space-y-4 text-center py-8">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900">Пройдите короткий тест</h3>
                <p className="text-gray-500 text-sm mb-6">Ответьте на 5 вопросов о вашем бренде, чтобы мы подобрали архетип.</p>
                <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? 'Анализируем...' : 'Начать тест (Авто-результат)'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea 
                  label="Вставьте текст вашего бренда (посты, статьи, о нас)" 
                  placeholder="Мы верим, что каждый может стать героем своей истории..."
                  value={textInput}
                  onChange={(e: any) => setTextInput(e.target.value)}
                  rows={6}
                />
                <Button onClick={handleAnalyze} disabled={isAnalyzing || !textInput.trim()} className="w-full">
                  {isAnalyzing ? 'Анализируем...' : 'Определить архетип по тексту'}
                </Button>
              </div>
            )}
          </Card>
        </div>

        <div>
          {archetype ? (
            <Card className="border-2 border-[#FFD1A6] bg-gradient-to-b from-white to-[#FFD1A6]/5">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFD1A6]/30 text-orange-600 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{archetype.primary}</h3>
                <p className="text-gray-500 mt-1">Доминирующий архетип ({archetype.scores[archetype.primary]}%)</p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="font-semibold text-gray-800 mb-2">Tone of Voice</div>
                  <div className="text-gray-600">{archetype.recommendations.tovModifiers}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="font-semibold text-green-800 mb-2">Рекомендовано</div>
                    <ul className="list-disc pl-4 text-green-700 space-y-1">
                      {archetype.recommendations.recommendedWords.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl">
                    <div className="font-semibold text-red-800 mb-2">Табу (Избегать)</div>
                    <ul className="list-disc pl-4 text-red-700 space-y-1">
                      {archetype.recommendations.tabooWords.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="font-semibold text-gray-800 mb-2">Примеры CTA</div>
                  <div className="flex flex-wrap gap-2">
                    {archetype.recommendations.ctaTemplates.map((cta, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{cta}</span>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={onApply} className="w-full mt-6 flex items-center justify-center gap-2">
                Отправить в Генератор <ArrowRight className="w-4 h-4" />
              </Button>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400">
              <div>
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Пройдите тест или проанализируйте текст, чтобы увидеть результат здесь.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
