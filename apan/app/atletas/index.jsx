import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ThemeContext } from "@/context/ThemeContext";
import { atletas as atletasModule } from "@/models/atletas";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Atletas() {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const router = useRouter();

  // estado local da lista (inicial vazio ou carregado)
  const [atletass, setAtletas] = useState(() =>
    atletasModule.slice().sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto))
  );

  // Função para (re)carregar os atletas do módulo
  const reloadAtletas = useCallback(() => {
    // cria cópia e ordena pra garantir consistência
    const copy = atletasModule.slice().sort((a, b) =>
      a.nomeCompleto.localeCompare(b.nomeCompleto)
    );
    setAtletas(copy);
  }, []);

  // useFocusEffect é chamado sempre que a tela fica em foco (visível)
  useFocusEffect(
    useCallback(() => {
      // quando a tela ganha foco -> recarrega a lista
      reloadAtletas();
      // se quiser, pode retornar um cleanup (não necessário aqui)
      return () => {};
    }, [reloadAtletas])
  );

  const handlePress = (id) => {
    const atleta = atletasModule.find((t) => t.id === id);
    router.push({
      pathname: `/atletas/atleta/${id}`,
      params: {
        name: atleta?.nomeCompleto ?? "",
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <FlatList
          data={atletass}
          keyExtractor={(t) => String(t.id)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item.id)} activeOpacity={0.7}>
              <View style={styles.equipeBtt}>
                <Text style={styles.equipeTitle}>{item.nomeCompleto}</Text>
                <Text style={styles.equipeSub}>{item.dataNascimento}</Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingVertical: 12, paddingBottom: 110 }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addBtt}
          onPress={() => router.push("/atletas/registrarDados")}
        >
          <Ionicons name="add" size={26} color={theme.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme) =>
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
      color: "#000",
    },
    equipeSub: {
      color: "#888",
      marginTop: 4,
      fontSize: 12,
    },
    equipeBtt: {
      backgroundColor: "white",
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
      backgroundColor: "blue",
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      elevation: 6,
    },
  });
