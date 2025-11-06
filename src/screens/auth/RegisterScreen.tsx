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

const RegisterScreen = ({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Register'>) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Missing information', 'Please provide email and password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please confirm your password.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email.trim().toLowerCase(), password);
    setLoading(false);
    if (error) {
      Alert.alert('Unable to create account', error);
    } else {
      Alert.alert('Check your email', 'Confirm your email address to activate your account.');
      navigation.navigate('Login');
    }
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.heading}>Create account</Text>
        <Text style={styles.subtitle}>Join MacroPulse to unlock proactive wellness intelligence.</Text>
        <View style={styles.form}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
          <TextField
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <AccentButton label={loading ? 'Creating account...' : 'Create account'} onPress={handleSubmit} />
          <AccentButton
            label="Back to sign in"
            tone="muted"
            onPress={() => navigation.navigate('Login')}
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

export default RegisterScreen;
