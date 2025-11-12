import { useUser } from "@/hooks/useUser";
import {Stack} from "expo-router";

export default function Layout(){

    const {user} =  useUser()
    console.log(user)

    return (
        <>
            <Stack
                screenOptions={{ headerShown:false, animation:"none"}}/>
        </>
    )
}