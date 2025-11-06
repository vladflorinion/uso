import React from 'react';
import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native';

import { palette } from '@theme/colors';
import { radius, spacing } from '@theme/spacing';
import { typography } from '@theme/typography';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

const TextField = React.forwardRef<TextInput, TextFieldProps>(({ label, error, style, ...rest }, ref) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      ref={ref}
      placeholderTextColor={palette.textMuted}
      style={[styles.input, style]}
      {...rest}
    />
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
));

TextField.displayName = 'TextField';

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing(1),
  },
  label: {
    ...typography.bodySmall,
    marginBottom: 6,
  },
  input: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#101217',
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: palette.textPrimary,
  },
  error: {
    color: palette.error,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    marginTop: 4,
  },
});

export default TextField;
