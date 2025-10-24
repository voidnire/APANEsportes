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

export default function Equipes() {
    const { theme, colorScheme } = useContext(ThemeContext);
    const styles = createStyles(theme, colorScheme);
    //const router = useRouter();
    //const params = useSearchParams(); // se você navegar com ?id= ou enviar dados
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Equipes Screen</Text>
        </View>
    );

}
const createStyles = (theme, colorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
    },
  });