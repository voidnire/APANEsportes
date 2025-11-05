import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,FlatList
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
    
    
    const handlePress = (id) => { 
      const equipe = equipes.find((t) => t.id === id);
      console.log("EQUIPE SELECIONADA: ", equipe);
      router.push(`/equipes/equipe/${id}`); 
      
      }; 
    
    return (
        <View style={styles.container}>
            <View style={styles.section}>

              <FlatList
                data={equipes}
                keyExtractor={(t) => t.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                  onPress={() => handlePress(item.id)}
                 activeOpacity={0.7}>
                    <View style={styles.equipeBtt}>
                      <Text style={styles.equipeTitle}>{item.name}</Text>
                      <Text style={styles.equipeSub}>{item.description}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={{ paddingVertical: 8 }}
              />

            </View>
            

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
      fontSize: 16,
      fontWeight: "700",
      color: theme.background,
    },
    equipeSub: { color: "#aaa", marginTop: 4, fontSize: 12 },
    
    section: {
      flex: 1,
      marginTop: 1,
      padding:24
    },

    separator: {
      height: 10,
    
  },
    
  equipeBtt:{
      maxWidth: "78%",
  
      backgroundColor: "white",
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 8
    }
  });