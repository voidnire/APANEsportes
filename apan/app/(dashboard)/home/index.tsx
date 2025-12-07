import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import APAN from '@/assets/images/APAN.png';
// import {Link} from 'expo-router'; // (Não usado neste arquivo)
// 1. AJUSTE: Imports corretos de Contexto, Tipos e Hooks
import { ThemeContext, ThemeContextType } from "@/context/ThemeContext";
import React, { ReactNode, useContext } from "react"; // (useState removido, não usado)
import ThemedText from "@/components/ThemedText"
import Spacer from "@/components/Spacer"
import { useUser } from '@/hooks/useUser'; // 2. AJUSTE: Importar o useUser
import { Colors } from '@/constants/Colors'; // 3. AJUSTE: Importar Colors para tipagem
import { router } from 'expo-router';
import { MaterialIcons,MaterialCommunityIcons } from '@expo/vector-icons';

// 4. AJUSTE: Tipo do 'theme' (nosso padrão)
type Theme = typeof Colors.light | typeof Colors.dark;

// 5. AJUSTE: Interface para o componente local
interface MenuCardProps {
  iconName: string;
  iconBgColor: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  onPress: () => void;
}

const HomeScreen = () => {
  // 6. AJUSTE: Consumo correto do ThemeContext (com checagem de null)
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('HomeScreen must be used within a ThemeProvider');
  }
  const { theme } = themeContext;
  const styles = createStyles(theme);
  const { user } = useUser();
  

  const handleRegistro = () => {
    console.log('Navigate to Registrar Treino');
    router.push('/(dashboard)/testes/registrarTreino');
  }

  const handleVideo = () =>{
    console.log('Navigate to Análise de Testes');
    router.push('/(dashboard)/testes/analise');

  }

  const instrucoes = [
    'O vídeo deve mostrar somente o atleta que será analisado — não inclua outras pessoas no enquadramento.',
    'Marque dois pontos na pista com distância conhecida (por exemplo: ponto de início e ponto de término) em metros. Sem essa referência o app não conseguirá calcular a distância corretamente.',
    'Marque um terceiro ponto para indicar a posição do atleta no vídeo (ponto de referência para a detecção).',
    'Garanta que a câmera esteja fixa e que toda a área entre os pontos esteja visível durante a gravação.',
    'Se possível, use linha do chão ou marcações visíveis para facilitar a detecção e aumentar a precisão.',
  ];

  const MenuCard = ({ iconName, icon, iconBgColor, title, subtitle, onPress }: MenuCardProps) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        {icon}
      </View>
      <View style={styles.cardTextContainer}>
        <ThemedText style={styles.cardTitle} title={true}>{title}</ThemedText>
        <ThemedText style={styles.cardSubtitle}>{subtitle}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Spacer height={4}/>
        <View style={styles.header}>
          <Image source={APAN}    
          style={{width: 50, height: 50}}/>
          <ThemedText style={styles.headerSubtitle}>Monitoramento de Atletas</ThemedText>
        </View>

        {/* 10. AJUSTE: Título de Boas-vindas conectado ao 'user' */}
        <ThemedText style={styles.welcomeTitle} title={true}>
          Bem vindo, {user ? user.nomeCompleto : '...'}
        </ThemedText>
        <Spacer height={30}/>

        {/* Opções do Menu */}
        <View style={styles.menuContainer}>

        {/* Opções do Menu 
        <TouchableOpacity style={styles.card} onPress={handleRegistro}>  
          <View style={[styles.iconContainer, { backgroundColor: "#E6F2FF" }]}>
            <MaterialIcons name="directions-run" size={30} color="#FF6A4D" />
          </View>
          <View style={styles.cardTextContainer}>
            <ThemedText style={styles.cardTitle} title={true}>Registrar Treino</ThemedText>
            <ThemedText style={styles.cardSubtitle}>Registre manualmente as principais métricas de treino do atleta.</ThemedText>
          </View>
        </TouchableOpacity>*/}

        <TouchableOpacity style={styles.card} onPress={handleVideo}>
          
          <View style={[styles.iconContainer, { backgroundColor: "#E6F2FF" }]}>
            <MaterialCommunityIcons name="record-circle" size={27} color="#FF6A4D" />
          </View>
          <View style={styles.cardTextContainer}>
            <ThemedText style={styles.cardTitle} title={true}>Análise de Salto/Potência/Velocidade</ThemedText>
            <ThemedText style={styles.cardSubtitle}>Grave ou envie um vídeo para análise com IA.</ThemedText>
          </View>
        </TouchableOpacity>
        {/* Caixa de instruções */}
        <View style={styles.instructionBox}>
          <ThemedText style={styles.instructionTitle} title={true}>
            Instruções rápidas de gravação
          </ThemedText>

          <ThemedText style={styles.instructionIntro}>
            Siga estas orientações para garantir que a análise automática (IA) calcule as métricas corretamente:
          </ThemedText>

          <View style={styles.bulletsContainer}>
            {instrucoes.map((item, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <View style={styles.bulletNumber}>
                  <Text style={styles.bulletNumberText}>{idx + 1}</Text>
                </View>
                <ThemedText style={styles.bulletText}>{item}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        <Spacer height={1} />


      </View>

        {/* Botão de Ação Rápida
        <TouchableOpacity style={styles.quickStartButton}>
          <Text style={styles.quickStartButtonText}>
            Quick Start Training Session
          </Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
};

// 11. AJUSTE: Tipagem do 'theme'
const createStyles = (theme: Theme)  => 
  StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF', // Azul do logo
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8A8A8E',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: theme.subtitle,
    lineHeight: 22,
  },
  menuContainer: {
    width: '100%',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: theme.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    // 12. AJUSTE: Correção do Typo
    borderColor: theme.cardBorder, 
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#8A8A8E',
    marginTop: 4,
    lineHeight: 18,
  },
  quickStartButton: {
    backgroundColor: theme.buttonBackground,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: 18,
    marginBottom: 10,
  },
  quickStartButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // INSTRUÇÕES
  instructionBox: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      marginBottom: 16,
    },
    instructionTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 8,
      color: theme.title,
    },
    instructionIntro: {
      fontSize: 14,
      marginBottom: 12,
      color: theme.subtitle,
      lineHeight: 20,
    },
    bulletsContainer: {
      marginTop: 4,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    bulletNumber: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: '#FF6A4D22', // leve transparência
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    bulletNumberText: {
      color: '#FF6A4D',
      fontWeight: '700',
    },
    bulletText: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
      lineHeight: 20,
    },
});

export default HomeScreen;