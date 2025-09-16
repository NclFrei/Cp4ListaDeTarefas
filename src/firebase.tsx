import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore,collection,addDoc,getDocs,doc,updateDoc,deleteDoc } from "firebase/firestore";

//Vai pegar o getReactNativePersistence mesmo sem tipagem
const {getReactNativePersistence} = require("firebase/auth") as any
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxe-b_erT4JZDMyqdBdtM0ZV8EdqMwhSA",
  authDomain: "listadetarefas-781f0.firebaseapp.com",
  projectId: "listadetarefas-781f0",
  storageBucket: "listadetarefas-781f0.firebasestorage.app",
  messagingSenderId: "28579822218",
  appId: "1:28579822218:web:6e221fce3d6fb9ba674b73"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

const auth = initializeAuth(app,{
  persistence:getReactNativePersistence(AsyncStorage)
});
export {auth,db,collection,addDoc,getDocs,doc,updateDoc,deleteDoc}