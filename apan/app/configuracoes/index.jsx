import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
//import { useRouter } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";

//import {Icon} from "@/assets/images/splash-icon.png"

const screenWidth = Dimensions.get("window").width;

export default function AthleteProfileScreen() {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);

  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
            <Text style={styles.backArrow}>To do ....</Text>
      </View>

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
