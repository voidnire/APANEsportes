import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,Alert,
  ActivityIndicator,
  Keyboard, // 1. Importado para o loading
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';

// 2. AJUSTE: Importando os tipos REAIS da API e o SERVIÇO
import { ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import {
  AtletaDetalhado,
  RegistroAvaliacaoCompleto,
} from '@/models/atletas';
import AtletaService from '@/services/atleta';
import { Colors } from '@/constants/Colors';

type Theme = typeof Colors.light | typeof Colors.dark;
const screenWidth = Dimensions.get('window').width;

export default function PerfilAtleta() {
  const { id } = useLocalSearchParams() as { id: string };
  console.log('Carregando atleta com id: ', id);

  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('PerfilAtleta must be used within a ThemeProvider');
  }
  const { theme } = themeContext;
  const styles = createStyles(theme);

  const router = useRouter()

  // 3. AJUSTE: States para os dados vindos da API
  const [atleta, setAtleta] = useState<AtletaDetalhado | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<RegistroAvaliacaoCompleto[]>([]);
  const [loading, setLoading] = useState(true);

  
  const fetchData = async () => {
        try {
          setLoading(true);
          // Chamada 1: Busca os dados básicos do atleta
          const atletaData = await AtletaService.getAtletaById(id);
          setAtleta(atletaData);
          // Chamada 2: Busca o histórico de avaliações (marcas, modalidades)
          const avaliacoesData =
            await AtletaService.getAvaliacoesByAtletaId(id);
          setAvaliacoes(avaliacoesData);
        } catch (err) {
          console.error('Erro ao carregar dados do perfil', err);
        } finally {
          setLoading(false);
        }
  };

  useEffect(() => {
    if (id) {
      
      fetchData();
    }
  }, [id]);

  useFocusEffect(
    // O useCallback é crucial para evitar loops infinitos
    useCallback(() => {
      // Esta função será executada toda vez que a tela entrar em foco
      fetchData(); 
      // Opcional: retorna uma função de limpeza (cleanup)
    }, [id])
  );



  // 5. AJUSTE: Funções auxiliares para processar os dados da API
  const getDisabilities = () => {
    if (!atleta || !atleta.classificacoes.length) return 'N/A';
    // Mapeia o array de classificações (que vem da API) para texto
    return atleta.classificacoes.map((c) => c.codigo).join(', ');
  };

  const getModalities = () => {
    if (!avaliacoes.length) return 'N/A';
    // Pega a modalidade da avaliação mais recente (exemplo)
    return avaliacoes[0].modalidade.nome;
  };

  const getBestMark = () => {
    if (!avaliacoes.length) return 'N/A';
    // Lógica de exemplo: Encontra o menor valor (assumindo que "Tempo" é a métrica)
    let best = Infinity;
    avaliacoes.forEach((reg) => {
      reg.resultados.forEach((res) => {
        if (res.tipoMetrica.nome === 'Tempo' && res.valor < best) {
          best = res.valor;
        }
      });
    });
    return best === Infinity ? 'N/A' : `${best}s`;
  };

  const handleEdit = () => {
    if (!atleta) return;
    router.push(`/(dashboard)/atletas/atleta/${atleta.id}/editarAtleta`);
    console.log('Editar atleta:', atleta.id);
  };

  const handleDelete = () => {
    if (!atleta) return;
    // Aqui você chamaria o serviço para deletar o atleta
    console.log('Excluir atleta:', atleta.id);
    Alert.alert("EXCLUIR ATLETA?", 
      "Tem certeza que deseja excluir o atleta permanentemente? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            Keyboard.dismiss();
            setLoading(true);
            try {
              await AtletaService.deleteAtleta(atleta.id);
              console.log("Atleta excluído com sucesso");
              Alert.alert("Sucesso", "Atleta excluído.", [
                {
                  text: "OK",
                  onPress: () => router.back(), // Volta para a lista
                },
              ]);
            } catch (error) {
              console.error("Erro ao excluir atleta:", error);
              Alert.alert("Erro", "Não foi possível excluir o atleta. Tente novamente mais tarde.");
            }finally {
                setLoading(false);
              }
          }
        }
      ]
    );
  }


  const handleDesempenho = () => {
    if (!atleta) return;
    router.push(`/(dashboard)/atletas/atleta/${atleta.id}/desempenho`);
    console.log('Ver desempenho do atleta:', atleta.id);
  };


  // --- RENDERIZAÇÃO ---

  // 6. AJUSTE: Mostrar tela de loading
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  // 7. AJUSTE: Mostrar tela de erro/não encontrado
  if (!atleta) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={{ color: theme.text }}>Atleta não encontrado :/</Text>
      </View>
    );
  }

  // 8. AJUSTE: 'dataNascimento' agora vem do atleta carregado
  const idadeAtual = calcularIdade(atleta.dataNascimento);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatarBorder}>
          {/* 9. AJUSTE: 'avatar' removido (não existe na API) */}
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {atleta.nomeCompleto ? atleta.nomeCompleto[0] : 'A'}
            </Text>
          </View>
        </View>
      </View>

      {/* Info rows */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoValue}>{atleta.nomeCompleto}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Idade:</Text>
          <Text style={styles.infoValue}>{idadeAtual}</Text>
        </View>
        {/* 10. AJUSTE: Dados agora vêm dos helpers */}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Modalidade:</Text>
          <Text style={styles.infoValue}>{getModalities()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Deficiência:</Text>
          <Text style={styles.infoValue}>{getDisabilities()}</Text>
        </View>
      </View>

      {/* Stats cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>☆</Text>
          <Text style={styles.statValue}>{getBestMark()}</Text>
          <Text style={styles.statLabel}>Melhor Marca (Tempo)</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🏅</Text>
          <Text style={styles.statValue}>N/A</Text>
          <Text style={styles.statLabel}>Média Geral</Text>
        </View>
      </View>

      {/* Edit button */}
      <Pressable style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText}>Editar</Text>
      </Pressable>

      {/* Excluir button */}
      <Pressable style={styles.editButton} onPress={handleDelete}>
        <Text style={styles.editButtonText}>Excluir</Text>
      </Pressable>

      {/* Ver desempenho tela */}
      <Pressable style={styles.editButton} onPress={handleDesempenho}>
        <Text style={styles.editButtonText}>Desempenho</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// (Função 'calcularIdade' - já estava correta)
