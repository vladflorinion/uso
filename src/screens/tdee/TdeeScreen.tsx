import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';

import GradientBackground from '@components/GradientBackground';
import SurfaceCard from '@components/SurfaceCard';
import PeriodToggle from '@components/PeriodToggle';
import ChartCard from '@components/ChartCard';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { useDailyLogs } from '@services/dailyLogs';
import { useAuth } from '@services/auth/AuthContext';
import { useSettingsStore } from '@store/useSettingsStore';
import { calculateTdee } from '@services/tdee';

const periods: (14 | 21 | 30)[] = [14, 21, 30];

const TdeeScreen = () => {
  const { user } = useAuth();
  const { settings } = useSettingsStore();
  const [period, setPeriod] = useState<14 | 21 | 30>(14);
  const { data: logs = [], isLoading, refetch } = useDailyLogs(user?.id);

  const filteredLogs = useMemo(
    () => logs.filter((log) => log.date).sort((a, b) => a.date.localeCompare(b.date)),
    [logs],
  );

  const result = useMemo(
    () => calculateTdee(filteredLogs, period, settings.units.weight),
    [filteredLogs, period, settings.units.weight],
  );

  const insufficientData = filteredLogs.length < 7;

  return (
    <GradientBackground>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => refetch()} />}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={typography.h2}>TDEE Calculator</Text>
          <Text style={styles.subtitle}>Estimate your maintenance intake based on recent logs.</Text>
        </View>

        <PeriodToggle
          options={periods.map((value) => ({ label: `${value} days`, value }))}
          value={period}
          onChange={(value) => setPeriod(value as 14 | 21 | 30)}
        />

        {insufficientData ? (
          <AlertBanner message="Log at least 7 days to unlock precise TDEE insights." />
        ) : null}

        <SurfaceCard elevated style={styles.mainCard}>
          <Text style={styles.tdeeLabel}>Calculated TDEE</Text>
          <Text style={styles.tdeeValue}>{result.tdee} kcal</Text>
          <Text style={styles.tdeeRange}>Range: {result.periodLabel}</Text>
          <View style={styles.gradientBar}>
            <View style={[styles.gradientSegment, { backgroundColor: '#FF6B6B' }]} />
            <View style={[styles.gradientSegment, { backgroundColor: palette.accentPrimary }]} />
            <View style={[styles.gradientSegment, { backgroundColor: '#5ED0FF' }]} />
          </View>
          <View style={styles.rangeRow}>
            <Text style={styles.rangeText}>Deficit {result.deficit} kcal</Text>
            <Text style={styles.rangeText}>Maintenance {result.tdee} kcal</Text>
            <Text style={styles.rangeText}>Surplus {result.surplus} kcal</Text>
          </View>
        </SurfaceCard>

        <View style={styles.chartGrid}>
          <ChartCard title="Average intake" value={`${result.averageCalories} kcal`} caption={`${period}-day mean`}>
            <Text style={styles.chartPlaceholder}>Line chart placeholder</Text>
          </ChartCard>
          <ChartCard title="Weight change" value={`${result.weightChange.toFixed(1)} ${settings.units.weight}`} caption="Total shift">
            <Text style={styles.chartPlaceholder}>Weight trend line</Text>
          </ChartCard>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const AlertBanner = ({ message }: { message: string }) => (
  <View style={styles.alertBanner}>
    <Text style={styles.alertText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing(3),
  },
  header: {
    marginBottom: spacing(2),
  },
  subtitle: {
    ...typography.body,
    color: palette.textMuted,
    marginTop: 8,
  },
  mainCard: {
    marginTop: spacing(2),
    alignItems: 'center',
    gap: 12,
  },
  tdeeLabel: {
    ...typography.bodySmall,
    color: palette.textMuted,
  },
  tdeeValue: {
    ...typography.h1,
    letterSpacing: 1,
  },
  tdeeRange: {
    ...typography.bodySmall,
    color: palette.textMuted,
  },
  gradientBar: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 16,
  },
  gradientSegment: {
    flex: 1,
    height: 10,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  rangeText: {
    ...typography.bodySmall,
    color: palette.textMuted,
  },
  chartGrid: {
    marginTop: spacing(3),
    gap: spacing(2),
  },
  chartPlaceholder: {
    ...typography.bodySmall,
    color: palette.textMuted,
    textAlign: 'center',
    paddingVertical: 40,
  },
  alertBanner: {
    backgroundColor: 'rgba(255, 166, 77, 0.16)',
    borderColor: '#FFA64D',
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginTop: spacing(2),
  },
  alertText: {
    ...typography.bodySmall,
    color: '#FFA64D',
    textAlign: 'center',
  },
});

export default TdeeScreen;
