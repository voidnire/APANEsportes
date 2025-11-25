import React, { useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Imports de Contexto e Tipos (assumidos como corretos)
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import Spacer from "@/components/Spacer";

type Theme = typeof Colors.light | typeof Colors.dark;

// 🛑 REFORMULAÇÃO: Nova lista de testes de monitoramento
const MENU_ITEMS = [
  // Categoria: Potência (Saltos)
  { 
    id: "1", 
    title: "Saltos & Potência", 
    subtitle: "CMJ, SJ, Medicine Ball Throw", 
    icon: "analytics" as const, // Ícone de análise/gráfico
    screen: "JumpsScreen" // Exemplo de navegação
  },
  // Categoria: Velocidade e Agilidade
  { 
    id: "2", 
    title: "Velocidade & Agilidade", 
    subtitle: "30m Sprint, AST, RAST", 
    icon: "walk" as const, // Ícone de corrida/caminhada
    screen: "SpeedScreen"
  },
  // Categoria: Força
  { 
    id: "3", 
    title: "Força Muscular", 
    subtitle: "Dinamometria (Handgrip, etc.)", 
    icon: "barbell" as const, // Ícone de halter
    screen: "StrengthScreen"
  },
  // Categoria: Capacidade Aeróbica
  { 
    id: "4", 
    title: "Capacidade Aeróbica", 
    subtitle: "Teste Incremental (VO2 Max)", 
    icon: "bicycle" as const, // Ícone de bicicleta/cardio
    screen: "AerobicScreen"
  },
  // Categoria: Bem-Estar e Recuperação
  { 
    id: "5", 
    title: "Questionários de Bem-Estar", 
    subtitle: "Prontidão para o treino (Readiness)", 
    icon: "list" as const, // Ícone de lista/questionário
    screen: "ReadinessScreen"
  },
];

// Interface para o componente local, ajustada para a nova lista
interface MenuRowProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: (screen: string) => void; // Ação de clique
  screen: string; // Nova prop para navegação
}

export default function HomeScreenClean() {
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('HomeScreenClean must be used within a ThemeProvider');
  }
  const { theme } = themeContext;
  
  const styles = createStyles(theme);

  // 🛑 AJUSTE: Função de clique para navegar para a tela correta
  const handlePress = (screen: string) => {
    // Aqui você deve usar o hook de navegação (ex: useNavigation)
    // Exemplo: navigation.navigate(screen);
    console.log("Abrir Tela de Teste:", screen);
  };
  
  const MenuRow = ({ title, subtitle, icon, screen, onPress }: MenuRowProps) => (
    <TouchableOpacity style={styles.row} onPress={() => onPress(screen)} activeOpacity={0.7}>
      
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

      <Ionicons name="chevron-forward" size={20} color={theme.icon} />
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.safe}>
      {/* Você pode adicionar aqui um título geral para a seção de avaliações */}
      <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>
        Módulos de Avaliação
      </Text>
      <Spacer height={10} />

      <View style={styles.section}>
        <FlatList
          data={MENU_ITEMS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MenuRow
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon as keyof typeof Ionicons.glyphMap}
              screen={item.screen}
              onPress={handlePress} // Usando a nova função handlePress
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          // 🛑 AJUSTE: Removendo o padding 24 do 'section' e colocando no 'contentContainerStyle'
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8 }}
        />
      </View>

    </SafeAreaView>
  );
}

// Estilos mantidos, com o ajuste no `section`
const createStyles = (theme: Theme) => 
StyleSheet.create({
  // ... (Estilos safe, header, logoBox, etc. mantidos)
  safe: {
    flex: 1,
    backgroundColor: theme.background,
    // Removendo paddingHorizontal/paddingTop para dar mais controle ao FlatList
    paddingTop: 18, 
  },
  // ...
  section: {
    flex: 1,
    // Removendo padding 24, pois ele irá para o contentContainerStyle do FlatList
  },
  sectionTitle: {
    fontSize: 16, // Aumentei um pouco para um título de tela
    fontWeight: "700",
    color: theme.text,
    // Alinhamento com o paddingHorizontal 20 do FlatList
  },
  row: {
    // ... (Estilos do MenuRow mantidos)
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: theme.cardBackground,
    borderRadius: 12, // Um pouco maior
    borderWidth: 1,
    borderColor: theme.cardBorder,
    // ...
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: theme.buttonBackground, // Mudando a cor de fundo do ícone para dar destaque
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    color: theme.background, // Cor do ícone em contraste (fundo)
  },
  texts: {
    maxWidth: "78%",
  },
  title: {
    fontSize: 16, // Um pouco maior
    fontWeight: "700",
    color: theme.text,
  },
  subtitle: {
    fontSize: 13,
    color: theme.subtitle,
    marginTop: 3,
  },
  separator: {
    height: 8, // Separador um pouco menor
  },
  // ... (Outros estilos)
});