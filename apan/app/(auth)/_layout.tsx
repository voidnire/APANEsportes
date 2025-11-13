import {Stack} from "expo-router";
import { useUser } from "@/hooks/useUser";
import GuestOnly from "@/components/auth/GuestOnly";

export default function Layout(){

    const {user} =  useUser()
    console.log(user)

    return (
        <GuestOnly>
            <Stack
                screenOptions={{ headerShown:false, animation:"none"}}/>
        </GuestOnly>
    )
}