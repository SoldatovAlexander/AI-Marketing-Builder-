import { GoogleGenAI, Type, Schema } from '@google/genai';
import { BriefData, GeneratedVariant, ArchetypeResult } from '../models/types';

// Initialize the Gemini API client
// The API key is injected by AI Studio at runtime
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const llmService = {
  async generateContent(brief: BriefData, archetype: ArchetypeResult | null): Promise<GeneratedVariant['content']> {
    try {
      const model = 'gemini-3-flash-preview'; // Fast and good for text generation
      
      let prompt = `Ты — senior copywriter и маркетолог. Создай контент на основе брифа.\n\n`;
      prompt += `ПРОДУКТ: ${brief.productName}\n`;
      prompt += `ОПИСАНИЕ: ${brief.shortDescription}\n`;
      prompt += `АУДИТОРИЯ: ${brief.targetAudience}\n`;
      prompt += `ПРЕИМУЩЕСТВА: ${brief.advantages.join(', ')}\n`;
      prompt += `РЕГИОН: ${brief.region}, ЯЗЫК: ${brief.language}\n`;
      prompt += `TONE OF VOICE: ${brief.toneOfVoice}\n`;
      prompt += `СИЛА КЛЕЙМОВ: ${brief.claimStrength}\n`;
      if (brief.constraints) prompt += `ОГРАНИЧЕНИЯ: ${brief.constraints}\n`;

      if (archetype) {
        prompt += `\nАРХЕТИП БРЕНДА: ${archetype.primary}\n`;
        prompt += `РЕКОМЕНДАЦИИ ПО СТИЛЮ: ${archetype.recommendations.tovModifiers}\n`;
        prompt += `РЕКОМЕНДОВАННЫЕ СЛОВА: ${archetype.recommendations.recommendedWords.join(', ')}\n`;
        prompt += `ТАБУ СЛОВА: ${archetype.recommendations.tabooWords.join(', ')}\n`;
      }

      let responseSchema: Schema;

      if (brief.mode === 'SEO') {
        prompt += `\nРЕЖИМ: SEO Статья\n`;
        prompt += `INTENT: ${brief.searchIntent}\n`;
        if (brief.keywords?.length) prompt += `КЛЮЧЕВЫЕ СЛОВА: ${brief.keywords.join(', ')}\n`;
        if (brief.serpPattern) prompt += `ФОРМАТ (SERP Pattern): ${brief.serpPattern}\n`;
        
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            article: { type: Type.STRING, description: 'Текст SEO статьи в формате Markdown (с заголовками H1, H2, списками)' },
            metaTitle: { type: Type.STRING, description: 'Meta Title (до 65 символов)' },
            metaDescription: { type: Type.STRING, description: 'Meta Description (до 160 символов)' },
            faq: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  q: { type: Type.STRING },
                  a: { type: Type.STRING }
                }
              },
              description: '3 вопроса и ответа для блока FAQ'
            }
          },
          required: ['article', 'metaTitle', 'metaDescription', 'faq']
        };
      } else if (brief.mode === 'Ads') {
        prompt += `\nРЕЖИМ: Рекламный текст (Ads)\n`;
        prompt += `ФОРМУЛА: ${brief.adStructure}\n`;
        prompt += `ЦЕЛЬ CTA: ${brief.ctaGoal}\n`;
        
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            article: { type: Type.STRING, description: 'Основной рекламный текст по выбранной формуле' },
            headlines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 варианта цепляющих заголовков'
            },
            ctas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 варианта призыва к действию (CTA)'
            },
            objections: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 кратких ответа на возможные возражения аудитории'
            }
          },
          required: ['article', 'headlines', 'ctas', 'objections']
        };
      } else {
        // PR
        prompt += `\nРЕЖИМ: PR-материал (Пресс-релиз / Статья)\n`;
        prompt += `ФОКУС: ${brief.prFocus}\n`;
        
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            article: { type: Type.STRING, description: 'Основной текст PR-материала в формате Markdown' },
            facts: { type: Type.STRING, description: 'Ключевые факты и контекст (bullet points)' },
            whyItMatters: { type: Type.STRING, description: 'Почему это важно для рынка/аудитории (1-2 абзаца)' },
            softCta: { type: Type.STRING, description: 'Мягкий призыв к действию (Soft CTA)' }
          },
          required: ['article', 'facts', 'whyItMatters', 'softCta']
        };
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema,
          temperature: 0.7,
        }
      });

      const text = response.text;
      if (!text) throw new Error('Empty response from LLM');
      
      return JSON.parse(text) as GeneratedVariant['content'];
      
    } catch (error) {
      console.error('Error generating content:', error);
      // Fallback to mock if API fails or key is missing
      return this.generateMockContent(brief);
    }
  },

  generateMockContent(brief: BriefData): GeneratedVariant['content'] {
    // Mock generation for fallback
    const article = `# ${brief.productName}\n\nЭто сгенерированный (Mock) текст для продукта ${brief.productName}. Целевая аудитория: ${brief.targetAudience}.\n\n## Преимущества\n${brief.advantages.map(a => `- ${a}`).join('\n')}`;
    
    if (brief.mode === 'SEO') {
      return {
        article,
        metaTitle: `Купить ${brief.productName} недорого`,
        metaDescription: `Узнайте все о ${brief.productName}. ${brief.shortDescription}`,
        faq: [{ q: 'Вопрос 1?', a: 'Ответ 1' }, { q: 'Вопрос 2?', a: 'Ответ 2' }, { q: 'Вопрос 3?', a: 'Ответ 3' }]
      };
    } else if (brief.mode === 'Ads') {
      return {
        article: `Внимание! ${brief.productName} решает ваши проблемы.\n\n${brief.shortDescription}`,
        headlines: ['Заголовок 1', 'Заголовок 2'],
        ctas: ['Купить сейчас', 'Узнать больше'],
        objections: ['Дорого? Нет, окупается за месяц.', 'Сложно? Настроим за 1 день.']
      };
    } else {
      return {
        article,
        facts: '- Факт 1\n- Факт 2',
        whyItMatters: 'Это меняет правила игры на рынке.',
        softCta: 'Следите за нашими новостями.'
      };
    }
  }
};
