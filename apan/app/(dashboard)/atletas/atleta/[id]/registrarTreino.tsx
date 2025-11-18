import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Alert,ScrollView, TouchableWithoutFeedback, Keyboard,
  Platform, // 1. Importado para o loading
} from "react-native";
// 2. Imports de Contexto, Tipos e Serviços (nosso padrão)
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import AtletaService from "@/services/atleta";
import { AtletaDetalhado, Modalidade, RegistroAvaliacaoCompleto } from "@/models/atletas";
// import { Link } from "expo-router"; // (Não usado no seu original)
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

import {useRouter, useLocalSearchParams } from "expo-router";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";

import DadosAuxiliaresService from "@/services/dadosAuxiliares";
import { Picker } from "@react-native-picker/picker";

type Theme = typeof Colors.light | typeof Colors.dark;
const screenWidth = Dimensions.get("window").width;

export default function RegistrarTreinoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
 
    const themeContext = useContext<ThemeContextType | null>(ThemeContext);
      if (!themeContext) {
        throw new Error('DesempenhoScreen must be used within a ThemeProvider');
      }
    const { theme } = themeContext;

    const router = useRouter();
    const styles = createStyles(theme);

    const [prePos, setPrePos] = useState("Pós");
    
    //const [avaliacoes, setAvaliacoes] = useState<RegistroAvaliacaoCompleto[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [atleta, setAtleta] = useState<AtletaDetalhado | null>(null);

    const [modalidades, setModalidades] = useState<Modalidade[]>([]);
    const [modalidadesLoading, setModalidadesLoading] = useState(false);
    const [selectedModalidadeId, setSelectedModalidadeId] = useState<string | null>(null);

    const fetchAtleta = async () => {
            try {
              setLoading(true);
              // Busca os dados básicos do atleta
              const atletaData = await AtletaService.getAtletaById(id);
              setAtleta(atletaData);
            } catch (err) {
              console.error('Erro ao carregar dados do perfil', err);
              Alert.alert("Erro", "Não foi possível carregar os dados do atleta.");
            } finally {
              setLoading(false);
            }
    };

    const fetchModalidades = async () => {
        try {
          setLoading(true);
          // Busca as modalidades do atleta
          // Supondo que exista um método no AtletaService para isso
          const modalidadesData = await DadosAuxiliaresService.getModalidades();
          setModalidades(modalidadesData);
        } catch (err:any) {
          console.error('Erro ao carregar modalidades', err);
          Alert.alert("Erro", "Não foi possível carregar as modalidades. ERRO:",err.message);
        } finally {
          setLoading(false);
        }
    }
 
    useEffect(() => {
        fetchModalidades();
        if (id) {
          fetchAtleta();
        }
    }, [id]);
    
    const listaModalidades = modalidades.map((m) => (
      <Picker.Item
        key={String(m.id)}
        label={`${m.nome} (${m.categoria ?? ""})`}
        value={m.id}
      />
    ));
    
    //const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView 
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                    keyboardShouldPersistTaps="handled"
                  >


                  
                  
            
            
            <ThemedTextInput
                value={atleta?.nomeCompleto  || ''}
            />

<View style={styles.input}>
          <ThemedText style={{ marginBottom: 8 }}>Modalidade</ThemedText>
          {modalidadesLoading ? (
            <View style={{ paddingVertical: 12, alignItems: "center" }}>
              <ActivityIndicator size="small" color={theme.text} />
            </View>
        ) : (
          <View style={[styles.pickerWrapper, {backgroundColor: theme.cardBackground}]}>
                <Picker
                    selectedValue={selectedModalidadeId}
                    onValueChange={(itemValue) => setSelectedModalidadeId(itemValue)}
                    mode={Platform.OS === "android" ? "dropdown" : "dialog"} 
                    style={styles.picker} // aplica altura fixa
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label="Selecionar Modalidade" style={{color: theme.text}} value={null} />
                        {listaModalidades}
       
                </Picker>
                </View>
            )}
            </View>    
            

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

    
            
            
        </View>
</ScrollView>
         </TouchableWithoutFeedback>

    )


    
}

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
    input: {
      width: '100%',
      marginBottom: 20,
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
    },pickerWrapper:{
      borderRadius: 8,
      borderWidth: 1,
      overflow: "hidden",
      // largura controlada pelo seu layout (usa width: '100%')
      // altura fixa para evitar "esticar" a tela
      height: 44,            // <--- reduz a altura do componente
      justifyContent: "center",
    },
    picker: {
      height: 44,            // <--- define altura interna do Picker
      width: "100%",
      color: theme.text,
    },
    pickerItem: {
      height: 44,            // iOS: altura dos itens (opcional)
    },
  });
}