import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase/client';
import { DailyLog } from '@app-types/dailyLog';
import { useDailyLogsStore } from '@store/useDailyLogsStore';
import { useOffline } from './offline/OfflineContext';

const LOGS_KEY = ['dailyLogs'];

export const useDailyLogs = (userId?: string) => {
  const hydrate = useDailyLogsStore((state) => state.hydrate);
  const { setLastSyncedAt } = useOffline();

  return useQuery({
    queryKey: LOGS_KEY,
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
      if (error) {
        throw error;
      }
      const logs = (data ?? []).map<DailyLog>((item) => ({
        id: item.id,
        userId: item.user_id,
        date: item.date,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        fiber: item.fiber,
        steps: item.steps,
        cardio: item.cardio,
        water: item.water,
        weight: item.weight,
        bowelMovement: item.bowel_movement ?? undefined,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
      hydrate(logs);
      await setLastSyncedAt(new Date().toISOString());
      return logs;
    },
  });
};

export const useUpsertDailyLog = () => {
  const setLog = useDailyLogsStore((state) => state.setLog);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: DailyLog & { userId: string }) => {
      const { error, data } = await supabase
        .from('daily_logs')
        .upsert(
          {
            user_id: log.userId,
            date: log.date,
            calories: log.calories,
            protein: log.protein,
            carbs: log.carbs,
            fat: log.fat,
            fiber: log.fiber,
            steps: log.steps,
            cardio: log.cardio,
            water: log.water,
            weight: log.weight,
            bowel_movement: log.bowelMovement ?? null,
          },
          { onConflict: 'user_id,date' },
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      const saved: DailyLog = {
        ...log,
        id: data?.id,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at,
      };

      setLog(saved);

      return saved;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOGS_KEY });
    },
  });
};

export const useDeleteDailyLog = () => {
  const removeLog = useDailyLogsStore((state) => state.removeLog);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, date }: { userId: string; date: string }) => {
      const { error } = await supabase
        .from('daily_logs')
        .delete()
        .eq('user_id', userId)
        .eq('date', date);

      if (error) {
        throw error;
      }
      removeLog(date);
      return date;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LOGS_KEY });
    },
  });
};
