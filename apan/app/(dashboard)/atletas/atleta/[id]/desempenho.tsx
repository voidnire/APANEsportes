import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  Dimensions,
  ActivityIndicator,
  Alert, // 1. Importado para o loading
} from "react-native";
// 2. Imports de Contexto, Tipos e Serviços (nosso padrão)
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import AtletaService from "@/services/atleta";
import { RegistroAvaliacaoCompleto } from "@/models/atletas";
// import { Link } from "expo-router"; // (Não usado no seu original)
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

import {useRouter, useLocalSearchParams } from "expo-router";
import ThemedText from "@/components/ThemedText";

type Theme = typeof Colors.light | typeof Colors.dark;
const screenWidth = Dimensions.get("window").width;

export default function DesempenhoScreen() {
  const { id } = useLocalSearchParams() as { id: string };
  console.log("ID recebido do atleta:", id);


  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('DesempenhoScreen must be used within a ThemeProvider');
  }
  const { theme } = themeContext;

  const styles = createStyles(theme);
  // Estados para os filtros
  const [prePos, setPrePos] = useState("Pós");
  const [comparar, setComparar] = useState(true);

  const [avaliacoes, setAvaliacoes] = useState<RegistroAvaliacaoCompleto[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  // Buscar dados da API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setErrorMessage(null); 
        const data = await AtletaService.getAvaliacoesByAtletaId(id);
        setAvaliacoes(data);

      } catch (error:any) {
        console.error("Erro ao carregar avaliações:", error);
        

        const status = error?.response?.status;
        let mensagem = "Não foi possível carregar as avaliações.";

        if (status === 400) {
          mensagem = "Requisição inválida. Verifique os dados enviados. PROVALVEMENTE O UUID DO ATLETA";
        } else if (status === 401) {
          mensagem = "Sessão expirada. Faça login novamente.";
        } else if (status === 404) {
          mensagem = "Nenhuma avaliação encontrada.";
        } else if (status === 500) {
          mensagem = "Erro interno no servidor. Tente novamente mais tarde.";
        }
        

        setErrorMessage(mensagem)
        console.error("Erro ao carregar avaliações:", errorMessage);
        /*Alert.alert("Erro", mensagem,[{
          text: "OK", style: "default"
        }]);
        
        if (router && router.replace) {
          setTimeout(() => {
            try {
              router.replace('/(dashboard)/home');
            } catch (navError) {
              console.warn("Erro ao redirecionar:", navError);
            }
          }, 500);
        }*/
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]); //router  

  // 7. AJUSTE: Processar dados da API para os gráficos (usando useMemo)
  
  // Gráfico de Linha (Evolução do Tempo)
  const lineChartData = useMemo(() => {
    // Filtra avaliações que tenham métrica de "Tempo"
    const data = avaliacoes
      .map(reg => {
        const tempoResult = reg.resultados.find(r => r.tipoMetrica.nome === "Tempo");
        if (tempoResult) {
          return {
            date: new Date(reg.dataHora),
            value: tempoResult.valor,
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a!.date.getTime() - b!.date.getTime()) // Ordena por data
      .slice(-6); // Pega os últimos 6

    return {
      labels: data.map(d => d!.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
      datasets: [
        {
          data: data.map(d => d!.value),
          color: (opacity = 1) => theme.buttonBackground,
          strokeWidth: 2,
        },
      ],
      legend: ["Tempo (s)"],
    };
  }, [avaliacoes, theme.buttonBackground]);

  // Gráfico de Barras (Desempenho em Saltos)
  const barChartData = useMemo(() => {
    const data = avaliacoes
      .flatMap(reg => reg.resultados)
      .filter(res => res.tipoMetrica.nome.includes("Salto")) // Ex: "Salto em Altura"
      .map(res => res.valor)
      .slice(-3); // Pega os últimos 3

    return {
      labels: data.map((_, i) => `Salto ${i + 1}`),
      datasets: [{ data: data.length > 0 ? data : [0, 0, 0] }], // Garante que há dados
    };
  }, [avaliacoes]);
  
  // (Gráfico de Pizza é complexo de processar, mantido mockado por enquanto)
  const pieChartData = [
    { name: "Zona 1", population: 20, color: "#f472b6", legendFontColor: theme.text, legendFontSize: 13 },
    // ... (outros dados mocados)
  ];


  // Configuração de estilo dos gráficos, usando o tema
  const chartConfig = {
    backgroundColor: theme.cardBackground,
    backgroundGradientFrom: theme.cardBackground,
    backgroundGradientTo: theme.cardBackground,
    decimalPlaces: 1,
    color: (opacity = 1) => theme.buttonBackground, // Cor primária
    labelColor: (opacity = 1) => theme.text,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: theme.buttonBackground,
    },
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* --- FILTROS --- */}
      <View style={styles.filtersContainer}>
        {/* (Estilos dos filtros foram traduzidos abaixo) */}
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Período</Text>
          <Pressable style={styles.dropdownButton}>
            <Text style={styles.dropdownButtonText}>Semana</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </Pressable>
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Pré/Pós</Text>
          <View style={styles.segmentedControl}>
            <Pressable
              style={[
                styles.segmentButton,
                prePos === "Pre" && styles.segmentButtonActive,
              ]}
              onPress={() => setPrePos("Pre")}
            >
              <Text style={[ styles.segmentButtonText, prePos === "Pre" && styles.segmentButtonTextActive ]}>
                Pré
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.segmentButton,
                prePos === "Pós" && styles.segmentButtonActive,
              ]}
              onPress={() => setPrePos("Pós")}
            >
              <Text style={[ styles.segmentButtonText, prePos === "Pós" && styles.segmentButtonTextActive ]}>
                Pós
              </Text>
            </Pressable>
          </View>
        </View>
        {/* Correção: Aplicando estilo de "último" manualmente */}
        <View style={[styles.filterRow, { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}> 
          <Text style={styles.filterLabel}>Comparar histórico</Text>
          <Switch
            trackColor={{ false: theme.subtitle, true: theme.buttonBackground }}
            thumbColor={theme.text}
            onValueChange={setComparar}
            value={comparar}
          />
        </View>
      </View>

      {/* --- GRÁFICOS --- */}
      {loading ? (
        <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />
      ) : errorMessage ?  (
        <ThemedText style={{ color: theme.text, fontSize: 16, marginBottom: 10, textAlign: "center" }}>
          {errorMessage}
        </ThemedText>) : (
        
        <View style={styles.chartsArea}>
          {/* Gráfico 1: Evolução do Tempo de Corrida */}
          <View style={styles.chartWrapper}>
            <Text style={styles.chartTitle}>Evolução do Tempo de Corrida</Text>
            <LineChart
              data={lineChartData}
              width={screenWidth - 36}
              height={220}
              chartConfig={chartConfig}
              bezier
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
              yAxisSuffix="m"
              fromZero={true}
              style={styles.chartStyle}
              showValuesOnTopOfBars={true}
            />
          </View>

          {/* Gráfico 3: Frequência Cardíaca Média (Mockado) */}
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
              center={[10, 0]}
              absolute
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// 8. AJUSTE: Estilos "traduzidos" para o nosso Tema
function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      paddingTop: 18,
      paddingHorizontal: 18,
      paddingBottom: 40,
      alignItems: "stretch",
    },
    // (Estilos de 'header' removidos, não usados)

    // --- Estilos dos Filtros ---
    filtersContainer: {
      marginBottom: 20,
      padding: 16,
      backgroundColor: theme.cardBackground, // Corrigido
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.cardBorder, // Corrigido
    },
    filterRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.cardBorder, // Corrigido
    },
    filterLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    dropdownButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.cardBorder, // Corrigido
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
    segmentedControl: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: theme.buttonBackground, // Corrigido
      borderRadius: 8,
      overflow: "hidden",
    },
    segmentButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.cardBackground, // Corrigido
    },
    segmentButtonActive: {
      backgroundColor: theme.buttonBackground, // Corrigido
    },
    segmentButtonText: {
      color: theme.buttonBackground, // Corrigido
      fontWeight: "600",
    },
    segmentButtonTextActive: {
      color: theme.text, // Corrigido
      fontWeight: "700",
    },

    // --- Estilos dos Gráficos ---
    chartsArea: {
      marginTop: 10,
    },
    chartWrapper: {
      marginBottom: 30,
      alignItems: "flex-start",
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 12,
      marginLeft: 4,
    },
    chartStyle: {
      borderRadius: 16,
    },
  });
}