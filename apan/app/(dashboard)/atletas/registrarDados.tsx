// (Arquivo: dashboard/atletas/registrarDados.tsx)
import React, { useContext, useState,useEffect } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard,ActivityIndicator,
  TouchableWithoutFeedback, Platform, View
} from "react-native";
import { useRouter } from "expo-router";

// 1. AJUSTE: Imports corretos
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import AtletaService from "@/services/atleta";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useAtletaMutate } from "@/hooks/useAtletaMutate";

type Theme = typeof Colors.light | typeof Colors.dark;

export default function RegistrarDados() {
  // 2. AJUSTE: Consumo correto do contexto
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('RegistrarDados must be used within a ThemeProvider');
  }
  const { theme } = themeContext;
  const styles = createStyles(theme);
  const router = useRouter();

  // 3. AJUSTE: States para o formulário
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [loading, setLoading] = useState(false);

  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const {mutate, isSuccess} = useAtletaMutate(); 
  

  const onChangeData = (event: any, selectedDate?: Date) => {
    setSelectedDate(selectedDate)
    if (selectedDate) {
      setDataNascimento(formatarData(selectedDate));
    }
    setMostrarPicker(false);
  };

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

    const atletaData ={
        nomeCompleto: nomeCompleto.trim(),
        dataNascimento: dataNascimento.trim() || new Date().toISOString().split('T')[0], // Envia data de hoje se vazio
    }

    mutate(atletaData)
  };

  useEffect(() => {
    if (isSuccess) {
      Alert.alert("Sucesso", "Atleta registrado com sucesso!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [isSuccess,router]); 

  return (
    // 5. AJUSTE: UI reescrita com componentes temáticos
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText title={true} style={styles.title}>
          Registrar novo atleta
        </ThemedText>

        <ThemedTextInput
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
          placeholder="Nome completo"
          style={styles.input}
          autoCapitalize="words"
        />

      <View style={styles.input}>
          <ThemedButton style={styles.dateButton} onPress={() => setMostrarPicker(true)}>
            <ThemedText>
              {dataNascimento ? dataNascimento : "Selecionar data de nascimento"}
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
    },
    pickerWrapper:{
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