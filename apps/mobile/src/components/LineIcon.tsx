import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ACCENT_WARM, ACCENT_WARM_TINT, BORDER_CARD } from '../theme/colors';

export type IconName =
  | 'cycle' | 'observe' | 'clock' | 'calendar'
  | 'eye' | 'droplet' | 'sparkle' | 'heart'
  | 'chart' | 'grid' | 'device' | 'analytics'
  | 'shield' | 'lock' | 'gear';

interface Props {
  name: IconName;
  size?: number;
}

const C = ACCENT_WARM;
const BG = ACCENT_WARM_TINT;
const BORDER = BORDER_CARD;

export function LineIcon({ name, size = 24 }: Props): JSX.Element {
  const isLarge = size >= 60;
  const frameSize = isLarge ? size * 1.25 : size * 1.6;
  const frameRadius = isLarge ? 20 : 10;
  const borderW = isLarge ? 1.5 : 1;

  return (
    <View style={[styles.frame, {
      width: frameSize, height: frameSize, borderRadius: frameRadius,
      borderWidth: borderW, borderColor: BORDER, backgroundColor: BG,
    }]}>
      {renderIcon(name, size)}
    </View>
  );
}

function renderIcon(name: IconName, s: number): JSX.Element {
  const w = Math.max(1, s * 0.06);

  switch (name) {
    case 'cycle': return <CycleIcon s={s} w={w} />;
    case 'observe': return <ObserveIcon s={s} w={w} />;
    case 'clock': return <ClockIcon s={s} w={w} />;
    case 'calendar': return <CalendarIcon s={s} w={w} />;
    case 'eye': return <EyeIcon s={s} w={w} />;
    case 'droplet': return <DropletIcon s={s} w={w} />;
    case 'sparkle': return <SparkleIcon s={s} w={w} />;
    case 'heart': return <HeartIcon s={s} w={w} />;
    case 'chart': return <ChartIcon s={s} w={w} />;
    case 'grid': return <GridIcon s={s} w={w} />;
    case 'device': return <DeviceIcon s={s} w={w} />;
    case 'analytics': return <AnalyticsIcon s={s} w={w} />;
    case 'shield': return <ShieldIcon s={s} w={w} />;
    case 'lock': return <LockIcon s={s} w={w} />;
    case 'gear': return <GearIcon s={s} w={w} />;
  }
}

function CycleIcon({ s, w }: { s: number; w: number }): JSX.Element {
  const r = s * 0.38;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: r * 2, height: r * 2, borderRadius: r,
        borderWidth: w, borderColor: C, borderStyle: 'dashed',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <View style={{
          width: s * 0.18, height: s * 0.32,
          borderWidth: w, borderColor: C, borderRadius: s * 0.09,
          transform: [{ rotate: '15deg' }],
        }} />
      </View>
      <View style={{
        position: 'absolute', top: s * 0.06,
        width: s * 0.06, height: s * 0.06, borderRadius: s * 0.03,
        backgroundColor: C,
      }} />
    </View>
  );
}

function ObserveIcon({ s, w }: { s: number; w: number }): JSX.Element {
  const pouchW = s * 0.55;
  const pouchH = s * 0.5;
  const foldH = s * 0.14;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      {/* Pouch body with rounded bottom */}
      <View style={{
        width: pouchW, height: pouchH,
        borderWidth: w, borderColor: C,
        borderTopLeftRadius: 2, borderTopRightRadius: 2,
        borderBottomLeftRadius: pouchW * 0.45, borderBottomRightRadius: pouchW * 0.45,
        alignItems: 'center', justifyContent: 'center',
        marginTop: foldH * 0.5,
      }}>
        {/* Small leaf/droplet in center */}
        <View style={{
          width: s * 0.1, height: s * 0.18,
          borderWidth: w, borderColor: C,
          borderRadius: s * 0.05,
          transform: [{ rotate: '0deg' }],
          marginTop: s * 0.04,
        }} />
      </View>
      {/* Fold flap (inverted V) – left arm */}
      <View style={{
        position: 'absolute',
        top: (s - pouchH - foldH * 0.5) / 2,
        width: pouchW * 0.55, height: w,
        backgroundColor: C,
        transform: [{ rotate: '25deg' }],
        left: s * 0.16,
      }} />
      {/* Fold flap – right arm */}
      <View style={{
        position: 'absolute',
        top: (s - pouchH - foldH * 0.5) / 2,
        width: pouchW * 0.55, height: w,
        backgroundColor: C,
        transform: [{ rotate: '-25deg' }],
        right: s * 0.16,
      }} />
    </View>
  );
}

