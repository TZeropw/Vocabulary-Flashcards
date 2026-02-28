// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// เอา Config ของคุณจากเว็บ Firebase มาวางทับตรงนี้ครับ 👇
const firebaseConfig = {
  apiKey: "AIzaSyAZ0a45m16SJa7Rr3zT_UYI4WEjwkxwPmU",
  authDomain: "vocab-flashcards-dd595.firebaseapp.com",
  projectId: "vocab-flashcards-dd595",
  storageBucket: "vocab-flashcards-dd595.firebasestorage.app",
  messagingSenderId: "710223877371",
  appId: "1:710223877371:web:1358f89173780a441c0c5e"
};

// ป้องกันการ Initialize ซ้ำใน Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ส่งออกระบบ Auth (ล็อกอิน) และ Firestore (ฐานข้อมูล) ไปให้หน้าอื่นใช้งาน
export const auth = getAuth(app);
export const db = getFirestore(app);