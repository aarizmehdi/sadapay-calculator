# SadaPay Banking Calculator

A web-based calculator for Pakistani users to compare USD → PKR conversion fees between **SadaPay** and traditional Pakistani banks.

**Live:** https://sadapay-calculator.vercel.app

---

## Features

- **USD → PKR** conversion with live interbank exchange rate
- **PKR → USD** reverse conversion
- **SadaPay fee breakdown**: 6% international fee (+ Rs.55 under Rs.800), Withholding Tax (5% filer / 10% non-filer)
- **Traditional bank comparison**: estimated 10% total cross-border costs (per SadaPay's published statement)
- **WHT on gross total**: calculated per FBR rules (Base Amount + all applicable fees)
- **Filer/Non-Filer toggle**: switches WHT rate between 5% and 10%
- **Live exchange rate**: fetched server-side via Vercel proxy (bypasses geo-blocking)
- **Manual rate override**: enter your own exchange rate
- **Copy results**: one-click copy of the full breakdown
- **Mobile responsive**: stacks vertically on screens <768px
- **GSAP animations**: smooth fade/slide transitions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | GSAP |
| Exchange Rate | Server-side proxy via `/api/rate` |
| Deployment | Vercel (auto-CI via GitHub) |

## Exchange Rate Sources

The app fetches USD/PKR rates from multiple sources in order:

1. **localStorage cache** — instant display, refreshes hourly
2. **Server proxy** (`/api/rate`) — tries open.er-api.com first, falls back to frankfurter.app
3. **Hardcoded fallback** — 279.50 PKR/USD if all APIs fail

## Fee Calculation Logic

```
Both columns use the SAME interbank rate as base.

SadaPay:
  Base Amount = USD × interbankRate
  International Fee = 6% of Base (or Rs.55 + 6% if under Rs.800)
  WHT = 5%/10% of (Base + International Fee)
  Total = Base + International Fee + WHT

Traditional Bank (estimated per SadaPay's statement):
  Base Amount = USD × interbankRate (same)
  Bank Markup = 7% of Base
  Network Fee = 3% of Base
  WHT = 5%/10% of (Base + Markup + Network Fee)
  Total = Base + Markup + Network Fee + WHT
```

## Local Development

```bash
git clone https://github.com/aarizmehdi/sadapay-calculator.git
cd sadapay-calculator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Every push to `main` auto-deploys to Vercel.

```bash
git push origin main
```

## Author

**Aariz Mehdi** — [github.com/aarizmehdi](https://github.com/aarizmehdi)

## License

MIT — feel free to use, modify, and share.

---

*Not affiliated with SadaPay. Rates are indicative only.*
