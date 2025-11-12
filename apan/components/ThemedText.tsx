import { Text, useColorScheme, TextProps } from 'react-native';
// 1. AJUSTE: Corrigido para caminho relativo
import { Colors } from '../constants/Colors';

// 2. AJUSTE: Criamos uma interface para as props customizadas
interface ThemedTextProps extends TextProps {
  title?: boolean;
}

// 3. AJUSTE: Aplicamos a nova interface de props
const ThemedText = ({ style, title = false, ...props }: ThemedTextProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  // 4. Sua lógica (correta) para a cor
  const textColor = title ? theme.title : theme.text;

  return (
    <Text
      style={[{ color: textColor }, style]}
      {...props} // Agora 'children' e outras props são passadas corretamente
    />
  );
};

export default ThemedText;