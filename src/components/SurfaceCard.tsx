import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { palette } from '@theme/colors';
import { radius } from '@theme/spacing';

export type SurfaceCardProps = ViewProps & {
  children: ReactNode;
  elevated?: boolean;
  highlight?: 'lime' | 'amber' | 'aqua';
  header?: ReactNode;
  footer?: ReactNode;
};

const highlightGradients = {
  lime: ['rgba(168, 255, 96, 0.24)', 'rgba(168, 255, 96, 0.08)'],
  amber: ['rgba(255, 166, 77, 0.24)', 'rgba(255, 166, 77, 0.08)'],
  aqua: ['rgba(94, 208, 255, 0.24)', 'rgba(94, 208, 255, 0.08)'],
};

const SurfaceCard = ({
  children,
  elevated,
  highlight,
  header,
  footer,
  style,
  ...rest
}: SurfaceCardProps) => {
  const content = (
    <View style={[styles.card, elevated && styles.elevated, style]} {...rest}>
      {header && <View style={styles.section}>{header}</View>}
      <View style={[styles.section, styles.content]}>{children}</View>
      {footer && <View style={styles.section}>{footer}</View>}
    </View>
  );

  if (!highlight) {
    return content;
  }

  return (
    <LinearGradient colors={highlightGradients[highlight]} style={styles.gradientWrapper}>
      {content}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientWrapper: {
    borderRadius: radius.md,
    padding: 1,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  elevated: {
    backgroundColor: palette.surfaceElevated,
    shadowColor: '#000',
    shadowOpacity: 0.32,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 12,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  content: {
    paddingTop: 12,
    paddingBottom: 20,
  },
});

export default SurfaceCard;
