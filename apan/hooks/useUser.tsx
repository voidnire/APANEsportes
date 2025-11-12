import { useContext } from "react";
// AJUSTE: Caminho relativo em vez de '@/'
import { UserContext, UserContextType } from "../context/UserContext"; 

export function useUser() {
  // Passa o tipo para o useContext para melhor inferência
  const context = useContext<UserContextType | null>(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}