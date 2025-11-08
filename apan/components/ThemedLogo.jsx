import { Image, useColorScheme} from 'react-native'

import DarkLogo from '@/assets/images/APAN.png'
//import LightLogo from '@/assets/images/APAN.png' //quando tiver as logos

const ThemedLogo = ({...props}) =>{
    const colorScheme = useColorScheme()
    //const logo = colorScheme === 'dark' ?? DarkLogo : LightLogo
    const logo = DarkLogo;
    return(
        <Image source={logo} {...props}/> 
    )
}

export default ThemedLogo