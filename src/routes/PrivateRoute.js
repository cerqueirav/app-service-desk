import {Navigate} from 'react-router-dom';
import {useContext} from "react";
import {AuthContext} from "../contexts/auth";

export default function PrivateRoute({children}){
    const { user } = useContext(AuthContext);
    return user ? children : <Navigate to='/'/>;
}