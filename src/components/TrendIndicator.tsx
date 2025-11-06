import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { palette } from '@theme/colors';
import { typography } from '@theme/typography';

type TrendIndicatorProps = {
  value: number;
  direction?: 'up' | 'down';
};

const TrendIndicator = ({ value, direction }: TrendIndicatorProps) => {
  if (!direction) {
    direction = value >= 0 ? 'up' : 'down';
  }

  const color = direction === 'up' ? palette.accentPrimary : '#ff6b6b';

  return (
    <View style={styles.container}>
      <Ionicons
        name={direction === 'up' ? 'arrow-up' : 'arrow-down'}
        color={color}
        size={14}
        style={styles.icon}
      />
      <Text style={[styles.value, { color }]}>{value > 0 ? `+${value}%` : `${value}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  value: {
    ...typography.bodySmall,
  },
});

export default TrendIndicator;
