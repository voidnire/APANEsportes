import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  Dimensions, // Importar Dimensions
} from "react-native";
import { ThemeContext } from "@/context/ThemeContext";
import { Link } from "expo-router";
// Importar os gráficos
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

// Obter a largura da tela para os gráficos
const screenWidth = Dimensions.get("window").width;

export default function DesempenhoScreen() {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  // Estados para os filtros
  const [prePos, setPrePos] = useState("Pós"); // "Pré" ou "Pós"
  const [comparar, setComparar] = useState(true);

  // --- DADOS MOCKADOS PARA OS GRÁFICOS ---

  // Dados para o Gráfico de Linha (Evolução do Tempo)
  const lineChartData = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    datasets: [
      {
        data: [
          Math.random() * 10 + 20, // 20-30
          Math.random() * 10 + 20,
          Math.random() * 10 + 20,
          Math.random() * 10 + 20,
          Math.random() * 10 + 20,
          Math.random() * 10 + 20,
        ],
        color: (opacity = 1) => theme.primary || `rgba(26, 120, 255, ${opacity})`, // Cor primária do tema
        strokeWidth: 2,
      },
    ],
    legend: ["Tempo (s)"], // opcional
  };

  // Dados para o Gráfico de Barras (Desempenho em Saltos)
  const barChartData = {
    labels: ["Salto 1", "Salto 2", "Salto 3"], // 3 barras como na imagem
    datasets: [
      {
        data: [2.8, 3.5, 3.1], // valores mockados
      },
    ],
  };

  // Dados para o Gráfico de Pizza (Frequência Cardíaca)
  const pieChartData = [
    {
      name: "Zona 1",
      population: 20,
      color: "#f472b6", // Rosa
      legendFontColor: theme.text,
      legendFontSize: 13,
    },
    {
      name: "Zona 2",
      population: 15,
      color: "#a855f7", // Roxo
      legendFontColor: theme.text,
      legendFontSize: 13,
    },
    {
      name: "Zona 3",
      population: 30,
      color: "#84cc16", // Verde
      legendFontColor: theme.text,
      legendFontSize: 13,
    },
    {
      name: "Zona 4",
      population: 25,
      color: "#eab308", // Amarelo
      legendFontColor: theme.text,
      legendFontSize: 13,
    },
    {
      name: "Zona 5",
      population: 10,
      color: "#3b82f6", // Azul
      legendFontColor: theme.text,
      legendFontSize: 13,
    },
  ];

  // Configuração de estilo dos gráficos, usando o tema
  const chartConfig = {
    backgroundColor: theme.card || "#ffffff",
    backgroundGradientFrom: theme.card || "#ffffff",
    backgroundGradientTo: theme.card || "#ffffff",
    decimalPlaces: 1,
    color: (opacity = 1) => theme.primary || `rgba(26, 120, 255, ${opacity})`,
    labelColor: (opacity = 1) => theme.text || `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.primary || "#007aff",
    },
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header com botão de voltar 
      <View style={styles.header}>
        <Link href="/" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        </Link>
        <View style={{ width: 36 }} />  espaço symétrico
      </View>*/}

      {/* --- FILTROS --- */}
      <View style={styles.filtersContainer}>
        {/* Filtro Período */}
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Período</Text>
          <Pressable style={styles.dropdownButton}>
            <Text style={styles.dropdownButtonText}>Semana</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </Pressable>
        </View>

        {/* Filtro Pré/Pós */}
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Pré/Pós</Text>
          <View style={styles.segmentedControl}>
            <Pressable
              style={[
                styles.segmentButton,
                styles.segmentButtonLeft,
                prePos === "Pre" && styles.segmentButtonActive,
              ]}
              onPress={() => setPrePos("Pre")}
            >
              <Text
                style={[
                  styles.segmentButtonText,
                  prePos === "Pre" && styles.segmentButtonTextActive,
                ]}
              >
                Pré
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.segmentButton,
                styles.segmentButtonRight,
                prePos === "Pós" && styles.segmentButtonActive,
              ]}
              onPress={() => setPrePos("Pós")}
            >
              <Text
                style={[
                  styles.segmentButtonText,
                  prePos === "Pós" && styles.segmentButtonTextActive,
                ]}
              >
                Pós
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Filtro Comparar Histórico */}
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Comparar histórico</Text>
          <Switch
            trackColor={{ false: theme.muted, true: theme.primary }}
            thumbColor={theme.onPrimary || "#f4f3f4"}
            onValueChange={setComparar}
            value={comparar}
          />
        </View>
      </View>

      {/* --- GRÁFICOS --- */}
      <View style={styles.chartsArea}>
        {/* Gráfico 1: Evolução do Tempo de Corrida */}
        <View style={styles.chartWrapper}>
          <Text style={styles.chartTitle}>Evolução do Tempo de Corrida</Text>
          <LineChart
            data={lineChartData}
            width={screenWidth - 36} // Largura da tela menos o padding
            height={220}
            chartConfig={chartConfig}
            bezier // Deixa a linha curvada
            style={styles.chartStyle}
          />
        </View>

        {/* Gráfico 2: Desempenho em Saltos */}
        <View style={styles.chartWrapper}>
          <Text style={styles.chartTitle}>Desempenho em Saltos</Text>
          <BarChart
            data={barChartData}
            width={screenWidth - 36}
            height={220}
            chartConfig={chartConfig}
            yAxisLabel=""
            yAxisSuffix="m" // Adiciona "m" de metros
            fromZero={true}
            style={styles.chartStyle}
            showValuesOnTopOfBars={true}
          />
        </View>

        {/* Gráfico 3: Frequência Cardíaca Média */}
        <View style={styles.chartWrapper}>
          <Text style={styles.chartTitle}>Frequência Cardíaca Média</Text>
          <PieChart
            data={pieChartData}
            width={screenWidth - 36}
            height={220}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 0]} // Ajusta a posição
            absolute // Mostra valores absolutos (population) em vez de %
          />
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      paddingTop: 18,
      paddingHorizontal: 18,
      paddingBottom: 40, // Espaço no final
      alignItems: "stretch",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    backButton: {
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    backArrow: {
      fontSize: 22,
      color: theme.text,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: theme.text,
      letterSpacing: 1,
    },

    // --- Estilos dos Filtros ---
    filtersContainer: {
      marginBottom: 20,
      padding: 16,
      backgroundColor: theme.card || (colorScheme === "dark" ? "#111" : "#fff"),
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border || "#ddd",
    },
    filterRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border || "#eee",
    },
    "filterRow:last-child": { // (pseudo-seletor) Aplicar manualmente no último
      marginBottom: 0,
      paddingBottom: 0,
      borderBottomWidth: 0,
    },
    filterLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    // Botão Dropdown (simulado)
    dropdownButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.background, // Fundo diferente
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    dropdownButtonText: {
      color: theme.text,
      fontWeight: "500",
      marginRight: 8,
    },
    dropdownArrow: {
      color: theme.text,
      fontSize: 10,
    },
    // Segmented Control (Pré/Pós)
    segmentedControl: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: theme.primary || "#007aff",
      borderRadius: 8,
      overflow: "hidden", // Para os cantos arredondados funcionarem
    },
    segmentButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.card,
    },
    segmentButtonLeft: {
      // borderTopLeftRadius: 8, (cobertos pelo overflow)
      // borderBottomLeftRadius: 8,
    },
    segmentButtonRight: {
      // borderTopRightRadius: 8,
      // borderBottomRightRadius: 8,
    },
    segmentButtonActive: {
      backgroundColor: theme.primary || "#007aff",
    },
    segmentButtonText: {
      color: theme.primary || "#007aff",
      fontWeight: "600",
    },
    segmentButtonTextActive: {
      color: theme.onPrimary || "#fff",
      fontWeight: "700",
    },

    // --- Estilos dos Gráficos ---
    chartsArea: {
      marginTop: 10,
    },
    chartWrapper: {
      marginBottom: 30,
      alignItems: "flex-start", // Alinha título à esquerda
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 12,
      marginLeft: 4, // Pequeno recuo
    },
    chartStyle: {
      borderRadius: 16,
    },
  });
}