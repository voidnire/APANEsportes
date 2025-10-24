import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Link, useRouter, useSearchParams } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";

const screenWidth = Dimensions.get("window").width;

export default function AthleteProfileScreen() {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();
  //const params = useSearchParams();  se  navegar com ?id= ou enviar dados
  // Mock
  const athlete = {
    id: /* params.id ||*/ "1",
    name: "Pessoa Exemplo",
    age: "17",
    modality: "Modalidade",
    disability: "Nenhuma",
    avatar:
      "", // exemplo; substitua por URL ou imagem local
    bestMark: "3,45 m",
    avgMark: "3,21 m",
  };

  const handleEdit = () => {
    // navegar para tela de edição; ajuste a rota conforme seu app
    router.push({
      pathname: "/editAthlete",
      params: { id: athlete.id },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Link href="/equipes/index" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
        </Link>
        <Text style={styles.headerTitle}>PERFIL</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatarBorder}>
          {athlete.avatar ? (
            <Image source={{ uri: athlete.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {athlete.name ? athlete.name[0] : "A"}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Info rows */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoValue}>{athlete.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Idade:</Text>
          <Text style={styles.infoValue}>{athlete.age}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Modalidade:</Text>
          <Text style={styles.infoValue}>{athlete.modality}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Deficiência:</Text>
          <Text style={styles.infoValue}>{athlete.disability}</Text>
        </View>
      </View>

      {/* Stats cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>☆</Text>
          <Text style={styles.statValue}>{athlete.bestMark}</Text>
          <Text style={styles.statLabel}>Melhor Marca</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🏅</Text>
          <Text style={styles.statValue}>{athlete.avgMark}</Text>
          <Text style={styles.statLabel}>Média Geral</Text>
        </View>
      </View>

      {/* Edit button */}
      <Pressable style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText}>Editar</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function createStyles(theme, colorScheme) {
  const cardBg = theme.card || (colorScheme === "dark" ? "#111" : "#fff");
  const border = theme.border || "#d9d9d9";
  const muted = theme.muted || "#8b8b8b";
  const primary = theme.primary || "#7c3aed";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingTop: 18,
      paddingHorizontal: 18,
      paddingBottom: 40,
      alignItems: "center",
    },

    header: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },
    backButton: {
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    backArrow: {
      fontSize: 20,
      color: theme.text,
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: theme.text,
      letterSpacing: 1,
    },

    avatarWrap: {
      marginTop: 4,
      marginBottom: 14,
      alignItems: "center",
      width: "100%",
    },
    avatarBorder: {
      width: 110,
      height: 110,
      borderRadius: 110 / 2,
      backgroundColor: cardBg,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 6,
      borderColor: "#6fb0ff22", // leve destaque similar ao mock
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 96 / 2,
    },
    avatarPlaceholder: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: "#eee",
      justifyContent: "center",
      alignItems: "center",
    },
    avatarInitial: {
      fontSize: 34,
      color: primary,
      fontWeight: "800",
    },

    infoCard: {
      width: "100%",
      marginTop: 6,
      marginBottom: 18,
      // cada linha tem borda externa; o visual do mock tem caixas individuais
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: border,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: cardBg,
    },
    infoLabel: {
      fontSize: 14,
      color: muted,
      fontWeight: "600",
    },
    infoValue: {
      fontSize: 14,
      color: theme.text,
      fontWeight: "700",
    },

    statsContainer: {
      width: "100%",
      marginTop: 14,
      alignItems: "center",
    },
    statCard: {
      width: screenWidth - 72,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 10,
      paddingVertical: 18,
      paddingHorizontal: 14,
      alignItems: "center",
      marginBottom: 12,
      shadowColor: "#000",
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 1,
    },
    statIcon: {
      fontSize: 26,
      marginBottom: 6,
      color: muted,
    },
    statValue: {
      fontSize: 22,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: muted,
    },

    editButton: {
      marginTop: 12,
      backgroundColor: "#222",
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 8,
    },
    editButtonText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 14,
    },
  });
}
