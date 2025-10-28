import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // expo/vector-icons or react-native-vector-icons

// Lista de itens conforme a imagem (texto em PT-BR)
const MENU_ITEMS = [
  { id: "1", title: "Saltar", subtitle: "My Jump 3", icon: "barbell" },
  { id: "2", title: "Treino baseado em velocidade", subtitle: "My Lift", icon: "speedometer" },
  { id: "3", title: "Corrida & Sprints", subtitle: "Runmatic", icon: "run" },
  { id: "4", title: "Questionários de bem estar", subtitle: "Readiness", icon: "list" },
  { id: "5", title: "Força dos Isquiotibiais", subtitle: "Nordics", icon: "fitness" },
  { id: "6", title: "Mobilidade", subtitle: "My ROM", icon: "body" },
];

// Componente de linha do menu — estilo minimalista / clean
const MenuRow = ({ title, subtitle, icon, onPress }) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.rowLeft}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} style={styles.icon} />
      </View>
      <View style={styles.texts}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
    </View>

    <Ionicons name="chevron-forward" size={20} color="#C4C4C6" />
  </TouchableOpacity>
);

export default function HomeScreenClean() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Cabeçalho 
      <View style={styles.header}>
        {// substitua por Image se quiser usar logo }
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>APAN</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>Monitoramento de Atletas</Text>
          <Text style={styles.headerSubtitle}>Painel principal</Text>
        </View>
      </View>*/}

      <View style={styles.section}>
        {/*<Text style={styles.sectionTitle}>Treinos e Ferramentas</Text>*/}
        <FlatList
          data={MENU_ITEMS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MenuRow
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              onPress={() => console.log("Abrir", item.title)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  logoBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#F4F8FB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoText: {
    fontWeight: "700",
    color: "#007AFF",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111114",
  },
  headerSubtitle: {
    color: "#8E8E93",
    fontSize: 12,
    marginTop: 2,
  },

  section: {
    flex: 1,
    marginTop: 1,
    padding:24
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    // borda sutil
    borderWidth: 1,
    borderColor: "#F0F0F3",
    // sombra leve (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    // elevação Android
    elevation: 1,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 9,
    backgroundColor: "#FAFBFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    color: "#2B7CD3",
  },
  texts: {
    maxWidth: "78%",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F1724",
  },
  subtitle: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 3,
  },

  separator: {
    height: 10,
  },

  primaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 18,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
