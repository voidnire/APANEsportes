import {useUser} from '@/hooks/useUser'
import {useRouter} from 'expo-router'
import React, { ReactNode ,useEffect } from 'react';
import ThemedLoader from '../ThemedLoader';

type UserOnlyProps = {
    children?: ReactNode; // <-- Agora 'ReactNode' é válido
};

const UserOnly = ({children}:UserOnlyProps) => {
    const {user, isAuthenticated} = useUser()
    const router = useRouter()

    useEffect(()=>{
        if(isAuthenticated && user ===null){
            console.log("Reencaminhando para login . . .")
            router.replace('/(auth)/login')
        }
    }, [user, isAuthenticated,router])

    if(!isAuthenticated || user === null || !user){ //!user
        return (
            <ThemedLoader/>
        )
    }

    return children
};

export default UserOnly;