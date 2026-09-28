// Service layer for Medhaa Telugu NLP Platform
// Supports both Mock API (default) and Real FastAPI Backend via VITE_API_BASE_URL

export interface SentimentResult {
  label: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  confidence: number;
  probabilities: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface EntityItem {
  text: string;
  type: 'PERSON' | 'LOCATION' | 'ORGANIZATION' | 'DATE' | 'MISC';
  confidence: number;
  start: number;
  end: number;
}

export interface NERResult {
  entities: EntityItem[];
}

export interface TransliterationResult {
  output: string;
}

export interface CodeSwitchToken {
  text: string;
  tag: 'TELUGU' | 'ENGLISH' | 'OTHER' | 'NAMED_ENTITY' | 'MIXED_TOKEN';
}

export interface CodeSwitchResult {
  tokens: CodeSwitchToken[];
  distribution: {
    telugu_pct: number;
    english_pct: number;
  };
}

export interface AnalyzeAllResult {
  sentiment: SentimentResult;
  ner: NERResult;
  codeSwitch: CodeSwitchResult;
  language: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const USE_MOCK = !API_BASE_URL || import.meta.env.VITE_USE_MOCK === 'true';

// Helper for delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const getRandomDelay = () => Math.floor(Math.random() * 1200) + 800; // 800 - 2000ms

// Script detection helper matching backend heuristic
export const isTeluguChar = (char: string) => {
  const code = char.charCodeAt(0);
  return code >= 0x0c00 && code <= 0x0c7f;
};

export const classifyTokenScript = (token: string): 'TELUGU' | 'ENGLISH' | 'MIXED_TOKEN' | 'OTHER' => {
  let hasTelugu = false;
  let hasLatin = false;

  for (const char of token) {
    if (isTeluguChar(char)) hasTelugu = true;
    else if (/[a-zA-Z]/.test(char)) hasLatin = true;
  }

  if (hasTelugu && !hasLatin) return 'TELUGU';
  if (hasLatin && !hasTelugu) return 'ENGLISH';
  if (hasTelugu && hasLatin) return 'MIXED_TOKEN';
  return 'OTHER';
};

// Transliteration dictionary for rich mock support
const TRANSLITERATION_MAP: Record<string, string> = {
  namaskaram: 'నమస్కారం',
  namaste: 'నమస్తే',
  meeru: 'మీరు',
  ela: 'ఎలా',
  unnaru: 'ఉన్నారు',
  bagundhi: 'బాగుంది',
  bagundi: 'బాగుంది',
  chala: 'చాలా',
  dhanyavadalu: 'ధన్యవాదాలు',
  andhariki: 'అందరికీ',
  telugu: 'తెలుగు',
  hyderabad: 'హైదరాబాద్',
  nenu: 'నేను',
  manchi: 'మంచి',
  pustakam: 'పుస్తకం',
  chadhuvuthunnanu: 'చదువుతున్నాను',
  cinemalu: 'సినిమాలు',
  kuda: 'కూడా',
  amman: 'అమ్మ',
  nanna: 'నాన్న',
  illu: 'ఇల్లు',
  bhasha: 'భాష',
  medhaa: 'మేధా',
  india: 'భారత్',
  raju: 'రాజు',
  rani: 'రాణి',
};

// Transliteration rules engine for unknown Romanized Telugu words
function transliterateWordRuleBased(word: string): string {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return word;
  if (TRANSLITERATION_MAP[clean]) return TRANSLITERATION_MAP[clean];

  let res = clean;
  res = res
    .replace(/kh/g, 'ఖ')
    .replace(/gh/g, 'ఘ')
    .replace(/ch/g, 'చ')
    .replace(/jh/g, 'ఝ')
    .replace(/th/g, 'త')
    .replace(/dh/g, 'ధ')
    .replace(/ph/g, 'ఫ')
    .replace(/bh/g, 'భ')
    .replace(/sh/g, 'ష')
    .replace(/k/g, 'క')
    .replace(/g/g, 'గ')
    .replace(/j/g, 'జ')
    .replace(/t/g, 'ట')
    .replace(/d/g, 'డ')
    .replace(/n/g, 'న')
    .replace(/p/g, 'ప')
    .replace(/b/g, 'బ')
    .replace(/m/g, 'మ')
    .replace(/y/g, 'య')
    .replace(/r/g, 'ర')
    .replace(/l/g, 'ల')
    .replace(/v/g, 'వ')
    .replace(/w/g, 'వ')
    .replace(/s/g, 'స')
    .replace(/h/g, 'హ')
    .replace(/aa/g, 'ా')
    .replace(/ee/g, 'ీ')
    .replace(/oo/g, 'ూ')
    .replace(/a/g, 'ా')
    .replace(/i/g, 'ి')
    .replace(/u/g, 'ు')
    .replace(/e/g, 'ె')
    .replace(/o/g, 'ో');
  return res || word;
}

// APIs
export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE_URL}/api/sentiment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  }

  await delay(getRandomDelay());

  const lower = text.toLowerCase();
  const posKeywords = ['బాగుంది', 'అద్భుతం', 'మంచి', 'చాలా బాగుంది', 'సంతోషం', 'అందమైన', 'great', 'awesome', 'good', 'love', 'happy', 'excellent'];
  const negKeywords = ['చెత్త', 'బాగోలేదు', 'చెడు', 'కోపం', 'బాధ', 'కష్టం', 'bad', 'terrible', 'worst', 'hate', 'sad', 'poor'];

  let posScore = 0.15;
  let negScore = 0.10;

  for (const kw of posKeywords) {
    if (text.includes(kw) || lower.includes(kw)) posScore += 0.35;
  }
  for (const kw of negKeywords) {
    if (text.includes(kw) || lower.includes(kw)) negScore += 0.35;
  }

  if (posScore > 0.9) posScore = 0.92;
  if (negScore > 0.9) negScore = 0.88;

  let label: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' = 'NEUTRAL';
  let neuScore = Math.max(0.05, 1 - (posScore + negScore));
  if (neuScore < 0) neuScore = 0.1;

  // normalize
  const total = posScore + negScore + neuScore;
  const pPos = Number((posScore / total).toFixed(4));
  const pNeg = Number((negScore / total).toFixed(4));
  const pNeu = Number((1 - pPos - pNeg).toFixed(4));

  if (pPos > pNeg && pPos > pNeu) label = 'POSITIVE';
  else if (pNeg > pPos && pNeg > pNeu) label = 'NEGATIVE';
  else label = 'NEUTRAL';

  const confidence = Math.max(pPos, pNeg, pNeu);

  return {
    label,
    confidence,
    probabilities: {
      positive: pPos,
      neutral: pNeu,
      negative: pNeg,
    },
  };
}

