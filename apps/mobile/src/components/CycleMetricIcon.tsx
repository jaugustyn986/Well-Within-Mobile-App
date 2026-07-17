import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PEAK_BORDER } from '../theme/colors';

export type CycleMetricIconName =
  | 'calendar-check'
  | 'calendar-progress'
  | 'calendar-question'
  | 'calendar-range'
  | 'comparison-chart'
  | 'peak-curve'
  | 'sprout';

interface Props {
  name: CycleMetricIconName;
  backgroundColor: string;
  size?: number;
}

export function CycleMetricIcon({
  name,
  backgroundColor,
  size = 48,
}: Props): React.JSX.Element {
  const canvasSize = size * 0.58;
  const stroke = Math.max(1.4, size * 0.035);

  return (
    <View
      style={[
        styles.frame,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {renderIcon(name, canvasSize, stroke)}
    </View>
  );
}

function renderIcon(
  name: CycleMetricIconName,
  size: number,
  stroke: number,
): React.JSX.Element {
  switch (name) {
    case 'calendar-check':
    case 'calendar-progress':
    case 'calendar-question':
    case 'calendar-range':
      return <CalendarMetricIcon name={name} size={size} stroke={stroke} />;
    case 'comparison-chart':
      return <ComparisonChartIcon size={size} stroke={stroke} />;
    case 'peak-curve':
      return <PeakCurveIcon size={size} stroke={stroke} />;
    case 'sprout':
      return <SproutMetricIcon size={size} stroke={stroke} />;
  }
}

function CalendarMetricIcon({
  name,
  size,
  stroke,
}: {
  name: Extract<CycleMetricIconName, `calendar-${string}`>;
  size: number;
  stroke: number;
}): React.JSX.Element {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: size * 0.82,
        height: size * 0.72,
        borderWidth: stroke,
        borderColor: PEAK_BORDER,
        borderRadius: size * 0.08,
        marginTop: size * 0.08,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: size * 0.17,
          height: stroke,
          backgroundColor: PEAK_BORDER,
        }} />
        {name === 'calendar-check' ? <CheckGlyph size={size} stroke={stroke} /> : null}
        {name === 'calendar-progress' ? <ProgressGlyph size={size} stroke={stroke} /> : null}
        {name === 'calendar-question' ? (
          <Text style={{
            color: PEAK_BORDER,
            fontSize: size * 0.42,
            lineHeight: size * 0.45,
            fontWeight: '600',
            marginTop: size * 0.17,
          }}>
            ?
          </Text>
        ) : null}
        {name === 'calendar-range' ? <RangeGlyph size={size} stroke={stroke} /> : null}
      </View>
      <View style={[styles.binding, {
        left: size * 0.24,
        top: size * 0.03,
        width: stroke,
        height: size * 0.2,
        backgroundColor: PEAK_BORDER,
      }]} />
      <View style={[styles.binding, {
        right: size * 0.24,
        top: size * 0.03,
        width: stroke,
        height: size * 0.2,
        backgroundColor: PEAK_BORDER,
      }]} />
    </View>
  );
}

function CheckGlyph({ size, stroke }: { size: number; stroke: number }): React.JSX.Element {
  return (
    <View style={{
      width: size * 0.42,
      height: size * 0.28,
      marginTop: size * 0.2,
    }}>
      <View style={{
        position: 'absolute',
        left: size * 0.03,
        bottom: size * 0.06,
        width: size * 0.17,
        height: stroke,
        borderRadius: stroke,
        backgroundColor: PEAK_BORDER,
        transform: [{ rotate: '42deg' }],
      }} />
      <View style={{
        position: 'absolute',
        left: size * 0.14,
        bottom: size * 0.1,
        width: size * 0.27,
        height: stroke,
        borderRadius: stroke,
        backgroundColor: PEAK_BORDER,
        transform: [{ rotate: '-42deg' }],
      }} />
      <View style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: stroke * 1.7,
        height: stroke * 1.7,
        borderRadius: stroke,
        backgroundColor: PEAK_BORDER,
      }} />
    </View>
  );
}

function ProgressGlyph({ size, stroke }: { size: number; stroke: number }): React.JSX.Element {
  return (
    <View style={{ width: size * 0.48, height: size * 0.28, marginTop: size * 0.2 }}>
      <View style={{
        position: 'absolute',
        left: size * 0.03,
        bottom: size * 0.05,
        width: size * 0.19,
        height: stroke,
        backgroundColor: PEAK_BORDER,
        transform: [{ rotate: '-35deg' }],
      }} />
      <View style={{
        position: 'absolute',
        left: size * 0.19,
        bottom: size * 0.07,
        width: size * 0.19,
        height: stroke,
        backgroundColor: PEAK_BORDER,
        transform: [{ rotate: '28deg' }],
      }} />
      <View style={{
        position: 'absolute',
        right: 0,
        top: size * 0.03,
        width: stroke * 1.8,
        height: stroke * 1.8,
        borderRadius: stroke,
        backgroundColor: PEAK_BORDER,
      }} />
    </View>
  );
}

