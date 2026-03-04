'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Sparkles } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

export default function RootPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.email ? user.email.split('@')[0] : 'ผู้ใช้งาน';
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
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err.code);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('อีเมลนี้ถูกใช้งานไปแล้ว');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('รูปแบบอีเมลไม่ถูกต้อง');
      } else {
        setErrorMsg('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    }
  };

  return (
    // ถอด bg-gray-50 ออก เพื่อให้มันใช้พื้นหลัง Gradient ตัวใหม่จาก layout.tsx
    <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <BookOpen className="text-primary dark:text-primary-light transition-colors" size={40} />
          <Sparkles className="text-secondary dark:text-yellow-400 transition-colors" size={24} />
        </div>
        <h1 className="text-4xl font-black text-gray-800 dark:text-white transition-colors">คลังคำศัพท์</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors">รวบรวมและจัดการคำศัพท์ของคุณ</p>
      </div>

      {/* อัปเกรดกล่องให้เป็นสีเทาเข้มใน Dark Mode */}
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[2rem] shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-500">
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl mb-6 transition-colors">
          <button onClick={() => { setIsLogin(true); setErrorMsg(''); }} className={`flex-1 py-3 rounded-xl font-bold transition-all ${isLogin ? 'bg-white dark:bg-gray-700 text-primary dark:text-primary-light shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>
            เข้าสู่ระบบ
          </button>
          <button onClick={() => { setIsLogin(false); setErrorMsg(''); }} className={`flex-1 py-3 rounded-xl font-bold transition-all ${!isLogin ? 'bg-white dark:bg-gray-700 text-primary dark:text-primary-light shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>
            สมัครสมาชิก
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 p-3 rounded-xl text-sm font-medium mb-4 text-center border border-red-100 dark:border-red-800/50 transition-colors">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">อีเมล (Email)</label>
            <input 
              type="email" 
              placeholder="example@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              // อัปเกรดช่อง Input ให้รองรับ Dark Mode
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary outline-none transition-colors" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">รหัสผ่าน (6 ตัวขึ้นไป)</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary outline-none transition-colors" 
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark dark:hover:bg-indigo-500 shadow-lg shadow-primary/25 transition mt-2">
            {isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชี'}
          </button>
        </form>
      </div>
    </div>
  );
}