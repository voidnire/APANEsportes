import React, { useContext, useState } from "react";
import {Link} from 'expo-router'
import {StyleSheet,TouchableWithoutFeedback, Keyboard } from 'react-native'
import { ThemeContext } from "@/context/ThemeContext";

import ThemedText from "@/components/ThemedText"
import Spacer from "@/components/Spacer"
import ThemedView from "@/components/ThemedView"
import ThemedButton from "@/components/ThemedButton"
import ThemedTextInput from "@/components/ThemedTextInput"

const Register = () => {
    const [email,setEmail] = useState('')
    const [senha,setSenha] = useState('')

    // PADRÃO ❕❕❕❕
    const { theme } = useContext(ThemeContext); // PADRÃO ❕❕❕❕
    const styles = createStyles(theme); // PADRÃO ❕❕❕❕

    const handleSubmit = () =>{
        console.log('Register form submitted: ',email,senha)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style= {styles.container}>
                <Spacer/>
                <ThemedText title={true} style={styles.title}>
                    Cadastre-se
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
        </TouchableWithoutFeedback>
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