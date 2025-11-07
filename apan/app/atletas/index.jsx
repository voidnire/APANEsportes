import React, { useContext,useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,FlatList
  ///Dimensions,
} from "react-native";
import { Link, useRouter, useSearchParams } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";
import { atletas } from "@/models/atletas";

///const screenWidth = Dimensions.get("window").width;

export default function Atletas() {
  const { theme, colorScheme } = useContext(ThemeContext);
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();
  //const params = useSearchParams(); // se você navegar com ?id= ou enviar dados
  const [atletass, setAtletas] = useState(atletas.sort((a,b)=> a.nomeCompleto-b.nomeCompleto));
    
    
  const handlePress = (id) => { 
    const atleta = atletas.find((t) => t.id === id);
      console.log("ATLETA SELECIONADO: ", atleta);
      router.push({
        pathname:`/atletas/atleta/${id}`,
        params:{
          name: atleta.name
        }
      }
      ); 
      
      }; 

      
        /*const atletasDaEquipe = useMemo(() => {
          if (!atletas) return [];
          return atletas;
        };*/
      
      
  console.log("ATLETAS: ", atletass);
      
      
        /*if (!atletass) {
          return (
            <View style={styles.container}>
              <Text style={{ color: theme.text }}>Equipe sem atletas encontrados :/</Text>
            </View>
          );
        }*/
      
        if (!atletass || atletass.length === 0) {
          return (
            <View style={styles.container}>
              <Text style={{ color: theme.text }}>
                Atletas não encontrados :/
              </Text>
            </View>
          );
        }
    
    return (
        <View style={styles.container}>
            <View style={styles.section}>

              <FlatList
                data={atletass}
                keyExtractor={(t) => t.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                  onPress={() => handlePress(item.id)}
                 activeOpacity={0.7}>
                    <View style={styles.equipeBtt}>
                      <Text style={styles.equipeTitle}>{item.nomeCompleto}</Text>
                      <Text style={styles.equipeSub}>{item.dataNascimento}</Text>
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