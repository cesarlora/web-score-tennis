import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAVs6PXhAakfWguF8Y_J7Y3azDdF-iznCU",
  authDomain: "score-tennis-ed5ca.firebaseapp.com",
  projectId: "score-tennis-ed5ca",
  storageBucket: "score-tennis-ed5ca.firebasestorage.app",
  messagingSenderId: "485539021170",
  appId: "1:485539021170:web:f68baec88ea09bd5555deb"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)