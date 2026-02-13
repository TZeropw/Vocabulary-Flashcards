'use client';
import Link from 'next/link';
import { BookOpen, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim()) {
      localStorage.setItem('vocab-username', username);
      
      window.location.href = '/dashboard'; 
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-2 text-primary mb-4">
          <BookOpen size={48} />
          <Sparkles size={32} className="text-pink-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">คลังคำศัพท์</h1>
        <p className="text-gray-500">รวบรวมและจัดการคำศัพท์ของคุณ</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transition-all duration-300">
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 rounded-md font-medium transition duration-200 ${isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>เข้าสู่ระบบ</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 rounded-md font-medium transition duration-200 ${!isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>สมัครสมาชิก</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้</label>
            <input 
              type="text" 
              placeholder="ตั้งชื่อเล่นของคุณ..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-gray-50 focus:bg-white transition" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input type="password" placeholder="••••••••" className="w-full border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-gray-50 focus:bg-white transition" required />
          </div>

          {!isLogin && (
             <div className="animate-fade-in-down">
                <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
                <input type="password" placeholder="••••••••" className="w-full border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-gray-50 focus:bg-white transition" required />
             </div>
          )}

          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg transform active:scale-95">
            {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <Link href="/dashboard" className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-600 text-center font-medium py-3 rounded-lg transition">
            ทดลองใช้งาน (ไม่ต้องสมัครสมาชิก)
          </Link>
        </div>
      </div>
    </div>
  );
}