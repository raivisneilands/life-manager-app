import styled from "@emotion/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Animated } from "react-native";

import {
  InsightScreen,
  buildFinanceContext,
  buildFitnessContext,
  buildGoalsContext,
  buildHabitsContext,
  buildHealthContext,
  buildRelationshipsContext,
  buildTodayContext,
  fetchInsight,
} from "@/utils/ai";

import { useAuth } from "@/contexts/AuthContext";
import { useFinanceStore } from "@/store/FinanceStore";
import { useFitnessStore } from "@/store/FitnessStore";
import { useGoalStore } from "@/store/GoalStore";
import { useHabitStore } from "@/store/HabitStore";
import { useHealthStore } from "@/store/HealthStore";
import { useRelationshipStore } from "@/store/RelationshipStore";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface InsightCardProps {
  screen: InsightScreen;
}

// ─── Styled components ─────────────────────────────────────────────────────────

const Card = styled.View<{ accentColor: string }>(({ theme, accentColor }) => ({
  backgroundColor: theme.card,
  borderRadius: 16,
  borderLeftWidth: 3,
  borderLeftColor: accentColor,
  paddingHorizontal: 16,
  paddingVertical: 14,
  paddingBottom: 10,
  marginVertical: 8,
  marginBottom: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
  elevation: 3,
}));

const Emoji = styled.Text(() => ({
  fontSize: 16,
  marginRight: 6,
}));

const Label = styled.Text(({ theme }) => ({
  fontSize: 12,
  fontWeight: "600",
  color: theme.textSecondary,
  letterSpacing: 0.6,
  textTransform: "uppercase",
}));

const Divider = styled.View<{ accentColor: string }>(({ accentColor }) => ({
  height: 1,
  backgroundColor: accentColor + "33",
  marginBottom: 12,
  borderRadius: 1,
}));

const Body = styled.View(() => ({
  minHeight: 48,
  justifyContent: "center",
}));

const LoadingRow = styled.View(() => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
}));

const LoadingText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
}));

const ErrorText = styled.Text(({ theme }) => ({
  color: theme.danger,
  fontSize: 14,
  lineHeight: 20,
}));

const InsightText = styled(Animated.Text)(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 15,
  lineHeight: 22,
  letterSpacing: 0.1,
}));

const Footer = styled.View(() => ({
  flexDirection: "row",
  alignItems: "center",
  marginTop: 12,
  gap: 6,
}));

const Dot = styled.View<{ accentColor: string }>(({ accentColor }) => ({
  width: 5,
  height: 5,
  borderRadius: 3,
  backgroundColor: accentColor,
  opacity: 0.7,
}));

const FooterText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 11,
  opacity: 0.5,
}));

// ─── Screen meta ───────────────────────────────────────────────────────────────

const SCREEN_LABEL: Record<InsightScreen, string> = {
  goals: "Goals Insight",
  habits: "Habits Insight",
  health: "Health Insight",
  fitness: "Fitness Insight",
  finance: "Finance Insight",
  relationships: "Relationships Insight",
  today: "Daily Insight",
};

const SCREEN_EMOJI: Record<InsightScreen, string> = {
  goals: "🎯",
  habits: "🔁",
  health: "🫀",
  fitness: "🏋️",
  finance: "💰",
  relationships: "🤝",
  today: "✨",
};

const SCREEN_ACCENT: Record<InsightScreen, string> = {
  goals: "#6366f1",
  habits: "#22c55e",
  health: "#ec4899",
  fitness: "#f97316",
  finance: "#eab308",
  relationships: "#14b8a6",
  today: "#6366f1",
};

const ChevronText = styled.Text<{ collapsed: boolean }>(
  ({ theme, collapsed }) => ({
    color: theme.textSecondary,
    fontSize: 16,
    transform: [{ rotate: collapsed ? "0deg" : "180deg" }],
  }),
);