function ClockIcon({ s, w }: { s: number; w: number }): JSX.Element {
  const r = s * 0.28;
  const handW = Math.max(1, w);
  const hourLen = r * 0.4;
  const minLen = r * 0.55;
  const dotR = Math.max(1, r * 0.06);
  const cx = r;
  const cy = r;
  // 10:30 and 4:30 (reference): short hand upper-left, long hand lower-right; center dot
  const hourAngle = '315deg';  // 10:30
  const minAngle = '135deg';   // 4:30
  return (
    <View style={{
      width: s,
      height: s,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <View style={{
        width: r * 2,
        height: r * 2,
        borderRadius: r,
        borderWidth: w,
        borderColor: C,
      }}>
        {/* Short hand (hour) – 10:30; pivot at circle center */}
        <View style={{
          position: 'absolute',
          top: cy - hourLen,
          left: cx - handW / 2,
          width: handW,
          height: hourLen,
          backgroundColor: C,
          borderRadius: 1,
          transform: [
            { translateY: hourLen / 2 },
            { rotate: hourAngle },
            { translateY: -hourLen / 2 },
          ],
        }} />
        {/* Long hand (minute) – 4:30; pivot at circle center */}
        <View style={{
          position: 'absolute',
          top: cy - minLen,
          left: cx - handW / 2,
          width: handW,
          height: minLen,
          backgroundColor: C,
          borderRadius: 1,
          transform: [
            { translateY: minLen / 2 },
            { rotate: minAngle },
            { translateY: -minLen / 2 },
          ],
        }} />
        {/* Center dot */}
        <View style={{
          position: 'absolute',
          top: cy - dotR,
          left: cx - dotR,
          width: dotR * 2,
          height: dotR * 2,
          borderRadius: dotR,
          backgroundColor: C,
        }} />
      </View>
    </View>
  );
}

function CalendarIcon({ s, w }: { s: number; w: number }): JSX.Element {
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: s * 0.65, height: s * 0.6,
        borderWidth: w, borderColor: C, borderRadius: 3,
        overflow: 'hidden',
      }}>
        <View style={{
          height: s * 0.12, backgroundColor: C, opacity: 0.3,
        }} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{
            width: s * 0.1, height: s * 0.1, borderRadius: s * 0.05,
            backgroundColor: C,
          }} />
        </View>
      </View>
      <View style={{
        position: 'absolute', top: s * 0.14,
        flexDirection: 'row', gap: s * 0.22,
      }}>
        {[0, 1].map(i => (
          <View key={i} style={{
            width: w * 1.2, height: s * 0.1, backgroundColor: C, borderRadius: 1,
          }} />
        ))}
      </View>
    </View>
  );
}

function EyeIcon({ s, w }: { s: number; w: number }): JSX.Element {
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: s * 0.7, height: s * 0.35,
        borderWidth: w, borderColor: C,
        borderRadius: s * 0.35,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <View style={{
          width: s * 0.16, height: s * 0.16, borderRadius: s * 0.08,
          backgroundColor: C,
        }} />
      </View>
    </View>
  );
}

function DropletIcon({ s, w }: { s: number; w: number }): JSX.Element {
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: s * 0.35, height: s * 0.35, borderRadius: s * 0.175,
        borderWidth: w, borderColor: C,
        transform: [{ rotate: '45deg' }],
        marginTop: s * 0.1,
      }} />
      <View style={{
        position: 'absolute', top: s * 0.18,
        width: 0, height: 0,
        borderLeftWidth: s * 0.175, borderRightWidth: s * 0.175,
        borderBottomWidth: s * 0.22,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderBottomColor: C,
        opacity: 0.4,
      }} />
    </View>
  );
}

function SparkleIcon({ s, w }: { s: number; w: number }): JSX.Element {
  const arm = s * 0.22;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: w * 1.5, height: arm * 2, backgroundColor: C, borderRadius: 1 }} />
      <View style={{
        position: 'absolute',
        width: arm * 2, height: w * 1.5, backgroundColor: C, borderRadius: 1,
      }} />
      <View style={{
        position: 'absolute',
        width: w * 1.5, height: arm * 1.5, backgroundColor: C, borderRadius: 1,
        transform: [{ rotate: '45deg' }],
      }} />
      <View style={{
        position: 'absolute',
        width: arm * 1.5, height: w * 1.5, backgroundColor: C, borderRadius: 1,
        transform: [{ rotate: '45deg' }],
      }} />
    </View>
  );
}

function HeartIcon({ s, w }: { s: number; w: number }): JSX.Element {
  const lobe = s * 0.2;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row', gap: lobe * 0.3, marginTop: -s * 0.06 }}>
        <View style={{
          width: lobe * 2, height: lobe * 2, borderRadius: lobe,
          borderWidth: w, borderColor: C,
        }} />
        <View style={{
          width: lobe * 2, height: lobe * 2, borderRadius: lobe,
          borderWidth: w, borderColor: C, marginLeft: -lobe * 0.3,
        }} />
      </View>
      <View style={{
        width: 0, height: 0, marginTop: -lobe * 0.5,
        borderLeftWidth: lobe * 1.15 + lobe * 0.15, borderRightWidth: lobe * 1.15 + lobe * 0.15,
        borderTopWidth: lobe * 1.5,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderTopColor: C, opacity: 0.35,
      }} />
    </View>
  );
}

