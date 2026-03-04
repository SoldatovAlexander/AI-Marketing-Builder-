import React, { useState, useEffect } from 'react';
import { BriefData, GeneratedVariant, ArchetypeResult } from './models/types';
import { PRESETS } from './utils/constants';
import { storageService } from './services/storageService';
import { TabTerms } from './components/TabTerms';
import { TabBrief } from './components/TabBrief';
import { TabGenerator } from './components/TabGenerator';
import { TabArchetypes } from './components/TabArchetypes';
import { TabQAExport } from './components/TabQAExport';
import { Button, Badge } from './components/ui';
import { BookOpen, FileEdit, Sparkles, Wand2, CheckSquare, Download } from 'lucide-react';

const defaultBrief: BriefData = {
  productName: '',
  shortDescription: '',
  targetAudience: '',
  advantages: ['', '', ''],
  region: '',
  language: 'ru',
  mode: 'SEO',
  toneOfVoice: 'нейтральный',
  claimStrength: 'medium',
  constraints: '',
  searchIntent: 'informational',
  serpPattern: 'guide',
  adStructure: 'AIDA',
  ctaGoal: 'консультация',
  prFocus: 'announcement'
};

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [brief, setBrief] = useState<BriefData>(defaultBrief);
  const [variants, setVariants] = useState<GeneratedVariant[]>([]);
  const [archetype, setArchetype] = useState<ArchetypeResult | null>(null);
  const [saveStatus, setSaveStatus] = useState('');

  // Load from local storage on mount
  useEffect(() => {
    const savedBrief = storageService.getBrief();
    if (savedBrief) setBrief(savedBrief);
    
    const savedVariants = storageService.getVariants();
    if (savedVariants.length > 0) setVariants(savedVariants);
    
    const savedArchetype = storageService.getArchetype();
    if (savedArchetype) setArchetype(savedArchetype);
  }, []);

  const handleSaveBrief = () => {
    storageService.saveBrief(brief);
    setSaveStatus('Сохранено (local)');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const loadPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setBrief(preset);
      setActiveTab(1); // Go to brief tab
      setSaveStatus('Пресет загружен');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const tabs = [
    { id: 0, label: 'Термины', icon: BookOpen },
    { id: 1, label: 'Требования (Brief)', icon: FileEdit },
    { id: 2, label: 'Генератор', icon: Sparkles },
    { id: 3, label: 'Архетип бренда', icon: Wand2 },
    { id: 4, label: 'QA и Экспорт', icon: CheckSquare }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-[#FFD1A6] selection:text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#DCEEFF] to-[#DFF3DF] rounded-lg flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800">
              AI Marketing Builder <span className="text-sm font-normal text-gray-500 ml-2 px-2 py-0.5 bg-gray-100 rounded-full">Учебный режим</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {saveStatus && <span className="text-sm text-green-600 font-medium animate-pulse">{saveStatus}</span>}
            
            <div className="relative group">
              <Button variant="secondary" className="text-sm">Prefill примерами ▾</Button>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                <div className="p-2 space-y-1">
                  <button onClick={() => loadPreset('preset1')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">
                    <div className="font-medium">HR / Рекрутинг</div>
                    <div className="text-xs text-gray-500">Ads + AIDA</div>
                  </button>
                  <button onClick={() => loadPreset('preset2')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">
                    <div className="font-medium">Стройка / Технадзор</div>
                    <div className="text-xs text-gray-500">SEO + Commercial</div>
                  </button>
                  <button onClick={() => loadPreset('preset3')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">
                    <div className="font-medium">Образование / Курс</div>
                    <div className="text-xs text-gray-500">Ads + PAS</div>
                  </button>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="text-sm flex items-center gap-2" onClick={() => setActiveTab(4)}>
              <Download className="w-4 h-4" /> Экспорт
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-8 mb-8">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#FFD1A6] text-gray-900 shadow-sm' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-700' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4">
        {activeTab === 0 && <TabTerms onNext={() => setActiveTab(1)} />}
        {activeTab === 1 && (
          <TabBrief 
            brief={brief} 
            setBrief={setBrief} 
            onSave={handleSaveBrief} 
            onNext={() => setActiveTab(2)} 
          />
        )}
        {activeTab === 2 && (
          <TabGenerator 
            brief={brief} 
            archetype={archetype} 
            variants={variants} 
            setVariants={setVariants}
            onGoToArchetypes={() => setActiveTab(3)}
          />
        )}
        {activeTab === 3 && (
          <TabArchetypes 
            archetype={archetype} 
            setArchetype={(a) => {
              setArchetype(a);
              storageService.saveArchetype(a);
            }} 
            onApply={() => setActiveTab(2)} 
          />
        )}
        {activeTab === 4 && (
          <TabQAExport 
            brief={brief} 
            variants={variants} 
            archetype={archetype} 
          />
        )}
      </main>
    </div>
  );
}
