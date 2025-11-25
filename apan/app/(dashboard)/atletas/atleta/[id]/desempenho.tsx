// Desempenho.tsx (versão robusta para formatos variados de `resultados`)
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
  Alert,
} from "react-native";
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import AtletaService from "@/services/atleta";
import { RegistroAvaliacaoCompleto } from "@/models/atletas";
import { LineChart } from "react-native-chart-kit";
import { useRouter, useLocalSearchParams } from "expo-router";
import ThemedText from "@/components/ThemedText";
import Spacer from "@/components/Spacer";
import ThemedButton from "@/components/ThemedButton";

type Theme = typeof Colors.light | typeof Colors.dark;
const screenWidth = Dimensions.get("window").width;
const MAX_POINTS = 8;

// Função utilitária que tenta extrair array de resultados no formato uniforme:
// [{ tipoMetricaNome: string, valor: number }]
function normalizeResultados(raw: any): { tipoMetricaNome?: string; valor?: number; tipoMetricaId?: string }[] {
  if (!raw) return [];

  const out: { tipoMetricaNome?: string; valor?: number; tipoMetricaId?: string }[] = [];

  // helper para processar um item que pode ser objeto com várias formas
  const pushIfValid = (item: any) => {
    if (!item || typeof item !== "object") return;
    // Possíveis formatos:
    // 1) { tipoMetrica: { id, nome }, valor }
    if (item.tipoMetrica && (item.valor !== undefined)) {
      const v = Number(item.valor);
      if (!Number.isNaN(v)) out.push({ tipoMetricaNome: item.tipoMetrica.nome ?? item.tipoMetricaId ?? item.tipoMetrica?.id, valor: v, tipoMetricaId: item.tipoMetrica?.id ?? item.tipoMetricaId });
      return;
    }
    // 2) { tipoMetricaId, valor }
    if ((item.tipoMetricaId || item.tipo_metrica_id) && (item.valor !== undefined)) {
      const v = Number(item.valor);
      if (!Number.isNaN(v)) out.push({ tipoMetricaNome: undefined, valor: v, tipoMetricaId: item.tipoMetricaId ?? item.tipo_metrica_id });
      return;
    }
    // 3) { nome, unidadeMedida, valor } (algumas APIs enviam tipo e valor juntos)
    if ((item.nome || item.tipo) && (item.valor !== undefined)) {
      const v = Number(item.valor);
      if (!Number.isNaN(v)) out.push({ tipoMetricaNome: item.nome ?? item.tipo, valor: v, tipoMetricaId: item.id });
      return;
    }
    // 4) objeto com chaves estranhas, tenta varrer
    if (item.valor !== undefined) {
      const v = Number(item.valor);
      if (!Number.isNaN(v)) {
        // tenta obter um nome pela propriedade tipoMetrica.nome ou similar
        const tipoNome = item.tipoMetrica?.nome ?? item.tipo ?? item.nome;
        out.push({ tipoMetricaNome: tipoNome, valor: v, tipoMetricaId: item.tipoMetrica?.id ?? item.tipoMetricaId });
      }
    }
  };

  // Se for array de arrays -> achata
  if (Array.isArray(raw)) {
    // Alguns responses chegam como [[Object]] etc — iterar recursivamente
    for (const el of raw) {
      if (Array.isArray(el)) {
        for (const sub of el) {
          if (typeof sub === "object") pushIfValid(sub);
        }
      } else if (typeof el === "object") {
        pushIfValid(el);
      } else {
        // pode ser string "Object" (quando console mostrou assim) -> ignorar
        continue;
      }
    }
  } else if (typeof raw === "object") {
    pushIfValid(raw);
  }

  return out;
}

