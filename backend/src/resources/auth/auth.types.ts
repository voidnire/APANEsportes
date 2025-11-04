import { Usuario } from "@prisma/client";

// DTO para o cadastro (signup)
// (Este já estava correto)
export type SignUpDTO = Pick<Usuario, "nomeCompleto" | "email"> & {
  password: string;
};

// DTO para o login (AQUI ESTÁ A CORREÇÃO)
export type LoginDTO = Pick<Usuario, "email"> & {
  password: string;
};