import { StyleSheet } from 'react-native';
import { palette } from './colors';

export const typography = StyleSheet.create({
  h1: {
    fontFamily: 'Inter-ExtraBold',
    fontSize: 32,
    letterSpacing: 3.2,
    color: palette.textPrimary,
    textTransform: 'uppercase',
  },
  h2: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    letterSpacing: 2.4,
    color: palette.textPrimary,
    textTransform: 'uppercase',
  },
  h3: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    letterSpacing: 1.2,
    color: palette.textPrimary,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    letterSpacing: 0.8,
    color: palette.textMuted,
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: palette.textPrimary,
  },
  bodySmall: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: palette.textMuted,
  },
  button: {
    fontFamily: 'Inter-Bold',
    fontSize: 15,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: palette.textPrimary,
  },
});
