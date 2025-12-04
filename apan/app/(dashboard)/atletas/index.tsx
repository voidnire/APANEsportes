// screens/Atletas.tsx (ou app/(dashboard)/atletas/index.tsx conforme sua estrutura)
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
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
          <View style={[styles.section, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ color: theme.subtitle, textAlign: 'center', marginTop: 20 }}>
              Nenhum atleta encontrado. Adicione um novo atleta usando o botão abaixo.
            </Text>
          </View>
        )}

        <Spacer />
        <FlatList
          data={atletass}
          keyExtractor={(t) => String(t.id)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.7}>
              <View style={styles.atletaBtt}>
                <Text style={styles.equipeTitle}>{item.nomeCompleto}</Text>
                <Text style={styles.equipeSub}>
                  {item.dataNascimento ? new Date(item.dataNascimento).toLocaleDateString('pt-BR') : ''}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingVertical: 12, paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addBtt}
          onPress={() => router.push('/(dashboard)/atletas/registrarDados')}
        >
          <Ionicons name="add" size={26} color={theme.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    equipeTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.text,
    },
    equipeSub: {
      color: theme.subtitle,
      marginTop: 4,
      fontSize: 12,
    },
    atletaBtt: {
      backgroundColor: theme.cardBackground,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 10,
      elevation: 2,
    },
    separator: {
      height: 10,
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    addBtt: {
      backgroundColor: theme.buttonBackground,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 6,
    },
  });