export default function DesempenhoScreen() {
  const { id } = useLocalSearchParams() as { id: string };

  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) throw new Error("DesempenhoScreen must be used within a ThemeProvider");
  const { theme } = themeContext;
  const styles = createStyles(theme);

  const [prePos, setPrePos] = useState<"PRE_TREINO" | "POS_TREINO" | "AMBOS">("AMBOS");
  const [comparar, setComparar] = useState(true);

  const [avaliacoes, setAvaliacoes] = useState<RegistroAvaliacaoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const data = await AtletaService.getAvaliacoesByAtletaId(id);
        setAvaliacoes(data ?? []);
      } catch (error: any) {
        console.error("Erro ao carregar avaliações:", error);
        const status = error?.response?.status;
        let mensagem = "Não foi possível carregar as avaliações.";
        if (status === 400) mensagem = "Requisição inválida. Verifique o ID do atleta.";
        else if (status === 401) mensagem = "Sessão expirada. Faça login novamente.";
        else if (status === 404) mensagem = "Nenhuma avaliação encontrada.";
        else if (status === 500) mensagem = "Erro interno no servidor. Tente novamente mais tarde.";
        setErrorMessage(mensagem);
        Alert.alert("Erro", mensagem, [{ text: "OK" }]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Agrupa por modalidade e por nome de métrica (normalizando)
  const modalitiesMap = useMemo(() => {
    const map = new Map<
      string,
      { nome: string; metrics: Map<string, { date: Date; value: number }[]> }
    >();

    for (const reg of avaliacoes) {
      // aplica filtro PRE/POS se o usuário selecionar (por enquanto 'AMBOS' mostra tudo)
      if (prePos !== "AMBOS" && reg.tipo !== prePos) continue;

      const modId = String(reg.modalidadeId ?? reg.modalidade?.id ?? "sem-modalidade");
      const modName = reg.modalidade?.nome ?? reg.modalidade?.categoria ?? "Modalidade";

      if (!map.has(modId)) map.set(modId, { nome: modName, metrics: new Map() });
      const entry = map.get(modId)!;

      // Normaliza resultados (lidando com arrays aninhados)
      const normalized = normalizeResultados(reg.resultados);

      for (const r of normalized) {
        const metricName = r.tipoMetricaNome ?? r.tipoMetricaId ?? "Métrica";
        const value = Number(r.valor);
        if (Number.isNaN(value)) continue;
        const dt = new Date(reg.dataHora ?? reg.createdAt ?? Date.now());

        if (!entry.metrics.has(metricName)) entry.metrics.set(metricName, []);
        entry.metrics.get(metricName)!.push({ date: dt, value });
      }
    }

    // converte e corta para últimos MAX_POINTS
    const final: Record<string, { nome: string; metrics: Record<string, { labels: string[]; data: number[] }> }> = {};
    for (const [modId, { nome, metrics }] of map.entries()) {
      const metricsObj: Record<string, { labels: string[]; data: number[] }> = {};
      for (const [metricName, series] of metrics.entries()) {
        const sorted = series.sort((a, b) => a.date.getTime() - b.date.getTime());
        const last = sorted.slice(-MAX_POINTS);
        metricsObj[metricName] = {
          labels: last.map((p) => p.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })),
          data: last.map((p) => p.value),
        };
      }
      final[modId] = { nome, metrics: metricsObj };
    }
    return final;
  }, [avaliacoes, prePos]);

  const chartConfig = {
    backgroundColor: theme.cardBackground,
    backgroundGradientFrom: theme.cardBackground,
    backgroundGradientTo: theme.cardBackground,
    decimalPlaces: 1,
    color: (opacity = 1) => theme.buttonBackground,
    labelColor: (opacity = 1) => theme.text,
    style: { borderRadius: 16 },
    propsForDots: { r: "4", strokeWidth: "2", stroke: theme.buttonBackground },
  };

  const modalitiesArray = useMemo(() => Object.entries(modalitiesMap).map(([id, val]) => ({ id, ...val })), [modalitiesMap]);

  const handleAvaliacao = () => {
    router.push({
      pathname: "/(dashboard)/testes/registrarTreino",
      params: { atletaId: id } // opcional
    });

    console.log('Registrar treino do atleta:', id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* filtros */}
      <Spacer/>
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Período</Text>
          <Pressable style={styles.dropdownButton}>
            <Text style={styles.dropdownButtonText}>Últimos {MAX_POINTS} pontos</Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </Pressable>
        </View>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Pré/Pós</Text>
          <View style={styles.segmentedControl}>
            <Pressable
              style={[styles.segmentButton, prePos === "PRE_TREINO" && styles.segmentButtonActive]}
              onPress={() => setPrePos("PRE_TREINO")}
            >
              <Text style={[styles.segmentButtonText, prePos === "PRE_TREINO" && styles.segmentButtonTextActive]}>Pré</Text>
            </Pressable>
            <Pressable
              style={[styles.segmentButton, prePos === "POS_TREINO" && styles.segmentButtonActive]}
              onPress={() => setPrePos("POS_TREINO")}
            >
              <Text style={[styles.segmentButtonText, prePos === "POS_TREINO" && styles.segmentButtonTextActive]}>Pós</Text>
            </Pressable>
            <Pressable
              style={[styles.segmentButton, prePos === "AMBOS" && styles.segmentButtonActive]}
              onPress={() => setPrePos("AMBOS")}
            >
              <Text style={[styles.segmentButtonText, prePos === "AMBOS" && styles.segmentButtonTextActive]}>Ambos</Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.filterRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.filterLabel}>Comparar histórico</Text>
          <Switch trackColor={{ false: theme.subtitle, true: theme.buttonBackground }} thumbColor={theme.text} onValueChange={setComparar} value={comparar} />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />
      ) : Object.keys(modalitiesMap).length === 0 ? (
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: theme.subtitle }}>Nenhuma avaliação disponível para este atleta / filtro.</Text>
          <Spacer/>
          <ThemedButton onPress={handleAvaliacao}><ThemedText>Adicionar Avaliação</ThemedText></ThemedButton>
        </View>
      ) : (
        <View style={styles.chartsArea}>
          {modalitiesArray.map((mod) => (
            <View key={mod.id} style={{ marginBottom: 28 }}>
              <Text style={styles.modalidadeTitle}>{mod.nome}</Text>

              {Object.keys(mod.metrics).length === 0 ? (
                <Text style={{ color: theme.subtitle, marginLeft: 6 }}>Nenhuma métrica registrada para esta modalidade.</Text>
              ) : (
                Object.entries(mod.metrics).map(([metricName, series]) => {
                  const hasData = Array.isArray(series.data) && series.data.length > 0 && series.data.some((d) => typeof d === "number");
                  if (!hasData) return null;

                  const chartData = {
                    labels: series.labels.length ? series.labels : series.data.map((_, i) => `${i + 1}`),
                    datasets: [{ data: series.data, color: (o = 1) => theme.buttonBackground, strokeWidth: 2 }],
                    legend: [metricName],
                  };

                  return (
                    <View key={metricName} style={styles.chartWrapper}>
                      <Text style={styles.chartTitle}>{metricName}</Text>
                      <LineChart data={chartData} width={screenWidth - 36} height={220} chartConfig={chartConfig} bezier style={styles.chartStyle} />
                    </View>
                  );
                })
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    contentContainer: { paddingTop: 18, paddingHorizontal: 18, paddingBottom: 40, alignItems: "stretch" },
    filtersContainer: { marginBottom: 20, padding: 16, backgroundColor: theme.cardBackground, borderRadius: 12, borderWidth: 1, borderColor: theme.cardBorder },
    filterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.cardBorder },
    filterLabel: { fontSize: 16, fontWeight: "600", color: theme.text },
    dropdownButton: { flexDirection: "row", alignItems: "center", backgroundColor: theme.background, borderWidth: 1, borderColor: theme.cardBorder, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
    dropdownButtonText: { color: theme.text, fontWeight: "500", marginRight: 8 },
    dropdownArrow: { color: theme.text, fontSize: 10 },
    segmentedControl: { flexDirection: "row", borderWidth: 1, borderColor: theme.buttonBackground, borderRadius: 8, overflow: "hidden" },
    segmentButton: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: theme.cardBackground },
    segmentButtonActive: { backgroundColor: theme.buttonBackground },
    segmentButtonText: { color: theme.buttonBackground, fontWeight: "600" },
    segmentButtonTextActive: { color: theme.text, fontWeight: "700" },
    chartsArea: { marginTop: 10 },
    chartWrapper: { marginBottom: 20, alignItems: "flex-start" },
    chartTitle: { fontSize: 16, fontWeight: "700", color: theme.text, marginBottom: 8, marginLeft: 4 },
    chartStyle: { borderRadius: 16 },
    modalidadeTitle: { fontSize: 18, fontWeight: "800", color: theme.text, marginBottom: 10 },
  });
}
