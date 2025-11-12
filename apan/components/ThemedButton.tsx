
import {
  Pressable,
  StyleSheet,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { ThemeContext, ThemeContextType } from '../context/ThemeContext';

import React, { useContext, ReactNode } from 'react';
import { Colors } from '../constants/Colors';

type Theme = typeof Colors.light | typeof Colors.dark;

interface ThemedButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode; // <-- Agora 'ReactNode' é válido
}

function ThemedButton({ style, children, ...props }: ThemedButtonProps) {
  // 3. Tipamos o 'useContext' para que o 'ThemeContextType' seja usado
  const context = useContext<ThemeContextType | null>(ThemeContext);
  if (!context) {
    throw new Error('ThemedButton must be used within a ThemeProvider');
  }
  const { theme } = context;
  const styles = createStyles(theme);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    btn: {
      backgroundColor: theme.buttonBackground,
      padding: 18,
      borderRadius: 6,
      marginVertical: 10,
    },
    pressed: {
      opacity: 0.5,
    },
  });

export default ThemedButton;