import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { ThemeContext } from '@/context/ThemeContext';
import Spacer from '@/components/Spacer';
import ThemedButton from '@/components/ThemedButton';
import { AnalysisResult } from '@/models/analysis'; 

const screenWidth = Dimensions.get("window").width;

export default function VideoDashboardScreen() {
  const { resultData } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext)!;
  
  // CORREÇÃO: A função lá embaixo agora se chama createStyles
  const styles = createStyles(theme);
  
  const router = useRouter();

  // Parse seguro do JSON
  const data: AnalysisResult | null = useMemo(() => {
    try { 
        return typeof resultData === 'string' ? JSON.parse(resultData) : null; 
    } catch { return null; }
  }, [resultData]);

  if (!data) return (
    <View style={styles.container}>
        <Text style={{color: theme.text, textAlign: 'center', marginTop: 50}}>
            Aguardando dados... ou erro ao carregar.
        </Text>
    </View>
  );

  // === Preparação Gráfica ===
  const runSeries = data.series?.speed_m_s || [];
  const jumpSeries = data.series?.jump_speed_m_s || [];
  
  const combinedSeries = runSeries.map((val, i) => {
    const jumpVal = jumpSeries[i] || 0;
    return jumpVal > 0 ? jumpVal : val;
  });

  const SAMPLE_RATE = 4; 
  const chartPoints = combinedSeries.filter((_, i) => i % SAMPLE_RATE === 0);
  const chartLabels = chartPoints.map((_, i) => {
      if (i % 10 === 0) {
          const frameIndex = i * SAMPLE_RATE;
          return (frameIndex / data.fps).toFixed(1) + 's';
      }
      return '';
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Spacer />
      <Text style={styles.title}>Análise Concluída</Text>
      <Text style={styles.subtitle}>Processamento via Computer Vision (RunPod)</Text>
      
      {/* 1. KPIs Principais */}
      <View style={styles.kpiContainer}>
        <KPICard 
            label="Vel. Máxima" 
            value={data.speed?.velocity_max_m_s?.toFixed(2) ?? "0.00"} 
            unit="m/s" 
            theme={theme} 
        />
        <KPICard 
            label="Salto" 
            value={data.jump?.has_jump && data.jump?.jump_height_m ? (data.jump.jump_height_m * 100).toFixed(1) : '--'} 
            unit="cm" 
            theme={theme} 
            highlight
        />
        <KPICard 
            label="Cadência" 
            value={data.stride?.stride_cadence_hz ? data.stride.stride_cadence_hz.toFixed(1) : '--'} 
            unit="Hz" 
            theme={theme} 
        />
      </View>

      {/* 2. Gráfico de Velocidade */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Curva de Velocidade</Text>
        {chartPoints.length > 0 ? (
            <LineChart
                data={{
                    labels: chartLabels,
                    datasets: [{ data: chartPoints }]
                }}
                width={screenWidth - 48} 
                height={220}
                yAxisSuffix="m/s"
                yAxisInterval={1}
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
                bezier
                style={{ borderRadius: 16 }}
            />
        ) : (
            <Text style={{color: theme.subtitle, textAlign: 'center', margin: 20}}>Dados insuficientes para gráfico</Text>
        )}
      </View>

      {/* 3. Detalhes Biomecânicos */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Detalhes da Execução</Text>
        
        <Row label="Distância Total Percorrida" value={`${data.speed?.distance_m?.toFixed(2) ?? 0} m`} theme={theme} />
        <Row label="Total de Passos" value={data.stride?.stride_count?.toString() ?? "0"} theme={theme} />
        <Row label="Comprimento Médio Passada" value={data.stride?.stride_length_mean_m ? `${data.stride.stride_length_mean_m.toFixed(2)} m` : '--'} theme={theme} />
        
        {data.jump?.has_jump && (
            <>
                <View style={styles.divider} />
                <Text style={[styles.sectionTitle, {fontSize: 14, marginTop: 10}]}>Fase de Voo</Text>
                <Row label="Tempo de Voo" value={`${data.jump.jump_duration_s.toFixed(2)} s`} theme={theme} />
                <Row label="Distância Salto (Horiz.)" value={`${data.jump.jump_distance_m.toFixed(2)} m`} theme={theme} />
            </>
        )}
      </View>

      <Spacer height={20} />
      <ThemedButton 
        title="Salvar Treino" 
        onPress={() => {
            Alert.alert("Sucesso", "Dados salvos no histórico do atleta.");
            router.dismissAll();
        }} 
      />
      <Spacer height={40} />
    </ScrollView>
  );
}

// Componentes UI Reutilizáveis
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

// CORREÇÃO: Nome alterado de 'styles' para 'createStyles' para bater com a chamada lá em cima
const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: theme.text },
  subtitle: { fontSize: 14, color: theme.subtitle, marginBottom: 20 },

  kpiContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  kpiCard: { 
    width: '31%', backgroundColor: theme.cardBackground, padding: 12, borderRadius: 12, 
    alignItems: 'center', borderWidth: 1, borderColor: theme.cardBorder,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  kpiLabel: { fontSize: 11, color: theme.subtitle, marginBottom: 4, textAlign: 'center' },
  kpiValue: { fontSize: 20, fontWeight: 'bold', color: theme.text },
  kpiUnit: { fontSize: 12, color: theme.subtitle, marginLeft: 2 },

  chartCard: {
    backgroundColor: theme.cardBackground, borderRadius: 16, padding: 12, marginBottom: 20,
    borderWidth: 1, borderColor: theme.cardBorder
  },
  chartTitle: { fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 16, marginLeft: 8 },

  detailsCard: {
    backgroundColor: theme.cardBackground, borderRadius: 16, padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: theme.cardBorder
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  rowLabel: { color: theme.subtitle, fontSize: 14 },
  rowValue: { color: theme.text, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: theme.cardBorder, marginVertical: 8 },
});