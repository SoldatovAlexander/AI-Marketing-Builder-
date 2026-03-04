import { BriefData } from '../models/types';

export const PRESETS: Record<string, BriefData> = {
  preset1: {
    productName: 'AI-сервис "Mira"',
    shortDescription: 'Автоматизирует первичный отбор, экономит время рекрутера',
    targetAudience: 'HR / рекрутеры / руководители',
    advantages: [
      'Быстрее первичный скрининг',
      'Меньше рутины для рекрутера',
      'Отчёт по кандидату по критериям'
    ],
    region: 'СНГ',
    language: 'ru',
    mode: 'Ads',
    toneOfVoice: 'экспертный',
    claimStrength: 'medium',
    constraints: 'Не обещать 100% закрытие вакансий, не дискредитировать конкурентов',
    adStructure: 'AIDA',
    ctaGoal: 'демо'
  },
  preset2: {
    productName: 'Сервис "Технадзор Онлайн"',
    shortDescription: 'Контроль качества строительства с чек-листами и фото-отчётами',
    targetAudience: 'Частные заказчики ремонта и малоэтажного строительства',
    advantages: [
      'Понятные отчёты',
      'Контроль скрытых работ',
      'Экономия на переделках'
    ],
    region: 'РФ',
    language: 'ru',
    mode: 'SEO',
    toneOfVoice: 'дружелюбный',
    claimStrength: 'medium',
    constraints: 'Не обещать "без ошибок", избегать юридических гарантий',
    searchIntent: 'commercial',
    keywords: ['технадзор', 'контроль ремонта', 'приёмка работ'],
    serpPattern: 'guide'
  },
  preset3: {
    productName: 'Курс "AI для маркетинга за 2 недели"',
    shortDescription: 'Практический курс по применению AI для брендинга, SEO и рекламных текстов',
    targetAudience: 'Владельцы малого бизнеса и маркетологи',
    advantages: [
      'Практические шаблоны и чек-листы',
      'Генерация контента под разные каналы',
      'Экономия времени на подготовке материалов'
    ],
    region: 'Global',
    language: 'ru',
    mode: 'Ads',
    toneOfVoice: 'премиальный',
    claimStrength: 'medium',
    constraints: 'Не обещать "рост продаж гарантирован"',
    adStructure: 'PAS',
    ctaGoal: 'консультация'
  }
};

export const TERMS = [
  {
    title: 'AIDA / PAS / BAB',
    description: 'Формулы рекламного текста. AIDA: Attention, Interest, Desire, Action. PAS: Problem, Agitation, Solution. BAB: Before, After, Bridge.',
    example: 'PAS: Устали от рутины? (P) Она съедает 80% времени (A). Наш сервис автоматизирует это (S).',
    field: 'AdStructure (в режиме Ads)'
  },
  {
    title: 'Search Intent',
    description: 'Намерение пользователя при поиске. Informational (узнать), Commercial (выбрать), Navigational (найти сайт), Transactional (купить).',
    example: 'Commercial: "лучшие CRM для малого бизнеса 2024"',
    field: 'SearchIntent (в режиме SEO)'
  },
  {
    title: 'Keywords / Семантика',
    description: 'Ключевые слова, по которым страница должна ранжироваться в поисковиках.',
    example: '"купить слона", "слон цена Москва"',
    field: 'Keywords (в режиме SEO)'
  },
  {
    title: 'SERP-паттерн',
    description: 'Формат контента, который поисковик предпочитает показывать по запросу.',
    example: 'Guide (руководство), List (список), FAQ (вопросы-ответы), Comparison (сравнение).',
    field: 'SERPPattern (в режиме SEO)'
  },
  {
    title: 'E-E-A-T',
    description: 'Experience, Expertise, Authoritativeness, Trustworthiness. Факторы оценки качества контента Google.',
    example: 'Проверяем: есть ли автор, ссылки на источники, реальный опыт использования.',
    field: 'QA Checklist (вкладка QA)'
  },
  {
    title: 'Tone of Voice (ToV)',
    description: 'Тональность коммуникации бренда. Как бренд "звучит" для аудитории.',
    example: 'Дружелюбный: "Привет! Давай настроим твой профиль." Экспертный: "Для корректной работы системы необходимо..."',
    field: 'ToneOfVoice (общие настройки)'
  },
  {
    title: 'Brand Archetypes',
    description: 'Психологические профили бренда, помогающие создать цельный образ.',
    example: 'Ruler (статус, контроль), Sage (мудрость, экспертность), Hero (достижения, преодоление).',
    field: 'Вкладка "Архетип бренда"'
  }
];

export const ARCHETYPES_INFO: Record<string, any> = {
  Ruler: {
    tovModifiers: 'Формальный, уверенный, статусный, без заискивания.',
    recommendedWords: ['лидерство', 'стандарт', 'эксклюзивный', 'премиум', 'контроль'],
    tabooWords: ['дешево', 'скидочка', 'попробуйте', 'может быть'],
    ctaTemplates: ['Получить доступ', 'Стать резидентом', 'Управлять']
  },
  Sage: {
    tovModifiers: 'Объективный, аналитический, спокойный, опирающийся на факты.',
    recommendedWords: ['исследование', 'анализ', 'понимание', 'истина', 'экспертиза'],
    tabooWords: ['шок', 'сенсация', 'магия', 'просто поверьте'],
    ctaTemplates: ['Изучить отчет', 'Узнать детали', 'Читать исследование']
  },
  Hero: {
    tovModifiers: 'Мотивирующий, энергичный, бросающий вызов, прямой.',
    recommendedWords: ['победа', 'результат', 'достижение', 'преодолеть', 'мощь'],
    tabooWords: ['сдаться', 'невозможно', 'слишком сложно', 'потом'],
    ctaTemplates: ['Начать сейчас', 'Достичь цели', 'Преодолеть']
  },
  Everyman: {
    tovModifiers: 'Дружелюбный, простой, понятный, "свой парень".',
    recommendedWords: ['вместе', 'просто', 'для каждого', 'понятно', 'удобно'],
    tabooWords: ['элитарный', 'эксклюзив', 'превосходство', 'сложные термины'],
    ctaTemplates: ['Присоединиться', 'Попробовать', 'Начать вместе']
  },
  Magician: {
    tovModifiers: 'Вдохновляющий, визионерский, обещающий трансформацию.',
    recommendedWords: ['трансформация', 'видение', 'чудо', 'воображение', 'открытие'],
    tabooWords: ['обыденность', 'стандартно', 'как у всех', 'скучно'],
    ctaTemplates: ['Открыть возможности', 'Трансформировать', 'Увидеть магию']
  }
};

export const RISK_PHRASES = [
  '100%', 'гарантируем', 'лучшие', 'навсегда', 'без риска', 'официально одобрено', 'номер один', '№1'
];
