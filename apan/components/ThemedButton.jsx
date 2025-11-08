import {Pressable,StyleSheet} from 'react-native'
import { ThemeContext } from "@/context/ThemeContext";
import React, { useContext } from "react";

function ThemedButton({ style, ...props}) {
    // PADRÃO ❕❕❕❕
    const { theme } = useContext(ThemeContext); // PADRÃO ❕❕❕❕
    const styles = createStyles(theme); // PADRÃO ❕❕❕❕

    return (
        <Pressable 
                style = {({pressed})=>[styles.btn, pressed && styles.pressed,
                    style]}
                    {...props}
                >
                
            </Pressable>
    )
}

const createStyles = (theme) =>
  StyleSheet.create({
    btn:{
        backgroundColor: theme.buttonBackground,
        padding: 18,
        borderRadius:6,
        marginVertical: 10
    },
    pressed: {
        opacity:0.5
    }
})

export default ThemedButton