export async function analyzeNER(text: string): Promise<NERResult> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE_URL}/api/ner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  }

  await delay(getRandomDelay());

  const knownEntities: Array<{ text: string; type: EntityItem['type'] }> = [
    { text: 'హైదరాబాద్', type: 'LOCATION' },
    { text: 'విజయవాడ', type: 'LOCATION' },
    { text: 'విశాఖపట్నం', type: 'LOCATION' },
    { text: 'తిరుపతి', type: 'LOCATION' },
    { text: 'భారత్', type: 'LOCATION' },
    { text: 'భారతదేశం', type: 'LOCATION' },
    { text: 'రాము', type: 'PERSON' },
    { text: 'సీత', type: 'PERSON' },
    { text: 'కృష్ణ', type: 'PERSON' },
    { text: 'నరేంద్ర మోదీ', type: 'PERSON' },
    { text: 'చంద్రబాబు', type: 'PERSON' },
    { text: 'జగన్', type: 'PERSON' },
    { text: 'వెంకటేష్', type: 'PERSON' },
    { text: 'చిరంజీవి', type: 'PERSON' },
    { text: 'Microsoft', type: 'ORGANIZATION' },
    { text: 'Google', type: 'ORGANIZATION' },
    { text: 'ISRO', type: 'ORGANIZATION' },
    { text: 'Hyderabad', type: 'LOCATION' },
    { text: 'India', type: 'LOCATION' },
  ];

  const entities: EntityItem[] = [];

  for (const ent of knownEntities) {
    let pos = text.indexOf(ent.text);
    while (pos !== -1) {
      entities.push({
        text: ent.text,
        type: ent.type,
        confidence: Number((0.88 + Math.random() * 0.1).toFixed(4)),
        start: pos,
        end: pos + ent.text.length,
      });
      pos = text.indexOf(ent.text, pos + ent.text.length);
    }
  }

  // If no predefined entity found, inspect words for potential capitalizations or long nouns
  if (entities.length === 0) {
    const words = text.split(/\s+/);
    let offset = 0;
    for (const w of words) {
      const idx = text.indexOf(w, offset);
      if (idx !== -1) {
        if (/^[A-Z][a-z]+/.test(w) && w.length > 3) {
          entities.push({
            text: w,
            type: 'LOCATION',
            confidence: 0.8254,
            start: idx,
            end: idx + w.length,
          });
        }
        offset = idx + w.length;
      }
    }
  }

  // Sort by start index
  entities.sort((a, b) => a.start - b.start);

  return { entities };
}

