import {initializeApp} from "firebase/app"
import{getAuth} from "firebase/auth"

const firebaseOptions = {
    apiKey: "AIzaSyAEeKMaGEiA6ieIk5qdrcrzxttVh1VJrpQ",
    authDomain: "service-desk-28b4e.firebaseapp.com",
    projectId: "service-desk-28b4e",
    storageBucket: "service-desk-28b4e.appspot.com",
    messagingSenderId: "563023548121",
    appId: "1:563023548121:web:b342f02ea213045968f8c8",
    measurementId: "G-XTSVRWQTLS"
}

const app=initializeApp(firebaseOptions);
var auth=null;
if(app){
    auth=getAuth();
}

export default auth;