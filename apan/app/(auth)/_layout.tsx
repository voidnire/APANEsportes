import {Stack} from "expo-router";
import { useUser } from "@/hooks/useUser";

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