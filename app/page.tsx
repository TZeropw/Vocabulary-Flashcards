'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Sparkles } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, writeBatch, setDoc } from 'firebase/firestore';

const STARTER_WORDS = [
  { word: "Water", meaning: "น้ำ", category: "A1", partOfSpeech: "Noun (n.)", example: "I drink water." },
  { word: "Food", meaning: "อาหาร", category: "A1", partOfSpeech: "Noun (n.)", example: "I like spicy food." },
  { word: "House", meaning: "บ้าน", category: "A1", partOfSpeech: "Noun (n.)", example: "This is my house." },
  { word: "Cat", meaning: "แมว", category: "A1", partOfSpeech: "Noun (n.)", example: "The cat is sleeping." },
  { word: "Sun", meaning: "พระอาทิตย์", category: "A1", partOfSpeech: "Noun (n.)", example: "The sun is hot." },
  { word: "Time", meaning: "เวลา", category: "A1", partOfSpeech: "Noun (n.)", example: "What time is it?" },
  { word: "Journey", meaning: "การเดินทาง", category: "A2", partOfSpeech: "Noun (n.)", example: "A long journey." },
  { word: "Weather", meaning: "สภาพอากาศ", category: "A2", partOfSpeech: "Noun (n.)", example: "The weather is nice today." },
  { word: "Machine", meaning: "เครื่องจักร", category: "A2", partOfSpeech: "Noun (n.)", example: "A washing machine." },
  { word: "Quickly", meaning: "อย่างรวดเร็ว", category: "A2", partOfSpeech: "Adverb (adv.)", example: "He runs quickly." },
  { word: "Delicious", meaning: "อร่อย", category: "A2", partOfSpeech: "Adjective (adj.)", example: "The food is delicious." },
  { word: "Healthy", meaning: "สุขภาพดี", category: "A2", partOfSpeech: "Adjective (adj.)", example: "Eat healthy food." },
  { word: "Experience", meaning: "ประสบการณ์", category: "B1", partOfSpeech: "Noun (n.)", example: "I have 2 years of experience." },
  { word: "Knowledge", meaning: "ความรู้", category: "B1", partOfSpeech: "Noun (n.)", example: "Knowledge is power." },
  { word: "Challenge", meaning: "ความท้าทาย", category: "B1", partOfSpeech: "Noun (n.)", example: "I like new challenges." },
  { word: "Improve", meaning: "ปรับปรุง/พัฒนา", category: "B1", partOfSpeech: "Verb (v.)", example: "I want to improve my English." },
  { word: "Suggest", meaning: "แนะนำ", category: "B1", partOfSpeech: "Verb (v.)", example: "What do you suggest?" },
  { word: "Environment", meaning: "สิ่งแวดล้อม", category: "B1", partOfSpeech: "Noun (n.)", example: "Protect the environment." },
  { word: "Significant", meaning: "สำคัญ/มีนัยสำคัญ", category: "B2", partOfSpeech: "Adjective (adj.)", example: "A significant change." },
  { word: "Analyze", meaning: "วิเคราะห์", category: "B2", partOfSpeech: "Verb (v.)", example: "Analyze the data carefully." },
  { word: "Consequence", meaning: "ผลลัพธ์/ผลที่ตามมา", category: "B2", partOfSpeech: "Noun (n.)", example: "Face the consequences." },
  { word: "Efficient", meaning: "มีประสิทธิภาพ", category: "B2", partOfSpeech: "Adjective (adj.)", example: "An efficient way to work." },
  { word: "Persuade", meaning: "ชักชวน/โน้มน้าว", category: "B2", partOfSpeech: "Verb (v.)", example: "Try to persuade him." },
  { word: "Complicated", meaning: "ซับซ้อน", category: "B2", partOfSpeech: "Adjective (adj.)", example: "It's a complicated problem." },
  { word: "Ubiquitous", meaning: "มีอยู่ทุกหนทุกแห่ง", category: "C1", partOfSpeech: "Adjective (adj.)", example: "Smartphones are ubiquitous today." },
  { word: "Meticulous", meaning: "พิถีพิถัน/ละเอียดลออ", category: "C1", partOfSpeech: "Adjective (adj.)", example: "He is very meticulous." },
  { word: "Resilient", meaning: "ยืดหยุ่น/ฟื้นตัวเร็ว", category: "C1", partOfSpeech: "Adjective (adj.)", example: "A resilient economy." },
  { word: "Ambiguous", meaning: "กำกวม/คลุมเครือ", category: "C1", partOfSpeech: "Adjective (adj.)", example: "An ambiguous answer." },
  { word: "Inevitable", meaning: "ซึ่งหลีกเลี่ยงไม่ได้", category: "C1", partOfSpeech: "Adjective (adj.)", example: "It was an inevitable result." },
  { word: "Crucial", meaning: "สำคัญมาก/วิกฤต", category: "C1", partOfSpeech: "Adjective (adj.)", example: "A crucial decision." },
  { word: "Ephemeral", meaning: "ไม่ยั่งยืน/อยู่ได้ไม่นาน", category: "C2", partOfSpeech: "Adjective (adj.)", example: "Fame is often ephemeral." },
  { word: "Paradigm", meaning: "กระบวนทัศน์/แบบอย่าง", category: "C2", partOfSpeech: "Noun (n.)", example: "A paradigm shift in education." },
  { word: "Eloquent", meaning: "มีวาทศิลป์/พูดจาจับใจ", category: "C2", partOfSpeech: "Adjective (adj.)", example: "She gave an eloquent speech." },
  { word: "Mitigate", meaning: "บรรเทา/ทำให้เบาบางลง", category: "C2", partOfSpeech: "Verb (v.)", example: "Mitigate the effects of climate change." },
  { word: "Pragmatic", meaning: "ในทางปฏิบัติ/เน้นความเป็นจริง", category: "C2", partOfSpeech: "Adjective (adj.)", example: "A pragmatic approach to the problem." },
  { word: "Anomaly", meaning: "ความผิดปกติ/สิ่งผิดปกติ", category: "C2", partOfSpeech: "Noun (n.)", example: "There is an anomaly in the data." }
];

