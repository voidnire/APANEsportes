import { Text, View, TextInput, Pressable, StyleSheet, FlatList, Image } from "react-native";
import { ThemeContext } from "@/context/ThemeContext";
import React,{ useContext } from "react";
import APANLogo from "../assets/images/APAN.png";


export default function HomeScreen() {
const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)  

const styles = createStyles(theme, colorScheme)  


    return (
    <View style={styles.container}>
     
      <Image source={APANLogo} style={{ width: 100, height: 100 }} />
     <Text style={styles.title}>Monitoramento de Atletas</Text>
    </View>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
    },
  });
}