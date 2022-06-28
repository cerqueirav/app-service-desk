import {initializeApp} from "firebase/app"
import{getAuth} from "firebase/auth"
import FirebaseSettings from "../config/firebase_settings";

const app=initializeApp(FirebaseSettings);
var auth=null;
if(app){
    auth=getAuth();
}

export default auth;