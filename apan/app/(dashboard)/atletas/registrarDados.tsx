// (Arquivo: dashboard/atletas/registrarDados.tsx)
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { useRouter } from "expo-router";

// 1. AJUSTE: Imports corretos
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import AtletaService from "@/services/atleta";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedButton from "@/components/ThemedButton";

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

  const validar = () => {
    if (!nomeCompleto.trim()) {
      Alert.alert("Erro", "Informe o nome completo do atleta.");
      return false;
    }
    // (Validação de data YYYY-MM-DD pode ser adicionada aqui)
    return true;
  };

  // 4. AJUSTE: 'handleSalvar' agora chama a API
  const handleSalvar = async () => {
    if (!validar() || loading) return;

    Keyboard.dismiss();
    setLoading(true);

    try {
      // Chama o serviço com os dados do DTO
      await AtletaService.createAtleta({
        nomeCompleto: nomeCompleto.trim(),
        dataNascimento: dataNascimento.trim() || new Date().toISOString().split('T')[0], // Envia data de hoje se vazio
      });

      Alert.alert("Sucesso", "Atleta cadastrado.", [
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
          Registrar novo atleta
        </ThemedText>

        <ThemedTextInput
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
          placeholder="Nome completo"
          style={styles.input}
          autoCapitalize="words"
        />

        <ThemedTextInput
          value={dataNascimento}
          onChangeText={setDataNascimento}
          placeholder="Data de Nascimento (YYYY-MM-DD)"
          style={styles.input}
          keyboardType="numeric"
        />

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
    }
  });