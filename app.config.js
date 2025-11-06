export default ({ config }) => ({
  ...config,
  extra: {
    ...(config.extra ?? {}),
    supabase: {
      url: 'https://pmknwhjabswawazfbhnk.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBta253aGphYnN3YXdhemZiaG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTU1MTgsImV4cCI6MjA3ODAzMTUxOH0.HvHbGNovsz-9yKDdDPa1a7_oJIL45zqnc5sYF4w7HK8',
    },
  },
});