const calcularIdade = (dataNascimentoString: string) => {
  const dataNascimento = new Date(dataNascimentoString);
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const diaAtual = hoje.getDate();
  const mesNascimento = dataNascimento.getMonth();
  const diaNascimento = dataNascimento.getDate();

  if (
    mesAtual < mesNascimento ||
    (mesAtual === mesNascimento && diaAtual < diaNascimento)
  ) {
    idade--;
  }
  return Math.max(0, idade);
};

// (Função 'createStyles' - já estava correta,
// usando as propriedades do nosso 'theme')
function createStyles(theme: Theme) {
  const cardBg = theme.cardBackground;
  const border = theme.cardBorder;
  const muted = theme.subtitle;
  const primary = theme.buttonBackground;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingTop: 18,
      paddingHorizontal: 18,
      paddingBottom: 40,
      alignItems: 'center',
    },
    avatarWrap: {
      marginTop: 4,
      marginBottom: 14,
      alignItems: 'center',
      width: '100%',
    },
    avatarBorder: {
      width: 110,
      height: 110,
      borderRadius: 110 / 2,
      backgroundColor: cardBg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 6,
      borderColor: '#6fb0ff22',
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 96 / 2,
    },
    avatarPlaceholder: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: '#eee',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarInitial: {
      fontSize: 34,
      color: primary,
      fontWeight: '800',
    },
    infoCard: {
      width: '100%',
      marginTop: 6,
      marginBottom: 18,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: border,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: cardBg,
    },
    infoLabel: {
      fontSize: 14,
      color: muted,
      fontWeight: '600',
    },
    infoValue: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '700',
    },
    statsContainer: {
      width: '100%',
      marginTop: 14,
      alignItems: 'center',
    },
    statCard: {
      width: screenWidth - 72,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 10,
      paddingVertical: 18,
      paddingHorizontal: 14,
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: theme.cardShadow,
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 1,
    },
    statIcon: {
      fontSize: 26,
      marginBottom: 6,
      color: muted,
    },
    statValue: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: muted,
    },
    editButton: {
      marginTop: 12,
      backgroundColor: theme.buttonBackground,
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 8,
    },
    editButtonText: {
      color: theme.text,
      fontWeight: '700',
      fontSize: 14,
    },
  });
}