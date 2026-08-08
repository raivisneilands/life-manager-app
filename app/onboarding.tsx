import { OnboardingContext } from "@/app/_layout";
import styled from "@emotion/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useContext, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Slide = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  title: string;
  description: string;
};

const SLIDES: Slide[] = [
  {
    icon: "dashboard",
    iconBg: "#6366F1",
    title: "Everything in One Place",
    description:
      "Track your goals, habits, health, finances, journal, fitness, and relationships — without switching apps.",
  },
  {
    icon: "auto-awesome",
    iconBg: "#8B5CF6",
    title: "AI-Powered Plans & Insights",
    description:
      "Turn goals into actionable steps and get smart insights on your progress, generated for you on demand.",
  },
  {
    icon: "info",
    iconBg: "#0EA5E9",
    title: "AI & Professional Advice",
    description:
      "AI-generated insights are for informational purposes only and may be inaccurate. They do not replace medical, financial, fitness, or other professional advice. Always consult a qualified professional before making important decisions.",
  },
  {
    icon: "lock",
    iconBg: "#22C55E",
    title: "Your Data, Your Control",
    description:
      "Your data is securely stored and always yours — delete entries, clear your data, or remove your account anytime.",
  },
  {
    icon: "rocket-launch",
    iconBg: "#F59E0B",
    title: "Ready to Get Started?",
    description: "Let's build the life you're planning for.",
  },
];

const Screen = styled(SafeAreaView)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.background,
}));

const SkipButton = styled.TouchableOpacity(() => ({
  alignSelf: "flex-end",
  paddingHorizontal: 24,
  paddingTop: 12,
}));

const SkipText = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 14,
  fontWeight: "600",
}));

const Slide = styled.View(() => ({
  width: SCREEN_WIDTH,
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 32,
}));

const IconCircle = styled.View<{ bg: string }>(({ bg }) => ({
  width: 96,
  height: 96,
  borderRadius: 48,
  backgroundColor: bg,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 32,
}));

const SlideTitle = styled.Text(({ theme }) => ({
  color: theme.textPrimary,
  fontSize: 24,
  fontWeight: "700",
  textAlign: "center",
  marginBottom: 12,
}));

const SlideDescription = styled.Text(({ theme }) => ({
  color: theme.textSecondary,
  fontSize: 15,
  textAlign: "center",
  lineHeight: 22,
}));

const Footer = styled.View(() => ({
  paddingHorizontal: 24,
  paddingBottom: 16,
}));

const DotsRow = styled.View(() => ({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 8,
  marginBottom: 24,
}));

const Dot = styled.View<{ active: boolean }>(({ theme, active }) => ({
  width: active ? 20 : 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: active ? theme.primary : theme.border,
}));

const PrimaryButton = styled.TouchableOpacity(({ theme }) => ({
  backgroundColor: theme.primary,
  borderRadius: 12,
  paddingVertical: 16,
  alignItems: "center",
}));

const PrimaryButtonText = styled.Text(() => ({
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
}));

export default function OnboardingScreen() {
  const { completeOnboarding } = useContext(OnboardingContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const isLastSlide = activeIndex === SLIDES.length - 1;

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  }

  function handleNext() {
    if (isLastSlide) {
      completeOnboarding();
      return;
    }
    listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
  }

  return (
    <Screen edges={["top", "bottom"]}>
      {!isLastSlide && (
        <SkipButton onPress={completeOnboarding} activeOpacity={0.6}>
          <SkipText>Skip</SkipText>
        </SkipButton>
      )}

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.title}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={{ flex: 1 }}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <Slide>
            <IconCircle bg={item.iconBg}>
              <MaterialIcons name={item.icon} size={40} color="#fff" />
            </IconCircle>
            <SlideTitle>{item.title}</SlideTitle>
            <SlideDescription>{item.description}</SlideDescription>
          </Slide>
        )}
      />

      <Footer>
        <DotsRow>
          {SLIDES.map((_, index) => (
            <Dot key={index} active={index === activeIndex} />
          ))}
        </DotsRow>

        <PrimaryButton onPress={handleNext} activeOpacity={0.8}>
          <PrimaryButtonText>
            {isLastSlide ? "Get Started" : "Next"}
          </PrimaryButtonText>
        </PrimaryButton>
      </Footer>
    </Screen>
  );
}
