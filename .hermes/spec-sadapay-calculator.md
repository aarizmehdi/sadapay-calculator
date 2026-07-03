# Spec: SadaPay Banking Calculator

## Overview
A web-based calculator for Pakistani SadaPay users that converts USD to PKR with full fee breakdown — international transaction fees, withholding tax (filer/non-filer), and bank comparison. SadaPay-branded with #072333 navy theme.

## Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Exchange Rate:** Free API (exchangerate-api.com or frankfurter.app) with manual override
- **Deployment:** Vercel
- **No backend needed** — all calculations client-side

## Feature Checklist

### Core Calculator
- [ ] **USD Input:** Numeric input for USD amount
- [ ] **Live FX Rate:** Fetch USD/PKR rate from free API on load, display current rate
- [ ] **Manual Rate Override:** User can manually set the exchange rate
- [ ] **Fee Breakdown Panel:**
  - Shows: Base USD amount → PKR at SadaPay FX rate
  - International transaction fee (6% of PKR amount, or Rs.55+6% if under Rs.800)
  - Withholding Tax (5% filer / 10% non-filer of transaction fee + amount)
  - **Total PKR payable**
- [ ] **Filer/Non-Filer Toggle:** Segmented control switching WHT rate
- [ ] **Bank Comparison:** Side-by-side comparison showing what a traditional Pakistani bank would charge (3-3.5% markup + same taxes)
- [ ] **Reverse Calculator:** PKR → USD equivalent
- [ ] **Copy Result:** One-click copy total amount

### UI/UX
- [ ] SadaPay branding: #072333 navy, white text, Inter font
- [ ] Calculator-style layout — centered card, large input
- [ ] Responsive — works on mobile (most Pakistani users are mobile-first)
- [ ] Smooth animations on calculation (Framer Motion)
- [ ] Loading state while fetching exchange rate
- [ ] Error state if API fails (fallback to manual rate)

### Data Flow
- All calculations are client-side JavaScript
- Exchange rate fetched once on page load from free API
- Fees computed locally based on SadaPay's official Schedule of Charges
- No user data stored — stateless calculator

## Fee Calculation Logic

```
Input: USD amount

1. PKR at SadaPay FX Rate = USD × sadapayRate
   (sadapayRate = marketRate × 1.10 — SadaPay claims 10% better)

2. International Transaction Fee:
   If PKR amount <= 800: fee = 55 + (PKR × 0.06)
   If PKR amount > 800: fee = PKR × 0.06

3. Withholding Tax (WHT):
   If filer: WHT = (PKR + fee) × 0.05
   If non-filer: WHT = (PKR + fee) × 0.10

4. Total = PKR + fee + WHT

5. Bank Comparison:
   bankRate = marketRate × 0.97 (3% markup)
   bankPKR = USD × bankRate
   bankFee = bankPKR × 0.06 (same international fee)
   bankWHT = same as above
   bankTotal = bankPKR + bankFee + bankWHT
```

## Component Tree
```
App
├── Layout
│   ├── Header (SadaPay logo + title)
│   └── Main Content
│       ├── FXRateBanner (shows current rate, last updated)
│       ├── CalculatorCard
│       │   ├── AmountInput (USD numeric input)
│       │   ├── FilerToggle (filer/non-filer switch)
│       │   ├── FeeBreakdown (SadaPay column)
│       │   │   ├── BaseAmount
│       │   │   ├── TransactionFee
│       │   │   ├── WithholdingTax
│       │   │   └── TotalAmount
│       │   └── BankComparison (traditional bank column)
│       │       ├── BaseAmount
│       │       ├── MarkupFee
│       │       ├── TransactionFee
│       │       ├── WithholdingTax
│       │       └── TotalAmount
│       └── Footer (disclaimer + source link)
```

## UI States
- **Loading:** Skeleton while fetching exchange rate
- **Empty:** Default state showing 0 with placeholder rate
- **Error:** "Could not fetch rate — enter manually" with manual input
- **Edge case:** Very small amounts (<$1) — still calculate correctly
- **Edge case:** Very large amounts — no overflow, use toLocaleString
- **Edge case:** API timeout — fallback to last known rate or manual

## Files to Create
```
sadapay-calculator/
├── .env.example
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── CalculatorCard.tsx
│   │   ├── FeeBreakdown.tsx
│   │   ├── BankComparison.tsx
│   │   ├── AmountInput.tsx
│   │   ├── FilerToggle.tsx
│   │   └── FXRateBanner.tsx
│   ├── lib/
│   │   ├── calculations.ts (all fee math)
│   │   ├── exchange-rate.ts (API fetch)
│   │   ├── types.ts
│   │   └── constants.ts (brand colors, fee values)
│   └── ...
└── public/
```

## Security
- No sensitive data processed
- No backend — fully client-side
- Input validation: only positive numbers
- Rate limiting: single API call on page load (free tier safe)
