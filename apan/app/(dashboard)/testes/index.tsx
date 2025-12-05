// (dashboard)/testes/index.tsx
import React, { useContext } from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Importante

import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import Spacer from "@/components/Spacer";

type Theme = typeof Colors.light | typeof Colors.dark;

const MENU_ITEMS = [
  { 
    id: "0", 
    title: "Nova Análise de Salto/Potência/Velocidade", 
    subtitle: "Grave ou envie um vídeo para análise IA", 
    icon: "videocam" as const, 
    screen: "/(dashboard)/testes/analise/selecaoVideo" // Rota nova
  },
];

interface MenuRowProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: (screen: string) => void;
  screen: string;
}

export default function HomeScreenClean() {
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  const { theme } = themeContext!;
  const styles = createStyles(theme);
  const router = useRouter();

  const handlePress = (screen: string) => {
    // Se for uma rota válida do expo-router (começa com /), navega
    if (screen.startsWith('/')) {
        router.push(screen as any);
    } else {
        console.log("Tela ainda não implementada:", screen);
    }
  };
  
  const MenuRow = ({ title, subtitle, icon, screen, onPress }: MenuRowProps) => (
    <TouchableOpacity style={styles.row} onPress={() => onPress(screen)} activeOpacity={0.7}>
      <View style={styles.rowLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={20} style={styles.icon} />
        </View>
        <View style={styles.texts}>
          <Text numberOfLines={1} style={styles.title}>{title}</Text>
          <Text numberOfLines={1} style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.icon} />
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.safe}>
      <Spacer />
      <View style={styles.section}>
        <FlatList
          data={MENU_ITEMS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MenuRow
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              screen={item.screen}
              onPress={handlePress}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8 }}
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background, paddingTop: 18 },
  section: { flex: 1 },
  row: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 14, paddingHorizontal: 12, backgroundColor: theme.cardBackground,
    borderRadius: 12, borderWidth: 1, borderColor: theme.cardBorder,
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 44, height: 44, borderRadius: 10, backgroundColor: theme.buttonBackground,
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  icon: { color: theme.background },
  texts: { maxWidth: "78%" },
  title: { fontSize: 16, fontWeight: "700", color: theme.text },
  subtitle: { fontSize: 13, color: theme.subtitle, marginTop: 3 },
  separator: { height: 8 },
});