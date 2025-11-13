import { TextInput, useColorScheme, TextInputProps } from 'react-native';
import { Colors } from '../constants/Colors';


const ThemedTextInput = ({ style, ...props }: TextInputProps) => {
  const colorScheme = useColorScheme();

  const theme = Colors[colorScheme ?? 'light'];

  const textColor = theme.text;

  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.cardBackground, 
          color: textColor,
          borderRadius: 6,
          padding: 20,
        },
        style, 
      ]}
      placeholderTextColor={theme.subtitle}
      {...props} 
    />
  );
};

export default ThemedTextInput;