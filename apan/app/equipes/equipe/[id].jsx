import React, { useContext , useState} from "react";
import {
  View,
  Text,
  StyleSheet,TouchableOpacity
  ,FlatList,ScrollView
  ///Dimensions,
} from "react-native";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";
import { equipes } from "@/models/equipes";
import { atletas } from "@/models/atletas";
///const screenWidth = Dimensions.gAet("window").width;

export default function Equipe() {

  const [atletass, setAtletas] = useState(atletas.sort((a,b)=> a.nomeCompleto-b.nomeCompleto));

  const { id } = useLocalSearchParams(); // pega ?id=...

  console.log("id: bosta, ", id);
  const { theme, colorScheme } = useContext(ThemeContext);


  
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();
    //const params = useSearchParams(); // se você navegar com ?id= ou enviar dados
    
  ////const equipe = equipes.find((t) => t.id === id);

  if (!atletass) {
    return (
      <View style={styles.container}>
        <Text style={{ color: theme.text }}>Equipe sem atletas encontrados :/</Text>
      </View>
    );
  }



    return (
        <View style={styles.container}>
            
            <ScrollView style={styles.section}>
              <FlatList
                      data={atletass}
                      keyExtractor={(m) => m.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity 
                          onPress={() => console.log("Clicou no atleta ", item.nomeCompleto," ou nao ne abestado")}
                          activeOpacity={0.7}>

                                       
                          <View style={styles.memberRow}>
                                <Text style={styles.memberName}>{item.nomeCompleto}</Text>
                                <Text style={styles.memberRole}>{item.role}nao tem role • {item.age}  nem anos</Text>
                          </View>

                        </TouchableOpacity>
                )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={{ paddingVertical: 8 }}
              
              />
            </ScrollView>
        </View>
    );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, padding: 16 },
    title: { fontSize: 22, fontWeight: "700", color: theme.text },
    desc: { color: "#999", marginBottom: 12 },
    subTitle: { marginTop: 12, fontWeight: "700", color: theme.text },
    memberRow: { 
      paddingVertical: 8, 
      borderBottomWidth: 1, borderColor: "#222",
          backgroundColor: "white",
        borderRadius: 8,
          
      paddingHorizontal: 14,

    },
    separator: {
      height: 10,},
    memberName: {  fontSize: 16,color: "black", fontWeight: "600" },
    memberRole: { color: "#aaa", fontSize: 12,marginTop: 4, },
  });