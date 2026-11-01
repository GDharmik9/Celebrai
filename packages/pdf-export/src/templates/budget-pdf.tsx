import {
  Document,
  Page,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import React from "react";
import type { BudgetVector } from "@celebrai/schemas";
import {
  COLORS,
  styles,
  SectionTitle,
  PageFooter,
} from "../components/primitives.js";

interface BudgetPDFProps {
  budget: BudgetVector;
  eventName: string;
}

function BudgetDocument({ budget, eventName }: BudgetPDFProps) {
  const total = budget.lineItems.reduce((s, i) => s + i.estimatedAmount, 0);
  const contingencyAmount = (total * budget.contingencyPercent) / 100;
  const grandTotal = total + contingencyAmount;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: budget.currency,
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBand}>
          <Text style={styles.headerTitle}>{eventName}</Text>
          <Text style={styles.headerSubtitle}>
            Event Budget Summary · Total: {fmt(grandTotal)}
          </Text>
        </View>

        {/* Summary Boxes */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {[
            { label: "Total Budget", value: fmt(budget.totalBudget) },
            { label: "Allocated", value: fmt(total) },
            { label: `Contingency (${budget.contingencyPercent}%)`, value: fmt(contingencyAmount) },
            { label: "Grand Total", value: fmt(grandTotal) },
          ].map((box) => (
            <View
              key={box.label}
              style={{
                flex: 1,
                backgroundColor: COLORS.secondary,
                borderRadius: 6,
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 7,
                  color: COLORS.textMuted,
                  marginBottom: 3,
                  textTransform: "uppercase",
                }}
              >
                {box.label}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Helvetica-Bold",
                  color: COLORS.primary,
                }}
              >
                {box.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Line Items Table */}
        <SectionTitle>Budget Breakdown</SectionTitle>
        <View style={styles.tableHeader}>
          {["Category", "Line Item", "Estimated", "% of Total", "Status"].map(
            (h) => (
              <Text key={h} style={styles.tableHeaderCell}>
                {h}
              </Text>
            )
          )}
        </View>
        {budget.lineItems.map((item, i) => (
          <View
            key={item.id}
            style={{
              ...styles.row,
              backgroundColor: i % 2 === 0 ? COLORS.white : "#FAFAFA",
              borderBottom: `0.5pt solid ${COLORS.border}`,
            }}
          >
            <Text style={{ ...styles.cell, textTransform: "capitalize" }}>
              {item.category}
            </Text>
            <Text style={styles.cell}>{item.label}</Text>
            <Text style={{ ...styles.cell, fontFamily: "Helvetica-Bold" }}>
              {fmt(item.estimatedAmount)}
            </Text>
            <Text style={{ ...styles.cell, color: COLORS.textMuted }}>
              {((item.estimatedAmount / total) * 100).toFixed(1)}%
            </Text>
            <Text
              style={{
                ...styles.cell,
                color: item.locked ? COLORS.warning : COLORS.textMuted,
              }}
            >
              {item.locked ? "Locked" : "Flexible"}
            </Text>
          </View>
        ))}

        <PageFooter generatedAt={budget.lastUpdatedAt} page="1" />
      </Page>
    </Document>
  );
}

/**
 * Renders the budget PDF to a Buffer (for serverless / API route usage).
 */
export async function renderBudgetPDF(
  budget: BudgetVector,
  eventName: string
): Promise<Buffer> {
  return renderToBuffer(<BudgetDocument budget={budget} eventName={eventName} />);
}
