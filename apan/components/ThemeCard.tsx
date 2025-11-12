import { StyleSheet, useColorScheme, View, ViewProps } from 'react-native';
import { Colors } from '../constants/Colors';

const ThemedCard = ({ style, ...props }: ViewProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light']; 

  return (
    <View
      style={[
        { backgroundColor: theme.background }, 
        styles.card, // Estilos base do card
        style, // Estilos customizados passados via prop
      ]}
      {...props} 
    />
  );
};

export default ThemedCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 20,
  },
});