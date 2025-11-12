import React, { useContext, useState } from 'react';
import { Link } from 'expo-router';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

// (Assumindo que os @/ imports agora funcionam)
import { ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import ThemedText from '@/components/ThemedText';
import Spacer from '@/components/Spacer';
import ThemedView from '@/components/ThemedView';
import ThemedButton from '@/components/ThemedButton';
import ThemedTextInput from '@/components/ThemedTextInput';
import { useUser } from '@/hooks/useUser';
import { Colors } from '@/constants/Colors'; // Importado para tipar o 'theme'

// (Este tipo nós definimos em outros arquivos)
type Theme = typeof Colors.light | typeof Colors.dark;

const Register = () => {
  // 1. Tipagem do state
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [nomeCompleto, setNomeCompleto] = useState<string>('');

  // PADRÃO ❕❕❕❕
  // 2. Checagem de contexto nulo (ESSENCIAL)
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('Register must be used within a ThemeProvider');
  }
  const { theme } = themeContext;
  // PADRÃO ❕❕❕❕
  const styles = createStyles(theme);

  // 3. Chamada CORRETA do hook (com parênteses)
  const { register, loading } = useUser();

  const handleSubmit = async () => {
    try {
      if (!email || !senha || !nomeCompleto) {
        Alert.alert('Atenção', 'Por favor, preencha todos os campos');
        return;
      }
      console.log('Register form submitted: ', nomeCompleto, email, senha);

      // 4. AJUSTE CRÍTICO: Passando todos os parâmetros
      //    (Conforme definido no nosso UserContext.tsx)
      const result = await register(nomeCompleto, email, senha);

      if (result && result.success) {
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
        // Navegação automática pelo AppNavigator
      }
      // O 'else if' não é necessário, pois o 'register' no
      // UserContext já exibe o Alert de erro.
    } catch (error: any) {
      console.log('Erro inesperado no registro:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado: ' + error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <Spacer />
        <ThemedText title={true} style={styles.title}>
          Cadastre-se
        </ThemedText>

        <ThemedTextInput
          style={{ width: '80%', marginBottom: 20 }}
          placeholder="Nome Completo"
          onChangeText={setNomeCompleto}
          value={nomeCompleto}
          autoCapitalize="words"
        />

        <ThemedTextInput
          style={{ width: '80%', marginBottom: 20 }}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
        />

        <ThemedTextInput
          style={{ width: '80%', marginBottom: 20 }}
          placeholder="Senha"
          onChangeText={setSenha}
          value={senha}
          secureTextEntry
        />

        {/* 5. Usando o 'loading' para desabilitar o botão */}
        <ThemedButton onPress={handleSubmit} disabled={loading}>
          <ThemedText>
            {loading ? 'Cadastrando...' : 'Cadastro'}
          </ThemedText>
        </ThemedButton>

        <Spacer height={100} />

        <Link href="/login">
          <ThemedText style={{ textAlign: 'center' }}>
            Entre na sua conta
          </ThemedText>
        </Link>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

// 6. Tipagem do 'theme' e correção do typo 'justifyContent'
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center', // <-- Corrigido
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      fontSize: 18,
      marginBottom: 30,
    },
  });