//APANEsportes/apan/app/(dashboard)/atletas/atleta/[id]/desempenho.tsx
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
  TouchableOpacity
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
import { Ionicons } from "@expo/vector-icons";

type Theme = typeof Colors.light | typeof Colors.dark;
const screenWidth = Dimensions.get("window").width;
const MAX_POINTS = 8;

// --- FUNÇÕES AUXILIARES ---
function normalizeResultados(raw: any): { tipoMetricaNome?: string; valor?: number; tipoMetricaId?: string }[] {
  if (!raw) return [];
  const out: { tipoMetricaNome?: string; valor?: number; tipoMetricaId?: string }[] = [];
  const pushIfValid = (item: any) => {
    if (!item || typeof item !== "object") return;
    if (item.tipoMetrica && (item.valor !== undefined)) {
      const v = Number(item.valor);
      if (!Number.isNaN(v)) out.push({ tipoMetricaNome: item.tipoMetrica.nome, valor: v, tipoMetricaId: item.tipoMetrica?.id });
      return;
    }
    if (item.valor !== undefined) {
      const v = Number(item.valor);
      if (!Number.isNaN(v)) {
        const tipoNome = item.tipoMetrica?.nome ?? item.tipo ?? item.nome;
        out.push({ tipoMetricaNome: tipoNome, valor: v, tipoMetricaId: item.tipoMetrica?.id });
      }
    }
  };
  if (Array.isArray(raw)) {
    for (const el of raw) {
      if (Array.isArray(el)) { for (const sub of el) if (typeof sub === "object") pushIfValid(sub); }
      else if (typeof el === "object") pushIfValid(el);
    }
  } else if (typeof raw === "object") {
    pushIfValid(raw);
  }
  return out;
}

// CORREÇÃO 1: Helper para extrair JSON BRUTO do texto
const extractJsonFromText = (obs: string) => {
    const startTag = '[RAW_JSON_START]';
    const endTag = '[RAW_JSON_END]';
    
    const startIndex = obs.indexOf(startTag);
    const endIndex = obs.indexOf(endTag);
    
    if (startIndex !== -1 && endIndex !== -1) {
        // Pega o conteúdo entre as tags
        const jsonStr = obs.substring(startIndex + startTag.length, endIndex).trim();
        return jsonStr;
    }
    return null;
};

