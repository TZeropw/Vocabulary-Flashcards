'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { User, Mail, Calendar, Shield, Activity, Save, Award, Edit3, BookOpen, Clock, Check } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [stats, setStats] = useState({ total: 0, streak: 1, categories: {} as Record<string, number> });
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'ผู้ใช้งาน'));

        try {
          const q = query(collection(db, 'vocabularies'), where('userId', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          
          let totalWords = 0;
          const categoryCount: Record<string, number> = {};

          querySnapshot.forEach((doc) => {
            totalWords++;
            const cat = doc.data().category || 'ทั่วไป';
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
          });

          let currentStreak = 1;
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            currentStreak = userSnap.data().streakCount || 1;
          }

          setStats({ total: totalWords, streak: currentStreak, categories: categoryCount });

          setStats({ total: totalWords, streak: currentStreak, categories: categoryCount });
        } catch (error) {
          console.error("โหลดข้อมูลสถิติล้มเหลว:", error);
        }
      }
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser || !displayName.trim()) return;
    try {
      await updateProfile(auth.currentUser, { displayName: displayName });
      localStorage.setItem('vocab-username', displayName);
      setMessage({ type: 'success', text: 'อัปเดตชื่อโปรไฟล์เรียบร้อยแล้ว!' });
      setIsEditingName(false);
      

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการอัปเดตชื่อ' });
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage({ type: 'success', text: 'ส่งลิงก์เปลี่ยนรหัสผ่านไปที่อีเมลของคุณแล้ว!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: 'เกิดข้อผิดพลาดในการส่งอีเมลรีเซ็ตรหัสผ่าน' });
    }
  };

  const creationDate = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) 
    : 'ไม่ทราบวันที่';

  if (!isLoaded) return <div className="p-10 text-center text-gray-500 dark:text-gray-400 animate-pulse font-bold text-lg">กำลังโหลดข้อมูลบัญชี...</div>;

  if (!user) return <div className="p-10 text-center text-red-500 font-bold text-lg">กรุณาล็อกอินก่อนเข้าใช้งานหน้านี้</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in-down">
      <div className="mb-8 flex items-center gap-3 text-gray-800 dark:text-white transition-colors">
        <div className="bg-primary/10 p-3 rounded-xl text-primary dark:text-primary-light">
          <User size={28} />
        </div>
        <h1 className="text-3xl font-bold">โปรไฟล์ของฉัน</h1>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl font-medium text-sm flex items-center gap-2 animate-fade-in-down border ${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400' : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400'}`}>
          {message.type === 'success' ? <Check size={18} /> : <Shield size={18} />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2"><Shield size={20} className="text-primary"/> ข้อมูลบัญชี</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">ชื่อที่แสดง (Display Name)</label>
                {isEditingName ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-colors"
                      autoFocus
                    />
                    <button onClick={handleUpdateProfile} className="bg-primary hover:bg-primary-dark text-white p-2 rounded-lg transition"><Save size={18}/></button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{displayName}</span>
                    <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-primary transition"><Edit3 size={16}/></button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">อีเมลที่ใช้งาน (Email)</label>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                  <Mail size={16} />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">วันที่เข้าร่วม (Joined Date)</label>
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                  <Calendar size={16} />
                  <span className="text-sm">{creationDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 transition-colors">
              <button onClick={handleResetPassword} className="w-full text-sm font-bold text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 py-3 rounded-xl transition-colors">
                ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมล
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <BookOpen className="absolute -top-4 -right-4 text-white/10 transform rotate-12" size={100} />
              <div className="relative z-10">
                <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wider">คำศัพท์ที่บันทึกไว้</p>
                <h3 className="text-4xl font-black">{stats.total} <span className="text-lg font-normal opacity-80">คำ</span></h3>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <Award className="absolute -top-4 -right-4 text-white/10 transform -rotate-12" size={100} />
              <div className="relative z-10">
                <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wider">เรียนต่อเนื่อง</p>
                <h3 className="text-4xl font-black">{stats.streak} <span className="text-lg font-normal opacity-80">วัน</span></h3>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2"><Activity size={20} className="text-primary"/> สัดส่วนหมวดหมู่คำศัพท์</h2>
            
            {Object.keys(stats.categories).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats.categories)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, count]) => {
                    const percentage = Math.round((count / stats.total) * 100);
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 transition-colors">
                          <span>{category}</span>
                          <span className="text-gray-400 dark:text-gray-500">{count} คำ ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden transition-colors">
                          <div className="bg-primary dark:bg-primary-light h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400 dark:text-gray-500 flex flex-col items-center transition-colors">
                <Clock size={40} className="mb-3 opacity-20" />
                <p>ยังไม่มีข้อมูลหมวดหมู่</p>
                <Link href="/vocab" className="text-primary hover:underline text-sm mt-2">ไปเพิ่มคำศัพท์กันเลย!</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}