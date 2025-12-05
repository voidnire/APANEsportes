// (dashboard)/testes/analise/calibracao.tsx
import React, { useContext, useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  TextInput, Alert, ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

type Theme = typeof Colors.light | typeof Colors.dark;

export default function CalibracaoScreen() {
  const { videoUri } = useLocalSearchParams();
  const router = useRouter();
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  const { theme } = themeContext!;
  const styles = createStyles(theme);

  const [points, setPoints] = useState<{x: number, y: number, videoX: number, videoY: number}[]>([]);
  const [realDistance, setRealDistance] = useState("3.0");
  const [isUploading, setIsUploading] = useState(false);
  const [loadingText, setLoadingText] = useState("Analisar");

  const [videoMeta, setVideoMeta] = useState({ width: 0, height: 0 });
  const [layoutMeta, setLayoutMeta] = useState({ width: 0, height: 0 });

  // ====================================================================
  // ⚠️ CHAVES
  // ====================================================================
  const CLOUD_NAME = process.env.ENV_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.ENV_UPLOAD_PRESET; 

  const RUNPOD_ID = process.env.ENV_RUNPOD_ID;
  const RUNPOD_API_KEY = process.env.ENV_RUNPOD_API_KEY;  
  // ====================================================================

  const calculateVideoCoordinates = (screenX: number, screenY: number) => {
    if (videoMeta.width === 0 || layoutMeta.width === 0) return { x: 0, y: 0 };

    const screenRatio = layoutMeta.width / layoutMeta.height;
    const videoRatio = videoMeta.width / videoMeta.height;

    let scale = 1, offsetX = 0, offsetY = 0;

    if (screenRatio > videoRatio) {
        scale = layoutMeta.height / videoMeta.height;
        const displayedWidth = videoMeta.width * scale;
        offsetX = (layoutMeta.width - displayedWidth) / 2;
    } else {
        scale = layoutMeta.width / videoMeta.width;
        const displayedHeight = videoMeta.height * scale;
        offsetY = (layoutMeta.height - displayedHeight) / 2;
    }

    return { 
        x: (screenX - offsetX) / scale, 
        y: (screenY - offsetY) / scale 
    };
  };

  const handlePress = (event: any) => {
    if (points.length >= 3) return;
    const { locationX, locationY } = event.nativeEvent;
    const realCoords = calculateVideoCoordinates(locationX, locationY);
    setPoints([...points, { x: locationX, y: locationY, videoX: realCoords.x, videoY: realCoords.y }]);
  };

  const handleAnalysis = async () => {
    if (points.length < 2) {
        Alert.alert("Atenção", "Marque pelo menos 2 pontos.");
        return;
    }

    setIsUploading(true);
    setLoadingText("Enviando vídeo...");

    try {
        // 1. UPLOAD PARA CLOUDINARY USANDO FETCH + FORMDATA
        // (Isso substitui o FileSystem e resolve o problema de memória e deprecation)
        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;
        
        const formData = new FormData();
        formData.append('upload_preset', UPLOAD_PRESET);
        
        // O React Native sabe lidar com esse objeto { uri, type, name } 
        // e faz o streaming do arquivo sem travar o celular.
        formData.append('file', {
            uri: videoUri,
            type: 'video/mp4', 
            name: 'upload.mp4',
        } as any); 

        const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error("Erro Cloudinary:", errorText);
            throw new Error("Falha no upload do vídeo. Verifique sua internet.");
        }

        const cloudinaryData = await uploadResponse.json();
        const videoUrl = cloudinaryData.secure_url;
        console.log("Vídeo hospedado em:", videoUrl);

        // 2. ENVIAR PARA RUNPOD
        setLoadingText("Processando IA...");
        
        let refPointData = null;
        if (points.length === 3) refPointData = [points[2].videoX, points[2].videoY];

        const payload = {
            input: {
                video_url: videoUrl,
                calib: {
                    point1: [points[0].videoX, points[0].videoY],
                    point2: [points[1].videoX, points[1].videoY],
                    real_distance_m: parseFloat(realDistance.replace(',', '.'))
                },
                ref_point: refPointData
            }
        };

        const response = await fetch(`https://api.runpod.ai/v2/${RUNPOD_ID}/runsync`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RUNPOD_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.status === "FAILED") {
            console.error("Erro RunPod:", data);
            throw new Error(data.error || "Erro no processamento do RunPod");
        }

        router.push({
            pathname: "/(dashboard)/testes/analise/dashboard",
            params: { resultData: JSON.stringify(data.output) }
        });

    } catch (err: any) {
        Alert.alert("Erro", err.message);
        console.error(err);
    } finally {
        setIsUploading(false);
        setLoadingText("Analisar");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{marginRight: 10}}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View>
            <Text style={styles.headerTitle}>Calibração</Text>
            <Text style={styles.headerSub}>1. Distância (2 pts) | 2. Atleta (Opcional)</Text>
        </View>
      </View>

      <View style={styles.videoContainer} onLayout={(e) => setLayoutMeta(e.nativeEvent.layout)}>
        <TouchableOpacity activeOpacity={1} onPress={handlePress} style={StyleSheet.absoluteFill}>
            <Video
                source={{ uri: videoUri as string }}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={false}
                onReadyForDisplay={(e) => setVideoMeta(e.naturalSize)}
            />
            {points.map((p, i) => (
                <View key={i} style={[styles.dot, i === 2 ? styles.dotRef : null, { left: p.x - 15, top: p.y - 15 }]}>
                    <Text style={styles.dotText}>{i === 2 ? "REF" : i + 1}</Text>
                </View>
            ))}
             {points.length >= 2 && (
                <View style={{
                    position: 'absolute', left: points[0].x, top: points[0].y,
                    width: Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y),
                    height: 2, backgroundColor: theme.buttonBackground,
                    transform: [{ rotate: `${Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x)}rad` }]
                }} />
            )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
            <Text style={styles.label}>Distância (m):</Text>
            <TextInput style={styles.input} value={realDistance} onChangeText={setRealDistance} keyboardType="numeric"/>
        </View>
        <View style={styles.actions}>
            <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => setPoints([])} disabled={isUploading}>
                <Text style={styles.btnTextOutline}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary, (points.length < 2 || isUploading) && styles.disabled]} onPress={handleAnalysis} disabled={points.length < 2 || isUploading}>
                {isUploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextPrimary}>{loadingText}</Text>}
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: { padding: 16, paddingTop: 40, flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: theme.text },
  headerSub: { fontSize: 13, color: theme.subtitle, marginTop: 4 },
  videoContainer: { flex: 1, backgroundColor: '#000', position: 'relative' },
  video: { width: '100%', height: '100%' },
  dot: { position: 'absolute', width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0, 255, 0, 0.4)', borderWidth: 2, borderColor: theme.buttonBackground, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  dotRef: { backgroundColor: 'rgba(255, 0, 0, 0.5)', borderColor: 'red' },
  dotText: { color: '#fff', fontWeight: 'bold', fontSize: 10 },
  footer: { padding: 20, backgroundColor: theme.cardBackground, borderTopWidth: 1, borderColor: theme.cardBorder },
  inputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  label: { fontSize: 16, color: theme.text, marginRight: 10 },
  input: { backgroundColor: theme.background, color: theme.text, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 8, width: 80, padding: 8, textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  btnOutline: { borderWidth: 1, borderColor: theme.subtitle },
  btnPrimary: { backgroundColor: theme.buttonBackground },
  btnTextOutline: { color: theme.subtitle, fontWeight: '600' },
  btnTextPrimary: { color: '#fff', fontWeight: '700', fontSize: 16 },
  disabled: { opacity: 0.5 }
});