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
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'; 

import { ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import AtletaService from '@/services/atleta';
import { Colors } from '@/constants/Colors';
import { AtletaResumido } from '@/models/atletas';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Spacer from '@/components/Spacer';

type Theme = typeof Colors.light | typeof Colors.dark;

export default function RegistrarDados() {
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) throw new Error('RegistrarDados must be used within a ThemeProvider');
  const { theme } = themeContext;
  const styles = createStyles(theme);

  const router = useRouter();
  
  // Mantemos os params para não quebrar, mas não usamos mais aqui para preenchimento manual
  const params = useLocalSearchParams();
  const { atletaId } = params;

  const [atletas, setAtletas] = useState<AtletaResumido[]>([]);
  const [selectedAtletaId, setSelectedAtletaId] = useState<string | null>(null);
  const [prePos, setPrePos] = useState<'Pré' | 'Pós'>('Pré');
  // Mantemos o estado, mas ele não será enviado daqui
  const [selectedPrePos, setselectedPrePos] = useState<'PRE_TREINO' | 'POS_TREINO'>('PRE_TREINO');

  const [dataHora, setDataHora] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);

  // Carrega apenas os atletas agora
  const fetchAtletas = useCallback(async () => {
      try {
        setLoading(true);
        const data = await AtletaService.getAtletas();
        console.log("Pegando atletas pro treino...")
        const sortedData = data.slice().sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));
        setAtletas(sortedData);
      } catch (error: any) {
        Alert.alert("Erro", "Não foi possível carregar os atletas: " + error.message);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    (async () => {
      await fetchAtletas();
      if (atletaId) {
        setSelectedAtletaId(String(atletaId));
      }
    })();
  }, []);

  const onChangeDate = (event: DateTimePickerEvent, selected?: Date) => {
    const { type } = event;
    if (Platform.OS === 'android' || Platform.OS === 'web') setShowDatePicker(false);
    if (type === 'set' && selected) setDataHora(selected)
    else {
            setShowDatePicker(false);
    }
  };

  // === AÇÃO DO BOTÃO "IMPORTAR VIA IA" ===
  const handleImportIA = () => {
    if (!selectedAtletaId) {
        Alert.alert("Atenção", "Selecione um atleta primeiro.");
        return;
    }
    // Navega para a seleção de vídeo, passando o ID do atleta para manter o contexto
    router.push({
        pathname: "/(dashboard)/atletas/atleta/[id]/treino/analise",
        params: { atletaId: selectedAtletaId }
    });
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
      <Spacer/>
      <Text style={styles.title}>Nova Análise de Vídeo</Text>

      {/* 1. ESCOLHER ATLETA E TIPO */}
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

        <View style={{ marginLeft: 12, width: 110 }}>
          <Text style={styles.label}>Momento</Text>
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

      {/* 2. DATA E HORA */}
      <View style={{ width: '100%', marginBottom: 24 }}>
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

      <View style={{width: '100%', height: 1, backgroundColor: theme.cardBorder, marginBottom: 24}} />

      {/* 3. BOTÃO DE AÇÃO PRINCIPAL (IA) */}
      <Pressable 
        style={[styles.importButton, {backgroundColor: theme.buttonBackground, flexDirection: 'row', justifyContent: 'center', gap: 8}]} 
        onPress={handleImportIA}
      > 
        <Ionicons name="videocam" size={24} color="#fff" />
        <Text style={styles.importButtonText}>Gravar ou Selecionar Vídeo</Text>
      </Pressable>

      <Text style={{textAlign: 'center', color: theme.subtitle, marginTop: 12, fontSize: 12}}>
        A análise biomêcanica será feita automaticamente pela IA.
      </Text>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function createStyles(theme: Theme) {
  const cardBg = theme.cardBackground;
  const border = theme.cardBorder;
  const muted = theme.subtitle;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingTop: 18,
      paddingHorizontal: 18,
      paddingBottom: 40,
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.text,
      marginBottom: 20,
      alignSelf: 'flex-start'
    },
    inputRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-start',
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
      paddingVertical: 12, // Aumentei um pouco para ficar mais clicável
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
    importButton: {
      width: '100%',
      marginTop: 12,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: theme.cardShadow,
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4
    },
    importButtonText: {
      color: "#fff",
      fontWeight: '700',
      fontSize: 16
    },
  });
}