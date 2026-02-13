'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Sparkles } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');

  // ส่วนสำคัญ: ตรวจสอบว่าถ้าเคย Login แล้ว ให้เด้งไป Dashboard เลย
  // ถ้าอยากเทสหน้า Login ให้ลบ localStorage หรือใช้โหมดไม่ระบุตัวตน (Incognito)
  useEffect(() => {
    const savedUser = localStorage.getItem('vocab-username');
    if (savedUser) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    // บันทึกชื่อลงเครื่อง
    localStorage.setItem('vocab-username', username);
    router.push('/dashboard');
  };

  const handleGuest = () => {
    localStorage.setItem('vocab-username', 'ผู้เยี่ยมชม');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* ส่วนหัวแสดงชื่อแอป */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <BookOpen className="text-primary" size={40} />
          <Sparkles className="text-secondary" size={24} />
        </div>
        <h1 className="text-4xl font-black text-gray-800">คลังคำศัพท์</h1>
        <p className="text-gray-500 mt-2">รวบรวมและจัดการคำศัพท์ของคุณ</p>
      </div>

      {/* บล็อกหน้าจอ Login */}
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-xl p-8 border border-gray-100">
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 rounded-xl font-bold transition ${isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>
            เข้าสู่ระบบ
          </button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 rounded-xl font-bold transition ${!isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>
            สมัครสมาชิก
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อผู้ใช้</label>
            <input type="text" placeholder="ตั้งชื่อเล่นของคุณ..." value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">รหัสผ่าน</label>
            <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary outline-none" />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark shadow-lg shadow-primary/25 transition">
            {isLogin ? 'เข้าสู่ระบบ' : 'สร้างบัญชี'}
          </button>
        </form>

        <div className="relative my-10 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <span className="relative bg-white px-4 text-gray-300 text-xs uppercase font-medium">หรือ</span>
        </div>

        <button onClick={handleGuest} className="w-full bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition border border-gray-100">
          ทดลองใช้งาน (ไม่ต้องสมัครสมาชิก)
        </button>
      </div>
    </div>
  );
}