import apiClient from './index';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignUpData {
  nomeCompleto:string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt:Date;
  updatedAt:Date;
  // outros campos que sua API retorna
}

class AuthService {
  async login(loginData: LoginData): Promise<User> {
    try {
      const response = await apiClient.post('/auth/login', loginData);
      
      // O cookie httpOnly é automaticamente armazenado pelo navegador
      // e enviado nas próximas requisições graças ao withCredentials: true
      
      return response.data.user; // ajuste conforme a resposta da sua API
    } catch (error) {
      throw error;
    }
  }

    async signup(signupData: SignUpData): Promise<User> {
    try {
      const response = await apiClient.post('/auth/signup', signupData);
      
      return response.data.user; // ajuste conforme a resposta da sua API
    } catch (error) {
      throw error;
    }
  }


  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Verifica se o usuário está autenticado
  async checkAuth(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();