import React, { useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  // Image, // (Não usado)
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 1. AJUSTE: Imports corretos de Contexto e Tipos
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

// 2. AJUSTE: Tipo do 'theme' (nosso padrão)
type Theme = typeof Colors.light | typeof Colors.dark;

// Lista de itens do menu (OK ser estático, pois é um menu)
const MENU_ITEMS = [
  { id: "1", title: "Saltar", subtitle: "My Jump 3", icon: "barbell" },
  { id: "2", title: "Treino baseado em velocidade", subtitle: "My Lift", icon: "speedometer" },
  { id: "3", title: "Corrida & Sprints", subtitle: "Runmatic", icon: "run" },
  { id: "4", title: "Questionários de bem estar", subtitle: "Readiness", icon: "list" },
  { id: "5", title: "Força dos Isquiotibiais", subtitle: "Nordics", icon: "fitness" },
  { id: "6", title: "Mobilidade", subtitle: "My ROM", icon: "body" },
];

// 3. AJUSTE: Interface para o componente local
// (usando keyof para segurança do tipo de ícone)
interface MenuRowProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap; // Tipo mais seguro
  onPress: () => void;
}

export default function HomeScreenClean() {
  // 4. AJUSTE: Consumo correto do ThemeContext (com checagem de null)
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('HomeScreenClean must be used within a ThemeProvider');
  }
  const { theme } = themeContext;
  
  // 5. AJUSTE: Tipagem correta para 'createStyles'
  const styles = createStyles(theme);
  
  // 6. AJUSTE: Tipagem das props
  const MenuRow = ({ title, subtitle, icon, onPress }: MenuRowProps) => (
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

      {/* 7. AJUSTE: Cor do ícone vinda do tema */}
      <Ionicons name="chevron-forward" size={20} color={theme.icon} />
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.safe}>
      {/* (Cabeçalho comentado) */}

      <View style={styles.section}>
        <FlatList
          data={MENU_ITEMS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MenuRow
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon as keyof typeof Ionicons.glyphMap} // Cast
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

// 8. AJUSTE: Tipagem do 'theme' e correção de cores hard-coded
const createStyles = (theme: Theme)  => 
StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  // (Estilos de Header mantidos, caso sejam usados no futuro)
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  logoText: {
    fontWeight: "700",
    color: theme.buttonBackground, // Corrigido
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.text, // Corrigido
  },
  headerSubtitle: {
    color: theme.subtitle, // Corrigido
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    flex: 1,
    marginTop: 1,
    // (Padding movido para 'safe' no seu original,
    // mas o FlatList parece precisar dele.
    // O seu `padding: 24` estava aqui, mantido.)
    padding: 24
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.text, // Corrigido
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: theme.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    shadowColor: theme.cardShadow,
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
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
    backgroundColor: theme.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    // 9. AJUSTE: Cor do ícone vinda do tema
    color: theme.buttonBackground, 
  },
  texts: {
    maxWidth: "78%",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.text,
  },
  subtitle: {
    fontSize: 12,
    color:theme.subtitle,
    marginTop: 3,
  },
  separator: {
    height: 10,
  },
  // (Estilos de 'primaryButton' não usados, mantidos)
  primaryButton: {
    backgroundColor: theme.buttonBackground, // Corrigido
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 18,
  },
  primaryButtonText: {
    color: theme.text, // Corrigido
    fontWeight: "700",
    fontSize: 15,
  },
});