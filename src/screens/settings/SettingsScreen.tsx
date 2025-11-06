import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Switch, Alert } from 'react-native';

import GradientBackground from '@components/GradientBackground';
import SurfaceCard from '@components/SurfaceCard';
import TextField from '@components/TextField';
import AccentButton from '@components/AccentButton';
import LoadingState from '@components/LoadingState';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { useAuth } from '@services/auth/AuthContext';
import { useSettingsStore } from '@store/useSettingsStore';
import { useUpdateSettings, useUserSettings } from '@services/settings';

const SettingsScreen = () => {
  const { user, signOut } = useAuth();
  const { settings } = useSettingsStore();
  const update = useUpdateSettings();
  const { isLoading } = useUserSettings(user?.id);
  const [theme, setTheme] = useState(settings.theme === 'dark');
  const [weightUnit, setWeightUnit] = useState(settings.units.weight);
  const [hydrationUnit, setHydrationUnit] = useState(settings.units.hydration);
  const [goals, setGoals] = useState(settings.goals);

  useEffect(() => {
    setTheme(settings.theme === 'dark');
    setWeightUnit(settings.units.weight);
    setHydrationUnit(settings.units.hydration);
    setGoals(settings.goals);
  }, [settings]);

  const handleSave = async () => {
    if (!user) return;
    try {
      await update.mutateAsync({
        userId: user.id,
        settings: {
          ...settings,
          theme: theme ? 'dark' : 'light',
          units: { weight: weightUnit, hydration: hydrationUnit },
          goals,
        },
      });
      Alert.alert('Settings saved', 'Your preferences have been updated.');
    } catch (error: any) {
      Alert.alert('Unable to save', error.message);
    }
  };

  const handleExport = () => {
    Alert.alert('Export requested', 'A CSV export will be emailed to you.');
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={typography.h2}>Settings</Text>
        <Text style={styles.subtitle}>Tune your experience, goals, and preferences.</Text>

        {isLoading ? <LoadingState message="Loading preferences" /> : null}

        <SurfaceCard header={<Text style={styles.sectionTitle}>Appearance</Text>}>
          <View style={styles.row}>
            <Text style={styles.label}>Dark mode</Text>
            <Switch value={theme} onValueChange={setTheme} />
          </View>
        </SurfaceCard>

        <SurfaceCard header={<Text style={styles.sectionTitle}>Daily goals</Text>}>
          <View style={styles.goalsGrid}>
            {Object.entries(goals).map(([key, value]) => (
              <TextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={String(value)}
                onChangeText={(text) => setGoals((prev) => ({ ...prev, [key]: Number(text) || 0 }))}
                keyboardType="numeric"
              />
            ))}
          </View>
        </SurfaceCard>

        <SurfaceCard header={<Text style={styles.sectionTitle}>Units</Text>}>
          <View style={styles.row}>
            <Text style={styles.label}>Weight ({weightUnit})</Text>
            <Switch
              value={weightUnit === 'lbs'}
              onValueChange={(value) => setWeightUnit(value ? 'lbs' : 'kg')}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Hydration ({hydrationUnit})</Text>
            <Switch
              value={hydrationUnit === 'oz'}
              onValueChange={(value) => setHydrationUnit(value ? 'oz' : 'L')}
            />
          </View>
        </SurfaceCard>

        <SurfaceCard header={<Text style={styles.sectionTitle}>Data & privacy</Text>}>
          <AccentButton label="Export CSV" tone="muted" onPress={handleExport} />
        </SurfaceCard>

        <View style={styles.footer}>
          <AccentButton label="Save changes" onPress={handleSave} />
          <AccentButton label="Log out" tone="muted" onPress={signOut} />
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing(4),
  },
  subtitle: {
    ...typography.body,
    color: palette.textMuted,
    marginVertical: spacing(1.5),
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: palette.textMuted,
    letterSpacing: 1.2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    ...typography.body,
  },
  goalsGrid: {
    gap: 12,
  },
  footer: {
    marginTop: spacing(3),
    gap: 12,
  },
});

export default SettingsScreen;
