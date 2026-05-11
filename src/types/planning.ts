export type ContentType = 'post' | 'story' | 'reel';

export type ContentItem = {
  id: string;
  type: ContentType;
  week: number;
  pos: number;
  imageBase64?: string;
  title: string;
  supportText: string;
  caption: string;
  suggestedDay: string;
  driveLink?: string;
};

export type ReelScene = {
  id: string;
  order: number;
  duration: string;
  visual: string;
  narration: string;
  screenText: string;
};

export type ReelScript = {
  hook: string;
  objective: string;
  music: string;
  scenes: ReelScene[];
};

export type MonthlyPlan = {
  id: string;
  clientId: string;
  clientName: string;
  method: 'SABOR' | 'CLÍNICA 360' | 'CLÍNICA 180';
  socialMediaName: string;
  month: string;
  items: ContentItem[];
  scripts: Record<string, ReelScript>;
  driveLink?: string;
  createdAt: string;
};

export const METHOD_SCOPE = {
  SABOR: {
    posts: 2, stories: 3, reels: 2,
    color: '#F97316', bg: '#FFF7ED', text: '#C2410C',
    desc: '2 Posts · 3 Stories · 2 Reels / semana',
    postDays: ['Segunda', 'Quinta'],
    storyDays: ['Segunda', 'Quarta', 'Sexta'],
    reelDays: ['Terça', 'Sábado'],
  },
  'CLÍNICA 360': {
    posts: 3, stories: 1, reels: 1,
    color: '#0EA5E9', bg: '#F0F9FF', text: '#0369A1',
    desc: '3 Posts · 1 Story · 1 Reel / semana',
    postDays: ['Segunda', 'Quarta', 'Sexta'],
    storyDays: ['Quarta'],
    reelDays: ['Sexta'],
  },
  'CLÍNICA 180': {
    posts: 3, stories: 1, reels: 0,
    color: '#10B981', bg: '#F0FDF4', text: '#065F46',
    desc: '3 Posts · 1 Story / semana',
    postDays: ['Segunda', 'Quarta', 'Sexta'],
    storyDays: ['Quarta'],
    reelDays: [],
  },
} as const;

export const CONTENT_CONFIG = {
  post:  { label: 'Post',  icon: '📷', color: '#1565C0', aspect: '4/5'  },
  story: { label: 'Story', icon: '📖', color: '#7B1FA2', aspect: '9/16' },
  reel:  { label: 'Reel',  icon: '🎬', color: '#C62828', aspect: '9/16' },
} as const;

export const MONTHS_OPTIONS = [
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
  'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
];

export function generateItems(method: keyof typeof METHOD_SCOPE): ContentItem[] {
  const scope = METHOD_SCOPE[method];
  const items: ContentItem[] = [];
  for (let week = 1; week <= 4; week++) {
    for (let p = 0; p < scope.posts; p++) {
      items.push({ id: `w${week}_post_${p + 1}`, type: 'post', week, pos: p + 1, title: '', supportText: '', caption: '', suggestedDay: scope.postDays[p] ?? '' });
    }
    for (let s = 0; s < scope.stories; s++) {
      items.push({ id: `w${week}_story_${s + 1}`, type: 'story', week, pos: s + 1, title: '', supportText: '', caption: '', suggestedDay: scope.storyDays[s] ?? '' });
    }
    for (let r = 0; r < scope.reels; r++) {
      items.push({ id: `w${week}_reel_${r + 1}`, type: 'reel', week, pos: r + 1, title: '', supportText: '', caption: '', suggestedDay: scope.reelDays[r] ?? '' });
    }
  }
  return items;
}

export function emptyScript(): ReelScript {
  return {
    hook: '', objective: '', music: '',
    scenes: [{ id: 's1', order: 1, duration: '3s', visual: '', narration: '', screenText: '' }],
  };
}

export function getItemStatus(item: ContentItem): 'empty' | 'partial' | 'complete' {
  const hasAny = !!(item.title || item.supportText || item.caption || item.imageBase64);
  if (!hasAny) return 'empty';
  const full = !!(item.imageBase64 && item.title && item.caption);
  return full ? 'complete' : 'partial';
}

export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX = 1200;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const LS_KEY = 'partem_plans';
export function loadPlans(): MonthlyPlan[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'); } catch { return []; }
}
export function savePlans(plans: MonthlyPlan[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(plans));
}
