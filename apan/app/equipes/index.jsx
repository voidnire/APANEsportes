import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ///Dimensions,
} from "react-native";
import { Link, useRouter, useSearchParams } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";

///const screenWidth = Dimensions.get("window").width;

export default function Equipes() {
    const { theme, colorScheme } = useContext(ThemeContext);
    const styles = createStyles(theme, colorScheme);
    const router = useRouter();
    //const params = useSearchParams(); // se você navegar com ?id= ou enviar dados
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Equipes Screen</Text>
            
            <Link href="/equipes/perfilAtleta" push asChild>
                <Pressable  style={{marginTop: 12,
      backgroundColor: "#222",
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 8,}}>
                    <Text style={{color: "teal",
      fontWeight: "700",
      fontSize: 14,}}>Equipe Corredores</Text>
                </Pressable>

             
            </Link>
        
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