import apiClient from './index';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignUpData {
  nomeCompleto: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  nomeCompleto: string; 
  createdAt: string;    
  updatedAt: string;  
}

class AuthService {
  async login(loginData: LoginData): Promise<User> {
    try {
      const response = await apiClient.post('/auth/login', loginData);
      
      return response.data; 
    } catch (error) {
      throw error;
    }
  }

  async signup(signupData: SignUpData): Promise<User> {
    try {
      const response = await apiClient.post('/auth/signup', signupData);
      
      return response.data;
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

  // Esta função já estava correta e batia com o Swagger
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Esta função usa a anterior, então já está correta
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