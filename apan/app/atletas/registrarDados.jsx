// app/atletas/registrarDados.jsx
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";
import { atletas } from "@/models/atletas"; // adiciona o novo atleta neste array (modifica o módulo)
import { Picker } from "@react-native-picker/picker"; // opcional, npm i @react-native-picker/picker

export default function RegistrarDados() {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const router = useRouter();

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState("masculino");
  const [modalidade, setModalidade] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const validar = () => {
    if (!nomeCompleto.trim()) {
      Alert.alert("Erro", "Informe o nome completo do atleta.");
      return false;
    }
    // opcional: validar data no formato YYYY-MM-DD
    return true;
  };

  const handleSalvar = () => {
    if (!validar()) return;

    const novoAtleta = {
      id: String(Date.now()),
      nomeCompleto: nomeCompleto.trim(),
      dataNascimento: dataNascimento.trim() || "2000-01-01",
      genero,
      modalidade: modalidade.trim(),
      observacoes: observacoes.trim(),
    };

    try {
      // adiciona no array do módulo — dependendo de como a lista é gerenciada, pode ser necessário disparar um refresh.
      atletas.push(novoAtleta);
      // feedback simples e volta para a lista
      Alert.alert("Sucesso", "Atleta cadastrado.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      console.error("Erro ao salvar atleta:", err);
      Alert.alert("Erro", "Não foi possível salvar o atleta. Veja o console.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registrar novo atleta</Text>

      <ScrollView
        style={styles.form}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          value={nomeCompleto}
          onChangeText={setNomeCompleto}
          placeholder="Ex: João da Silva"
          placeholderTextColor="#999"
          style={styles.input}
          returnKeyType="next"
        />

        <Text style={styles.label}>Data de Nascimento</Text>
        <TextInput
          value={dataNascimento}
          onChangeText={setDataNascimento}
          placeholder="YYYY-MM-DD (opcional)"
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/**
        <Text style={styles.label}>Gênero</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={genero}
            onValueChange={(v) => setGenero(v)}
            style={Platform.OS === "ios" ? { height: 140 } : {}}
          >
            <Picker.Item label="Masculino" value="masculino" />
            <Picker.Item label="Feminino" value="feminino" />
            <Picker.Item label="Outro / Não informar" value="outro" />
          </Picker>
        </View>

        <Text style={styles.label}>Modalidade / Esporte</Text>
        <TextInput
          value={modalidade}
          onChangeText={setModalidade}
          placeholder="Ex: Atletismo - Salto"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <Text style={styles.label}>Observações</Text>
        <TextInput
          value={observacoes}
          onChangeText={setObservacoes}
          placeholder="Observações (opcional)"
          placeholderTextColor="#999"
          style={[styles.input, { height: 90, textAlignVertical: "top" }]}
          multiline
        />
        */}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ccc" }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, { color: "#222" }]}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSalvar}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 12,
      paddingHorizontal: 16,
    },
    header: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
      alignSelf: "center",
    },
    form: {
      flex: 1,
      marginTop: 8,
    },
    label: {
      color: theme.text,
      fontSize: 13,
      marginBottom: 6,
      marginTop: 12,
    },
    input: {
      backgroundColor: "#fff",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#e6e6e6",
      color: "#000",
    },
    pickerWrapper: {
      backgroundColor: "#fff",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#e6e6e6",
      overflow: "hidden",
    },
    actions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    button: {
      flex: 1,
      marginHorizontal: 6,
      backgroundColor: "#007AFF",
      paddingVertical: 12,
      alignItems: "center",
      borderRadius: 8,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "700",
    },
  });
