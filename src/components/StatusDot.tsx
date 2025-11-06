import React from 'react';
import { View, StyleSheet } from 'react-native';

import { palette } from '@theme/colors';

const colorMap = {
  success: palette.accentPrimary,
  warning: '#FFA64D',
  neutral: '#8a8f9c',
};

type StatusDotProps = {
  status?: keyof typeof colorMap;
};

const StatusDot = ({ status = 'neutral' }: StatusDotProps) => (
  <View style={[styles.dot, { backgroundColor: colorMap[status] }]} />
);

const styles = StyleSheet.create({
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowColor: '#a8ff60',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default StatusDot;
