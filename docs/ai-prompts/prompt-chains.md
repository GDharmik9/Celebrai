# 3-Stage Vendor Prompt Chain Definitions

The Celebrai Smart Vendor Checklist engine executes a three-stage sequential prompt chain using Gemini.

---

## Stage 1: Specification Parsing (RFP Generation)

**Model:** `Gemini 1.5 Pro` (or `gemini-4-argon`)  
**Output:** Structured RFP Object with category-specific SLAs and questions.

### Prompt Template:
```text
You are an expert procurement architect for luxury and large-scale celebrations.
Parse the following event specification:
- Event: {{eventName}} ({{eventType}})
- Date & Location: {{eventDate}}, {{city}}
- Guest Count: {{guestCount}}
- Allocated Category Budget: {{currency}} {{allocatedAmount}}

Generate an exhaustive, legally airtight RFP for a {{vendorCategory}} vendor.
Include:
1. Exact scope of deliverables with time-stamped SLAs.
2. Technical prerequisites (power, square footage, staging).
3. 15-20 binary and quantitative vetting questions.
Output must strictly adhere to the RFPChecklist schema.
```

---

## Stage 2: Quote Vetting (Market Anomaly Detection)

**Model:** `Gemini 1.5 Pro` (or `gemini-4-argon`)  
**Input:** Vendor submitted proposal/quote + regional market benchmark dataset.

### Prompt Template:
```text
Analyze the submitted quote from {{vendorName}} against regional pricing standards for {{city}}:
Submitted Quote:
{{rawQuoteContent}}

Benchmark Matrix:
{{marketBenchmarkData}}

Execute anomaly detection:
1. Detect unbundled fees (taxes, overtime surcharges, travel per-diems).
2. Identify variance exceeding ±18% against regional median rates.
3. Formulate 3-5 concrete negotiation leverage points.
Output must strictly adhere to the QuoteVettingResult schema.
```

---

## Stage 3: Contract Extraction (Deliverable & Payment Milestones)

**Model:** `Gemini 1.5 Pro` (or `gemini-4-argon`)  
**Output:** Actionable checklist items & payment triggers linked to the DAG timeline.

### Prompt Template:
```text
Extract legal commitments and execution obligations from the executed contract:
{{executedContractText}}

Map each obligation to:
1. An actionable checklist item assigned to either the Vendor or Host.
2. A strict milestone due date calculated relative to T_event.
3. Penalty clauses or liquidated damages associated with breach.
Output must strictly adhere to the ContractMilestones schema.
```

