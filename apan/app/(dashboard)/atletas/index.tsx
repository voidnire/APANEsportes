// app/(dashboard)/atletas/index.tsx
import React, { useContext, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import Spacer from '@/components/Spacer';
import { AtletaResumido } from '@/models/atletas';
import { Colors } from '@/constants/Colors';
import { useAtletas } from '@/hooks/useAtletas';

type Theme = typeof Colors.light | typeof Colors.dark;

export default function Atletas() {
  const { data: atletass = [], isLoading, error } = useAtletas();

  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('Atletas screen must be used within a ThemeProvider');
  }
  const { theme } = themeContext;
  const styles = createStyles(theme);
  const router = useRouter();

  const handlePress = (atleta: AtletaResumido) => {
    router.push({
      pathname: `/(dashboard)/atletas/atleta/${atleta.id}`,
      params: {
        name: atleta.nomeCompleto,
      },
    });
  };

  const renderAtleta = ({ item }: { item: AtletaResumido }) => {
    const initials = getInitials(item.nomeCompleto);
    const age = item.dataNascimento ? calculateAge(item.dataNascimento) : null;
    const bg = avatarBackgroundColor(item.id);

    return (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Abrir atleta ${item.nomeCompleto}`}
      >
        <View style={styles.card}>
          <View style={[styles.avatar, { backgroundColor: bg }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {item.nomeCompleto}
            </Text>
            <Text style={styles.sub}>
              {item.dataNascimento ? new Date(item.dataNascimento).toLocaleDateString('pt-BR') : 'Data de nascimento não informada'}
            </Text>
          </View>

          <View style={styles.right}>
            {age !== null && (
              <View style={styles.ageBadge}>
                <Text style={styles.ageText}>{age} anos</Text>
              </View>
            )}

            <Ionicons name="chevron-forward" size={22} color={theme.subtitle} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && atletass.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        {(!isLoading && atletass.length === 0) && (
          <View style={[styles.emptyBox]}>
            <Text style={[styles.emptyText, { color: theme.subtitle }]}>
              Nenhum atleta encontrado.
            </Text>
            <Text style={[styles.emptyHint, { color: theme.subtitle }]}>
              Adicione um novo atleta usando o botão abaixo.
            </Text>
          </View>
        )}

        <Spacer />

        <FlatList
          data={atletass}
          keyExtractor={(t) => String(t.id)}
          renderItem={renderAtleta}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingVertical: 12, paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addBtt, { backgroundColor: theme.buttonBackground }]}
          onPress={() => router.push('/(dashboard)/atletas/registrarDados')}
          accessibilityRole="button"
          accessibilityLabel="Adicionar atleta"
        >
          <Ionicons name="add" size={26} color={theme.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ===== Helpers ===== */
function getInitials(name?: string) {
  if (!name) return '??';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function calculateAge(dateString: string) {
  try {
    const dob = new Date(dateString);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  } catch {
    return null;
  }
}

/* gera uma cor estável simples baseada no id (pra variar os avatares) */
function avatarBackgroundColor(id: string | number | undefined) {
  const colors = [
    '#FFEDD5', // peach
    '#E0F2FE', // sky
    '#E9F5EC', // greenish
    '#FEF3C7', // yellow
    '#F3E8FF', // purple
  ];
  const key = String(id ?? Math.random());
  let sum = 0;
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  return colors[sum % colors.length];
}

/* ===== Styles ===== */
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      paddingTop: 8,
    },
    section: {
      width: '92%',
      alignSelf: 'center',
      flex: 1,
      marginTop: 10,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardBackground,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 12,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: Platform.OS === 'ios' ? 0.06 : 0.12,
      shadowRadius: 6,
      borderWidth: 1,
      borderColor: theme.cardBorder,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#333',
    },
    info: {
      flex: 1,
      justifyContent: 'center',
    },
    name: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.text,
    },
    sub: {
      marginTop: 4,
      fontSize: 12,
      color: theme.subtitle,
    },
    right: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginLeft: 8,
      width: 80,
    },
    ageBadge: {
      backgroundColor: '#11182708', // leve transparência (dark) - ajusta bem com theme
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 999,
      marginBottom: 6,
    },
    ageText: {
      fontSize: 12,
      color: theme.subtitle,
      fontWeight: '600',
    },
    separator: {
      height: 12,
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    addBtt: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 8,
    },
    emptyBox: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 32,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 6,
    },
    emptyHint: {
      fontSize: 13,
    },
  });