function ChartIcon({ s, w }: { s: number; w: number }): JSX.Element {
  const barW = s * 0.13;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: s * 0.15 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: s * 0.06 }}>
        {[0.25, 0.5, 0.35, 0.65].map((h, i) => (
          <View key={i} style={{
            width: barW, height: s * h, backgroundColor: C,
            borderRadius: 2, opacity: 0.5 + i * 0.15,
          }} />
        ))}
      </View>
    </View>
  );
}

function GridIcon({ s, w }: { s: number; w: number }): JSX.Element {
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: s * 0.6, height: s * 0.6,
        borderWidth: w, borderColor: C, borderRadius: 2,
      }}>
        <View style={{
          position: 'absolute', top: '33%', left: 0, right: 0,
          height: w, backgroundColor: C,
        }} />
        <View style={{
          position: 'absolute', top: '66%', left: 0, right: 0,
          height: w, backgroundColor: C,
        }} />
        <View style={{
          position: 'absolute', left: '33%', top: 0, bottom: 0,
          width: w, backgroundColor: C,
        }} />
        <View style={{
          position: 'absolute', left: '66%', top: 0, bottom: 0,
          width: w, backgroundColor: C,
        }} />
      </View>
    </View>
  );
}

function DeviceIcon({ s, w }: { s: number; w: number }): JSX.Element {
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: s * 0.4, height: s * 0.65,
        borderWidth: w, borderColor: C, borderRadius: s * 0.06,
        alignItems: 'center', justifyContent: 'flex-end', paddingBottom: s * 0.04,
      }}>
        <View style={{
          width: s * 0.1, height: w * 1.2, backgroundColor: C, borderRadius: 1,
        }} />
      </View>
    </View>
  );
}

function AnalyticsIcon({ s, w }: { s: number; w: number }): JSX.Element {
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: s * 0.65, height: w, backgroundColor: C, marginTop: s * 0.15,
      }} />
      <View style={{
        position: 'absolute',
        flexDirection: 'row', alignItems: 'flex-end', gap: s * 0.04, bottom: s * 0.22,
      }}>
        {[0.15, 0.3, 0.22, 0.45].map((h, i) => (
          <View key={i} style={{
            width: s * 0.1, height: s * h, backgroundColor: C,
            borderRadius: 1.5, opacity: 0.5 + i * 0.15,
          }} />
        ))}
      </View>
    </View>
  );
}

function ShieldIcon({ s, w }: { s: number; w: number }): JSX.Element {
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: s * 0.5, height: s * 0.58,
        borderWidth: w, borderColor: C,
        borderTopLeftRadius: s * 0.04, borderTopRightRadius: s * 0.04,
        borderBottomLeftRadius: s * 0.25, borderBottomRightRadius: s * 0.25,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <View style={{
          width: s * 0.15, height: w * 1.5, backgroundColor: C,
          borderRadius: 1, transform: [{ rotate: '45deg' }],
        }} />
        <View style={{
          position: 'absolute',
          width: w * 1.5, height: s * 0.15, backgroundColor: C,
          borderRadius: 1, transform: [{ rotate: '45deg' }],
        }} />
      </View>
    </View>
  );
}

function LockIcon({ s, w }: { s: number; w: number }): JSX.Element {
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: s * 0.28, height: s * 0.2,
        borderWidth: w, borderColor: C,
        borderTopLeftRadius: s * 0.14, borderTopRightRadius: s * 0.14,
        borderBottomWidth: 0, marginBottom: -w,
      }} />
      <View style={{
        width: s * 0.42, height: s * 0.32,
        borderWidth: w, borderColor: C, borderRadius: 3,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <View style={{
          width: s * 0.06, height: s * 0.1, backgroundColor: C, borderRadius: 1,
        }} />
      </View>
    </View>
  );
}

function GearIcon({ s, w }: { s: number; w: number }): JSX.Element {
  const r = s * 0.2;
  const toothSize = s * 0.08;
  return (
    <View style={{ width: s, height: s, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: r * 2, height: r * 2, borderRadius: r,
        borderWidth: w, borderColor: C,
      }} />
      {[0, 45, 90, 135].map(deg => (
        <View key={deg} style={{
          position: 'absolute',
          width: toothSize, height: s * 0.56,
          borderRadius: 1,
          backgroundColor: C, opacity: 0.5,
          transform: [{ rotate: `${deg}deg` }],
        }} />
      ))}
      <View style={{
        position: 'absolute',
        width: r * 0.8, height: r * 0.8, borderRadius: r * 0.4,
        backgroundColor: C, opacity: 0.3,
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
