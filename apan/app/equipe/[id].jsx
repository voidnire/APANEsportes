import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,FlatList
  ///Dimensions,
} from "react-native";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";
import { equipes } from "@/models/equipes";

///const screenWidth = Dimensions.get("window").width;

export default function Equipe() {

    const { id } = useLocalSearchParams(); // pega ?id=...

    console.log("id: bosta, ", id);
    const { theme, colorScheme } = useContext(ThemeContext);


  
    const styles = createStyles(theme, colorScheme);
    const router = useRouter();
    //const params = useSearchParams(); // se você navegar com ?id= ou enviar dados
    
    const equipe = equipes.find((t) => t.id === id);

    if (!equipe) {
    return (
      <View style={styles.container}>
        <Text style={{ color: theme.text }}>Equipe não encontrada :/</Text>
      </View>
    );
  }



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Membros</Text>

            <FlatList
        data={equipe.members}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View style={styles.memberRow}>
            <Link href="/equipes/perfilAtleta" push asChild>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberRole}>{item.role} • {item.age} anos</Text>
            </Link>
          </View>
        )}
      />
        
        </View>
    );

}

const createStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, padding: 16 },
    title: { fontSize: 22, fontWeight: "700", color: theme.text },
    desc: { color: "#999", marginBottom: 12 },
    subTitle: { marginTop: 12, fontWeight: "700", color: theme.text },
    memberRow: { paddingVertical: 8, borderBottomWidth: 1, borderColor: "#222" },
    memberName: { color: theme.text, fontWeight: "600" },
    memberRole: { color: "#aaa", fontSize: 12 },
  });