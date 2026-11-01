import {
  Document,
  Page,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import React from "react";
import type { TimelineDAG } from "@celebrai/schemas";
import {
  COLORS,
  styles,
  SectionTitle,
  PageFooter,
} from "../components/primitives.js";

const PRIORITY_COLORS: Record<string, string> = {
  critical: COLORS.danger,
  high: COLORS.warning,
  medium: COLORS.primary,
  low: COLORS.textMuted,
};

interface RunOfShowPDFProps {
  timeline: TimelineDAG;
  eventName: string;
}

function RunOfShowDocument({ timeline, eventName }: RunOfShowPDFProps) {
  const sorted = [...timeline.milestones].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const byCategory = sorted.reduce<Record<string, typeof sorted>>(
    (acc, m) => {
      acc[m.category] ??= [];
      acc[m.category]!.push(m);
      return acc;
    },
    {}
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBand}>
          <Text style={styles.headerTitle}>{eventName}</Text>
          <Text style={styles.headerSubtitle}>
            Run-of-Show Timeline · Event Date:{" "}
            {new Date(timeline.eventDate).toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {Object.entries(byCategory).map(([category, milestones]) => (
          <View key={category}>
            <SectionTitle>
              {category.charAt(0).toUpperCase() + category.slice(1)} Milestones
            </SectionTitle>
            {milestones.map((m) => (
              <View
                key={m.id}
                style={{
                  flexDirection: "row",
                  marginBottom: 6,
                  borderLeft: `3pt solid ${PRIORITY_COLORS[m.priority] ?? COLORS.textMuted}`,
                  paddingLeft: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Helvetica-Bold",
                      fontSize: 10,
                      color: m.completed ? COLORS.success : COLORS.text,
                      textDecoration: m.completed ? "line-through" : "none",
                    }}
                  >
                    {m.title}
                  </Text>
                  {m.description ? (
                    <Text
                      style={{
                        fontSize: 8,
                        color: COLORS.textMuted,
                        marginTop: 2,
                      }}
                    >
                      {m.description}
                    </Text>
                  ) : null}
                </View>
                <View style={{ width: 80, alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 9,
                      color: COLORS.primary,
                      fontFamily: "Helvetica-Bold",
                    }}
                  >
                    {new Date(m.dueDate).toLocaleDateString("en-IN")}
                  </Text>
                  <Text
                    style={{
                      fontSize: 7,
                      color: PRIORITY_COLORS[m.priority] ?? COLORS.textMuted,
                      marginTop: 2,
                    }}
                  >
                    {m.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <PageFooter generatedAt={timeline.generatedAt} page="1" />
      </Page>
    </Document>
  );
}

export async function renderRunOfShowPDF(
  timeline: TimelineDAG,
  eventName: string
): Promise<Buffer> {
  return renderToBuffer(
    <RunOfShowDocument timeline={timeline} eventName={eventName} />
  );
}
