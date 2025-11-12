import { createContext, useState, ReactNode } from "react";
import { Appearance } from "react-native";
// Verifique se este caminho está correto para o seu projeto
import { Colors } from "../constants/Colors"; 

export interface ThemeContextType {
  colorScheme: "light" | "dark" | null | undefined;
  setColorScheme: (scheme: "light" | "dark" | null | undefined) => void;
  theme: typeof Colors.light | typeof Colors.dark;
}

// O valor 'null' aqui é importante para o hook (useTheme)
export const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};