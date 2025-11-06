import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import GradientBackground from '@components/GradientBackground';
import SurfaceCard from '@components/SurfaceCard';
import ProgressRing from '@components/ProgressRing';
import ProgressBar from '@components/ProgressBar';
import EmptyState from '@components/EmptyState';
import AccentButton from '@components/AccentButton';
import LoadingState from '@components/LoadingState';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { useDailyLogs } from '@services/dailyLogs';
import { useUserSettings } from '@services/settings';
import { useAuth } from '@services/auth/AuthContext';
import { useOffline } from '@services/offline/OfflineContext';
import { useDailyLogsStore } from '@store/useDailyLogsStore';
import { AppTabParamList } from '@navigation/RootNavigator';

const DashboardScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<BottomTabNavigationProp<AppTabParamList>>();
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: settings, isLoading: settingsLoading, refetch: refetchSettings } = useUserSettings(
    user?.id,
  );
  const {
    data: logs,
    isLoading: logsLoading,
    refetch: refetchLogs,
  } = useDailyLogs(user?.id);
  const { isOnline } = useOffline();
  const logsMap = useDailyLogsStore((state) => state.logs);
  const todayLog = logsMap[today];

  const macroProgress = useMemo(() => {
    if (!todayLog || !settings) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    return {
      calories: todayLog.calories / settings.goals.calories,
      protein: todayLog.protein / settings.goals.protein,
      carbs: todayLog.carbs / settings.goals.carbs,
      fat: todayLog.fat / settings.goals.fat,
    };
  }, [todayLog, settings]);

  const handleRefresh = () => {
    refetchLogs();
    refetchSettings();
  };

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={logsLoading || settingsLoading} onRefresh={handleRefresh} />}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={typography.subtitle}>Today</Text>
            <Text style={styles.heading}>{format(new Date(), 'EEEE, MMM d')}</Text>
          </View>
          <AccentButton
            label="Add Daily Log"
            onPress={() => navigation.navigate('DailyLog')}
            style={styles.addButton}
          />
        </View>

        {logsLoading && <LoadingState message="Syncing your data" />}

        {todayLog && settings ? (
          <SurfaceCard>
            <View style={styles.overviewRow}>
              <ProgressRing
                progress={macroProgress.calories}
                label="Calories"
                value={`${todayLog.calories} / ${settings.goals.calories}`}
                goal="kcal"
              />
              <View style={styles.macros}>
                <ProgressBar
                  label="Protein"
                  value={todayLog.protein}
                  goal={settings.goals.protein}
                  color={palette.accentPrimary}
                  unit="g"
                />
                <ProgressBar
                  label="Carbs"
                  value={todayLog.carbs}
                  goal={settings.goals.carbs}
                  color="#FFA64D"
                  unit="g"
                />
                <ProgressBar
                  label="Fat"
                  value={todayLog.fat}
                  goal={settings.goals.fat}
                  color="#5ED0FF"
                  unit="g"
                />
              </View>
            </View>
          </SurfaceCard>
        ) : (
          <SurfaceCard>
            <EmptyState
              title="No log yet"
              description="Add your meals, hydration, and movement to see your MacroPulse come alive."
            />
            <AccentButton label="Add Daily Log" onPress={() => navigation.navigate('DailyLog')} />
          </SurfaceCard>
        )}

        {todayLog && settings ? (
          <View style={styles.snapshotGrid}>
            <SurfaceCard
              header={<Text style={styles.cardTitle}>Hydration</Text>}
              footer={<Text style={styles.cardFooter}>{settings.goals.water} target</Text>}
            >
              <Text style={styles.metricValue}>{todayLog.water} {settings.units.hydration}</Text>
            </SurfaceCard>
            <SurfaceCard
              header={<Text style={styles.cardTitle}>Steps</Text>}
              footer={<Text style={styles.cardFooter}>{settings.goals.steps} goal</Text>}
            >
              <Text style={styles.metricValue}>{todayLog.steps.toLocaleString()}</Text>
            </SurfaceCard>
            <SurfaceCard
              header={<Text style={styles.cardTitle}>Weight</Text>}
              footer={<Text style={styles.cardFooter}>Last 7-day change</Text>}
            >
              <Text style={styles.metricValue}>{todayLog.weight} {settings.units.weight}</Text>
            </SurfaceCard>
            <SurfaceCard header={<Text style={styles.cardTitle}>Streak</Text>}>
              <Text style={styles.metricValue}>{logs?.length ?? 0} days</Text>
            </SurfaceCard>
          </View>
        ) : null}

        <View style={styles.syncStatus}>
          <Text style={styles.syncText}>{isOnline ? 'Online' : 'Offline mode'}</Text>
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  heading: {
    ...typography.h2,
    letterSpacing: 1.8,
    marginTop: 4,
  },
  addButton: {
    width: 170,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2),
  },
  macros: {
    flex: 1,
  },
  snapshotGrid: {
    marginTop: spacing(2),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  cardTitle: {
    ...typography.bodySmall,
    color: palette.textMuted,
  },
  cardFooter: {
    ...typography.bodySmall,
    color: palette.textMuted,
  },
  metricValue: {
    ...typography.h3,
  },
  syncStatus: {
    marginTop: spacing(3),
    alignItems: 'center',
  },
  syncText: {
    ...typography.bodySmall,
    color: palette.textMuted,
  },
});

export default DashboardScreen;
