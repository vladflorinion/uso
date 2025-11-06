import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import GradientBackground from '@components/GradientBackground';
import AccentButton from '@components/AccentButton';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { AuthStackParamList } from '@navigation/RootNavigator';

const WelcomeScreen = ({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Welcome'>) => (
  <GradientBackground>
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heading}>MacroPulse</Text>
        <Text style={styles.subheading}>Own your daily rhythm with precision wellness insights.</Text>
      </View>
      <View style={styles.actions}>
        <AccentButton label="Get Started" onPress={() => navigation.navigate('Register')} />
        <AccentButton
          label="I already have an account"
          tone="muted"
          onPress={() => navigation.navigate('Login')}
          style={styles.secondaryButton}
        />
      </View>
    </View>
  </GradientBackground>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    marginTop: 100,
  },
  heading: {
    ...typography.h1,
    marginBottom: 16,
  },
  subheading: {
    ...typography.body,
    textAlign: 'center',
    color: palette.textMuted,
    maxWidth: 320,
  },
  actions: {
    marginBottom: 60,
  },
  secondaryButton: {
    marginTop: 16,
  },
});

export default WelcomeScreen;
