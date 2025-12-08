// (dashboard)/atletas/atleta/[id]/treino/analise/dashboard.tsx
import React, { useContext, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { ThemeContext } from '@/context/ThemeContext';
import Spacer from '@/components/Spacer';
import ThemedButton from '@/components/ThemedButton';
import { AnalysisResult } from '@/models/analysis'; 
import DadosAuxiliaresService from '@/services/dadosAuxiliares'; 
import { ThemedText } from '@/components/themed-text';

const screenWidth = Dimensions.get("window").width;

export default function VideoDashboardScreen() {
  const { resultData, videoUrl, atletaId, readOnly } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext)!;
  const styles = createStyles(theme);
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);

  const data: AnalysisResult | null = useMemo(() => {
    try { 
        return typeof resultData === 'string' ? JSON.parse(resultData) : null; 
        
    } catch { return null; }
  }, [resultData]);
  console.log(resultData)
  

  const handleAutoSave = async () => {
    if (!data || !atletaId) {
        Alert.alert("Erro", "Faltam dados para salvar.");
        return;
    }

    setIsSaving(true);

    try {
        // 1. Buscar Modalidade "Salto"
        const modalidades = await DadosAuxiliaresService.getModalidades();
        const modalidadeAlvo = modalidades.find((m: any) => 
            m.nome.toLowerCase().includes('distância') || 
            m.nome.toLowerCase().includes('distancia') ||
            m.nome.toLowerCase().includes('salto')
        );

        if (!modalidadeAlvo) throw new Error("Modalidade 'Salto' não encontrada.");

        // 2. Buscar e Mapear Métricas (SQL)
        const metricasDisponiveis = await DadosAuxiliaresService.getMetricas(modalidadeAlvo.id);
        
        const aiValues = {
            speed: data.speed?.velocity_max_m_s || 0,
            jump: data.jump?.has_jump ? data.jump.jump_height_m : 0,
            cadence: data.stride?.stride_cadence_hz || 0,
            distance: data.speed?.distance_m || 0
        };

        const resultadosParaSalvar = [];

        for (const metrica of metricasDisponiveis) {
            const nome = metrica.nome.toLowerCase();
            let valor = 0;

            if (nome.includes('velocidade') || nome.includes('max')) {
                valor = Number(aiValues.speed.toFixed(2));
            } 
            else if (nome.includes('salto') || nome.includes('altura')) {
                if (metrica.unidadeMedida.toLowerCase().includes('cm')) {
                    valor = Number((aiValues.jump * 100).toFixed(1));
                } else {
                    valor = Number(aiValues.jump.toFixed(3));
                }
            }
            else if (nome.includes('cadência')) valor = Number(aiValues.cadence.toFixed(2));
            else if (nome.includes('distância')) valor = Number(aiValues.distance.toFixed(2));

            if (valor > 0) {
                resultadosParaSalvar.push({ tipoMetricaId: metrica.id, valor });
            }
        }

        // ============================================================
        // 3. O "PULO DO GATO": CRIAR VERSÃO LEVE DO JSON
        // ============================================================
        
        // Clona o objeto para não estragar a tela atual
        const dataLite = JSON.parse(JSON.stringify(data));

        // Removemos o peso pesado (Esqueleto e BBox quadro a quadro)
        if (dataLite.series) {
            delete dataLite.series.skeleton; // O maior vilão
            delete dataLite.series.bbox;     // Segundo maior vilão
            
            // Se quiser economizar MUITO mais, remova coordenadas X/Y brutas
            // pois o gráfico só usa 'speed_m_s' e 'jump_speed_m_s'
            const keysToRemove = Object.keys(dataLite.series).filter(key => 
                key.includes('_x') || key.includes('_y') || key.includes('raw')
            );
            keysToRemove.forEach(k => delete dataLite.series[k]);
        }

        // Agora o JSON deve ter poucos KBs em vez de MBs
        let obsText = `Análise Automática IA.\n`;
        if (videoUrl) obsText += `Vídeo: ${videoUrl}\n`;
        obsText += `\n[RAW_JSON_START]\n${JSON.stringify(dataLite)}\n[RAW_JSON_END]`;

        const payload = {
            atletaId: String(atletaId),
            modalidadeId: modalidadeAlvo.id,
            tipo: "POS_TREINO",
            observacoes: obsText,
            dataHora: new Date().toISOString(),
            resultados: resultadosParaSalvar
        };

        // 4. Enviar
        await DadosAuxiliaresService.registrarTreino(payload);

        Alert.alert("Sucesso", "Salvo no histórico!", [
            { text: "OK", onPress: () => router.push("/(dashboard)/atletas") }
        ]);

    } catch (error: any) {
        console.error("Erro salvar:", error);
        // Se ainda der 413, avisa que foi o tamanho
        const msg = error.message?.includes('413') ? "Arquivo muito grande." : error.message;
        Alert.alert("Erro", msg || "Falha ao salvar.");
    } finally {
        setIsSaving(false);
    }
  };

  if (!data) return (
    <View style={styles.container}>
        <Text style={{color: theme.text, textAlign: 'center', marginTop: 50}}>Carregando...</Text>
    </View>
  );

  // Mantém a lógica de gráficos igual...
  const runSeries = data.series?.speed_m_s || [];
  const chartPoints = runSeries.filter((_, i) => i % 4 === 0);
  const chartLabels = chartPoints.map((_, i) => i % 10 === 0 ? ((i * 4) / data.fps).toFixed(1) + 's' : '');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Spacer />
      <Text style={styles.title}>Análise Concluída</Text>
      <Text style={styles.subtitle}>Resultados da IA</Text>
      
      <View style={styles.kpiContainer}>
        <KPICard label="Vel. Máxima" value={data.speed?.velocity_max_m_s?.toFixed(2) ?? "0.00"} unit="m/s" theme={theme} />
        <KPICard label="Salto" value={data.jump?.has_jump ? (data.jump.jump_height_m * 100).toFixed(1) : '--'} unit="cm" theme={theme} highlight />
        <KPICard label="Cadência" value={data.stride?.stride_cadence_hz?.toFixed(1) ?? '--'} unit="Hz" theme={theme} />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Curva de Velocidade</Text>
        {chartPoints.length > 0 ? (
            <LineChart
                data={{ labels: chartLabels, datasets: [{ data: chartPoints }] }}
                width={screenWidth - 48} height={220}
                yAxisSuffix="m/s" yAxisInterval={1}
                chartConfig={{
                    backgroundColor: theme.cardBackground,
                    backgroundGradientFrom: theme.cardBackground,
                    backgroundGradientTo: theme.cardBackground,
                    decimalPlaces: 1,
                    color: (opacity = 1) => theme.buttonBackground,
                    labelColor: (opacity = 1) => theme.subtitle,
                    style: { borderRadius: 16 },
                    propsForDots: { r: "0" } 
                }}
                bezier style={{ borderRadius: 16 }}
            />
        ) : <Text style={{textAlign:'center', margin:20, color:theme.subtitle}}>Sem dados</Text>}
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Detalhes</Text>
        <Row label="Distância" value={`${data.speed?.distance_m?.toFixed(2)} m`} theme={theme} />
        <Row label="Passos" value={data.stride?.stride_count?.toString()} theme={theme} />
        {data.jump?.has_jump && (
             <>
                <View style={styles.divider} />
                <Row label="Voo" value={`${data.jump.jump_duration_s.toFixed(2)} s`} theme={theme} />
             </>
        )}
      </View>

      <Spacer height={20} />
      
      {/* Botão condicional */}
      {readOnly !== 'true' && (
        <>
            <ThemedButton 
                style={styles.quickStartButton}
                onPress={handleAutoSave} 
                disabled={isSaving} 
            >
                <ThemedText style={styles.quickStartButtonText}>{isSaving ? "Salvando..." : "Salvar no Histórico"} </ThemedText>
                </ThemedButton> 
            {isSaving && <ActivityIndicator style={{marginTop: 10}} color={theme.text} />}
        </>
      )}
      
      <Spacer height={40} />
    </ScrollView>
  );
}

