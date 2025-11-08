import React, { useContext, useState } from "react";
import {Link} from 'expo-router'
import {StyleSheet, Pressable} from 'react-native'

import ThemedText from "@/components/ThemedText"
import Spacer from "@/components/Spacer"
import ThemedView from "@/components/ThemedView"
import ThemedButton from "@/components/ThemedButton"

import { ThemeContext } from "@/context/ThemeContext";

const Login = () => {
    // PADRÃO ❕❕❕❕
    const { theme } = useContext(ThemeContext); // PADRÃO ❕❕❕❕
    const styles = createStyles(theme); // PADRÃO ❕❕❕❕

    const handleSubmit = () =>{
        console.log('Login form submitted')
    }

    return (
        <ThemedView style= {styles.container}>
            <Spacer/>
            <ThemedText title={true} style={styles.title}>
                Entre na sua conta
            </ThemedText>

            <ThemedButton onPress={handleSubmit}>
                <ThemedText>
                    Login
                </ThemedText>
            </ThemedButton>
            

            <Spacer height={100}/>

            <Link href='/register'> 
                <ThemedText style={{textAlign: 'center'}}>
                    Cadastre-se!
                </ThemedText>
             </Link>



        </ThemedView>
    )
}

export default Login

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
    },
    btn:{
        backgroundColor:theme.buttonBackground,
        padding:15,
        borderRadius:5
    },
    pressed: {
        opacity:0.8
    }
    

})