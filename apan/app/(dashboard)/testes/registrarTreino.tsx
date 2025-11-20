import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
  ActivityIndicator,
  Keyboard,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

import DadosAuxiliaresService from '@/services/dadosAuxiliares';

import { ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import AtletaService from '@/services/atleta';
//import RegistroService from '@/services/registro';
import { Colors } from '@/constants/Colors';
import { AtletaResumido, MetricaEntrada, Modalidade, TipoMetrica } from '@/models/atletas';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import ThemedTextInput from '@/components/ThemedTextInput';

type Theme = typeof Colors.light | typeof Colors.dark;
const screenWidth = Dimensions.get('window').width;

export default function RegistrarDados() {
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) throw new Error('RegistrarDados must be used within a ThemeProvider');
  const { theme } = themeContext;
  const styles = createStyles(theme);

  const router = useRouter();

  const [atletas, setAtletas] = useState<AtletaResumido[]>([]);
  const [selectedAtletaId, setSelectedAtletaId] = useState<string | null>(null);
  const [prePos, setPrePos] = useState<'Pré' | 'Pós'>('Pré');
  const [selectedPrePos, setselectedPrePos] = useState<'PRE_TREINO' | 'POS_TREINO'>('PRE_TREINO');


  const [modalidades, setModalidades] = useState<Modalidade[]>([]);
  const [selectedModalidadeId, setSelectedModalidadeId] = useState<string | null>(null);

  const [metricas, setMetricas] = useState<TipoMetrica[]>([]);
  const [metricasEntradas, setMetricasEntradas] = useState<MetricaEntrada[]>([]);


  //const tabs = ['Corrida', 'Salto V', 'Salto H', 'Lançamento'];
  //const [activeTab, setActiveTab] = useState<number>(0);


  const [observacoes, setObservacoes] = useState<string>('');


const [dataHora, setDataHora] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);


  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchAtletas = useCallback(async () => {
      try {
        setLoading(true);
        const data = await AtletaService.getAtletas();
        // Ordena os dados vindos da API
        const sortedData = data.slice().sort((a, b) =>
          a.nomeCompleto.localeCompare(b.nomeCompleto)
        );
        setAtletas(sortedData);
      } catch (error: any) {
        Alert.alert("Erro", "Não foi possível carregar os atletas: " + error.message);
      } finally {
        setLoading(false);
      }
    }, []);

    const fetchModalidades = useCallback(async () => {
      try {
        setLoading(true);
        const data = await DadosAuxiliaresService.getModalidades();
        // Ordena os dados vindos da API
        const sortedData = data.slice().sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );
        setModalidades(sortedData);
      } catch (error: any) {
        Alert.alert("Erro", "Não foi possível carregar os atletas: " + error.message);
      } finally {
        setLoading(false);
      }
    }, []);

  const fetchMetricas = useCallback(
    async (selectedModalidadeId?: string | null) => {
      if (!selectedModalidadeId) {
        setMetricas([]);
        setMetricasEntradas([]);
        return;
      }
      try {
        setLoading(true);
        const data = await DadosAuxiliaresService.getMetricas(selectedModalidadeId);
        console.log('METRICAS: ', data);
        setMetricas(data);

        // cria entradas para todas as métricas retornadas (uma entrada por tipo)
        const entradas: MetricaEntrada[] = data.map((m) => ({
          tipoMetricaId: m.id,
          valor: 0,
        }));
        setMetricasEntradas(entradas);
      } catch (error: any) {
        Alert.alert('Erro', 'Erro ao buscar métricas da modalidade. ' + error.message);
        setMetricas([]);
        setMetricasEntradas([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  
  useEffect(() => {
    (async () => {
      await Promise.all([fetchAtletas(), fetchModalidades()]);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMetricas(selectedModalidadeId);
    }, [selectedModalidadeId,fetchMetricas])
  );



  const validateAndBuildPayload = () => {
    if (!selectedAtletaId) {
      Alert.alert('Selecionar atleta', 'Escolha um atleta.');
      return null;
    }

    if (!selectedModalidadeId) {
      Alert.alert('Selecionar atleta', 'Escolha um atleta.');
      return null;
    }

    const resultados = metricasEntradas
      .filter((e) => e.tipoMetricaId && e.tipoMetricaId !== '')
      .map((e) => ({
        tipoMetricaId: e.tipoMetricaId,
        valor: Number(e.valor),
      }));

    if (!resultados.length) {
      Alert.alert('Preencha métricas', 'Adicione ao menos uma métrica com valor.');
      return null;
    }

    const payload: any = {
      atletaId: selectedAtletaId,
      modalidadeId:selectedModalidadeId,
      tipo: selectedPrePos,
      observacoes: observacoes.trim() || '',
      dataHora: dataHora.toISOString(),
      resultados:resultados //ResultadoMetricaDTO[]
    };

    return payload;
  };

  // DateTime handler
  const onChangeDate = (event: DateTimePickerEvent, selected?: Date) => {
    const { type } = event;
    if (Platform.OS === 'android' || Platform.OS === 'web') setShowDatePicker(false);
    if (type === 'set' && selected) setDataHora(selected)
    else {
            setShowDatePicker(false);
    }
  };

  const handleSalvar = async () => {
    Keyboard.dismiss();
    const payload = validateAndBuildPayload();

    console.log("PAYLOAD:", JSON.stringify(payload, null, 2));


    if (!payload) return;

    try {
      setSaving(true);
      await DadosAuxiliaresService.registrarTreino(payload);
      Alert.alert('Sucesso', 'Registro salvo com sucesso.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (err) {
      console.error('Erro ao salvar registro', err);
      Alert.alert('Erro', 'Não foi possível salvar o registro. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };


  const handleAddMetrica = () => {
    if (!metricas || metricas.length === 0) {
      Alert.alert('Nenhuma métrica', 'Não há métricas disponíveis para esta modalidade.');
      return;
    }

    // Se metricasEntradas estiver vazia — simplesmente popula com todas as métricas
    if (!metricasEntradas || metricasEntradas.length === 0) {
      const entradas = metricas.map((m) => ({ tipoMetricaId: m.id, valor: 0 }));
      setMetricasEntradas(entradas);
      return;
    }

    // Caso contrário, adiciona apenas as métricas que ainda não existem na lista (evita duplicatas)
    const existentes = new Set(metricasEntradas.map((e) => e.tipoMetricaId));
    const aAdicionar = metricas
      .filter((m) => !existentes.has(m.id))
      .map((m) => ({ tipoMetricaId: m.id, valor: 0 }));

    if (aAdicionar.length === 0) {
      Alert.alert('Todas adicionadas', 'Todas as métricas já foram adicionadas.');
      return;
    }

    setMetricasEntradas((prev) => [...prev, ...aAdicionar]);
  };


  const handleRemoveMetrica = (index: number) => {
    setMetricasEntradas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeMetricaTipo = (index: number, tipoMetricaId: string) => {
    setMetricasEntradas((prev) => prev.map((e, i) => (i === index ? { ...e, tipoMetricaId } : e)));
  };

  const handleChangeMetricaValor = (index: number, valorStr: string) => {
    // converte para number quando salvar; aqui mantemos number type because interface asks number
    // Aceitamos entrada como string e parseamos para number no momento do set
    const parsed = valorStr === '' ? 0 : Number(String(valorStr).replace(',', '.'));
    if (Number.isNaN(parsed)) {
      // ignore invalid input
      return;
    }
    setMetricasEntradas((prev) => prev.map((e, i) => (i === index ? { ...e, valor: parsed } : e)));
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Registrar Novo Treino</Text>

      <View style={styles.inputRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Escolher Atleta</Text>
          <View style={[styles.pickerWrapper, styles.pickerCard]}>
            <Picker
              selectedValue={selectedAtletaId}
              onValueChange={(itemValue) => setSelectedAtletaId(itemValue)}
              mode={Platform.OS === 'android' ? 'dropdown' : 'dialog'}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Selecione um atleta..." value={null} />
              {atletas.map((a) => (
                <Picker.Item key={String(a.id)} label={a.nomeCompleto} value={String(a.id)} />
              ))}
            </Picker>
          </View>
        </View>

        {/*PRE POS TREINO*/}
        <View style={{ marginLeft: 12, width: 110 }}>
          <Text style={styles.label}>Pré/Pós</Text>
          <View style={styles.preposWrap}>
            <Pressable
              style={[
                styles.chip,
                prePos === 'Pré' ? { backgroundColor: theme.buttonBackground } : { borderWidth: 1, borderColor: theme.cardBorder },
              ]}
              onPress={() => {setPrePos('Pré'); setselectedPrePos('PRE_TREINO')}}
            >
              <Text style={[styles.chipText, prePos === 'Pré' ? { color: theme.text } : { color: theme.subtitle }]}>Pré</Text>
            </Pressable>
            <Pressable
              style={[
                styles.chip,
                prePos === 'Pós' ? { backgroundColor: theme.buttonBackground } : { borderWidth: 1, borderColor: theme.cardBorder },
              ]}
              onPress={() => {setPrePos('Pós'); setselectedPrePos('POS_TREINO')}}
            >
              <Text style={[styles.chipText, prePos === 'Pós' ? { color: theme.text } : { color: theme.subtitle }]}>Pós</Text>
            </Pressable>
          </View>
            </View>
        </View>
              
       {/*MODALIDADE PICKER */}
        <View style={styles.inputRow}>
            <View style={{ flex: 1 }}>
            <Text style={styles.label}>Escolher Modalidade</Text>
            <View style={[styles.pickerWrapper, styles.pickerCard]}>
                <Picker
                selectedValue={selectedModalidadeId}
                onValueChange={(itemValue) => setSelectedModalidadeId(itemValue)}
                mode={Platform.OS === 'android' ? 'dropdown' : 'dialog'}
                style={styles.picker}
                itemStyle={styles.pickerItem}
                >
                <Picker.Item label="Selecione a modalidade..." value={null} />
                {modalidades.map((a) => (
                    <Picker.Item key={String(a.id)} label={a.nome} value={String(a.id)} />
                ))}
                </Picker>
            </View>
            </View>
        </View>

        {/* Date/Hora */}
      <View style={{ width: '100%', marginBottom: 12 }}>
        <Text style={styles.label}>Data / Hora</Text>
        <Pressable style={[styles.dateButton]} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: theme.text }}>{dataHora.toLocaleString()}</Text>
        </Pressable>
        {showDatePicker && (
            <DateTimePicker
                          value={dataHora || new Date()}
                          mode="date"
                          display={Platform.OS === "ios" ? "spinner" : "calendar"}
                          maximumDate={new Date()} 
                          onChange={onChangeDate}
            />
        )}
      </View>

      {/*Observações*/}
      <View style={{ width: '100%', marginBottom: 12 }}>
        <Text style={styles.label}>Observações</Text>
        <ThemedTextInput style={styles.picker}
          placeholder="Observações adicionais..."
          value={observacoes}
          onChangeText={setObservacoes}
          placeholderTextColor={theme.subtitle}/>
      </View>


      {/* Tabs 
      <View style={styles.tabs}>
        {tabs.map((t, i) => (
          <Pressable
            key={t}
            style={[styles.tab, activeTab === i ? { borderBottomColor: theme.buttonBackground, borderBottomWidth: 2 } : undefined]}
            onPress={() => setActiveTab(i)}
          >
            <Text style={[styles.tabText, activeTab === i ? { color: theme.text, fontWeight: '700' } : { color: theme.subtitle }]}>{t}</Text>
          </Pressable>
        ))}
      </View>*/}

{/*MÉTRICAS*/}
    <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.inputLabel}>Métricas</Text>
          <Pressable style={styles.addButton} onPress={handleAddMetrica}>
            <Text style={{ color: theme.text, fontWeight: '700' }}>+ Adicionar métrica</Text>
          </Pressable>
        </View>

        {!selectedModalidadeId ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text style={{ color: theme.subtitle }}>Escolha a modalidade para ver as métricas disponíveis.</Text>
          </View>
        ) : metricas.length === 0 ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <Text style={{ color: theme.subtitle }}>Nenhuma métrica configurada para esta modalidade.</Text>
          </View>
        ) : (
          <View style={styles.metricsScrollWrap}> 
            <ScrollView nestedScrollEnabled contentContainerStyle={{ paddingBottom: 8 }}>
              {metricasEntradas.map((entry, idx) => (
                <View key={idx} style={styles.metricRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.labelSmall}>Tipo</Text>
                    <View style={[styles.pickerWrapperSmall, styles.pickerCard]}>
                      <Picker 
                        selectedValue={entry.tipoMetricaId}
                        onValueChange={(v) => handleChangeMetricaTipo(idx, v)}
                        mode={Platform.OS === 'android' ? 'dropdown' : 'dialog'}
                        style={styles.pickerSmall}
                      >
                        <Picker.Item label="Selecione..." value={''} /> 
                        {metricas.map((tm) => (
                          <Picker.Item key={String(tm.id)} label={`${tm.nome} (${tm.unidadeMedida})`} value={String(tm.id)} />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  <View style={{ width: 110, marginLeft: 10 }}>
                    <Text style={styles.labelSmall}>Valor</Text>
                    <TextInput
                      style={styles.metricInput}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={theme.subtitle}
                      value={String(entry.valor)}
                      onChangeText={(text) => handleChangeMetricaValor(idx, text)}
                    />
                  </View>

                  <Pressable style={styles.removeButton} onPress={() => handleRemoveMetrica(idx)}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>🗑</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 8 }} />

        <Pressable style={styles.importButton} onPress={()=>{Alert.alert("Ainda não....")}}> 
          <Text style={styles.importButtonText}>Importar do My Jump Lab</Text>
        </Pressable>

        <Pressable style={styles.saveButton} onPress={handleSalvar} disabled={saving}>
          {saving ? <ActivityIndicator color={theme.text} /> : <Text style={styles.saveButtonText}>Salvar Registro</Text>}
        </Pressable>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function createStyles(theme: Theme) {
  const cardBg = theme.cardBackground;
  const border = theme.cardBorder;
  const muted = theme.subtitle;
  const primary = theme.buttonBackground;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
     pickerSmall: {
      //height: 40,
      width: '100%',
      color: theme.text,
    }, labelSmall: {
      fontSize: 11,
      color: muted,
      marginBottom: 4,
    }, pickerWrapperSmall: {
      borderRadius: 8,
      borderWidth: 1,
      overflow: 'hidden',
      height: 40,
      justifyContent: 'center',
    },
    content: {
      paddingTop: 18,
      paddingHorizontal: 18,
      paddingBottom: 40,
      alignItems: 'center',
    },
    textarea: {
      minHeight: 60,
      textAlignVertical: 'top',
    },
    addButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: '#00000006',
    },
    title: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.text,
      marginBottom: 12,
    },
    inputRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-start',
      color:theme.text,
      marginBottom: 12,
    },
    label: {
      fontSize: 12,
      color: muted,
      marginBottom: 6,
    },
    pickerWrapper: {
      borderRadius: 8,
      borderWidth: 1,
      overflow: 'hidden',
      height: 44,
      justifyContent: 'center',
    },
    dateButton: {
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    pickerCard: {
      backgroundColor: cardBg,
      borderColor: border,
    },
    picker: {
      width: '100%',
      color: theme.text,
    },
    pickerItem: {
      height: 44,
    },
    preposWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginLeft: 8,
    },
    chipText: {
      fontWeight: '700',
      fontSize: 13,
    },
    tabs: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 12,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
    },
    tabText: {
      fontSize: 13,
    },
    card: {
      width: '100%',
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 10,
      padding: 14,
      shadowColor: theme.cardShadow,
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 1,
    },
    inputLabel: {
      fontSize: 12,
      color: "grey",
      marginBottom: 6,
      marginTop: 8,
      fontWeight: '600',
    },
    input: {
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 6,
      paddingVertical: 10,
      paddingHorizontal: 12,
      color: "grey",

      backgroundColor: 'transparent',
    },
    
    importButton: {
      marginTop: 12,
      backgroundColor: theme.buttonBackground ?? '#33333311',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    importButtonText: {
      color: theme.text,
      fontWeight: '700',
    },
    saveButton: {
      marginTop: 12,
      backgroundColor: primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    saveButtonText: {
      color: theme.text,
      fontWeight: '800',
    },
    metricsScrollWrap: {
      maxHeight: 260,
      marginTop: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 8,
      padding: 8,
      backgroundColor: 'transparent',
    },
    metricRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    metricInput: {
      borderWidth: 1,
      borderColor: border,
      borderRadius: 6,
      paddingVertical: 8,
      paddingHorizontal: 8,
      color: theme.text,
      backgroundColor: 'transparent',
    },
    removeButton: {
      marginLeft: 8,
      backgroundColor: '#d9534f',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    smallChip: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
    },

  });
}
