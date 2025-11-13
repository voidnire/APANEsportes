import {useUser} from '@/hooks/useUser'
import {useRouter} from 'expo-router'
import React, { ReactNode, useEffect } from 'react';
import ThemedLoader from '../ThemedLoader';

type GuestOnlyProps = {
    children?: ReactNode; // <-- Agora 'ReactNode' é válido
};

const GuestOnly = ({children}:GuestOnlyProps) => {
    const {user, isAuthenticated} = useUser()
    const router = useRouter()

    useEffect(()=>{
        if(isAuthenticated && user !== null){
            router.replace('/(dashboard)/home') /*pro index ou home ou seila*/
        }
    }, [user, isAuthenticated,router])

    if(!isAuthenticated || user){ //!user
        return (
            <ThemedLoader/>
        )
    }

    return children
};

export default GuestOnly;