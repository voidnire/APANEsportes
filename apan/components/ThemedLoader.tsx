import {ActivityIndicator} from 'react-native'
import {Colors} from '@/constants/Colors'
import { ThemeContext, ThemeContextType } from '../context/ThemeContext';
import React, { useContext } from 'react';
import ThemedView from './ThemedView';

//type Theme = typeof Colors.light | typeof Colors.dark;

const ThemedLoader = () => {
    const themeContext = useContext<ThemeContextType | null>(ThemeContext);
      if (!themeContext) {
        throw new Error('Login must be used within a ThemeProvider');
      }
      const { theme } = themeContext; // PADRÃO ❕❕❕❕

    return (
        <ThemedView style={{
            flex:1,
            justifyContent:'center',
            alignItems:'center'
        }}>
            <ActivityIndicator size="large" color={theme.text}/>

        </ThemedView>
    )

}

export default ThemedLoader