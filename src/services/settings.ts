import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase/client';
import { UserSettings } from '@types/settings';
import { useSettingsStore } from '@store/useSettingsStore';

const SETTINGS_KEY = ['userSettings'];

const mapFromApi = (item: any): UserSettings => ({
  id: item.id,
  userId: item.user_id,
  theme: item.theme ?? 'dark',
  units: item.units ?? { weight: 'kg', hydration: 'L' },
  goals: item.goals ?? {
    calories: 2000,
    protein: 150,
    carbs: 220,
    fat: 70,
    water: 3,
    steps: 10000,
  },
  updatedAt: item.updated_at,
});

export const useUserSettings = (userId?: string) => {
  const setSettings = useSettingsStore((state) => state.setSettings);

  return useQuery({
    queryKey: SETTINGS_KEY,
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      if (!data) {
        return undefined;
      }
      const mapped = mapFromApi(data);
      setSettings(mapped);
      return mapped;
    },
  });
};

export const useUpdateSettings = () => {
  const setSettings = useSettingsStore((state) => state.setSettings);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, settings }: { userId: string; settings: UserSettings }) => {
      const { data, error } = await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: userId,
            theme: settings.theme,
            units: settings.units,
            goals: settings.goals,
          },
          { onConflict: 'user_id' },
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      const mapped = mapFromApi(data);
      setSettings(mapped);
      return mapped;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
    },
  });
};
