export interface ExchangeRateResult {
  rate: number;
  timestamp: Date;
  source: 'api' | 'fallback' | 'manual';
}

const FALLBACK_RATE = 279.50;
const STORAGE_KEY = 'sadapay-last-rate';

function getStoredRate(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.timestamp < 3600000) {
        return parsed.rate;
      }
    }
  } catch { /* ignore */ }
  return null;
}

function storeRate(rate: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rate, timestamp: Date.now() }));
  } catch { /* ignore */ }
}

async function fetchWithTimeout(url: string, ms = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const resp = await fetch(url, { signal: controller.signal });
    return resp;
  } finally {
    clearTimeout(id);
  }
}

async function tryFrankfurter(): Promise<number | null> {
  try {
    const resp = await fetchWithTimeout('https://api.frankfurter.app/latest?from=USD&to=PKR');
    if (!resp.ok) return null;
    const text = await resp.text();
    // frankfurter sometimes returns HTML when blocked
    if (text.startsWith('<')) return null;
    const data = JSON.parse(text);
    const rate = data.rates?.PKR;
    return typeof rate === 'number' ? rate : null;
  } catch { return null; }
}

async function tryOpenErApi(): Promise<number | null> {
  try {
    const resp = await fetchWithTimeout('https://open.er-api.com/v6/latest/USD');
    if (!resp.ok) return null;
    const data = await resp.json();
    const rate = data.rates?.PKR;
    return typeof rate === 'number' ? rate : null;
  } catch { return null; }
}

/** Fetch USD/PKR rate from multiple sources. Falls back to hardcoded rate. */
export async function fetchExchangeRate(): Promise<ExchangeRateResult> {
  // 1. Check localStorage cache first
  const stored = getStoredRate();
  if (stored) {
    return { rate: stored, timestamp: new Date(), source: 'fallback' };
  }

  // 2. Try APIs in order
  const rate = await tryOpenErApi() || await tryFrankfurter();

  if (rate && rate > 0) {
    storeRate(rate);
    return { rate, timestamp: new Date(), source: 'api' };
  }

  // 3. All failed — return hardcoded fallback
  return { rate: FALLBACK_RATE, timestamp: new Date(), source: 'fallback' };
}
