import type { VendorCategory } from "@celebrai/schemas";

export function buildVendorChecklistPrompt(
  category: VendorCategory,
  eventType: string,
  budget: number,
  currency = "INR"
): string {
  return `Generate a comprehensive vendor evaluation checklist for a ${category} vendor for a ${eventType} event.

Budget Range: ${currency} ${budget.toLocaleString("en-IN")}

Create 15-20 targeted RFP questions covering:
1. Pricing & packages (what's included, customization options, payment terms)
2. Availability & capacity confirmation for the event date
3. Portfolio & references (minimum 3 similar events)
4. Logistics (setup/teardown timelines, staff count, backup plans)
5. Legal & contractual terms (cancellation policy, force majeure, liability)
6. Deliverables & timelines (when and how deliverables are provided)
7. Technical requirements (AV, power, internet, permits if applicable)

Also identify:
- 5 red flags that should disqualify a vendor immediately
- 5 negotiation leverage points for this vendor category
- Key contract clauses to insist upon

Respond ONLY with valid JSON matching the GeneratedVendorChecklist schema.`;
}
