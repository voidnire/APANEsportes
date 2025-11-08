import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import APANLOGO from '@/assets/images/APAN.png';
import {Link} from 'expo-router';
import { ThemeContext } from "@/context/ThemeContext";
import React, { useContext, useState } from "react";
import ThemedText from "@/components/ThemedText"
import Spacer from "@/components/Spacer"

const HomeScreen = () => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  
  const MenuCard = ({ iconName, iconColor, iconBgColor, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
      <Image
        source={APANLOGO}
        style={{ width: 25, height: 24, tintColor: iconColor }}
        resizeMode="cover"
      />
    </View>
    <View style={styles.cardTextContainer}>
      <ThemedText style={styles.cardTitle} title={true}>{title}</ThemedText>
      <ThemedText style={styles.cardSubtitle}>{subtitle}</ThemedText>
    </View>
  </TouchableOpacity>
);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Image source={APANLOGO}    
          style={{width: 50, height: 50}}/>
          <ThemedText style={styles.headerSubtitle}>Monitoramento de Atletas</ThemedText>
        </View>

        {/* Título de Boas-vindas */}
        <ThemedText style={styles.welcomeTitle} title={true}>Bem vindo, [nome]</ThemedText>
        <Spacer height={30}/>

        {/*<ThemeCard>
          <Text style={{color:theme.text}}>Oie</Text>
        </ThemeCard>*/}

        {/* Opções do Menu */}
        <View style={styles.menuContainer}>
          <MenuCard
            iconName="clipboard-list"
            iconColor="#007AFF"
            iconBgColor="#E6F2FF"
            title="Registrar Dados"
            subtitle="Record athlete performance metrics and test results"
            onPress={() => console.log('Register Data pressed')}
          />
          <MenuCard
            iconName="chart-bar"
            iconColor="#FF6A4D"
            iconBgColor="#FFF0ED"
            title="Consultar Desempenho"
            subtitle="View and analyze athlete performance over time"
            onPress={() => console.log('Dashboard pressed')}
          />
          <MenuCard
            iconName="settings-sharp"
            iconColor="#555555"
            iconBgColor="#F4F4F4"
            title="Configurações"
            subtitle="Manage sensors, profiles, and export data"
            onPress={() => console.log('Settings pressed')}
          />
        </View>

        {/* Botão de Ação Rápida */}
        <TouchableOpacity style={styles.quickStartButton}>
          <Text style={styles.quickStartButtonText}>
            Quick Start Training Session
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme)  => 
  StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF', // Azul do logo
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8A8A8E',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: theme.subtitle,
    lineHeight: 22,
  },
  menuContainer: {
    width: '100%',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // Sombra sutil
    shadowColor: theme.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderColor: theme.carbBorder,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1, // Garante que o texto quebre a linha se for muito longo
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#8A8A8E',
    marginTop: 4,
    lineHeight: 18,
  },
  quickStartButton: {
    backgroundColor: theme.buttonBackground, // Azul/Ciano do botão
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto', // Empurra o botão para baixo se houver espaço
    paddingTop: 18, // Adicionado para garantir padding superior
    marginBottom: 10, // Margem inferior
  },
  quickStartButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;