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

/** Fetch USD/PKR rate via server-side proxy (avoids CORS/geo-blocking). */
export async function fetchExchangeRate(): Promise<ExchangeRateResult> {
  // 1. Check localStorage cache first
  const stored = getStoredRate();
  if (stored) {
    return { rate: stored, timestamp: new Date(), source: 'fallback' };
  }

  // 2. Fetch via our own API route (server-side, not affected by client-side blocks)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch('/api/rate', { signal: controller.signal });
    clearTimeout(timeout);

    if (resp.ok) {
      const data = await resp.json();
      if (data.rate && typeof data.rate === 'number' && data.rate > 0) {
        storeRate(data.rate);
        return { rate: data.rate, timestamp: new Date(), source: 'api' };
      }
    }
  } catch { /* fall through */ }

  // 3. All failed — return hardcoded fallback
  return { rate: FALLBACK_RATE, timestamp: new Date(), source: 'fallback' };
}
