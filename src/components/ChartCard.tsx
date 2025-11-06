import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import SurfaceCard from './SurfaceCard';
import TrendIndicator from './TrendIndicator';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';

type ChartCardProps = {
  title: string;
  value: string;
  trend?: number;
  caption?: string;
  footer?: ReactNode;
  children: ReactNode;
};

const ChartCard = ({ title, value, trend, caption, footer, children }: ChartCardProps) => (
  <SurfaceCard
    header={
      <View style={styles.header}>
        <View>
          <Text style={styles.caption}>{caption}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          {typeof trend === 'number' ? <TrendIndicator value={trend} /> : null}
        </View>
      </View>
    }
    footer={footer}
  >
    <View style={styles.chart}>{children}</View>
  </SurfaceCard>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caption: {
    ...typography.bodySmall,
    color: palette.textMuted,
    marginBottom: 4,
  },
  title: {
    ...typography.h3,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  value: {
    ...typography.h3,
    letterSpacing: 0,
  },
  chart: {
    marginTop: 12,
  },
});

export default ChartCard;
