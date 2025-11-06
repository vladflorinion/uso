import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { palette } from '@theme/colors';
import { radius } from '@theme/spacing';
import { typography } from '@theme/typography';

type ProgressBarProps = {
  label: string;
  value: number;
  goal: number;
  color?: string;
  unit?: string;
};

const ProgressBar = ({ label, value, goal, color = palette.accentPrimary, unit }: ProgressBarProps) => {
  const progress = goal > 0 ? Math.min(value / goal, 1) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value}
          {unit ? ` ${unit}` : ''} / {goal}
          {unit ? ` ${unit}` : ''}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    ...typography.bodySmall,
    color: palette.textMuted,
  },
  value: {
    ...typography.body,
  },
  track: {
    height: 12,
    backgroundColor: '#1b1d22',
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.xl,
  },
});

export default ProgressBar;
