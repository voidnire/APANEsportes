// (Arquivo: dashboard/atletas/registrarDados.tsx)
import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback, Platform, View
} from "react-native";
import { useRouter } from "expo-router";

// 1. AJUSTE: Imports corretos
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import AtletaService, { EditAtletaDto } from "@/services/atleta";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";

import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from 'expo-router';
import { AtletaDetalhado } from "@/models/atletas";


type Theme = typeof Colors.light | typeof Colors.dark;

export default function EditarAtleta() {
  // 2. AJUSTE: Consumo correto do contexto
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('EditarAtleta must be used within a ThemeProvider');
  }
  const { theme } = themeContext;
  const styles = createStyles(theme);
  const router = useRouter();

  // 3. AJUSTE: States para o formulário
  const [atleta, setAtleta] = useState<AtletaDetalhado | null>(null);

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [nomeCompletoEditado, setnomeCompletoEditado] = useState("");
  const [dataNascimentoEditada, setDataNascimentoEditada] = useState("");

  const [loading, setLoading] = useState(false);

  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);


  const { id } = useLocalSearchParams() as { id: string }; 

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          // Busca os dados básicos do atleta
          const atletaData = await AtletaService.getAtletaById(id);
          setAtleta(atletaData);
          setNomeCompleto(atletaData.nomeCompleto);
          setDataNascimento(atletaData.dataNascimento);
        } catch (err) {
          console.error('Erro ao carregar dados do perfil', err);
          Alert.alert("Erro", "Não foi possível carregar os dados do atleta.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  


  const onChangeData = useCallback((event: DateTimePickerEvent, date?: Date) => {
    const { type } = event;

    // Fecha o picker no Android e Web após qualquer ação (cancelar ou selecionar)
    if (Platform.OS === 'android' || Platform.OS === 'web') {
        setMostrarPicker(false);
    }
    
    // O tipo 'set' indica que o usuário clicou em OK/Confirmar (Android/Web) ou rolou no iOS 
    // Para iOS no modo 'spinner', 'set' ocorre a cada mudança de rolagem.
    if (type === 'set') {
        if (date !== undefined) {
            // Guarda o objeto Date selecionado
            
            setSelectedDate(date); 
            console.log("DATA SELECIONADA:", date)
            // Atualiza o estado que será enviado para a API (YYYY-MM-DD)
            setDataNascimentoEditada(date.toISOString().split('T')[0]); 
            console.log("DATANASCIMENTO EDIT:", dataNascimentoEditada)
        }
    } else {
        // Se o tipo for 'dismissed' (Cancelado no Android/Web), ou se for iOS e o tipo não for 'set'
        // Apenas fecha o picker. O estado de dataNascimento não é alterado.
      
            setMostrarPicker(false);
        
    }
  }, []); // Dependências vazias, pois usa o useCallback

  const validar = () => {
    if (!nomeCompleto.trim()) {
      Alert.alert("Erro", "Informe o nome completo do atleta.");
      return false;
    }
    // (Validação de data YYYY-MM-DD pode ser adicionada aqui)
    return true;
  };

  const formatarData = (data?: Date) => {
    if (!data) return "";
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };




  // 4. AJUSTE: 'handleSalvar' agora chama a API
  const handleSalvar = async () => {
    if (!validar() || loading) return;

    if (!id) {
        Alert.alert("Erro", "ID do atleta não encontrado.");
        return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const dto: EditAtletaDto = {
        nomeCompleto: nomeCompletoEditado? nomeCompletoEditado.trim() : nomeCompleto.trim(),
        dataNascimento: dataNascimentoEditada ? dataNascimentoEditada.trim() :  dataNascimento.trim(), // Já está no formato YYYY-MM-DD
      };
      // Chama o serviço com os dados do DTO
      await AtletaService.editAtleta(id, dto);

      Alert.alert("Sucesso", "Atleta editado.", [
        {
          text: "OK",
          onPress: () => router.back(), // Volta para a lista
        },
      ]);

    } catch (err: any) {
      console.error("Erro ao salvar atleta:", err);
      const message = err.response?.data?.message || err.message || "Não foi possível salvar o atleta.";
      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
    }
  };



  return (
    // 5. AJUSTE: UI reescrita com componentes temáticos
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText title={true} style={styles.title}>
          Editar atleta
        </ThemedText>

        <ThemedTextInput
          value={nomeCompletoEditado ? nomeCompletoEditado : nomeCompleto}
          onChangeText={setNomeCompleto}
          placeholder="Nome completo"
          style={styles.input}
          autoCapitalize="words"
        />

      

      <View style={styles.input}>
          <ThemedButton style={styles.dateButton} onPress={() => setMostrarPicker(true)}>
            <ThemedText>
              {dataNascimentoEditada ? new Date(dataNascimentoEditada).toLocaleDateString('pt-BR') : new Date(dataNascimento).toLocaleDateString('pt-BR')}
            </ThemedText>
          </ThemedButton>

          {mostrarPicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "calendar"}
              maximumDate={new Date()} // impede datas futuras
              onChange={onChangeData}
            />
          )}
      </View>





        <ThemedButton 
          onPress={handleSalvar} 
          disabled={loading}
          style={styles.button}
        >
          <ThemedText>
            {loading ? "Salvando..." : "Salvar"}
          </ThemedText>
        </ThemedButton>

        <ThemedButton 
          onPress={() => router.back()} 
          style={[styles.button, styles.cancelButton]}
          disabled={loading}
        >
          <ThemedText style={styles.cancelButtonText}>
            Cancelar
          </ThemedText>
        </ThemedButton>

      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

// 6. AJUSTE: Estilos alinhados com 'login.tsx'
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      flexGrow: 1,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      marginBottom: 30,
      textAlign: 'center',
    },
    input: {
      width: '100%',
      marginBottom: 20,
    },
    button: {
      width: '100%',
    },
    cancelButton: {
      backgroundColor: theme.cardBackground, // Fundo diferente
      borderColor: theme.cardBorder,
      borderWidth: 1,
    },
    cancelButtonText: {
      color: theme.subtitle, // Cor de texto diferente
    },
    dateButton:{
      backgroundColor: theme.cardBackground,
    }
  });