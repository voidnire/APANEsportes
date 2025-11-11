import React, { useContext, useState } from "react";
import {Link} from 'expo-router'
import {StyleSheet, Keyboard
    , TouchableWithoutFeedback
} from 'react-native'

import ThemedText from "@/components/ThemedText"
import Spacer from "@/components/Spacer"
import ThemedView from "@/components/ThemedView"
import ThemedButton from "@/components/ThemedButton"

import { ThemeContext } from "@/context/ThemeContext";

import ThemedTextInput from "@/components/ThemedTextInput"
import { useUser } from "@/hooks/useUser";

const Login = () => {
    const [email,setEmail] = useState('')
    const [senha,setSenha] = useState('')

    const {user} = useUser

    // PADRÃO ❕❕❕❕
    const { theme } = useContext(ThemeContext); // PADRÃO ❕❕❕❕
    const styles = createStyles(theme); // PADRÃO ❕❕❕❕

    const handleSubmit = () =>{
        console.log("current user:", user)
        console.log('Login form submitted',email,senha)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <ThemedView style= {styles.container}>
                <Spacer/>
                <ThemedText title={true} style={styles.title}>
                    Entre na sua conta
                </ThemedText>

                <ThemedTextInput 
                    style={{ width:'80%', 
                        marginBottom:20,
                    }}
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    value={email}
                />

                <ThemedTextInput 
                    style={{ width:'80%', 
                        marginBottom:20,
                    }}
                    placeholder="Senha"
                    onChangeText={setSenha}
                    value={senha}
                    secureTextEntry
                />
                

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
        </TouchableWithoutFeedback>

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