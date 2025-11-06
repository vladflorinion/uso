import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { palette } from '@theme/colors';

const backgroundGradient = ['rgba(168, 255, 96, 0.06)', 'rgba(94, 208, 255, 0.04)', 'rgba(255, 166, 77, 0.04)'];

const overlayGradient = ['rgba(8, 9, 12, 0.92)', 'rgba(8, 9, 12, 0.96)'];

const GradientBackground = ({ children }: { children: ReactNode }) => (
  <View style={styles.container}>
    <LinearGradient colors={backgroundGradient} style={StyleSheet.absoluteFill} />
    <LinearGradient colors={overlayGradient} style={StyleSheet.absoluteFill} />
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
});

export default GradientBackground;
