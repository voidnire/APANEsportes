// (dashboard)/testes/analise/selecaoVideo.tsx
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // <--- Importe useLocalSearchParams
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';
import Spacer from '@/components/Spacer';

type Theme = typeof Colors.light | typeof Colors.dark;

export default function SelecaoVideoScreen() {
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  const { theme } = themeContext!;
  const styles = createStyles(theme);
  const router = useRouter();

  // CORREÇÃO 1: Capturar o atletaId que veio da tela anterior
  const { atletaId } = useLocalSearchParams();

  const [videoUri, setVideoUri] = useState<string | null>(null);

  // Função para escolher da galeria
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setVideoUri(result.assets[0].uri);
  };

  // Função para gravar com a câmera
  const recordVideo = async () => {
    try {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permissão negada", "Precisamos de acesso à câmera.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) setVideoUri(result.assets[0].uri);
    } catch (e) {
        Alert.alert("Erro", "Não foi possível abrir a câmera.");
    }
  };

  const handleNext = () => {
    if (!videoUri) return;
    
    // CORREÇÃO 2: Repassar o atletaId para a Calibração
    router.push({
      pathname: "/(dashboard)/testes/analise/calibracao",
      params: { 
        videoUri,
        atletaId // <--- Passando adiante!
      }
    });
  };

  return (
    <View style={styles.container}>
      <Spacer />
      <Text style={styles.title}>Captura de Movimento</Text>
      <Text style={styles.subtitle}>Grave ou selecione um vídeo lateral do atleta.</Text>
      
      <View style={styles.content}>
        {videoUri ? (
          <View style={styles.videoWrapper}>
            <Video
              style={styles.video}
              source={{ uri: videoUri }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
            />
            <TouchableOpacity onPress={() => setVideoUri(null)} style={styles.removeBtn}>
                <Ionicons name="close-circle" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.optionsRow}>
             <TouchableOpacity style={styles.optionCard} onPress={recordVideo}>
                <Ionicons name="camera" size={40} color={theme.buttonBackground} />
                <Text style={styles.optionText}>Gravar Vídeo</Text>
             </TouchableOpacity>

             <TouchableOpacity style={styles.optionCard} onPress={pickVideo}>
                <Ionicons name="images" size={40} color={theme.buttonBackground} />
                <Text style={styles.optionText}>Galeria</Text>
             </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
            style={[styles.button, !videoUri && styles.buttonDisabled]} 
            onPress={handleNext}
            disabled={!videoUri}
        >
            <Text style={styles.buttonText}>Avançar para Calibração</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={{marginLeft: 8}} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background, padding: 18 },
    title: { fontSize: 22, fontWeight: '800', color: theme.text, marginBottom: 8 },
    subtitle: { fontSize: 14, color: theme.subtitle, marginBottom: 30 },
    content: { flex: 1, justifyContent: 'center' },
    
    optionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
    optionCard: {
        flex: 1, height: 140, backgroundColor: theme.cardBackground, borderRadius: 16,
        justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.cardBorder,
        borderStyle: 'dashed'
    },
    optionText: { marginTop: 12, color: theme.text, fontWeight: '600' },

    videoWrapper: { width: '100%', height: 250, borderRadius: 16, overflow: 'hidden', backgroundColor: '#000' },
    video: { flex: 1 },
    removeBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#00000080', borderRadius: 20 },

    footer: { marginBottom: 20 },
    button: {
        backgroundColor: theme.buttonBackground, paddingVertical: 16, borderRadius: 12,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        shadowColor: theme.cardShadow, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4
    },
    buttonDisabled: { backgroundColor: theme.cardBorder, opacity: 0.7 },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 }
  });
}