// Componentes Auxiliares (KPICard, Row, createStyles) permanecem os mesmos do seu código original...
const KPICard = ({ label, value, unit, theme, highlight }: any) => (
    <View style={[createStyles(theme).kpiCard, highlight && { borderColor: theme.buttonBackground, borderWidth: 1.5 }]}>
        <Text style={createStyles(theme).kpiLabel}>{label}</Text>
        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
            <Text style={[createStyles(theme).kpiValue, highlight && { color: theme.buttonBackground }]}>{value}</Text>
            <Text style={createStyles(theme).kpiUnit}>{unit}</Text>
        </View>
    </View>
);

const Row = ({ label, value, theme }: any) => (
    <View style={createStyles(theme).row}>
        <Text style={createStyles(theme).rowLabel}>{label}</Text>
        <Text style={createStyles(theme).rowValue}>{value}</Text>
    </View>
);

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  button: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: theme.cardBackground },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: theme.text },
  subtitle: { fontSize: 14, color: theme.subtitle, marginBottom: 20 },
  kpiContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  kpiCard: { width: '31%', backgroundColor: theme.cardBackground, padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.cardBorder, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  kpiLabel: { fontSize: 11, color: theme.subtitle, marginBottom: 4, textAlign: 'center' },
  kpiValue: { fontSize: 20, fontWeight: 'bold', color: theme.text },
  kpiUnit: { fontSize: 12, color: theme.subtitle, marginLeft: 2 },
  chartCard: { backgroundColor: theme.cardBackground, borderRadius: 16, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: theme.cardBorder },
  chartTitle: { fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 16, marginLeft: 8 },
  detailsCard: { backgroundColor: theme.cardBackground, borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: theme.cardBorder },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  rowLabel: { color: theme.subtitle, fontSize: 14 },
  rowValue: { color: theme.text, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: theme.cardBorder, marginVertical: 8 },


  quickStartButton: {
    backgroundColor: theme.buttonBackground,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: 18,
    marginBottom: 10,
  },
  quickStartButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: 'bold',
  },

});