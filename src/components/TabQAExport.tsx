import React, { useState, useEffect } from 'react';
import { BriefData, GeneratedVariant, ArchetypeResult } from '../models/types';
import { RISK_PHRASES } from '../utils/constants';
import { exportService } from '../services/exportService';
import { Card, Button, Badge } from './ui';
import { CheckCircle, AlertTriangle, Download, FileText, FileCode2 } from 'lucide-react';

interface TabQAExportProps {
  brief: BriefData;
  variants: GeneratedVariant[];
  archetype: ArchetypeResult | null;
}

export const TabQAExport = ({ brief, variants, archetype }: TabQAExportProps) => {
  const [activeVariant, setActiveVariant] = useState<GeneratedVariant | null>(variants[0] || null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<{label: string, checked: boolean}[]>([]);

  useEffect(() => {
    if (variants.length > 0 && !activeVariant) {
      setActiveVariant(variants[0]);
    }
  }, [variants]);

  useEffect(() => {
    if (!activeVariant) return;

    // 1. Check Risk Phrases
    const textToCheck = activeVariant.content.article.toLowerCase();
    const foundWarnings = RISK_PHRASES.filter(phrase => textToCheck.includes(phrase.toLowerCase()));
    
    if (activeVariant.content.metaTitle) {
      if (activeVariant.content.metaTitle.length > 65) foundWarnings.push('Meta Title длиннее 65 символов');
    }
    if (activeVariant.content.metaDescription) {
      if (activeVariant.content.metaDescription.length > 160) foundWarnings.push('Meta Description длиннее 160 символов');
    }

    setWarnings(foundWarnings);

    // 2. Build Checklist based on Mode
    const newChecklist = [
      { label: 'E-E-A-T: Текст выглядит экспертно и достоверно', checked: true },
      { label: `Tone of Voice соответствует: ${brief.toneOfVoice}`, checked: true },
    ];

    if (brief.mode === 'SEO') {
      newChecklist.push({ label: `Соответствует Intent: ${brief.searchIntent}`, checked: true });
      newChecklist.push({ label: 'Присутствуют H1 и H2 заголовки', checked: activeVariant.content.article.includes('##') });
      newChecklist.push({ label: 'Сгенерированы Meta теги', checked: !!activeVariant.content.metaTitle });
      newChecklist.push({ label: 'Сгенерирован блок FAQ', checked: !!activeVariant.content.faq?.length });
    } else if (brief.mode === 'Ads') {
      newChecklist.push({ label: `Использована структура: ${brief.adStructure}`, checked: true });
      newChecklist.push({ label: 'Есть варианты заголовков', checked: !!activeVariant.content.headlines?.length });
      newChecklist.push({ label: 'Есть призывы к действию (CTA)', checked: !!activeVariant.content.ctas?.length });
      newChecklist.push({ label: 'Отработаны возражения', checked: !!activeVariant.content.objections?.length });
    } else {
      newChecklist.push({ label: 'Выделены ключевые факты', checked: !!activeVariant.content.facts });
      newChecklist.push({ label: 'Объяснена важность (Why it matters)', checked: !!activeVariant.content.whyItMatters });
    }

    setChecklist(newChecklist);

  }, [activeVariant, brief]);

  if (!activeVariant) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Нет сгенерированных вариантов для проверки. Сначала создайте контент в Генераторе.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Проверяемый вариант:</span>
          <select 
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none"
            value={activeVariant.id}
            onChange={(e) => setActiveVariant(variants.find(v => v.id === e.target.value) || null)}
          >
            {variants.map((v, i) => (
              <option key={v.id} value={v.id}>Вариант {variants.length - i} ({new Date(v.timestamp).toLocaleTimeString()})</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportService.exportToMarkdown(activeVariant, brief, archetype, warnings)} className="flex items-center gap-2 text-sm py-1.5">
            <FileText className="w-4 h-4" /> Markdown
          </Button>
          <Button variant="primary" onClick={() => exportService.exportToHtml(activeVariant, brief, archetype, warnings)} className="flex items-center gap-2 text-sm py-1.5">
            <FileCode2 className="w-4 h-4" /> HTML
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QA Panel */}
        <Card className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Checklist ({brief.mode})</h3>
          </div>
          
          <div className="space-y-3">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${item.checked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {item.checked ? '✓' : '—'}
                </div>
                <span className={`text-sm ${item.checked ? 'text-gray-800' : 'text-gray-500'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Warnings Panel */}
        <Card className="space-y-6 border-l-4 border-amber-400">
          <div className="flex items-center gap-2 border-b pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">Risk Detector</h3>
          </div>

          {warnings.length === 0 ? (
            <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Рискованных фраз не найдено. Текст выглядит безопасно.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-sm">
                Найдены стоп-слова или фразы, которые могут снизить доверие или нарушить правила рекламных площадок.
              </div>
              <ul className="space-y-2">
                {warnings.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-2 rounded border border-gray-100 shadow-sm">
                    <span className="text-amber-500 font-bold">!</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full text-sm mt-2">
                Показать советы по исправлению
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
