import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { palette } from '@theme/colors';
import { radius } from '@theme/spacing';
import { typography } from '@theme/typography';

type AccentButtonProps = {
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'muted';
  disabled?: boolean;
  style?: ViewStyle;
};

const AccentButton = ({ label, onPress, tone = 'primary', disabled, style }: AccentButtonProps) => (
  <Pressable
    onPress={() => {
      if (!disabled) {
        Haptics.selectionAsync();
        onPress();
      }
    }}
    disabled={disabled}
    style={({ pressed }) => [
      styles.base,
      tone === 'muted' && styles.muted,
      pressed && styles.pressed,
      disabled && styles.disabled,
      style,
    ]}
  >
    {tone === 'primary' ? (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={[palette.accentPrimary, '#5ED0FF']}
        style={styles.gradient}
      >
        <Text style={[typography.button, styles.text]}>{label}</Text>
      </LinearGradient>
    ) : (
      <Text style={[typography.button, styles.text]}>{label}</Text>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  muted: {
    backgroundColor: '#1b1d22',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: palette.textPrimary,
    textAlign: 'center',
  },
});

export default AccentButton;
