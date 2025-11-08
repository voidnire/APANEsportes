import React, { useContext, useState } from "react";
import {Link} from 'expo-router'
import {StyleSheet, View} from 'react-native'
import { ThemeContext } from "@/context/ThemeContext";

import ThemedText from "@/components/ThemedText"
import Spacer from "@/components/Spacer"
import ThemedView from "@/components/ThemedView"
import ThemedButton from "@/components/ThemedButton"

const Register = () => {
    // PADRÃO ❕❕❕❕
    const { theme } = useContext(ThemeContext); // PADRÃO ❕❕❕❕
    const styles = createStyles(theme); // PADRÃO ❕❕❕❕

    const handleSubmit = () =>{
        console.log('Register form submitted')
    }

    return (
        <ThemedView style= {styles.container}>
            <Spacer/>
            <ThemedText title={true} style={styles.title}>
                Cadastre-se
            </ThemedText>
            
            <ThemedButton onPress={handleSubmit}>
                <ThemedText>
                    Cadastro
                </ThemedText>
            </ThemedButton>
            


            <Spacer height={100}/>
            
            <Link href='/login'> 
                <ThemedText style={{textAlign: 'center'}}>
                    Entre na sua conta
                </ThemedText>
             </Link>



        </ThemedView>
    )
}

export default Register

const createStyles = (theme) =>
  StyleSheet.create({
    container:{
        flex:1,
        justifyContext:"center",
        alignItems:"center"
    },
    title:{
        textAlign:"center",
        fontSize:18,
        marginBottom:30

    }

})