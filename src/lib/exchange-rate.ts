export interface ExchangeRateResult {
  rate: number;
  timestamp: Date;
  source: 'api' | 'fallback' | 'manual';
}

const FALLBACK_RATE = 279.50; // Fallback rate if API fails
const STORAGE_KEY = 'sadapay-last-rate';

function getStoredRate(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Use stored rate if it's less than 1 hour old
      if (Date.now() - parsed.timestamp < 3600000) {
        return parsed.rate;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function storeRate(rate: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rate, timestamp: Date.now() }));
  } catch {
    // ignore
  }
}

export async function fetchExchangeRate(): Promise<ExchangeRateResult> {
  // Try stored rate first for instant display
  const storedRate = getStoredRate();
  if (storedRate) {
    return {
      rate: storedRate,
      timestamp: new Date(),
      source: 'fallback',
    };
  }

  // Try primary API: frankfurter.app (free, no key needed)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=PKR',
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const rate = data.rates.PKR;

    if (!rate || typeof rate !== 'number') {
      throw new Error('Invalid rate from API');
    }

    storeRate(rate);
    return {
      rate,
      timestamp: new Date(),
      source: 'api',
    };
  } catch {
    // Try backup API: open.er-api.com (free, no key needed)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        'https://open.er-api.com/v6/latest/USD',
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const rate = data.rates?.PKR;

      if (!rate || typeof rate !== 'number') {
        throw new Error('Invalid rate from backup API');
      }

      storeRate(rate);
      return {
        rate,
        timestamp: new Date(),
        source: 'api',
      };
    } catch {
      // All APIs failed — return fallback
      return {
        rate: FALLBACK_RATE,
        timestamp: new Date(),
        source: 'fallback',
      };
    }
  }
}