function RangeGlyph({ size, stroke }: { size: number; stroke: number }): React.JSX.Element {
  return (
    <View style={{ width: size * 0.5, height: size * 0.22, marginTop: size * 0.2 }}>
      <View style={{
        position: 'absolute',
        left: size * 0.05,
        right: size * 0.05,
        top: size * 0.1,
        height: stroke,
        backgroundColor: PEAK_BORDER,
      }} />
      <View style={{
        position: 'absolute',
        left: size * 0.03,
        top: size * 0.04,
        width: size * 0.13,
        height: stroke,
        backgroundColor: PEAK_BORDER,
        transform: [{ rotate: '-42deg' }],
      }} />
      <View style={{
        position: 'absolute',
        right: size * 0.03,
        top: size * 0.04,
        width: size * 0.13,
        height: stroke,
        backgroundColor: PEAK_BORDER,
        transform: [{ rotate: '42deg' }],
      }} />
    </View>
  );
}

function ComparisonChartIcon({ size, stroke }: { size: number; stroke: number }): React.JSX.Element {
  const dot = stroke * 2.4;
  return (
    <View style={{ width: size, height: size }}>
      <View style={{
        position: 'absolute',
        left: size * 0.08,
        top: size * 0.08,
        bottom: size * 0.08,
        width: stroke,
        backgroundColor: PEAK_BORDER,
      }} />
      <View style={{
        position: 'absolute',
        left: size * 0.08,
        right: size * 0.04,
        bottom: size * 0.08,
        height: stroke,
        backgroundColor: PEAK_BORDER,
      }} />
      <View style={{
        position: 'absolute',
        left: size * 0.17,
        top: size * 0.54,
        width: size * 0.26,
        height: stroke,
        backgroundColor: PEAK_BORDER,
        transform: [{ rotate: '-48deg' }],
      }} />
      <View style={{
        position: 'absolute',
        left: size * 0.39,
        top: size * 0.48,
        width: size * 0.22,
        height: stroke,
        backgroundColor: PEAK_BORDER,
        transform: [{ rotate: '42deg' }],
      }} />
      <View style={{
        position: 'absolute',
        right: size * 0.09,
        top: size * 0.32,
        width: size * 0.25,
        height: stroke,
        backgroundColor: PEAK_BORDER,
        transform: [{ rotate: '-52deg' }],
      }} />
      {[
        { left: size * 0.16, top: size * 0.61 },
        { left: size * 0.38, top: size * 0.34 },
        { left: size * 0.57, top: size * 0.5 },
        { left: size * 0.79, top: size * 0.2 },
      ].map((position, index) => (
        <View key={index} style={{
          position: 'absolute',
          ...position,
          width: dot,
          height: dot,
          borderRadius: dot / 2,
          borderWidth: stroke * 0.75,
          borderColor: PEAK_BORDER,
          backgroundColor: 'transparent',
        }} />
      ))}
    </View>
  );
}

function PeakCurveIcon({ size, stroke }: { size: number; stroke: number }): React.JSX.Element {
  const dot = stroke * 2;
  return (
    <View style={{ width: size, height: size }}>
      <View style={{
        position: 'absolute',
        left: size * 0.12,
        top: size * 0.55,
        width: size * 0.42,
        height: stroke,
        borderRadius: stroke,
        backgroundColor: PEAK_BORDER,
        transform: [{ rotate: '-48deg' }],
      }} />
      <View style={{
        position: 'absolute',
        left: size * 0.43,
        top: size * 0.49,
        width: size * 0.31,
        height: stroke,
        borderRadius: stroke,
        backgroundColor: PEAK_BORDER,
        transform: [{ rotate: '42deg' }],
      }} />
      <View style={{
        position: 'absolute',
        right: size * 0.08,
        top: size * 0.64,
        width: size * 0.22,
        height: stroke,
        borderRadius: stroke,
        backgroundColor: PEAK_BORDER,
        transform: [{ rotate: '-20deg' }],
      }} />
      <View style={{
        position: 'absolute',
        left: size * 0.46,
        top: size * 0.08,
        width: stroke,
        height: size * 0.31,
        backgroundColor: PEAK_BORDER,
        borderRadius: stroke,
      }} />
      {[
        { left: size * 0.43, top: size * 0.33 },
        { left: size * 0.67, top: size * 0.64 },
        { right: size * 0.03, top: size * 0.57 },
      ].map((position, index) => (
        <View key={index} style={{
          position: 'absolute',
          ...position,
          width: dot,
          height: dot,
          borderRadius: dot / 2,
          backgroundColor: PEAK_BORDER,
        }} />
      ))}
    </View>
  );
}

function SproutMetricIcon({ size, stroke }: { size: number; stroke: number }): React.JSX.Element {
  return (
    <View style={{ width: size, height: size }}>
      <View style={{
        position: 'absolute',
        left: size * 0.49,
        top: size * 0.38,
        width: stroke,
        height: size * 0.49,
        borderRadius: stroke,
        backgroundColor: PEAK_BORDER,
      }} />
      <View style={{
        position: 'absolute',
        left: size * 0.08,
        top: size * 0.22,
        width: size * 0.39,
        height: size * 0.25,
        borderWidth: stroke,
        borderColor: PEAK_BORDER,
        borderTopLeftRadius: size * 0.23,
        borderBottomRightRadius: size * 0.23,
        transform: [{ rotate: '14deg' }],
      }} />
      <View style={{
        position: 'absolute',
        right: size * 0.08,
        top: size * 0.12,
        width: size * 0.39,
        height: size * 0.25,
        borderWidth: stroke,
        borderColor: PEAK_BORDER,
        borderTopRightRadius: size * 0.23,
        borderBottomLeftRadius: size * 0.23,
        transform: [{ rotate: '-14deg' }],
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', justifyContent: 'center' },
  binding: { position: 'absolute', borderRadius: 2 },
});
