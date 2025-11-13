// 1. Import React (necessário para JSX)
import React, { useContext, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';

import ThemedText from '@/components/ThemedText';
import Spacer from '@/components/Spacer';
import ThemedView from '@/components/ThemedView';
import ThemedButton from '@/components/ThemedButton';
import ThemedTextInput from '@/components/ThemedTextInput';

// Imports para tipagem e contexto
import { ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import { useUser } from '@/hooks/useUser';
import { Colors } from '@/constants/Colors'; // Importado para tipar o 'theme'

// (Este tipo nós definimos em outros arquivos)
type Theme = typeof Colors.light | typeof Colors.dark;

const Login = () => {
  // 2. Tipagem do state
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');

  const [error,setError] = useState<string | null>(null);

  const router = useRouter()
  // PADRÃO ❕❕❕❕
  // 3. Checagem de contexto nulo (ESSENCIAL)
  const themeContext = useContext<ThemeContextType | null>(ThemeContext);
  if (!themeContext) {
    throw new Error('Login must be used within a ThemeProvider');
  }
  const { theme } = themeContext; // PADRÃO ❕❕❕❕
  const styles = createStyles(theme); // PADRÃO ❕❕❕❕

  // 4. Chamada CORRETA do hook (com parênteses)
  const { login, loading } = useUser();

  const handleSubmit = async () => {
    setError(null)

    try {
      if (!email || !senha) {
        Alert.alert('Atenção', 'Por favor, preencha email e senha');
        return;
      }
      console.log('Login form submitted: ', email, senha);

      // 5. A chamada do login() está CORRETA
      //    (ela bate com o que definimos no UserContext.tsx)
      const result = await login(email, senha);
      if (result.success) {
        // A navegação acontece automaticamente pelo _layout
        console.log('Login realizado:', result.user);
        router.push({
          pathname: '/', // Caminho completo
          // Passamos o nome para o layout (como o layout esperava)

        });
      }
      // O 'catch' de erros já é tratado dentro do 'login' no UserContext
    } catch (err: any) {
      // Este catch é só para erros inesperados
      setError(err.message)
      //Alert.alert('Erro Inesperado', err.message || 'Ocorreu um problema.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <Spacer />
        {/* Assumindo que ThemedText aceita a prop 'title' */}
        <ThemedText title={true} style={styles.title}>
          Entre na sua conta
        </ThemedText>

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

        {/* 6. Usando o 'loading' para desabilitar o botão */}
        <ThemedButton onPress={handleSubmit} disabled={loading}>
          <ThemedText>
            {loading ? 'Carregando...' : 'Login'}
          </ThemedText>
        </ThemedButton>

        <Spacer/>

        {error && <ThemedText style={styles.error}>{error}</ThemedText>}

        <Spacer height={100} />

        <Link href="/register">
          <ThemedText style={{ textAlign: 'center' }}>
            Cadastre-se!
          </ThemedText>
        </Link>

        <Spacer/>


      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

// 7. Tipagem do 'theme' e correção do typo 'justifyContent'
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
    btn: {
      backgroundColor: theme.buttonBackground,
      padding: 15,
      borderRadius: 5,
    },
    pressed: {
      opacity: 0.8,
    },
    error:{
      color:Colors.warning.color,
      padding:10,
      backgroundColor:'#f5c1c8',
      borderColor:Colors.warning.color,
      borderWidth:1,
      borderRadius:6,
      marginHorizontal:10,
    }
  });