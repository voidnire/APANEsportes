import React, { useContext, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  Pressable,
  Platform,
  AccessibilityRole,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Context / hooks / components do seu projeto
import { ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';
import Spacer from '@/components/Spacer';
import ThemedButton from '@/components/ThemedButton';
import ThemedText from '@/components/ThemedText';

type Theme = typeof Colors.light | typeof Colors.dark;
const screenWidth = Dimensions.get('window').width;

/* ---------- Aux Component: InfoRow ---------- */
interface InfoRowProps {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}
const InfoRow: React.FC<InfoRowProps> = ({ label, value, styles }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
      {value}
    </Text>
  </View>
);

/* ---------- MenuRow local ---------- */
interface MenuRowProps {
  title: string;
  screen: string;
  onPress: (screen: string) => void;
}
const MenuRow: React.FC<MenuRowProps> = ({ title, screen, onPress }) => {
  return (
    <Pressable
      onPress={() => onPress(screen)}
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      style={({ pressed }) => [
        stylesMemo.row,
        pressed ? stylesMemo.rowPressed : undefined,
      ]}
      accessibilityRole={'button' as AccessibilityRole}
      accessibilityLabel={`Abrir ${title}`}
      hitSlop={8}
    >
      <View style={stylesMemo.rowLeft}>
        <View style={stylesMemo.texts}>
          <Text style={stylesMemo.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>

      <Ionicons
        name={Platform.OS === 'ios' ? 'chevron-forward' : 'chevron-forward-outline'}
        size={22}
        color={stylesMemo.icon.color}
        style={{ marginLeft: 8 }}
      />
    </Pressable>
  );
};

/* ---------- Screen ---------- */
export default function SettingsScreen() {
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) throw new Error('SettingsScreen must be used within a ThemeProvider');
  const { theme } = themeContext;

  const { logout, user } = useUser();
  const router = useRouter();

  const styles = useMemo(() => createStyles(theme), [theme]);

  // keep a shallow global reference for MenuRow styling (MenuRow is declared outside return)
  // This is used inside MenuRow's inline styles.
  // We set stylesMemo so MenuRow can access some style values.
  setStylesMemo(styles);

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/'); // ajuste a rota inicial conforme seu app
    } catch (err) {
      console.error('Erro ao deslogar:', err);
      router.replace('/');
    }
  };

  /*const MENU_ITEMS = [
    { id: '1', title: 'Alterar Dados da Conta', screen: 'JumpsScreen' },
    { id: '2', title: 'Alterar Senha', screen: 'StrengthScreen' },
  ];*/

  const handlePressMenu = (screen: string) => {
    // ajuste a navegação conforme sua estrutura de rotas:
    // exemplo: router.push(`/settings/${screen}`) ou router.push(`/${screen}`)
    console.log(`Navegar para a tela: ${screen}`);
    //router.push(`/configuracoes/${screen}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <Spacer/>

      <View style={styles.avatarWrap}>
        <View style={styles.avatarBorder}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{getInitials(user?.nomeCompleto)}</Text>
          </View>
        </View>
        <Spacer height={10} />
        <Text style={styles.profileName}>{user?.nomeCompleto || 'Usuário Desconhecido'}</Text>

      </View>

      <Spacer height={18} />

      <View style={styles.infoCard}>
        <InfoRow label="Nome Completo" value={user?.nomeCompleto || 'N/A'} styles={styles} />
        <InfoRow label="Email" value={user?.email || 'N/A'} styles={styles} />
        {/* adicione outras linhas conforme necessário */}
      </View>

      <Spacer height={12} />

      {/** 
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Geral</Text>
        <Spacer height={8} />
        <FlatList
          data={MENU_ITEMS}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <MenuRow title={item.title} screen={item.screen} onPress={handlePressMenu} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingVertical: 8 }}
          scrollEnabled={false}
        />
      </View>*/}
      <Spacer />

      <ThemedButton onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </ThemedButton>

      <Spacer height={12} />
    </ScrollView>
  );
}

/* ---------- Styles ---------- */
function createStyles(theme: Theme) {
  const cardBg = theme.cardBackground;
  const border = theme.cardBorder;
  const muted = theme.subtitle;
  const primary = theme.buttonBackground;

  // avatar size responsivo
  const avatarSize = Math.min(120, Math.max(88, Math.floor(screenWidth * 0.28)));

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
      marginBottom: 8,
    },
    backButton: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.text,
    },

    avatarWrap: {
      alignItems: 'center',
      width: '100%',
      marginBottom: 8,
    },
    avatarBorder: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
      backgroundColor: cardBg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 5,
      borderColor: border,
    },
    avatarPlaceholder: {
      width: avatarSize - 14,
      height: avatarSize - 14,
      borderRadius: (avatarSize - 14) / 2,
      backgroundColor: primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarInitial: {
      fontSize: Math.floor(avatarSize * 0.28),
      color: theme.text,
      fontWeight: '800',
    },
    profileName: {
      marginTop: 12,
      fontSize: 16,
      fontWeight: '800',
      color: theme.text,
    },
    profileSubtitle: {
      marginTop: 4,
      fontSize: 13,
      color: muted,
      maxWidth: '85%',
      textAlign: 'center',
    },

    infoCard: {
      width: '100%',
      marginTop: 6,
      marginBottom: 18,
      borderRadius: 12,
      overflow: 'hidden',
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
      marginRight: 12,
    },
    infoValue: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '700',
      maxWidth: '60%',
      textAlign: 'right',
    },

    // section
    section: {
      marginTop: 4,
      width: '100%',
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.text,
      paddingHorizontal: 2,
      marginBottom: 6,
    },

    // row (menu)
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 12,
      backgroundColor: cardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: border,
      width: '100%',
    },
    rowPressed: {
      opacity: 0.9,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    icon: {
      color: theme.subtitle, // ícone em tom suave
    },
    texts: {
      flex: 1,
      marginRight: 8,
    },
    title: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.text,
    },

    separator: {
      height: 10,
    },

    logoutButton: {
      width: '100%',
      backgroundColor: primary,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 22,
    },
    logoutButtonText: {
      color: theme.text,
      fontWeight: '700',
      fontSize: 16,
    },
  });
}

/* ---------- small helper to let MenuRow access styles (not ideal but pragmatic) ---------- */
// We export a mutable holder for menu row styles used above
let stylesMemo = {} as ReturnType<typeof createStyles>;
function setStylesMemo(v: ReturnType<typeof createStyles>) {
  stylesMemo = v;
}
