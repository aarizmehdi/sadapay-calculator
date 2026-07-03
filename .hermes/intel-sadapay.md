# Intel: SadaPay Banking Calculator

## Research date
2026-07-03

## SadaPay Overview
SadaPay is a Pakistani digital bank (regulated by SBP), Mastercard issuer.
Offers: Debit card (virtual + physical), local transfers, international transactions, remittances.
Known for: Better FX rates than traditional Pakistani banks.

## Brand Identity (from official website)
- **Primary color:** #072333 (dark navy)
- **White:** #ffffff
- **Fonts:** Inter (primary), Lato, Varela Round, Noto Nastaliq Urdu
- **Style:** Clean, modern, minimal, mobile-first
- **Logo:** SadaPay wordmark in their signature style

## Fee Structure (July-December 2026 — from official Schedule of Charges)

### International Transactions
| Item | Fee |
|------|-----|
| International Transaction Fee (up to Rs. 800) | Rs. 55 + 6% |
| International Transaction Fee (above Rs. 800) | 6% |
| International ATM Fee | Rs. 250 |
| Withholding Tax - Filer | 5% |
| Withholding Tax - Non-Filer | 10% |

### Other Charges
| Item | Fee |
|------|-----|
| MasterCard Physical Card Issuance | Rs. 1,724 (one-time) |
| MasterCard Virtual Card | Free |
| ATM Withdrawals (first 3/month) | Free |
| ATM Withdrawals (subsequent) | Rs. 35 |
| Local bank transfers | Free |
| Incoming remittances | Free |

### FX Rate
- SadaPay claims "10% better FX rate than every bank and fintech in Pakistan"
- Traditional Pakistani banks charge 3-3.5% foreign exchange markup
- SadaPay's FX advantage saves ~PKR 2,400-2,600/year on a $20/month ChatGPT subscription

## What the Calculator Must Do

1. **USD → PKR Converter** with live-ish exchange rate
2. **Full fee breakdown:**
   - Base amount in USD
   - SadaPay FX rate applied → PKR equivalent
   - International transaction fee (6% or Rs. 55 + 6%)
   - Withholding Tax (5% filer / 10% non-filer toggle)
   - Total payable in PKR
3. **Bank Comparison:** Show what a traditional Pakistani bank would charge (3-3.5% markup vs SadaPay's rate)
4. **Filer/Non-Filer toggle** for WHT calculation
5. **Clean calculator UI** — input amount in USD, see instant breakdown
6. **SadaPay branding** — #072333 navy, white, Inter font
