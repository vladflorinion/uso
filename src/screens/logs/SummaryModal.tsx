import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import SurfaceCard from '@components/SurfaceCard';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { useDailyLogsStore } from '@store/useDailyLogsStore';
import { RootStackParamList } from '@navigation/RootNavigator';
import { formatDateLabel } from '@utils/format';

const SummaryModal = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SummaryModal'>>();
  const { date } = route.params;
  const log = useDailyLogsStore((state) => state.logs[date]);

  const entries = useMemo(
    () =>
      log
        ? [
            { label: 'Calories', value: `${log.calories} kcal` },
            { label: 'Protein', value: `${log.protein} g` },
            { label: 'Carbs', value: `${log.carbs} g` },
            { label: 'Fat', value: `${log.fat} g` },
            { label: 'Fiber', value: `${log.fiber} g` },
            { label: 'Water', value: `${log.water}` },
            { label: 'Steps', value: `${log.steps.toLocaleString()}` },
            { label: 'Cardio', value: `${log.cardio} min` },
            { label: 'Weight', value: `${log.weight}` },
          ]
        : [],
    [log],
  );

  if (!log) {
    return (
      <View style={styles.container}>
        <Text style={typography.h3}>No data for {formatDateLabel(date)}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={typography.h2}>{formatDateLabel(date)}</Text>
      <SurfaceCard style={styles.card}>
        {entries.map((entry) => (
          <View style={styles.row} key={entry.label}>
            <Text style={styles.label}>{entry.label}</Text>
            <Text style={styles.value}>{entry.value}</Text>
          </View>
        ))}
        {log.bowelMovement?.notes ? (
          <View style={styles.notes}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.value}>{log.bowelMovement.notes}</Text>
          </View>
        ) : null}
      </SurfaceCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing(3),
    backgroundColor: palette.background,
  },
  card: {
    marginTop: spacing(2),
    gap: spacing(1),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    ...typography.bodySmall,
    color: palette.textMuted,
  },
  value: {
    ...typography.body,
  },
  notes: {
    marginTop: 16,
    gap: 8,
  },
});

export default SummaryModal;
