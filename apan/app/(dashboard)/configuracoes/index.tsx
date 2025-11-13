import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
// import { useRouter } from "expo-router"; // (Não usado, removido)

// 1. AJUSTE: Imports corretos de Contexto e Tipos
import { ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';
import Spacer from '@/components/Spacer';
import ThemedButton from '@/components/ThemedButton';

import ThemedText from '@/components/ThemedText'
import { useRouter } from 'expo-router';

type Theme = typeof Colors.light | typeof Colors.dark;

const screenWidth = Dimensions.get('window').width;

export default function SettingsScreen() { // Renomeado para ser mais claro
  // 2. AJUSTE: Consumo correto do ThemeContext (com checagem de null)
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('SettingsScreen must be used within a ThemeProvider');
  }
  const { theme } = themeContext; // colorScheme não é usado aqui

  const { logout, user } = useUser();

  const router = useRouter()
  // 3. AJUSTE: Passando SÓ o 'theme' (como em todos os outros arquivos)
  const styles = createStyles(theme);

  const handleLogout = async () => {  
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }finally{
      router.replace('/login')
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.backArrow}>To do ....</Text>
      </View>
      
      <Spacer/>

      <ThemedText>
        {user?.email}
      </ThemedText>

      <ThemedButton onPress={handleLogout}>
        <ThemedText>Sair</ThemedText>
      </ThemedButton>
      {/* (O resto dos estilos (avatar, infoCard, etc.)
          agora funcionam com o tema, mas estão
          comentados no JSX pois não estão em uso) */}
    </ScrollView>
  );
}

// 4. AJUSTE: Função 'createStyles' "traduzida" para o nosso Tema
function createStyles(theme: Theme) {
  // "Traduzindo" os nomes das variáveis para o nosso padrão
  const cardBg = theme.cardBackground;
  const border = theme.cardBorder;
  const muted = theme.subtitle;
  const primary = theme.buttonBackground;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingTop: 18,
      paddingHorizontal: 18,
      paddingBottom: 40,
      alignItems: 'center',
    },

    header: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    backButton: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backArrow: {
      fontSize: 20,
      color: theme.text,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.text,
      letterSpacing: 1,
    },

    // (O resto dos estilos foi mantido e traduzido,
    // caso você queira usá-los como template depois)
    avatarWrap: {
      marginTop: 4,
      marginBottom: 14,
      alignItems: 'center',
      width: '100%',
    },
    avatarBorder: {
      width: 110,
      height: 110,
      borderRadius: 110 / 2,
      backgroundColor: cardBg, // Corrigido
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 6,
      borderColor: '#6fb0ff22',
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 96 / 2,
    },
    avatarPlaceholder: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: '#eee',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarInitial: {
      fontSize: 34,
      color: primary, // Corrigido
      fontWeight: '800',
    },
    infoCard: {
      width: '100%',
      marginTop: 6,
      marginBottom: 18,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: border, // Corrigido
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: cardBg, // Corrigido
    },
    infoLabel: {
      fontSize: 14,
      color: muted, // Corrigido
      fontWeight: '600',
    },
    infoValue: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '700',
    },
    statsContainer: {
      width: '100%',
      marginTop: 14,
      alignItems: 'center',
    },
    statCard: {
      width: screenWidth - 72,
      backgroundColor: cardBg, // Corrigido
      borderWidth: 1,
      borderColor: border, // Corrigido
      borderRadius: 10,
      paddingVertical: 18,
      paddingHorizontal: 14,
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: theme.cardShadow, // Corrigido
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 1,
    },
    statIcon: {
      fontSize: 26,
      marginBottom: 6,
      color: muted, // Corrigido
    },
    statValue: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: muted, // Corrigido
    },
    editButton: {
      marginTop: 12,
      backgroundColor: theme.buttonBackground, // Corrigido
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 8,
    },
    editButtonText: {
      color: theme.text, // Corrigido
      fontWeight: '700',
      fontSize: 14,
    },
  });
}