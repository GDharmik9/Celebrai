# Gemini Context Caching: Standard Operating Procedures (SOPs)

This document contains static, high-token context blocks cached in Gemini via the Caching API (`ttl="3600s"`). In downstream interactions, these SOPs are referenced by cache handle (`cachedContent: cache.name`), reducing token overhead by up to 90%.

---

## 1. Statutory Event Safety & Legal Compliance SOP

1. **Fire & Life Safety Clearance:**
   - Every indoor venue exceeding 200 guests requires a temporary Fire Department No Objection Certificate (NOC).
   - Flame retardant certification required for all draped fabrics and temporary structures.
   - Emergency exits must remain unblocked with 2.4m minimum clearance.

2. **Sound Amplification Regulations:**
   - Decibel limit: 55 dB(A) after 10:00 PM for outdoor zones.
   - DG set (diesel generator) pollution control boards and silent canopy compliance mandatory.

3. **Liquor & Catering Licensing:**
   - Single-day occasion liquor license (P-10/local excise equivalent) must be filed at least 15 business days prior.
   - Food safety supervisor (FSSAI) compliance check on all caterers.

---

## 2. Vendor SLA Standard Operating Rules

| Category | Load-In Window | Teardown Deadline | Payment Milestones |
|---|---|---|---|
| **Venue** | $T-24\text{h}$ | $T+6\text{h}$ | 50% deposit, 50% on key handover |
| **Catering** | $T-6\text{h}$ | $T+2\text{h}$ | 40% advance, 40% on load-in, 20% on wrap |
| **AV / Lighting** | $T-12\text{h}$ | $T+3\text{h}$ | 30% booking, 50% soundcheck, 20% post-event |
| **Décor / Florals** | $T-14\text{h}$ | $T+4\text{h}$ | 50% booking, 40% 1 week prior, 10% delivery |
| **Photography** | $T-2\text{h}$ | $T+1\text{h}$ | 30% booking, 50% day-of, 20% raw delivery |