export default function RootPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'ผู้ใช้งาน');
        localStorage.setItem('vocab-username', displayName);
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim() || !password.trim()) return;

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        const batch = writeBatch(db);
        const todayStr = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

        STARTER_WORDS.forEach((wordObj) => {
          const docRef = doc(collection(db, 'vocabularies'));
          batch.set(docRef, {
            ...wordObj,
            userId: uid,
            weight: 10,
            createdAt: todayStr
          });
        });

        const userRef = doc(db, 'users', uid);
        batch.set(userRef, {
          lastLoginDate: new Date().toDateString(),
          streakCount: 1
        });

        await batch.commit();
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setErrorMsg('อีเมลนี้ถูกใช้งานไปแล้ว');
      else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      else if (err.code === 'auth/weak-password') setErrorMsg('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      else setErrorMsg('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <BookOpen className="text-primary dark:text-primary-light transition-colors" size={40} />
          <Sparkles className="text-secondary dark:text-yellow-400 transition-colors" size={24} />
        </div>
        <h1 className="text-4xl font-black text-gray-800 dark:text-white transition-colors">คลังคำศัพท์</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors">รวบรวมและจัดการคำศัพท์ของคุณ</p>
      </div>

      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[2rem] shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-500">
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl mb-6 transition-colors">
          <button onClick={() => { setIsLogin(true); setErrorMsg(''); }} className={`flex-1 py-3 rounded-xl font-bold transition-all ${isLogin ? 'bg-white dark:bg-gray-700 text-primary dark:text-primary-light shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>เข้าสู่ระบบ</button>
          <button onClick={() => { setIsLogin(false); setErrorMsg(''); }} className={`flex-1 py-3 rounded-xl font-bold transition-all ${!isLogin ? 'bg-white dark:bg-gray-700 text-primary dark:text-primary-light shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>สมัครสมาชิก</button>
        </div>

        {errorMsg && <div className="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 p-3 rounded-xl text-sm font-medium mb-4 text-center border border-red-100 dark:border-red-800/50 transition-colors">{errorMsg}</div>}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">อีเมล (Email)</label>
            <input type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary outline-none transition-colors" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">รหัสผ่าน (6 ตัวขึ้นไป)</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary outline-none transition-colors" required minLength={6} />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark dark:hover:bg-indigo-500 shadow-lg shadow-primary/25 transition mt-2">
            {isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชี'}
          </button>
        </form>
      </div>
    </div>
  );
}