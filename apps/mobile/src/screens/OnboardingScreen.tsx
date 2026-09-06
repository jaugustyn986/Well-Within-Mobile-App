import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
  type ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ACCENT_WARM,
  BG_PAGE,
  BORDER_CARD,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_MUTED,
} from '../theme/colors';
import {
  OnboardingChartContextPanel,
  OnboardingEntryPanel,
  OnboardingFirstActionPanel,
  OnboardingIntercoursePanel,
  OnboardingPrivacyPanel,
} from '../components/OnboardingPanels';
import {
  ONBOARDING_SLIDES,
  onboardingPrimaryActionLabel,
  type OnboardingSlideDefinition,
} from './onboardingFlow';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoSource = require('../../assets/icon-1024.png');

const { width: SW, height: SH } = Dimensions.get('window');

interface Props {
  onComplete: () => void;
}

function IdentitySlide({
  headline,
  body,
}: {
  headline: string;
  body: string;
}): React.JSX.Element {
  return (
    <View style={identity.container}>
      <View style={identity.decorativeLayer} importantForAccessibility="no-hide-descendants">
        <View style={identity.blob1} />
        <View style={identity.blob2} />
        <View style={identity.blob3} />
      </View>
      <View style={identity.content}>
        <View style={identity.logoBox}>
          <Image
            source={logoSource}
            style={identity.logo}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </View>
        <Text style={identity.brandName}>{headline}</Text>
        <Text style={identity.tagline}>{body}</Text>
        <View style={identity.promiseCard}>
          <Text style={identity.promise}>
            Record what you observe. See it in context. Keep control of your chart.
          </Text>
        </View>
      </View>
    </View>
  );
}

function OnboardingTopNav({
  step,
  total,
  onBack,
}: {
  step: number;
  total: number;
  onBack: () => void;
}): React.JSX.Element {
  return (
    <View style={panel.topNav}>
      <Pressable
        onPress={onBack}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Previous onboarding screen"
        style={({ pressed }) => [panel.backButton, pressed && panel.pressed]}
      >
        <Text style={panel.backText}>{'‹ Back'}</Text>
      </Pressable>
      <Text
        style={panel.stepText}
        accessibilityLabel={`Step ${step} of ${total}`}
      >
        {step} of {total}
      </Text>
      <View style={panel.topNavSpacer} />
    </View>
  );
}

