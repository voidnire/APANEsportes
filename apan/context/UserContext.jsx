import { createContext,useState } from 'react'

export const UserContext = createContext()

export function UserProvider({children}){
    const [user,setUser] = useState(null)

    async function login(email,senha){

    }

    async function register(email,senha){

    }

    async function logout(){

    }
    
    return (
        <UserContext.Provider value={{user, login, register,logout}}>
            {children}
        </UserContext.Provider>
    ) 

}