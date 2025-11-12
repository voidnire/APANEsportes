import { Link, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import React, { useContext } from 'react'; // 1. Import 'React'

// 2. AJUSTE: Imports corretos de Contexto e Tipos
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// 3. AJUSTE: Importar nosso botão
import ThemedButton from '@/components/ThemedButton';

// 4. AJUSTE: Tipo do 'theme'
type Theme = typeof Colors.light | typeof Colors.dark;

export default function LoginScreen() {
  const router = useRouter();

  // 5. AJUSTE: Consumo correto do ThemeContext (com checagem de null)
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('LoginScreen must be used within a ThemeProvider');
  }
  const { theme } = themeContext;

  // 6. AJUSTE: Usar a função createStyles
  const styles = createStyles(theme);
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Login Screen</ThemedText>

      {/* 7. AJUSTE: Usar ThemedButton e ThemedText */}
      <View style={styles.buttonContainer}>
        <ThemedButton 
          style={styles.button}
          onPress={() => router.push('/')}
        >
          <ThemedText>Login</ThemedText>
        </ThemedButton>
      </View>

      <Link href="/" style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

// 8. AJUSTE: 'createStyles' agora usa o 'theme'
const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.background, // Adicionado
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  // O estilo do botão (cor de fundo, etc.)
  // é tratado automaticamente pelo ThemedButton.
  // Só precisamos de ajustes de layout se necessário.
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '80%', // Exemplo de estilização de layout
  },
  // O estilo do 'buttonText' é tratado
  // automaticamente pelo ThemedText.
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});