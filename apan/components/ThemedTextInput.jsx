import {TextInput, useColorScheme} from 'react-native'
import {Colors} from '@/constants/Colors'

const ThemedTextInput = ({style, ...props}) =>{
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    const textColor = theme.text

    return(
        <TextInput 
            style={[
                {
                backgroundColor: theme.cardBackground,
                color:textColor,
                borderRadius:6,
                padding:20
            },
            style
        ]}
        {...props}/>
    )
}

export default ThemedTextInput