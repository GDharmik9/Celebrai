# Dynamic Budget Engine: Variance Sensitivity & Invariant Conservation

## 1. Mathematical Invariant

The budget engine enforces strict total budget conservation across all transformations:

$$\sum_{i=1}^{n} B_i = B_{\text{total}}$$

Where:
- $B_i$ is the estimated allocation for category $i$.
- $n$ is the total number of categories.
- $B_{\text{total}}$ is the immutable ceiling defined by the event host.

## 2. Zero-Shot Distribution Model

For cold-start event configurations, Celebrai applies the following default zero-shot allocation vector based on historical event execution statistics:

| Category | Allocation ($\%$) | Role |
|---|---|---|
| **Catering** | $40\%$ | Food, beverages, service staff, bar packages |
| **Venue** | $25\%$ | Rental fees, security deposits, permit fees |
| **Décor & Styling** | $15\%$ | Floral arrangements, rentals, stage design |
| **Contingency / Buffer** | $10\%$ | Unforeseen operational expenses |
| **Auxiliary / Miscellaneous** | $10\%$ | Transport, invites, photography, entertainment |

## 3. Slider Sensitivity Matrix & Dynamic Rebalancing

When category $k$ is adjusted by $\Delta$:

$$\Delta = B_k^{\text{new}} - B_k^{\text{old}}$$

The required compensation $-\Delta$ is distributed across all unlocked categories ($U = \{i \mid i \neq k, \text{locked}_i = \text{false}\}$):

$$B_i^{\text{adjusted}} = B_i^{\text{old}} - \Delta \cdot \frac{S_i \cdot B_i^{\text{old}}}{\sum_{j \in U} S_j \cdot B_j^{\text{old}}}$$

Where:
- $S_i \in [0, 1]$ is the empirical elasticity / sensitivity coefficient of category $i$.
- In basic mode, sensitivity weights are proportional to current allocations: $S_i = 1$.
- In AI rebalancing mode (Gemini 1.5 Flash), the model provides specific non-linear rationale:
  - e.g., Reducing venue by 10% can fund live music and enhance floral accents.
  - Generates savings opportunities and vendor negotiation levers.

