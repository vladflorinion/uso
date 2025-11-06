import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import GradientBackground from '@components/GradientBackground';
import TextField from '@components/TextField';
import AccentButton from '@components/AccentButton';
import { AuthStackParamList } from '@navigation/RootNavigator';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import { useAuth } from '@services/auth/AuthContext';

const LoginScreen = ({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Login'>) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Missing information', 'Please provide both email and password.');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email.trim().toLowerCase(), password);
    setLoading(false);
    if (error) {
      Alert.alert('Unable to sign in', error);
    }
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue tracking your daily wellness pulse.</Text>
        <View style={styles.form}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <AccentButton label={loading ? 'Signing in...' : 'Sign In'} onPress={handleSubmit} />
          <AccentButton
            label="Create an account"
            tone="muted"
            onPress={() => navigation.navigate('Register')}
            style={styles.secondaryButton}
          />
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    ...typography.h1,
    marginTop: 80,
  },
  subtitle: {
    ...typography.body,
    color: palette.textMuted,
    marginTop: 16,
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  secondaryButton: {
    marginTop: 12,
  },
});

export default LoginScreen;