function PanelSlide({
  headline,
  body,
  renderPanel,
  step,
  total,
  onBack,
}: {
  headline: string;
  body: string;
  renderPanel: () => React.JSX.Element;
  step: number;
  total: number;
  onBack: () => void;
}): React.JSX.Element {
  return (
    <View style={panel.container}>
      <OnboardingTopNav step={step} total={total} onBack={onBack} />
      <ScrollView
        style={panel.scroll}
        contentContainerStyle={panel.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={panel.textBlock}>
          <Text style={panel.headline}>{headline}</Text>
          <Text style={panel.body}>{body}</Text>
        </View>
        <View style={panel.panelArea}>
          {renderPanel()}
        </View>
      </ScrollView>
    </View>
  );
}

function renderPanelForKind(
  item: OnboardingSlideDefinition,
): () => React.JSX.Element {
  switch (item.kind) {
    case 'chart_context':
      return () => <OnboardingChartContextPanel />;
    case 'observation':
      return () => <OnboardingEntryPanel />;
    case 'intercourse':
      return () => <OnboardingIntercoursePanel />;
    case 'privacy':
      return () => <OnboardingPrivacyPanel />;
    case 'first_action':
      return () => <OnboardingFirstActionPanel />;
    case 'identity':
      throw new Error('Identity slides do not render a panel.');
  }
}

function renderSlideContent(
  item: OnboardingSlideDefinition,
  index: number,
  onBack: () => void,
): React.JSX.Element {
  if (item.kind === 'identity') {
    return <IdentitySlide headline={item.headline} body={item.body} />;
  }

  return (
    <PanelSlide
      headline={item.headline}
      body={item.body}
      renderPanel={renderPanelForKind(item)}
      step={index + 1}
      total={ONBOARDING_SLIDES.length}
      onBack={onBack}
    />
  );
}

export function OnboardingScreen({ onComplete }: Props): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const flatListRef = useRef<FlatList<OnboardingSlideDefinition>>(null);

  const goToIndex = (nextIndex: number) => {
    const bounded = Math.max(0, Math.min(ONBOARDING_SLIDES.length - 1, nextIndex));
    setActiveIndex(bounded);
    activeIndexRef.current = bounded;
    flatListRef.current?.scrollToOffset({ offset: bounded * SW, animated: true });
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        activeIndexRef.current = viewableItems[0].index;
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const onScroll = useRef(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / SW);
      if (index !== activeIndexRef.current) {
        activeIndexRef.current = index;
        setActiveIndex(index);
      }
    },
  ).current;

  const handleNext = () => {
    if (activeIndex >= ONBOARDING_SLIDES.length - 1) {
      onComplete();
      return;
    }
    goToIndex(activeIndex + 1);
  };

  const handleBack = () => {
    goToIndex(activeIndex - 1);
  };

  const renderItem = ({
    item,
    index,
  }: ListRenderItemInfo<OnboardingSlideDefinition>) => (
    <View style={[styles.slide, { width: SW }]}>
      {renderSlideContent(item, index, handleBack)}
    </View>
  );

  const navFooter = (
    <View style={styles.navFooter}>
      <View
        style={styles.dots}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 1,
          max: ONBOARDING_SLIDES.length,
          now: activeIndex + 1,
        }}
      >
        {ONBOARDING_SLIDES.map((slide, index) => (
          <View
            key={slide.id}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleNext}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>
          {onboardingPrimaryActionLabel(activeIndex)}
        </Text>
      </Pressable>
    </View>
  );

  if (Platform.OS === 'web') {
    const item = ONBOARDING_SLIDES[activeIndex];
    return (
      <View style={styles.container}>
        <View style={styles.slide}>
          {renderSlideContent(item, activeIndex, handleBack)}
        </View>
        {navFooter}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        onScroll={onScroll}
        scrollEventThrottle={32}
        getItemLayout={(_, index) => ({
          length: SW,
          offset: SW * index,
          index,
        })}
      />
      {navFooter}
    </SafeAreaView>
  );
}

const identity = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    width: SW,
    height: SW,
    borderRadius: SW / 2,
    backgroundColor: '#EDE8DC',
    opacity: 0.65,
    top: SH * 0.02,
    left: -SW * 0.25,
  },
  blob2: {
    position: 'absolute',
    width: SW * 0.75,
    height: SW * 0.75,
    borderRadius: SW * 0.375,
    backgroundColor: '#E5E0D5',
    opacity: 0.55,
    top: SH * 0.32,
    right: -SW * 0.2,
  },
  blob3: {
    position: 'absolute',
    width: SW * 0.55,
    height: SW * 0.55,
    borderRadius: SW * 0.275,
    backgroundColor: '#D9E5DC',
    opacity: 0.45,
    bottom: SH * 0.08,
    left: SW * 0.08,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoBox: {
    width: 140,
    height: 140,
    borderRadius: 28,
    backgroundColor: '#FDFCFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  logo: {
    width: 110,
    height: 110,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '300',
    color: TEXT_PRIMARY,
    letterSpacing: 2,
    marginBottom: 14,
    textTransform: 'lowercase',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  promiseCard: {
    marginTop: 30,
    maxWidth: 330,
    paddingHorizontal: 20,
    paddingVertical: 17,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    backgroundColor: 'rgba(253, 252, 251, 0.78)',
  },
  promise: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: TEXT_SECONDARY,
  },
});

const panel = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNav: {
    minHeight: 52,
    paddingTop: 16,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 76,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    color: ACCENT_WARM,
    fontSize: 16,
    fontWeight: '600',
  },
  stepText: {
    color: TEXT_MUTED,
    fontSize: 13,
    fontWeight: '600',
  },
  topNavSpacer: {
    width: 76,
  },
  pressed: {
    opacity: 0.55,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 12,
  },
  textBlock: {
    paddingTop: 12,
    paddingHorizontal: 28,
    paddingBottom: 20,
  },
  headline: {
    fontSize: 30,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    letterSpacing: -0.6,
    lineHeight: 35,
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: TEXT_SECONDARY,
    lineHeight: 24,
  },
  panelArea: {
    paddingHorizontal: 28,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_PAGE,
  },
  slide: {
    flex: 1,
  },
  navFooter: {
    paddingHorizontal: 28,
    paddingBottom: 36,
    paddingTop: 12,
    alignItems: 'center',
    backgroundColor: BG_PAGE,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D6D0CA',
  },
  dotActive: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: ACCENT_WARM,
  },
  button: {
    backgroundColor: ACCENT_WARM,
    borderRadius: 16,
    minHeight: 58,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    shadowColor: ACCENT_WARM,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.78,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
});
