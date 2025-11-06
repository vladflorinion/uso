# MacroPulse Wellness Tracker (Mobile)

A React Native (Expo) mobile application that mirrors the MacroPulse web experience for tracking daily nutrition, hydration, activity, and body metrics. The app integrates with Supabase for authentication and data storage while offering an immersive dark mode UI consistent with the MacroPulse design system.

## Tech Stack
- [Expo](https://expo.dev/) (React Native, TypeScript)
- Supabase Auth & PostgreSQL
- Zustand for local state & offline hydration
- React Navigation with bottom tabs
- Victory Native for analytics charting
- React Native Calendars for daily logging calendar
- Expo Secure Store & AsyncStorage for session persistence

## Features
- Email/password authentication with persistent sessions
- Dashboard with calorie ring, macro breakdowns, and wellness snapshot cards
- Daily log with calendar, nutrition/activity/hydration/body metrics forms, and summary modal
- Analytics with 7/14/30 day trends and hydration vs bowel movement scatter plot
- TDEE calculator with configurable time windows and deficit/maintenance/surplus bands
- Settings for goals, unit preferences, CSV export placeholder, and logout
- Offline caching of daily logs and settings with transparent sync status

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Add Supabase credentials by creating an `app.config.js` or using Expo environment variables:
   ```js
   export default ({ config }) => ({
     ...config,
     extra: {
       supabase: {
         url: 'https://your-project.supabase.co',
         anonKey: 'public-anon-key',
       },
     },
   });
   ```
3. Start the development server:
   ```bash
   npm run start
   ```
4. Run on a device or emulator using the Expo Go app or platform-specific commands.

## Project Structure
```
src/
  components/      // Design system components
  hooks/           // Analytics data hooks
  navigation/      // Navigation containers & tab stack
  screens/         // Feature screens (auth, dashboard, logs, analytics, tdee, settings)
  services/        // Supabase integration, auth, offline, data services
  store/           // Zustand stores for logs and settings
  theme/           // Color palette, typography, spacing, theming context
  types/           // Shared TypeScript types
  utils/           // Formatting helpers
```

## Testing & Linting
- `npm run typecheck` for TypeScript correctness
- `npm run lint` for ESLint

## Notes
- Real-time push notifications and biometric auth are placeholders and can be added using Expo Notifications and Local Authentication APIs.
- CSV export currently shows a placeholder alert; integrate Supabase functions or backend services for actual exports.
- Charts use placeholder textual summaries in some areas (e.g., TDEE side charts); connect to real data visualizations as needed.
