import { useColorScheme, View, ViewProps } from 'react-native';
// O caminho relativo já estava correto
import { Colors } from '../constants/Colors';

// AJUSTE: Tipagem com ViewProps (que já inclui 'style' e 'children')
const ThemedView = ({ style, ...props }: ViewProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[{ backgroundColor: theme.background }, style]}
      {...props} // Passa 'children' e outras props
    />
  );
};

export default ThemedView;