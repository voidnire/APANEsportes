import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform, // Para ícone de seta de volta
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Imports de Contexto e Componentes
import { ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';
import Spacer from '@/components/Spacer';
import ThemedButton from '@/components/ThemedButton';
import ThemedText from '@/components/ThemedText'

type Theme = typeof Colors.light | typeof Colors.dark;

const screenWidth = Dimensions.get('window').width;

// 1. Componente Auxiliar para a linha de Informação
interface InfoRowProps {
  label: string;
  value: string;
  theme: Theme;
  styles: ReturnType<typeof createStyles>; // Reutiliza os estilos
}

const InfoRow = ({ label, value, theme, styles }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

// 2. Componente Principal
export default function SettingsScreen() {
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('SettingsScreen must be used within a ThemeProvider');
  }
  const { theme } = themeContext;

  const { logout, user } = useUser();
  const router = useRouter();

  const styles = createStyles(theme);

  // 3. Função para obter as iniciais (se user existir)
  const getInitials = (name: string | undefined): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
      // 4. Redirecionamento após o logout (Substitui o histórico de navegação)
      router.replace('/'); 
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo se houver erro no servidor, desloga localmente e redireciona
      router.replace('/'); 
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      

      
      <Spacer height={20} />

      {/* 5. Avatar e Nome */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatarBorder}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {getInitials(user?.nomeCompleto)}
            </Text>
          </View>
        </View>
        <Spacer height={10} />
        <Text style={styles.headerTitle}>
          {user?.nomeCompleto || 'Atleta Desconhecido'}
        </Text>
      </View>
      
      <Spacer height={20} />

      {/* 6. Informações do Perfil */}
      <View style={styles.infoCard}>
        <InfoRow label="Nome Completo" value={user?.nomeCompleto || 'N/A'} theme={theme} styles={styles} />
        <InfoRow label="Email" value={user?.email || 'N/A'} theme={theme} styles={styles} />
        {/* Adicione mais informações aqui, como função, time, etc. */}
      </View>

      <Spacer height={20} />

      {/* 7. Botão de Logout */}
      <ThemedButton onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </ThemedButton>

      

    </ScrollView>
  );
}

// 8. Estilos (Função createStyles completa e revisada)
function createStyles(theme: Theme) {
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
    },
    header: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
      paddingHorizontal: 0, // Removido o padding para o header usar a largura total
    },
    backButton: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18, // Aumentado
      fontWeight: '800',
      color: theme.text,
    },
    // --- Avatar ---
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
      backgroundColor: cardBg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 6,
      borderColor: theme.text, // Ajustado para ser mais consistente com o tema
    },
    avatarPlaceholder: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: primary, // Fundo do placeholder
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarInitial: {
      fontSize: 34,
      color: theme.text, // Cor da letra no avatar
      fontWeight: '800',
    },
    // --- Card de Informação ---
    infoCard: {
      width: '100%',
      marginTop: 6,
      marginBottom: 18,
      borderRadius: 10,
      overflow: 'hidden', // Para que as bordas do card funcionem
      borderWidth: 1,
      borderColor: border,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 15,
      backgroundColor: cardBg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: border,
    },
    infoLabel: {
      fontSize: 14,
      color: muted,
      fontWeight: '600',
    },
    infoValue: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '700',
    },
    // --- Botão de Logout ---
    logoutButton: {
      width: '100%',
      backgroundColor: theme.buttonBackground,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 30,
    },
    logoutButtonText: {
      color: theme.text, // Texto branco/claro no botão primário
      fontWeight: '700',
      fontSize: 16,
    },
    // Estilos não usados (mantidos no original)
    backArrow: {}, 
    statsContainer: {}, 
    statCard: {},
    statIcon: {},
    statValue: {},
    statLabel: {},
    editButton: {},
    editButtonText: {},
  });
}