export default function DesempenhoScreen() {
  const { id } = useLocalSearchParams() as { id: string };
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  const { theme } = themeContext!;
  const styles = createStyles(theme);
  const router = useRouter();

  const [viewMode, setViewMode] = useState<'HISTORY' | 'VIDEOS'>('HISTORY');
  const [prePos, setPrePos] = useState<"PRE_TREINO" | "POS_TREINO" | "AMBOS">("AMBOS");
  const [comparar, setComparar] = useState(true);
  
  const [avaliacoes, setAvaliacoes] = useState<RegistroAvaliacaoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await AtletaService.getAvaliacoesByAtletaId(id);
      const sorted = (data ?? []).sort((a, b) => 
        new Date(b.dataHora || 0).getTime() - new Date(a.dataHora || 0).getTime()
      );
      setAvaliacoes(sorted);
    } catch (error) {
      console.error("Erro ao carregar avaliações", error);
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE DADOS ---

  const modalitiesMap = useMemo(() => {
    const map = new Map<string, { nome: string; metrics: Map<string, { date: Date; value: number }[]> }>();
    for (const reg of avaliacoes) {
      if (prePos !== "AMBOS" && reg.tipo !== prePos) continue;
      const modId = String(reg.modalidadeId ?? "sem-modalidade");
      const modName = reg.modalidade?.nome ?? "Modalidade";
      if (!map.has(modId)) map.set(modId, { nome: modName, metrics: new Map() });
      const entry = map.get(modId)!;
      const normalized = normalizeResultados(reg.resultados);
      for (const r of normalized) {
        const metricName = r.tipoMetricaNome ?? "Métrica";
        const value = Number(r.valor);
        if (Number.isNaN(value) || value === 0) continue; 
        const dt = new Date(reg.dataHora ?? Date.now());
        if (!entry.metrics.has(metricName)) entry.metrics.set(metricName, []);
        entry.metrics.get(metricName)!.push({ date: dt, value });
      }
    }
    const final: any = {};
    for (const [modId, { nome, metrics }] of map.entries()) {
      const metricsObj: any = {};
      for (const [metricName, series] of metrics.entries()) {
        const sorted = series.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(-MAX_POINTS);
        if (sorted.length > 0) {
            metricsObj[metricName] = {
            labels: sorted.map((p) => p.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })),
            data: sorted.map((p) => p.value),
            };
        }
      }
      final[modId] = { nome, metrics: metricsObj };
    }
    return final;
  }, [avaliacoes, prePos]);

  const modalitiesArray = useMemo(() => Object.entries(modalitiesMap).map(([id, val]: any) => ({ id, ...val })), [modalitiesMap]);

  // 2. Processamento para Lista de Vídeos
  const videosList = useMemo(() => {
    return avaliacoes
        // CORREÇÃO 2: Filtra pela nova tag de JSON BRUTO
        .filter(a => a.observacoes && a.observacoes.includes('[RAW_JSON_START]'))
        .map(a => {
            const results = normalizeResultados(a.resultados);
            const jumpMetric = results.find(r => r.tipoMetricaNome?.toLowerCase().includes('salto') || r.tipoMetricaNome?.toLowerCase().includes('altura'));
            const speedMetric = results.find(r => r.tipoMetricaNome?.toLowerCase().includes('velocidade') || r.tipoMetricaNome?.toLowerCase().includes('speed'));
            
            return {
                id: a.id,
                data: new Date(a.dataHora!).toLocaleDateString('pt-BR'),
                tipo: a.modalidade?.nome || 'Treino',
                fullObs: a.observacoes || '', // Passamos o texto completo
                metrics: {
                    jump: jumpMetric?.valor,
                    speed: speedMetric?.valor
                }
            };
        });
  }, [avaliacoes]);

  // --- AÇÃO: ABRIR ANÁLISE SALVA ---
  const handleOpenAnalysis = (videoItem: any) => {
    // CORREÇÃO 3: Extrai o JSON direto da string, sem fetch
    const jsonStr = extractJsonFromText(videoItem.fullObs);

    if (jsonStr) {
        router.push({
            pathname: "/(dashboard)/atletas/atleta/[id]/treino/analise/dashboard",
            params: { 
                id: id,
                resultData: jsonStr,
                readOnly: 'true' // <--- IMPORTANTE: Passamos essa flag para esconder o botão salvar
            }
        });
    } else {
        Alert.alert("Erro", "Dados brutos não encontrados neste registro.");
    }
  };

  const renderVideosTab = () => (
    <View>
        <View style={styles.videoHeader}>
            <Text style={styles.sectionTitle}>Histórico de Análises IA</Text>
            {/*<TouchableOpacity style={styles.btnAddVideo} onPress={() => router.push({ pathname: "/(dashboard)/testes/analise/selecaoVideo", params: { atletaId: id } })}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={{color: '#fff', fontWeight: 'bold', marginLeft: 4}}>Nova Análise</Text>
            </TouchableOpacity>*/}
        </View>

        {videosList.length === 0 ? (
            <View style={styles.emptyState}>
                <Ionicons name="videocam-outline" size={48} color={theme.subtitle} />
                <Text style={styles.emptyText}>Nenhuma análise de vídeo encontrada.</Text>
            </View>
        ) : (
            videosList.map((video) => (
                <TouchableOpacity 
                    key={video.id} 
                    style={styles.videoCard}
                    onPress={() => handleOpenAnalysis(video)}
                >
                    <View style={styles.videoIconBox}>
                        <Ionicons name="play-circle" size={32} color={theme.buttonBackground} />
                    </View>
                    <View style={styles.videoInfo}>
                        <Text style={styles.videoTitle}>{video.tipo}</Text>
                        <Text style={styles.videoDate}>{video.data}</Text>
                    </View>
                    <View style={styles.videoMetrics}>
                        {video.metrics.jump !== undefined && (
                            <Text style={styles.metricTag}>Salto: {video.metrics.jump}cm</Text>
                        )}
                        {video.metrics.speed !== undefined && (
                            <Text style={styles.metricTag}>Vel: {video.metrics.speed}m/s</Text>
                        )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.subtitle} />
                </TouchableOpacity>
            ))
        )}
    </View>
  );

  // ... (renderHistoryTab e JSX principal mantidos)
  const chartConfig = {
    backgroundColor: theme.cardBackground,
    backgroundGradientFrom: theme.cardBackground,
    backgroundGradientTo: theme.cardBackground,
    decimalPlaces: 1,
    color: (opacity = 1) => theme.buttonBackground,
    labelColor: (opacity = 1) => theme.text,
    style: { borderRadius: 16 },
  };

  const renderHistoryTab = () => (
    <View>
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Pré/Pós</Text>
            <View style={styles.segmentedControl}>
            <Pressable style={[styles.segmentButton, prePos === "PRE_TREINO" && styles.segmentButtonActive]} onPress={() => setPrePos("PRE_TREINO")}>
                <Text style={[styles.segmentButtonText, prePos === "PRE_TREINO" && styles.segmentButtonTextActive]}>Pré</Text>
            </Pressable>
            <Pressable style={[styles.segmentButton, prePos === "POS_TREINO" && styles.segmentButtonActive]} onPress={() => setPrePos("POS_TREINO")}>
                <Text style={[styles.segmentButtonText, prePos === "POS_TREINO" && styles.segmentButtonTextActive]}>Pós</Text>
            </Pressable>
            <Pressable style={[styles.segmentButton, prePos === "AMBOS" && styles.segmentButtonActive]} onPress={() => setPrePos("AMBOS")}>
                <Text style={[styles.segmentButtonText, prePos === "AMBOS" && styles.segmentButtonTextActive]}>Ambos</Text>
            </Pressable>
            </View>
        </View>
      </View>

      {modalitiesArray.length === 0 ? (
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: theme.subtitle }}>Nenhum dado gráfico disponível.</Text>
          <Spacer/>
        
        </View>
      ) : (
        modalitiesArray.map((mod: any) => (
          <View key={mod.id} style={{ marginBottom: 28 }}>
            <Text style={styles.modalidadeTitle}>{mod.nome}</Text>
            {Object.entries(mod.metrics).map(([metricName, series]: any) => (
               <View key={metricName} style={styles.chartWrapper}>
                 <Text style={styles.chartTitle}>{metricName}</Text>
                 <LineChart 
                    data={{ labels: series.labels, datasets: [{ data: series.data }] }} 
                    width={screenWidth - 36} height={220} 
                    chartConfig={{...chartConfig, propsForDots: {r: "4"}}} 
                    bezier 
                    style={styles.chartStyle} 
                 />
               </View>
            ))}
          </View>
        ))
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Spacer/>
      <View style={styles.topTabsContainer}>
         <Pressable style={[styles.topTab, viewMode === 'HISTORY' && styles.topTabActive]} onPress={() => setViewMode('HISTORY')}>
            <Text style={[styles.topTabText, viewMode === 'HISTORY' && styles.topTabTextActive]}>Gráficos</Text>
         </Pressable>
         <Pressable style={[styles.topTab, viewMode === 'VIDEOS' && styles.topTabActive]} onPress={() => setViewMode('VIDEOS')}>
            <Text style={[styles.topTabText, viewMode === 'VIDEOS' && styles.topTabTextActive]}>Análises de Vídeo</Text>
         </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />
      ) : (
        viewMode === 'HISTORY' ? renderHistoryTab() : renderVideosTab()
      )}
    </ScrollView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    contentContainer: { paddingTop: 18, paddingHorizontal: 18, paddingBottom: 60 },
    topTabsContainer: { flexDirection: 'row', backgroundColor: theme.cardBackground, borderRadius: 12, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: theme.cardBorder },
    topTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
    topTabActive: { backgroundColor: theme.buttonBackground },
    topTabText: { fontWeight: '600', color: theme.subtitle },
    topTabTextActive: { color: '#fff', fontWeight: 'bold' },
    filtersContainer: { marginBottom: 20, padding: 16, backgroundColor: theme.cardBackground, borderRadius: 12, borderWidth: 1, borderColor: theme.cardBorder },
    filterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 0 },
    filterLabel: { fontSize: 14, fontWeight: "600", color: theme.text },
    segmentedControl: { flexDirection: "row", borderWidth: 1, borderColor: theme.buttonBackground, borderRadius: 8, overflow: "hidden" },
    segmentButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: theme.cardBackground },
    segmentButtonActive: { backgroundColor: theme.buttonBackground },
    segmentButtonText: { color: theme.buttonBackground, fontWeight: "600", fontSize: 12 },
    segmentButtonTextActive: { color: "#fff", fontWeight: "700" },
    chartWrapper: { marginBottom: 20, alignItems: "flex-start" },
    chartTitle: { fontSize: 16, fontWeight: "700", color: theme.text, marginBottom: 8, marginLeft: 4 },
    chartStyle: { borderRadius: 16 },
    modalidadeTitle: { fontSize: 18, fontWeight: "800", color: theme.text, marginBottom: 10, marginTop: 10 },
    videoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.text },
    btnAddVideo: { flexDirection: 'row', backgroundColor: theme.buttonBackground, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
    videoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.cardBackground, padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: theme.cardBorder, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
    videoIconBox: { width: 50, height: 50, borderRadius: 8, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    videoInfo: { flex: 1 },
    videoTitle: { fontWeight: 'bold', color: theme.text, fontSize: 15 },
    videoDate: { color: theme.subtitle, fontSize: 12, marginTop: 2 },
    videoMetrics: { alignItems: 'flex-end', marginRight: 8 },
    metricTag: { fontSize: 11, color: theme.buttonBackground, fontWeight: '700', marginBottom: 2 },
    emptyState: { alignItems: 'center', marginTop: 40, padding: 20 },
    emptyText: { marginTop: 10, color: theme.text, fontWeight: '600', fontSize: 16 }
  });
}