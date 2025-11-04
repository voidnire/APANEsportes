import { Usuario } from "@prisma/client";
import { prisma } from "../../database/prismaSingleton"; // Ajuste o caminho se necessário
import { SignUpDTO, LoginDTO } from "./auth.types";
import bcrypt from "bcryptjs";

/**
 * Busca um usuário pelo e-mail.
 */
export const getUsuarioByEmail = (email: string): Promise<Usuario | null> => {
  return prisma.usuario.findUnique({
    where: { email: email.toLowerCase() },
  });
};

/**
 * Busca um usuário pelo ID.
 */
export const getUsuarioById = (id: string): Promise<Usuario | null> => {
  return prisma.usuario.findUnique({
    where: { id },
  });
};

/**
 * Cria um novo usuário (treinador) no banco de dados.
 * Inclui o hashing da senha.
 */
export const createUsuario = async (data: SignUpDTO): Promise<Usuario> => {
  // Pega o número de "rounds" do .env ou usa 10 como padrão
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
  
  // Cria o hash da senha
  const senhaHash = await bcrypt.hash(data.password, saltRounds);

  // Cria o usuário no banco
  return prisma.usuario.create({
    data: {
      nomeCompleto: data.nomeCompleto,
      email: data.email.toLowerCase(),
      senhaHash: senhaHash,
    },
  });
};

/**
 * Verifica as credenciais de login (email e senha).
 * Retorna o objeto do usuário se a senha for válida, ou null se for inválida.
 */
export const checkCredentials = async (
  data: LoginDTO
): Promise<Usuario | null> => {
  // 1. Encontra o usuário pelo e-mail
  const usuario = await getUsuarioByEmail(data.email);
  if (!usuario) {
    return null; // Usuário não encontrado
  }

  // 2. Compara a senha enviada com o hash salvo no banco
  const senhaValida = await bcrypt.compare(data.password, usuario.senhaHash);
  if (!senhaValida) {
    return null; // Senha incorreta
  }

  // 3. Credenciais válidas
  return usuario;
};