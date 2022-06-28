import { useState, createContext, useEffect } from 'react'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from "firebase/auth";
import _auth from '../services/firebaseConnection'
import { urlBase } from '../config/api_configs';
import axios from 'axios';

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    //const [loading, setLoading] = useState(false);

    useEffect(() => {
            const storagedUser = onAuthStateChanged(_auth, (currentUser) =>{
                setUser(currentUser);
            });
        return () => storagedUser();
    }, []);

    async function signUp(email, password) {
        //Criar usario no Firebase baseado no email e senha e Salvador em um banco mysql
        await createUserWithEmailAndPassword(_auth, email, password)
        await axios.post(urlBase + '/user', {email});
    }

    async function signIn(email, password) {
        await signInWithEmailAndPassword(_auth, email, password);  
    }

    async function logout() {
        return await signOut(_auth);
    }

    return (
        <AuthContext.Provider value={{
            user,
            signUp,
            logout,
            signIn,
            setUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthProvider;