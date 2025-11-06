import React from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLine, VictoryScatter, VictoryTheme } from 'victory-native';

import GradientBackground from '@components/GradientBackground';
import PeriodToggle from '@components/PeriodToggle';
import ChartCard from '@components/ChartCard';
import LoadingState from '@components/LoadingState';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { useAnalyticsData } from '@hooks/useAnalyticsData';
import { useDailyLogs } from '@services/dailyLogs';
import { useAuth } from '@services/auth/AuthContext';

const AnalyticsScreen = () => {
  const { user } = useAuth();
  const analytics = useAnalyticsData();
  const { isLoading, refetch } = useDailyLogs(user?.id);

  return (
    <GradientBackground>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => refetch()} />}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={typography.h2}>Analytics</Text>
          <Text style={styles.subtitle}>See trendlines across nutrition, hydration, movement, and weight.</Text>
        </View>

        <PeriodToggle
          options={[
            { label: '7 days', value: 7 },
            { label: '14 days', value: 14 },
            { label: '30 days', value: 30 },
          ]}
          value={analytics.period}
          onChange={(value) => analytics.setPeriod(value as 7 | 14 | 30)}
        />

        {isLoading ? <LoadingState message="Computing insights" /> : null}

        <View style={styles.grid}>
          <ChartCard
            title="Calories"
            value={`${analytics.averages.calories} kcal`}
            trend={analytics.averages.weightDelta}
            caption="Average daily"
          >
            <VictoryChart
              theme={VictoryTheme.material}
              padding={{ top: 20, bottom: 40, left: 48, right: 12 }}
              height={220}
            >
              <VictoryAxis style={axisStyle} tickFormat={() => ''} />
              <VictoryAxis dependentAxis style={axisStyle} tickFormat={(t) => `${t}`} />
              <VictoryLine
                interpolation="monotoneX"
                style={{ data: { stroke: palette.accentPrimary, strokeWidth: 3 } }}
                data={analytics.dailySeries.map((item, index) => ({ x: index, y: item.calories }))}
              />
            </VictoryChart>
          </ChartCard>

          <ChartCard
            title="Hydration"
            value={`${analytics.averages.water} avg`}
            trend={analytics.averages.water}
            caption="Liters per day"
          >
            <VictoryChart theme={VictoryTheme.material} padding={{ top: 20, bottom: 40, left: 48, right: 12 }} height={220}>
              <VictoryAxis style={axisStyle} tickFormat={() => ''} />
              <VictoryAxis dependentAxis style={axisStyle} tickFormat={(t) => `${t}`} />
              <VictoryBar
                barWidth={12}
                cornerRadius={{ top: 6 }}
                style={{ data: { fill: '#5ED0FF' } }}
                data={analytics.dailySeries.map((item, index) => ({ x: index, y: item.water }))}
              />
            </VictoryChart>
          </ChartCard>

          <ChartCard
            title="Steps"
            value={`${analytics.averages.steps.toLocaleString()} steps`}
            trend={analytics.averages.steps}
            caption="Average"
          >
            <VictoryChart theme={VictoryTheme.material} padding={{ top: 20, bottom: 40, left: 48, right: 12 }} height={220}>
              <VictoryAxis style={axisStyle} tickFormat={() => ''} />
              <VictoryAxis dependentAxis style={axisStyle} tickFormat={(t) => `${t}`} />
              <VictoryBar
                barWidth={12}
                cornerRadius={{ top: 6 }}
                style={{ data: { fill: '#FFA64D' } }}
                data={analytics.dailySeries.map((item, index) => ({ x: index, y: item.steps }))}
              />
            </VictoryChart>
          </ChartCard>

          <ChartCard
            title="Weight trend"
            value={`${analytics.averages.weightDelta.toFixed(1)} Δ`}
            trend={analytics.averages.weightDelta}
            caption="Change"
          >
            <VictoryChart theme={VictoryTheme.material} padding={{ top: 20, bottom: 40, left: 48, right: 12 }} height={220}>
              <VictoryAxis style={axisStyle} tickFormat={() => ''} />
              <VictoryAxis dependentAxis style={axisStyle} tickFormat={(t) => `${t}`} />
              <VictoryLine
                interpolation="monotoneX"
                style={{ data: { stroke: '#5ED0FF', strokeWidth: 3 } }}
                data={analytics.dailySeries.map((item, index) => ({ x: index, y: item.weight }))}
              />
            </VictoryChart>
          </ChartCard>
        </View>

        <SurfaceScatter hydration={analytics.hydrationScatter} />
      </ScrollView>
    </GradientBackground>
  );
};

const SurfaceScatter = ({ hydration }: { hydration: { hydration: number; bristolScale?: number }[] }) => (
  <View style={styles.scatterCard}>
    <Text style={styles.scatterTitle}>Hydration vs. Bowel Movement Quality</Text>
    <VictoryChart theme={VictoryTheme.material} padding={{ top: 20, bottom: 40, left: 48, right: 12 }} height={240}>
      <VictoryAxis
        label="Hydration"
        style={{ ...axisStyle, axisLabel: { ...typography.bodySmall, fill: palette.textMuted, padding: 30 } }}
      />
      <VictoryAxis
        dependentAxis
        label="Bristol"
        style={{ ...axisStyle, axisLabel: { ...typography.bodySmall, fill: palette.textMuted, padding: 40 } }}
        tickFormat={(t) => `${t}`}
      />
      <VictoryScatter
        size={6}
        style={{ data: { fill: palette.accentPrimary } }}
        data={hydration.map((item, index) => ({ x: index + 1, y: item.bristolScale ?? 0 }))}
      />
    </VictoryChart>
  </View>
);

const axisStyle = {
  axis: { stroke: 'rgba(88, 94, 104, 0.24)' },
  tickLabels: { fill: palette.textMuted, fontFamily: 'Inter-Regular', fontSize: 12 },
  grid: { stroke: 'rgba(88, 94, 104, 0.12)' },
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing(4),
  },
  header: {
    marginBottom: spacing(2),
  },
  subtitle: {
    ...typography.body,
    color: palette.textMuted,
    marginTop: 8,
  },
  grid: {
    marginTop: spacing(2),
    gap: spacing(2),
  },
  scatterCard: {
    marginTop: spacing(3),
    backgroundColor: '#15171b',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.border,
  },
  scatterTitle: {
    ...typography.h3,
    marginBottom: 12,
  },
});

export default AnalyticsScreen;
