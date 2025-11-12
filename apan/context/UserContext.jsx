import { createContext,useState,useEffect } from 'react'
import AuthService, {LoginData,SignUpData, User} from "@/services/auth"
import { Alert } from 'react-native';

import apiClient from '@/services/index'


export const UserContext = createContext()

export function UserProvider({children}){
    const [user,setUser] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth(){
        try{
            setLoading(true);
            const response = await apiClient.get('/auth/me');
            setUser(response.data);
        }catch(error){
            console.log("ERRO: Nenhum usuário logado ou CORS: ", error.message)
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(email,senha){
        try {
            setLoading(true);
            const response = await apiClient.post('/auth/login', {
                email,
                password: senha
            });

            // O cookie httpOnly é automaticamente armazenado
            // Buscar os dados do usuário após login
            const userResponse = await apiClient.get('/auth/me');
            setUser(userResponse.data);
            
            return { success: true, user: userResponse.data };
        } catch (error) {
            const message = error.response?.data?.message || 'Erro ao fazer login';
            Alert.alert('Erro', message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    }

    async function register(nomeCompleto, email,senha){
        try{
            setLoading(true)
            console.log('Tentando registrar:', email);

            const response = await apiClient.post('auth/signup',{
                nomeCompleto:nomeCompleto,email: email,password:senha
            }, {
                timeout: 10000, // 10 segundos timeout
            }) 

            console.log('Registro bem-sucedido:', response.data);


            // login automático após registrar
            const loginResult  = await login(email,senha)
            return loginResult;

        }catch(error){

            console.log('Erro completo no registro:', error);
            
            // Tratamento específico para CORS
            if (error.message === 'Network Error' || error.code === 'NETWORK_ERROR') {
                Alert.alert(
                    'Erro de Conexão', 
                    'Não foi possível conectar ao servidor. Problema de CORS.\n\nSoluções:\n1. Contate o administrador do backend\n2. Use um backend local\n3. Configure CORS no servidor'
                );
                return { 
                    success: false, 
                    error: 'Erro de CORS - Não foi possível conectar ao servidor' 
                };
            }


            const message = error.response?.data?.message || error.message || 'Erro ao criar conta';
            console.log(error.message)
            Alert.alert('Erro no Cadastro', message);

            return {
                success:false,error:message
            }            
        }finally{
            setLoading(false)
        }
    }

    async function logout(){
        try{
            await apiClient.post('/auth/logout');
            setUser(null);
            Alert.alert('Sucesso', 'Logout realizado com sucesso');
        } catch (error) {
            console.log('Erro no logout:', error.message);
            // Mesmo com erro, limpa o usuário localmente
            setUser(null);
        }

    }
    
    return (
        <UserContext.Provider value={{user, login, register,logout,loading,isAuthenticated:!!user }}>
            {children}
        </UserContext.Provider>
    ) 

}