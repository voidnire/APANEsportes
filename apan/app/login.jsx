import { Link,useRouter } from 'expo-router';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { ThemeContext } from "@/context/ThemeContext";
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState, useContext, useEffect } from "react";

export default function LoginScreen(){
  const router = useRouter()

  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Login Screen</ThemedText>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button}
        onPress={()=> router.push('/')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
      <Link href="/" style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
}); 