const HeaderTouchable = styled.TouchableOpacity(() => ({
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
}));

const HeaderLeft = styled.View(() => ({
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
}));

const DisclaimerText = styled.Text(({ theme }) => ({
  marginTop: 8,
  color: theme.textSecondary,
  fontSize: 11,
  lineHeight: 16,
  opacity: 0.8,
}));

// ─── Context hook ───────────────────────────────────────────────────────────────

function useScreenContext(screen: InsightScreen): string {
  const goals = useGoalStore();
  const habits = useHabitStore();
  const health = useHealthStore();
  const fitness = useFitnessStore();
  const finance = useFinanceStore();
  const relationships = useRelationshipStore();

  switch (screen) {
    case "goals":
      return buildGoalsContext(goals);
    case "habits":
      return buildHabitsContext(habits);
    case "health":
      return buildHealthContext(health);
    case "fitness":
      return buildFitnessContext(fitness);
    case "finance":
      return buildFinanceContext(finance);
    case "relationships":
      return buildRelationshipsContext(relationships);
    case "today":
      return buildTodayContext({
        goals,
        habits,
        health,
        fitness,
        finance,
        relationships,
      });
  }
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function InsightCard({ screen }: InsightCardProps) {
  const context = useScreenContext(screen);
  const { session } = useAuth();

  const accentColor = SCREEN_ACCENT[screen];

  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const opacity = React.useRef(new Animated.Value(0)).current;
  const collapseAnim = React.useRef(new Animated.Value(1)).current;

  const SCREEN_DISCLAIMER: Partial<Record<InsightScreen, string>> = {
    health:
      "Informational only. Not medical advice. Consult a qualified healthcare professional for medical advice, diagnosis, or treatment.",

    finance:
      "Informational only. Not financial advice. Consider consulting a qualified financial professional before making financial decisions.",

    fitness:
      "Informational only. Not a substitute for professional fitness or healthcare advice. Consult a qualified professional before making significant changes to your exercise routine.",
  };

  const toggleCollapse = () => {
    const toValue = collapsed ? 1 : 0;
    Animated.timing(collapseAnim, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setCollapsed((c) => !c);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    opacity.setValue(0);

    try {
      const result = await fetchInsight(screen, context, {
        userJwt: session?.access_token ?? "",
      });
      setInsight(result);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (e) {
      setError("Couldn't load insight. Try again later.");
    } finally {
      setLoading(false);
    }
  }, [screen, context, session]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  return (
    <Card accentColor={accentColor}>
      <HeaderTouchable onPress={toggleCollapse} activeOpacity={0.7}>
        <HeaderLeft>
          <Emoji>{SCREEN_EMOJI[screen]}</Emoji>
          <Label>{SCREEN_LABEL[screen]}</Label>
        </HeaderLeft>
        <ChevronText collapsed={collapsed}>⌄</ChevronText>
      </HeaderTouchable>

      {!collapsed && (
        <Animated.View style={{ opacity: collapseAnim }}>
          <Divider accentColor={accentColor} />

          <Body>
            {loading ? (
              <LoadingRow>
                <ActivityIndicator size="small" color={accentColor} />
                <LoadingText>Generating insight…</LoadingText>
              </LoadingRow>
            ) : error ? (
              <ErrorText>Couldn't load insight. Try again later.</ErrorText>
            ) : insight ? (
              <InsightText style={{ opacity }}>{insight}</InsightText>
            ) : null}
          </Body>

          {!loading && !error && insight && (
            <Footer>
              <Dot accentColor={accentColor} />
              <FooterText>
                AI-generated · for informational purposes · refreshes daily
              </FooterText>
            </Footer>
          )}
        </Animated.View>
      )}

      {SCREEN_DISCLAIMER[screen] && (
        <DisclaimerText>{SCREEN_DISCLAIMER[screen]}</DisclaimerText>
      )}
    </Card>
  );
}
