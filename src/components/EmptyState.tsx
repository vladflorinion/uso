import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { palette } from '@theme/colors';
import { typography } from '@theme/typography';

const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  title: {
    ...typography.h3,
    marginBottom: 12,
  },
  description: {
    ...typography.body,
    color: palette.textMuted,
    textAlign: 'center',
  },
});

export default EmptyState;
