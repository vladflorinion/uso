import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

import { palette } from '@theme/colors';
import { radius } from '@theme/spacing';
import { typography } from '@theme/typography';

type PeriodToggleProps<T extends string | number> = {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
};

const PeriodToggle = <T extends string | number>({ options, value, onChange }: PeriodToggleProps<T>) => (
  <View style={styles.container}>
    {options.map((option) => {
      const active = option.value === value;
      return (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          style={({ pressed }) => [
            styles.pill,
            active && styles.pillActive,
            pressed && { opacity: 0.9 },
          ]}
        >
          <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#101217',
    padding: 6,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.border,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: radius.xl,
  },
  pillActive: {
    backgroundColor: palette.accentSoft,
  },
  label: {
    ...typography.bodySmall,
    color: palette.textMuted,
  },
  labelActive: {
    color: palette.accentPrimary,
    fontFamily: 'Inter-SemiBold',
  },
});

export default PeriodToggle;
