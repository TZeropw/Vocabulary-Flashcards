# 📖 Vocabulary Flashcards App (คลังคำศัพท์)

แอปพลิเคชันเว็บสำหรับจดบันทึกและทบทวนคำศัพท์ส่วนตัว พัฒนาขึ้นเพื่อช่วยให้การเรียนรู้คำศัพท์ใหม่ๆ เป็นเรื่องง่ายและสนุกยิ่งขึ้นผ่านระบบ Flashcards 

## ✨ ฟีเจอร์หลัก (Features)

* **🔐 ระบบจัดการบัญชีผู้ใช้:** สมัครสมาชิกและเข้าสู่ระบบด้วย Email ผ่านระบบรักษาความปลอดภัยของ Firebase
* **📝 การจัดการคำศัพท์ (CRUD):** * เพิ่ม ลบ และแก้ไขคำศัพท์ได้อย่างอิสระ
  * จัดหมวดหมู่คำศัพท์ (เช่น อาหาร, การเดินทาง, สแลง ฯลฯ)
  * ค้นหาคำศัพท์ด้วยคีย์เวิร์ด และกรองตามหมวดหมู่
* **🎮 โหมดทบทวนความจำ (Review Mode):** * ระบบ Flashcard สุ่มคำศัพท์มาให้ทบทวน
  * เอฟเฟกต์พลิกการ์ด (Flip Animation) เพื่อดูความหมายและประโยคตัวอย่าง
  * เลือกทบทวนแบบสุ่มทั้งหมด หรือเจาะจงเฉพาะหมวดหมู่ได้
* **📊 แดชบอร์ดสรุปผล:** แสดงจำนวนคำศัพท์ทั้งหมด และสถิติการเข้าเรียนต่อเนื่อง (Streak)

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

* **Frontend:** Next.js (React), Tailwind CSS
* **Backend & Database:** Firebase Authentication, Cloud Firestore
* **Icons:** Lucide-React
* **Version Control:** Git & GitHub

# 📖 Vocabulary Flashcards App (คลังคำศัพท์)
🔗 **ทดลองใช้งานเว็บจริงได้ที่นี่:** [https://vocabulary-flashcards-five.vercel.app/](https://vocabulary-flashcards-five.vercel.app/)

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

หากต้องการดึงโปรเจกต์นี้ไปรันในเครื่องของคุณ ให้ทำตามขั้นตอนดังนี้:

**1. ติดตั้ง Node.js**
ตรวจสอบให้แน่ใจว่าเครื่องของคุณติดตั้ง [Node.js](https://nodejs.org/) เรียบร้อยแล้ว (เวอร์ชัน LTS)

**2. Clone โปรเจกต์**
git clone [https://github.com/TZeropw/Vocabulary-Flashcards.git](https://github.com/TZeropw/Vocabulary-Flashcards.git)
cd Vocabulary-Flashcards

**3. ติดตั้ง Dependencies**
npm install

**4. ตั้งค่า Firebase**
เนื่องจากโปรเจกต์นี้ใช้ Firebase เป็นฐานข้อมูล คุณจำเป็นต้องตั้งค่าในไฟล์ lib/firebase.ts ให้ตรงกับโปรเจกต์ Firebase ของคุณ

**5. รันโปรเจกต์ (Development Server)**
npm run dev
จากนั้นเปิดเบราว์เซอร์และเข้าไปที่ http://localhost:3000