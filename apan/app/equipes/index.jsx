import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,FlatList
  ///Dimensions,
} from "react-native";
import { Link, useRouter, useSearchParams } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";
import { equipes } from "@/models/equipes";

///const screenWidth = Dimensions.get("window").width;

export default function Equipes() {
    const { theme, colorScheme } = useContext(ThemeContext);
    const styles = createStyles(theme, colorScheme);
    const router = useRouter();
    //const params = useSearchParams(); // se você navegar com ?id= ou enviar dados
    console.log("PARAMS EQUIPES: ",equipes.toString());
    return (
        <View style={styles.container}>
            
            <FlatList
        data={equipes}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <Link 
          href={`/equipe/${item.id}`} >
            <Pressable
              onPress={()=>{console.log("CLICOU NA EQUIPE ", item.name)}}
            style={styles.equipeBtt}
            >
              <Text style={styles.equipeTitle}>{item.name}</Text>
              <Text style={styles.equipeSub}>{item.description}</Text>
            </Pressable>
          </Link>
        )}
      />

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
    equipeTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
    },
    equipeSub: { color: "#aaa", marginTop: 4, fontSize: 12 },
    equipeBtt:{
      marginTop: 12,
      backgroundColor: "#222",
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 8
    }
  });