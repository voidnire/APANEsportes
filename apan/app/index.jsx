import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { ThemeContext } from "@/context/ThemeContext";
import React,{ useContext,useMemo } from "react";


export default function HomeScreen() {
    const { colorScheme, theme } = useContext(ThemeContext)
  
  const styles = useMemo(() => createStyles(theme, colorScheme), [theme, colorScheme]);
    
    return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
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
    },
  });
}