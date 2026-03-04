import React from 'react';
import { BriefData } from '../models/types';
import { Card, Input, Textarea, Select, Button, Badge } from './ui';
import { Info, Save, Play } from 'lucide-react';

interface TabBriefProps {
  brief: BriefData;
  setBrief: (brief: BriefData) => void;
  onSave: () => void;
  onNext: () => void;
}

export const TabBrief = ({ brief, setBrief, onSave, onNext }: TabBriefProps) => {
  
  const handleChange = (field: keyof BriefData, value: any) => {
    setBrief({ ...brief, [field]: value });
  };

  const handleAdvantageChange = (index: number, value: string) => {
    const newAdv = [...brief.advantages];
    newAdv[index] = value;
    handleChange('advantages', newAdv);
  };

  const addAdvantage = () => {
    handleChange('advantages', [...brief.advantages, '']);
  };

  const removeAdvantage = (index: number) => {
    const newAdv = brief.advantages.filter((_, i) => i !== index);
    handleChange('advantages', newAdv);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#DFF3DF] rounded-2xl p-6 flex items-start gap-4">
        <Info className="w-6 h-6 text-green-700 shrink-0 mt-1" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Зачем эта вкладка?</h2>
          <p className="text-gray-700 mt-1">
            Здесь мы собираем структурированные требования (Бриф). Чем точнее данные, тем лучше результат генерации. 
            Справа вы видите "Карту требований", которая показывает, как эти данные будут использованы.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Базовая информация</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Название продукта *" 
                value={brief.productName} 
                onChange={(e: any) => handleChange('productName', e.target.value)} 
                placeholder="Например: AI-сервис Mira"
              />
              <Select 
                label="Режим генерации *" 
                value={brief.mode} 
                onChange={(e: any) => handleChange('mode', e.target.value)}
                options={['SEO', 'Ads', 'PR']}
                className="bg-[#FFD1A6]/20"
              />
            </div>
            
            <Textarea 
              label="Краткое описание *" 
              value={brief.shortDescription} 
              onChange={(e: any) => handleChange('shortDescription', e.target.value)} 
              placeholder="Что это и какую проблему решает?"
              rows={2}
            />
            
            <Input 
              label="Целевая аудитория *" 
              value={brief.targetAudience} 
              onChange={(e: any) => handleChange('targetAudience', e.target.value)} 
              placeholder="Например: HR-специалисты, 25-40 лет"
            />

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Преимущества / USP (минимум 3) *</label>
              <div className="space-y-2">
                {brief.advantages.map((adv, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input 
                      className="flex-1" 
                      value={adv} 
                      onChange={(e: any) => handleAdvantageChange(idx, e.target.value)} 
                      placeholder={`Преимущество ${idx + 1}`}
                    />
                    {brief.advantages.length > 3 && (
                      <Button variant="secondary" onClick={() => removeAdvantage(idx)} className="px-3 text-red-500">✕</Button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" onClick={addAdvantage} className="text-sm mt-2">+ Добавить преимущество</Button>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Стиль и ограничения</h3>
            <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Tone of Voice" 
                value={brief.toneOfVoice} 
                onChange={(e: any) => handleChange('toneOfVoice', e.target.value)}
                options={['нейтральный', 'дружелюбный', 'премиальный', 'экспертный', 'дерзкий']}
              />
              <Select 
                label="Сила клеймов (обещаний)" 
                value={brief.claimStrength} 
                onChange={(e: any) => handleChange('claimStrength', e.target.value)}
                options={['low', 'medium', 'high']}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Регион" 
                value={brief.region} 
                onChange={(e: any) => handleChange('region', e.target.value)} 
              />
              <Select 
                label="Язык" 
                value={brief.language} 
                onChange={(e: any) => handleChange('language', e.target.value)}
                options={[{value: 'ru', label: 'Русский'}, {value: 'en', label: 'English'}]}
              />
            </div>
            <Textarea 
              label="Ограничения (Constraints)" 
              value={brief.constraints} 
              onChange={(e: any) => handleChange('constraints', e.target.value)} 
              placeholder="Что нельзя обещать или говорить? (Например: не гарантировать 100% результат)"
              rows={2}
            />
          </Card>

          <Card className="space-y-4 border-l-4 border-[#FFD1A6]">
            <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
              Специфичные настройки для: <Badge variant="orange">{brief.mode}</Badge>
            </h3>
            
            {brief.mode === 'SEO' && (
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Search Intent" 
                  value={brief.searchIntent || 'informational'} 
                  onChange={(e: any) => handleChange('searchIntent', e.target.value)}
                  options={['informational', 'commercial', 'navigational', 'transactional']}
                />
                <Select 
                  label="SERP Pattern" 
                  value={brief.serpPattern || 'guide'} 
                  onChange={(e: any) => handleChange('serpPattern', e.target.value)}
                  options={['guide', 'list', 'faq', 'comparison']}
                />
                <div className="col-span-2">
                  <Input 
                    label="Ключевые слова (через запятую)" 
                    value={brief.keywords?.join(', ') || ''} 
                    onChange={(e: any) => handleChange('keywords', e.target.value.split(',').map((k: string) => k.trim()))} 
                    placeholder="seo, маркетинг, продвижение"
                  />
                </div>
              </div>
            )}

            {brief.mode === 'Ads' && (
              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Структура рекламы" 
                  value={brief.adStructure || 'AIDA'} 
                  onChange={(e: any) => handleChange('adStructure', e.target.value)}
                  options={['AIDA', 'PAS', 'BAB']}
                />
                <Select 
                  label="Цель CTA" 
                  value={brief.ctaGoal || 'консультация'} 
                  onChange={(e: any) => handleChange('ctaGoal', e.target.value)}
                  options={['консультация', 'демо', 'расчёт', 'скачать', 'подписка']}
                />
              </div>
            )}

            {brief.mode === 'PR' && (
              <div className="grid grid-cols-1 gap-4">
                <Select 
                  label="Фокус PR-материала" 
                  value={brief.prFocus || 'announcement'} 
                  onChange={(e: any) => handleChange('prFocus', e.target.value)}
                  options={['announcement', 'thought-leadership', 'partnership', 'case-note']}
                />
              </div>
            )}
          </Card>

          <div className="flex justify-between items-center pt-4">
            <Button variant="secondary" onClick={onSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" /> Сохранить brief
            </Button>
            <Button onClick={onNext} className="flex items-center gap-2">
              Открыть в Генераторе <Play className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Map Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <Card className="bg-gray-50 border-gray-200">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                🗺️ Карта требований
              </h3>
              <div className="space-y-4 text-sm">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <div className="font-medium text-gray-800 mb-1">Tone of Voice ➔ Промпт</div>
                  <div className="text-gray-600">Определяет лексику. Сейчас: <span className="font-semibold text-blue-600">{brief.toneOfVoice}</span></div>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <div className="font-medium text-gray-800 mb-1">Ограничения ➔ Guardrails</div>
                  <div className="text-gray-600">LLM получит инструкцию избегать: <span className="italic">{brief.constraints || 'нет ограничений'}</span></div>
                </div>
                
                {brief.mode === 'SEO' && (
                  <div className="bg-[#DCEEFF]/50 p-3 rounded-xl shadow-sm border border-blue-100">
                    <div className="font-medium text-gray-800 mb-1">Intent ➔ Структура</div>
                    <div className="text-gray-600">Статья будет адаптирована под <span className="font-semibold text-blue-600">{brief.searchIntent}</span> запрос.</div>
                  </div>
                )}
                {brief.mode === 'Ads' && (
                  <div className="bg-[#FFD1A6]/30 p-3 rounded-xl shadow-sm border border-orange-100">
                    <div className="font-medium text-gray-800 mb-1">Формула ➔ Абзацы</div>
                    <div className="text-gray-600">Текст будет разбит по шагам <span className="font-semibold text-orange-600">{brief.adStructure}</span>.</div>
                  </div>
                )}
                {brief.mode === 'PR' && (
                  <div className="bg-[#DFF3DF]/50 p-3 rounded-xl shadow-sm border border-green-100">
                    <div className="font-medium text-gray-800 mb-1">Фокус ➔ Акценты</div>
                    <div className="text-gray-600">Главная мысль: <span className="font-semibold text-green-600">{brief.prFocus}</span>.</div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
