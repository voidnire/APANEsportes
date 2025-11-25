import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert, // Para mostrar erros
  ActivityIndicator, // Para o loading
} from "react-native";

import { useRouter, useFocusEffect } from "expo-router";
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

// 2. AJUSTE: Importar a interface e o serviço, em vez do mock
import { AtletaResumido } from "@/models/atletas";
import { Colors } from "@/constants/Colors"; // Para o tipo 'Theme'
import AtletaService from '@/services/atleta';
import atleta from "@/services/atleta";
import Spacer from "@/components/Spacer";

type Theme = typeof Colors.light | typeof Colors.dark;

export default function Atletas() {
  // 3. AJUSTE: Consumir o ThemeContext da forma correta
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('Atletas screen must be used within a ThemeProvider');
  }
  const { theme } = themeContext;
  const styles = createStyles(theme);
  const router = useRouter();

  // 4. AJUSTE: States para carregar dados da API
  const [atletass, setAtletas] = useState<AtletaResumido[]>([]);
  const [loading, setLoading] = useState(true);

  // 5. AJUSTE: Função para carregar dados da API
  const loadAtletas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AtletaService.getAtletas();
      // Ordena os dados vindos da API
      const sortedData = data.slice().sort((a, b) =>
        a.nomeCompleto.localeCompare(b.nomeCompleto)
      );
      setAtletas(sortedData);
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível carregar os atletas: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 6. AJUSTE: useFocusEffect agora chama a API
  useFocusEffect(
    useCallback(() => {
      loadAtletas();
    }, [loadAtletas]) // A dependência garante que a função é estável
  );

  // 7. AJUSTE: 'handlePress' recebe o objeto AtletaResumido
  const handlePress = (atleta: AtletaResumido) => {
    router.push({
      pathname: `/(dashboard)/atletas/atleta/${atleta.id}`, // Caminho completo
      // Passamos o nome para o layout (como o layout esperava)
      params: { 
        name: atleta.nomeCompleto,
      },
    });
  };

  // 8. AJUSTE: Mostrar um indicador de loading
  if (loading && atletass.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>

        {atleta && atletass.length === 0 && !loading && (
          <View style={[styles.section,{ alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ color: theme.subtitle, textAlign: 'center', marginTop: 20 }}>
              Nenhum atleta encontrado. Adicione um novo atleta usando o botão abaixo.
            </Text>
          </View>
          
        ) }
        <Spacer />
        <FlatList
          data={atletass}
          keyExtractor={(t) => String(t.id)}
          renderItem={({ item }) => (
            // Passa o 'item' inteiro para o handlePress
            <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.7}>
              <View style={styles.atletaBtt}>
                <Text style={styles.equipeTitle}>{item.nomeCompleto}</Text>
                {/* O campo dataNascimento existe no AtletaResumido */}
                <Text style={styles.equipeSub}>{new Date(item.dataNascimento).toLocaleDateString('pt-BR')}</Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingVertical: 12, paddingBottom: 110 }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          // Adiciona "pull-to-refresh"
          onRefresh={loadAtletas}
          refreshing={loading}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addBtt}
          // 9. AJUSTE: Caminho completo para a rota
          onPress={() => router.push("/(dashboard)/atletas/registrarDados")}
        >
          <Ionicons name="add" size={26} color={theme.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 10. AJUSTE: Tipagem correta do 'theme'
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: "stretch",
      justifyContent: "flex-start",
      paddingTop: 8,
    },
    section: {
      width: "92%",
      alignSelf: "center",
      flex: 1,
      marginTop: 10,
    },
    equipeTitle: {
      fontSize: 16,
      fontWeight: "700",
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
      position: "absolute",
      bottom: 20,
      right: 20,
    },
    addBtt: {
      backgroundColor: theme.buttonBackground,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      elevation: 6,
    },
  });