import React, { useState } from 'react';
import { TERMS } from '../utils/constants';
import { Card, Button } from './ui';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

export const TabTerms = ({ onNext }: { onNext: () => void }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-[#DCEEFF] rounded-2xl p-6 flex items-start gap-4">
        <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Зачем эта вкладка?</h2>
          <p className="text-gray-700 mt-1">
            Здесь собраны основные маркетинговые термины. Изучите их, чтобы понимать, 
            какие данные мы будем собирать в Брифе и как они повлияют на генерацию контента.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {TERMS.map((term, idx) => {
          const isOpen = openIndex === idx;
          return (
            <Card key={idx} className="overflow-hidden p-0 transition-all hover:shadow-md">
              <button 
                className="w-full text-left px-6 py-4 flex justify-between items-center bg-white focus:outline-none"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <span className="font-semibold text-lg text-gray-800">{term.title}</span>
                {isOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </button>
              
              {isOpen && (
                <div className="px-6 pb-5 pt-2 border-t border-gray-50 bg-gray-50/50">
                  <p className="text-gray-700 mb-3">{term.description}</p>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 mb-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Пример</span>
                    <p className="text-gray-600 italic text-sm">{term.example}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg inline-flex">
                    <span className="font-medium">Связь с брифом:</span>
                    <span>{term.field}</span>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} className="flex items-center gap-2 text-lg px-6 py-3">
          Перейти к Требованиям (Brief)
        </Button>
      </div>
    </div>
  );
};
