import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';

import { palette } from '@theme/colors';
import { typography } from '@theme/typography';

export type ProgressRingProps = {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  label: string;
  value: string;
  goal?: string;
};

const ProgressRing = ({
  progress,
  size = 220,
  strokeWidth = 18,
  label,
  value,
  goal,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#1f2228"
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={palette.accentPrimary}
          fill="transparent"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        {goal ? <Text style={styles.goal}>{goal}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.bodySmall,
    letterSpacing: 1.2,
  },
  value: {
    ...typography.h2,
    marginTop: 8,
  },
  goal: {
    ...typography.bodySmall,
    marginTop: 8,
    color: palette.textMuted,
  },
});

export default ProgressRing;
