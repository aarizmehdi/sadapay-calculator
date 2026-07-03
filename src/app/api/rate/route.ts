import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_RATE = 279.50;

export async function GET() {
  const sources = [
    'https://open.er-api.com/v6/latest/USD',
    'https://api.frankfurter.app/latest?from=USD&to=PKR',
  ];

  for (const url of sources) {
    try {
      const resp = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!resp.ok) continue;
      const text = await resp.text();
      if (text.startsWith('<')) continue; // HTML = blocked
      const data = JSON.parse(text);
      const rate = data.rates?.PKR;
      if (typeof rate === 'number' && rate > 0) {
        return NextResponse.json({ rate, source: url.includes('open.er') ? 'open.er-api' : 'frankfurter' });
      }
    } catch { continue; }
  }

  return NextResponse.json({ rate: FALLBACK_RATE, source: 'fallback' });
}
