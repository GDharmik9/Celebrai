# Interactive Timeline Engine: DAG Horizons & Topological Scheduling

## 1. DAG Formulation

The Celebrai Interactive Timeline Engine represents an event schedule as a Directed Acyclic Graph:

$$G = (V, E)$$

- **Vertices ($V$):** Milestones and actionable tasks $v_i \in V$, each possessing an estimated completion duration $d_i$ and deadline $t_i$.
- **Edges ($E$):** Dependency relationships $(u, v) \in E$ stating that milestone $u$ must complete before milestone $v$ can commence.

## 2. Backward-Scheduled Horizons

Scheduling is calculated backwards from the immutable zero-hour timestamp $T_{\text{event}}$ across 3 operational horizons:

```
T - 6 Months             T - 1 Month          T - 12 Hours     T_event      T + 4 Hours
┌─────────────────────────────┬─────────────────────┬──────────────┬─────────────┐
│      Strategic Horizon      │ Operational Horizon │    Day-of    │ Wrap-Up     │
│   (Procurement & Permits)   │ (Headcount & Logistics)│ (Execution)  │ (Teardown)  │
└─────────────────────────────┴─────────────────────┴──────────────┴─────────────┘
```

### 1. Strategic Horizon ($T-6\text{m}$ to $T-2\text{m}$)
- Major vendor procurement (venue, caterer, photographer).
- Statutory permissions, licensing, and municipal clearances.
- Core aesthetic vision alignment.

### 2. Operational Horizon ($T-1\text{m}$ to $T-1\text{w}$)
- Guest RSVP finalization and dietary allocations.
- Final run-of-show synchronization across vendor contracts.
- Staging and technical load-in rehearsal schedules.

### 3. Day-of Run of Show ($T-12\text{h}$ to $T+4\text{h}$)
- Minute-by-minute vendor arrivals and stage setup.
- Guest welcome, ceremony cue-to-cue, dining timelines.
- Teardown, inventory reconciliation, and load-out.

## 3. Critical Path Recalculation

When milestone $k$ experiences an operational slip:

$$T_{\text{actual}}(k) > T_{\text{planned}}(k)$$

The DAG execution engine triggers a topological traversal:
1. Identifies the child subgraph $\text{Descendants}(k) = \{v \in V \mid (k, \dots, v) \in E\}$.
2. Recalculates Earliest Start Time ($EST$) and Latest Finish Time ($LFT$) for each dependent node.
3. Computes the float slack $S_v = LFT_v - EST_v - d_v$.
4. Nodes with $S_v \le 0$ are designated as the new **Critical Path**.
5. Dispatches automated risk mitigation alerts to the host with AI recovery plans.

