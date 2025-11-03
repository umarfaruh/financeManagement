import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// === Вставлены твои данные Firebase (как ты дал) ===
const firebaseConfig = {
  apiKey: "AIzaSyC-JwxcC-S599a1asiDZrHxFhj8o9WzgbY",
  authDomain: "finance-management-f3c85.firebaseapp.com",
  projectId: "finance-management-f3c85",
  storageBucket: "finance-management-f3c85.firebasestorage.app",
  messagingSenderId: "802076761061",
  appId: "1:802076761061:web:cde537d2f7046b2824ad0c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// helper for admin fetch
export async function fetchAllData(){
  const subsQ = query(collection(db,'subscriptions'), orderBy('createdAt','desc'));
  const contQ = query(collection(db,'contacts'), orderBy('createdAt','desc'));
  const subsSnap = await getDocs(subsQ);
  const contSnap = await getDocs(contQ);
  const rows = [];
  subsSnap.forEach(d => rows.push({type:'subscription', ...d.data()}));
  contSnap.forEach(d => rows.push({type:'contact', ...d.data()}));
  return rows;
}
