import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import GradientBackground from '@components/GradientBackground';
import SurfaceCard from '@components/SurfaceCard';
import TextField from '@components/TextField';
import AccentButton from '@components/AccentButton';
import LoadingState from '@components/LoadingState';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { useAuth } from '@services/auth/AuthContext';
import { useDailyLogs, useDeleteDailyLog, useUpsertDailyLog } from '@services/dailyLogs';
import { useUserSettings } from '@services/settings';
import { useDailyLogsStore } from '@store/useDailyLogsStore';
import { DailyLog } from '@app-types/dailyLog';
import { RootStackParamList } from '@navigation/RootNavigator';

const emptyLog = (date: string): DailyLog => ({
  date,
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  steps: 0,
  cardio: 0,
  water: 0,
  weight: 0,
});

const DailyLogScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(today);
  const [form, setForm] = useState<DailyLog>(emptyLog(today));

  const logsMap = useDailyLogsStore((state) => state.logs);
  const {
    data: settings,
    isLoading: settingsLoading,
    refetch: refetchSettings,
  } = useUserSettings(user?.id);
  const {
    isLoading: logsLoading,
    refetch: refetchLogs,
  } = useDailyLogs(user?.id);

  const upsert = useUpsertDailyLog();
  const remove = useDeleteDailyLog();

  useEffect(() => {
    const log = logsMap[selectedDate];
    setForm(log ? { ...log } : emptyLog(selectedDate));
  }, [logsMap, selectedDate]);

  const markedDates = useMemo(() => {
    const marks: Record<string, { selected?: boolean; marked?: boolean; selectedColor?: string }> = {};
    Object.keys(logsMap).forEach((date) => {
      marks[date] = { marked: true, selectedColor: palette.accentPrimary };
    });
    marks[selectedDate] = {
      ...(marks[selectedDate] ?? {}),
      selected: true,
      selectedColor: '#2a2d33',
    };
    return marks;
  }, [logsMap, selectedDate]);

  const handleChange = (key: keyof DailyLog, value: string) => {
    const numericKeys: (keyof DailyLog)[] = [
      'calories',
      'protein',
      'carbs',
      'fat',
      'fiber',
      'steps',
      'cardio',
      'water',
      'weight',
    ];
    if (numericKeys.includes(key)) {
      setForm((prev) => ({ ...prev, [key]: Number(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const validate = () => {
    if (!form.date) {
      return 'Date is required';
    }
    if (form.calories < 0 || form.protein < 0 || form.carbs < 0 || form.fat < 0) {
      return 'Nutrition values must be positive';
    }
    if (form.water < 0 || form.steps < 0 || form.cardio < 0) {
      return 'Hydration and activity must be positive';
    }
    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) {
      Alert.alert('Cannot save log', error);
      return;
    }
    if (!user) return;
    try {
      await upsert.mutateAsync({ ...form, userId: user.id });
      Alert.alert('Log saved', 'Daily log updated successfully.');
    } catch (err: any) {
      Alert.alert('Unable to save', err.message);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    Alert.alert('Delete log', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove.mutateAsync({ userId: user.id, date: selectedDate });
            Alert.alert('Log deleted', 'Your log has been removed.');
          } catch (err: any) {
            Alert.alert('Unable to delete', err.message);
          }
        },
      },
    ]);
  };

  const handleRefresh = () => {
    refetchLogs();
    refetchSettings();
  };

  const showSummary = () => {
    navigation.navigate('SummaryModal', { date: selectedDate });
  };

  return (
    <GradientBackground>
      <ScrollView
        refreshControl={<RefreshControl refreshing={logsLoading || settingsLoading} onRefresh={handleRefresh} />}
      >
        <View style={styles.header}>
          <Text style={typography.h2}>Daily log</Text>
          <Text style={styles.subtitle}>Capture today’s nutrition, movement, and recovery insights.</Text>
        </View>

        <SurfaceCard elevated>
          <Calendar
            theme={{
              calendarBackground: 'transparent',
              backgroundColor: 'transparent',
              textSectionTitleColor: palette.textMuted,
              dayTextColor: palette.textPrimary,
              todayTextColor: palette.accentPrimary,
              selectedDayBackgroundColor: palette.accentSoft,
              monthTextColor: palette.textPrimary,
              arrowColor: palette.accentPrimary,
            }}
            markedDates={markedDates}
            maxDate={today}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            renderHeader={(date) => (
              <Text style={styles.calendarHeader}>{format(date, 'MMMM yyyy')}</Text>
            )}
            hideExtraDays
            enableSwipeMonths
            firstDay={1}
          />
        </SurfaceCard>

        {logsLoading ? <LoadingState message="Loading log" /> : null}

        <View style={styles.sectionContainer}>
          <SurfaceCard highlight="lime" header={<Text style={styles.sectionTitle}>Nutrition</Text>}>
            <View style={styles.fieldGrid}>
              <TextField
                label="Calories (kcal)"
                value={String(form.calories)}
                onChangeText={(value) => handleChange('calories', value)}
                keyboardType="numeric"
              />
              <TextField
                label="Protein (g)"
                value={String(form.protein)}
                onChangeText={(value) => handleChange('protein', value)}
                keyboardType="numeric"
              />
              <TextField
                label="Carbs (g)"
                value={String(form.carbs)}
                onChangeText={(value) => handleChange('carbs', value)}
                keyboardType="numeric"
              />
              <TextField
                label="Fat (g)"
                value={String(form.fat)}
                onChangeText={(value) => handleChange('fat', value)}
                keyboardType="numeric"
              />
              <TextField
                label="Fiber (g)"
                value={String(form.fiber)}
                onChangeText={(value) => handleChange('fiber', value)}
                keyboardType="numeric"
              />
            </View>
          </SurfaceCard>

          <SurfaceCard highlight="amber" header={<Text style={styles.sectionTitle}>Activity</Text>}>
            <View style={styles.fieldGrid}>
              <TextField
                label="Steps"
                value={String(form.steps)}
                onChangeText={(value) => handleChange('steps', value)}
                keyboardType="numeric"
              />
              <TextField
                label="Cardio (minutes)"
                value={String(form.cardio)}
                onChangeText={(value) => handleChange('cardio', value)}
                keyboardType="numeric"
              />
            </View>
          </SurfaceCard>

          <SurfaceCard highlight="aqua" header={<Text style={styles.sectionTitle}>Hydration</Text>}>
            <View style={styles.fieldGrid}>
              <TextField
                label={`Water (${settings?.units.hydration ?? 'L'})`}
                value={String(form.water)}
                onChangeText={(value) => handleChange('water', value)}
                keyboardType="numeric"
              />
            </View>
          </SurfaceCard>

          <SurfaceCard header={<Text style={styles.sectionTitle}>Body metrics</Text>}>
            <View style={styles.fieldGrid}>
              <TextField
                label={`Weight (${settings?.units.weight ?? 'kg'})`}
                value={String(form.weight)}
                onChangeText={(value) => handleChange('weight', value)}
                keyboardType="numeric"
              />
              <TextField
                label="Bowel notes"
                value={form.bowelMovement?.notes ?? ''}
                onChangeText={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    bowelMovement: {
                      time: prev.bowelMovement?.time ?? '',
                      bristolScale: prev.bowelMovement?.bristolScale ?? 0,
                      urgency: prev.bowelMovement?.urgency ?? 0,
                      discomfort: prev.bowelMovement?.discomfort ?? 0,
                      notes: value,
                    },
                  }))
                }
                placeholder="Optional observations"
              />
            </View>
          </SurfaceCard>
        </View>

        <View style={styles.footerActions}>
          <AccentButton label="Save log" onPress={handleSave} />
          <AccentButton label="View summary" tone="muted" onPress={showSummary} />
          {logsMap[selectedDate] ? (
            <AccentButton label="Delete log" tone="muted" onPress={handleDelete} style={styles.deleteButton} />
          ) : null}
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing(2),
  },
  subtitle: {
    ...typography.body,
    color: palette.textMuted,
    marginTop: 8,
  },
  calendarHeader: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionContainer: {
    marginTop: spacing(2),
    gap: spacing(2),
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: palette.textMuted,
    letterSpacing: 1.2,
  },
  fieldGrid: {
    gap: 12,
  },
  footerActions: {
    marginVertical: spacing(3),
    gap: 12,
  },
  deleteButton: {
    borderColor: '#ff6b6b',
  },
});

export default DailyLogScreen;
