import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import WelcomeScreen from '@screens/auth/WelcomeScreen';
import LoginScreen from '@screens/auth/LoginScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import DashboardScreen from '@screens/dashboard/DashboardScreen';
import DailyLogScreen from '@screens/logs/DailyLogScreen';
import AnalyticsScreen from '@screens/analytics/AnalyticsScreen';
import TdeeScreen from '@screens/tdee/TdeeScreen';
import SettingsScreen from '@screens/settings/SettingsScreen';
import SummaryModal from '@screens/logs/SummaryModal';
import { useAuth } from '@services/auth/AuthContext';
import { palette } from '@theme/colors';

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  SummaryModal: { date: string };
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Dashboard: undefined;
  DailyLog: undefined;
  Analytics: undefined;
  TDEE: undefined;
  Settings: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: palette.accentPrimary,
      tabBarInactiveTintColor: palette.textMuted,
      tabBarStyle: {
        backgroundColor: '#101217',
        borderTopColor: 'rgba(88, 94, 104, 0.24)',
        paddingVertical: 8,
        height: 80,
      },
      tabBarIcon: ({ color, size }) => {
        const iconMap: Record<keyof AppTabParamList, keyof typeof Ionicons.glyphMap> = {
          Dashboard: 'pulse-outline',
          DailyLog: 'calendar-outline',
          Analytics: 'analytics-outline',
          TDEE: 'calculator-outline',
          Settings: 'settings-outline',
        };
        return <Ionicons name={iconMap[route.name]} color={color} size={size} />;
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="DailyLog" component={DailyLogScreen} />
    <Tab.Screen name="Analytics" component={AnalyticsScreen} />
    <Tab.Screen name="TDEE" component={TdeeScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const AuthStackScreen = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerTransparent: true,
      headerTitle: '',
      contentStyle: { backgroundColor: 'transparent' },
    }}
  >
    <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: palette.background }} />;
  }

  return (
    <RootStack.Navigator>
      {user ? (
        <>
          <RootStack.Screen
            name="App"
            component={AppTabs}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="SummaryModal"
            component={SummaryModal}
            options={{
              presentation: 'modal',
              headerTransparent: true,
              headerTitle: '',
            }}
          />
        </>
      ) : (
        <RootStack.Screen
          name="Auth"
          component={AuthStackScreen}
          options={{ headerShown: false }}
        />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
