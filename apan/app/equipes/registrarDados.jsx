import React, { useContext, useState, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { ThemeContext } from "@/context/ThemeContext";
import { Picker } from "@react-native-picker/picker";
import { Link, router } from "expo-router";
import { ArrowLeft } from "lucide-react-native"; // npm i lucide-react-native

export default function RegistrarDadosScreen() {
  const { colorScheme, theme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  const [atleta, setAtleta] = useState("");
  const [prePos, setPrePos] = useState("Pré");
  const [aba, setAba] = useState("Corrida");
  const [tempo, setTempo] = useState("");
  const [distancia, setDistancia] = useState("");
  const [velocidade, setVelocidade] = useState("");
  const [freqCard, setFreqCard] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const atletas = [
    { id: "a1", nome: "Atleta 1" },
    { id: "a2", nome: "Atleta 2" },
    { id: "a3", nome: "Atleta 3" },
  ];

  const pickerRef = useRef(null);

  function abrirPicker() {
    if (pickerRef.current && Platform.OS === "android") {
      pickerRef.current.focus?.();
    }
  }

  function handleSalvar() {
    const payload = {
      atleta,
      prePos,
      aba,
      tempo,
      distancia,
      velocidade,
      freqCard,
      observacoes,
      createdAt: new Date().toISOString(),
    };
    console.log("Salvar registro:", payload);
  }

  function handleImportar() {
    console.log("Importar do My Jump Lab (implementar)");
  }

  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Botão de voltar */}
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft color={theme.text} size={22} />
        <Text style={styles.backText}>Voltar</Text>
      </Pressable>

      <Text style={styles.label}>Escolher Atleta</Text>

      <View style={styles.pickerWrapper}>
        <Picker
          ref={pickerRef}
          selectedValue={atleta}
          onValueChange={(itemValue) => setAtleta(itemValue)}
          style={styles.picker}
          dropdownIconColor={theme.text}
        >
          <Picker.Item label="Selecione..." value="" />
          {atletas.map((a) => (
            <Picker.Item key={a.id} label={a.nome} value={a.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.rowBetween}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.label}>Pré/Pós:</Text>
          <View style={styles.toggleGroup}>
            {["Pré", "Pós"].map((t) => (
              <Pressable
                key={t}
                onPress={() => setPrePos(t)}
                style={[
                  styles.toggleButton,
                  prePos === t && styles.toggleButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.toggleText,
                    prePos === t && styles.toggleTextActive,
                  ]}
                >
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable style={styles.smallGhostButton} onPress={abrirPicker}>
          <Text style={styles.smallGhostText}>Abrir lista</Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {["Corrida", "Salto V", "Salto H", "Lançamento"].map((t) => (
          <Pressable
            key={t}
            onPress={() => setAba(t)}
            style={[styles.tabButton, aba === t && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, aba === t && styles.tabTextActive]}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Tempo (s)</Text>
        <TextInput
          value={tempo}
          onChangeText={setTempo}
          placeholder="Value"
          placeholderTextColor={theme.muted}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Distância (m)</Text>
        <TextInput
          value={distancia}
          onChangeText={setDistancia}
          placeholder="Value"
          placeholderTextColor={theme.muted}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Velocidade (m/s)</Text>
        <TextInput
          value={velocidade}
          onChangeText={setVelocidade}
          placeholder="Value"
          placeholderTextColor={theme.muted}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Frequência cardíaca (bpm)</Text>
        <TextInput
          value={freqCard}
          onChangeText={setFreqCard}
          placeholder="Value"
          placeholderTextColor={theme.muted}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={[styles.field, { marginTop: 6 }]}>
        <Text style={styles.fieldLabel}>Observações</Text>
        <TextInput
          value={observacoes}
          onChangeText={setObservacoes}
          placeholder="Escreva aqui detalhes do treino..."
          placeholderTextColor={theme.muted}
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
        />
      </View>

      <Pressable
        style={[styles.actionButton, styles.importButton]}
        onPress={handleImportar}
      >
        <Text style={styles.actionText}>Importar do My Jump Lab</Text>
      </Pressable>

      <Pressable
        style={[styles.actionButton, styles.saveButton]}
        onPress={handleSalvar}
      >
        <Text style={styles.actionText}>Salvar Registro</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      padding: 18,
      alignItems: "stretch",
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },
    backText: {
      color: theme.text,
      marginLeft: 6,
      fontSize: 16,
      fontWeight: "600",
    },
    label: {
      color: theme.text,
      fontWeight: "600",
      marginBottom: 6,
      fontSize: 16,
    },
    pickerWrapper: {
      borderWidth: 1,
      borderColor: theme.border || "#ccc",
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: theme.card || (colorScheme === "dark" ? "#111" : "#fff"),
      marginBottom: 12,
    },
    picker: {
      height: 48,
      color: theme.text,
    },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    toggleGroup: {
      flexDirection: "row",
      marginLeft: 8,
    },
    toggleButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border || "#ccc",
      marginRight: 6,
      backgroundColor: "transparent",
    },
    toggleButtonActive: {
      backgroundColor: theme.primary || "#2f95dc",
      borderColor: theme.primary || "#2f95dc",
    },
    toggleText: {
      color: theme.text,
      fontWeight: "600",
    },
    toggleTextActive: {
      color: theme.onPrimary || "#fff",
    },
    smallGhostButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border || "#ccc",
      backgroundColor: "transparent",
    },
    smallGhostText: {
      color: theme.text,
      fontSize: 12,
    },
    tabs: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 14,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 10,
      marginHorizontal: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border || "#ccc",
      backgroundColor: "transparent",
      alignItems: "center",
    },
    tabButtonActive: {
      backgroundColor: theme.primary || "#2f95dc",
      borderColor: theme.primary || "#2f95dc",
    },
    tabText: {
      color: theme.text,
      fontWeight: "600",
      fontSize: 12,
    },
    tabTextActive: {
      color: theme.onPrimary || "#fff",
    },
    field: {
      marginBottom: 12,
    },
    fieldLabel: {
      color: theme.text,
      marginBottom: 6,
      fontWeight: "600",
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border || "#ccc",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: theme.text,
      backgroundColor: theme.card || (colorScheme === "dark" ? "#111" : "#fff"),
    },
    textArea: {
      minHeight: 90,
      textAlignVertical: "top",
    },
    actionButton: {
      height: 48,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 12,
    },
    importButton: {
      backgroundColor: theme.card || "#444",
      borderWidth: 1,
      borderColor: theme.border || "#ccc",
    },
    saveButton: {
      backgroundColor: theme.primary || "red",
      marginBottom: 8,
    },
    actionText: {
      color: theme.onPrimary || "#fff",
      fontWeight: "700",
    },
  });
}
