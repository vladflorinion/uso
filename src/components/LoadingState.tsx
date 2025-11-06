import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

import { palette } from '@theme/colors';
import { typography } from '@theme/typography';

const LoadingState = ({ message = 'Loading...' }: { message?: string }) => (
  <View style={styles.container}>
    <ActivityIndicator color={palette.accentPrimary} size="large" />
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  message: {
    ...typography.bodySmall,
    marginTop: 16,
    color: palette.textMuted,
  },
});

export default LoadingState;