export async function transliterate(text: string): Promise<TransliterationResult> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE_URL}/api/transliterate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  }

  await delay(getRandomDelay());

  const words = text.split(/(\s+)/);
  const converted = words.map((w) => {
    if (/^\s+$/.test(w)) return w;
    return transliterateWordRuleBased(w);
  });

  return { output: converted.join('') };
}

export async function detectCodeSwitching(
  text: string,
  mode: 'native' | 'romanized'
): Promise<CodeSwitchResult> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE_URL}/api/code-switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mode }),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  }

  await delay(getRandomDelay());

  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return { tokens: [], distribution: { telugu_pct: 0, english_pct: 0 } };
  }

  let tokens: CodeSwitchToken[] = [];

  if (mode === 'native') {
    tokens = words.map((w) => ({
      text: w,
      tag: classifyTokenScript(w),
    }));
  } else {
    // Romanized mode
    const knownTeluguRomanized = new Set([
      'namaskaram', 'namaste', 'meeru', 'ela', 'unnaru', 'bagundhi', 'bagundi',
      'chala', 'dhanyavadalu', 'andhariki', 'telugu', 'nenu', 'manchi', 'pustakam',
      'cinemalu', 'kuda', 'amma', 'nanna', 'illu', 'bhasha', 'medhaa', 'raju',
      'vostanu', 'tintanu', 'ekkada', 'yento', 'kavali'
    ]);

    const knownEntities = new Set(['hyderabad', 'india', 'microsoft', 'google', 'isro', 'delhi', 'mumbai']);

    tokens = words.map((w) => {
      const clean = w.toLowerCase().replace(/[^a-z]/g, '');
      if (knownEntities.has(clean)) return { text: w, tag: 'NAMED_ENTITY' };
      if (knownTeluguRomanized.has(clean)) return { text: w, tag: 'TELUGU' };
      if (/[a-zA-Z]/.test(w)) {
        // Simple heuristic: if ends in common telugu suffix like 'u', 'i', 'lu', 'am', 'ani' or in set
        if (/(u|lu|am|ani|iki|lo|tho)$/i.test(clean) && clean.length > 3) {
          return { text: w, tag: 'TELUGU' };
        }
        return { text: w, tag: 'ENGLISH' };
      }
      return { text: w, tag: 'OTHER' };
    });
  }

  // Calculate distribution
  const teluguCount = tokens.filter((t) => t.tag === 'TELUGU').length;
  const englishCount = tokens.filter((t) => t.tag === 'ENGLISH').length;
  const total = teluguCount + englishCount;

  const telugu_pct = total > 0 ? Number(((teluguCount / total) * 100).toFixed(1)) : 0;
  const english_pct = total > 0 ? Number(((englishCount / total) * 100).toFixed(1)) : 0;

  return {
    tokens,
    distribution: { telugu_pct, english_pct },
  };
}

export async function analyzeAll(text: string): Promise<AnalyzeAllResult> {
  if (!USE_MOCK) {
    const res = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  }

  // Determine mode based on script
  const hasTeluguScript = Array.from(text).some((c) => isTeluguChar(c));
  const mode = hasTeluguScript ? 'native' : 'romanized';

  const [sentiment, ner, codeSwitch] = await Promise.all([
    analyzeSentiment(text),
    analyzeNER(text),
    detectCodeSwitching(text, mode),
  ]);

  const hasEnglish = codeSwitch.tokens.some((t) => t.tag === 'ENGLISH');
  const language = hasEnglish ? 'Telugu + English' : 'Telugu';

  return {
    sentiment,
    ner,
    codeSwitch,
    language,
  };
}
