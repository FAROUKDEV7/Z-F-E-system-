<div align="center">

# 🏫 Z.F.E — نظام إدارة المعهد التعليمي

**نظام SaaS عربي متكامل لإدارة المعاهد التعليمية**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![Recharts](https://img.shields.io/badge/Recharts-3-22B5BF?style=flat-square)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 📋 جدول المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المميزات](#-المميزات)
- [الصفحات](#-الصفحات)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [هيكل المشروع](#-هيكل-المشروع)
- [تشغيل المشروع](#-تشغيل-المشروع)
- [بيانات الدخول](#-بيانات-الدخول-التجريبية)
- [API المُحاكاة](#-api-المحاكاة)
- [التخصيص](#-التخصيص)
- [المساهمة](#-المساهمة)

---

## 🌟 نظرة عامة

**Z.F.E** هو نظام إدارة تعليمي متكامل مبني بـ **React + Vite** يوفر لوحة تحكم عربية احترافية تشمل:

- إدارة الطلاب مع توليد **باركود فريد** لكل طالب
- تسجيل الحضور بمسح الباركود مع **إشعارات واتساب مُحاكاة**
- تتبع المصاريف والمدفوعات لحظياً
- إدارة الامتحانات وتحليل أداء الطلاب
- إنشاء **امتحانات أونلاين** مع مؤقت وتصحيح تلقائي
- تقارير وإحصائيات بصرية شاملة
- **وضع داكن / فاتح** مع حفظ التفضيل

---

## ✨ المميزات

| المميزة | الوصف |
|---------|-------|
| 🎨 **تصميم RTL عربي** | واجهة عربية كاملة بخط Cairo مع دعم اتجاه اليمين لليسار |
| 🌙 **Dark / Light Mode** | تبديل فوري مع حفظ في localStorage |
| ⚡ **أنيميشن سلس** | Framer Motion في جميع الانتقالات والعناصر |
| 📊 **رسوم بيانية** | Bar / Area / Pie / Line charts بـ Recharts |
| 🔲 **نظام باركود** | توليد + طباعة بطاقة الطالب بـ react-barcode |
| 💬 **محاكاة واتساب** | إشعارات تلقائية لأولياء الأمور عند الحضور والدفع |
| 📝 **امتحانات أونلاين** | إنشاء + مؤقت + تصحيح تلقائي |
| 🤖 **ذكاء بسيط** | كشف الطلاب الضعفاء تلقائياً (أقل من 60%) |
| 📱 **متجاوب** | يعمل على الحاسوب والتابلت والموبايل |
| 🔒 **حماية المسارات** | PrivateRoute — لا يمكن الوصول بدون تسجيل دخول |

---

## 📱 الصفحات

<details>
<summary><b>1. 🚀 شاشة التحميل</b></summary>

- أنيميشن Z.F.E بـ Framer Motion
- جسيمات متحركة في الخلفية
- شريط تحميل متدرج
- انتقال تلقائي لصفحة الدخول

</details>

<details>
<summary><b>2. 🔐 تسجيل الدخول</b></summary>

- خلفية متدرجة مع كرات ضوئية متحركة
- حقول اسم المستخدم وكلمة المرور
- زر إظهار/إخفاء كلمة المرور
- رسائل خطأ متحركة
- تحقق كامل قبل الإرسال

</details>

<details>
<summary><b>3. 📊 لوحة التحكم الرئيسية</b></summary>

- **4 بطاقات إحصائية:** إجمالي الطلاب، حاضرون اليوم، غير مدفوعين، يحتاجون متابعة
- **2 شريط تقدم:** نسبة الحضور + نسبة التحصيل المالي
- **12 بطاقة صف دراسي** مع إحصائيات وتنقل مباشر
- إشعارات في الـ Navbar مع عدد التنبيهات

</details>

<details>
<summary><b>4. 👨‍🎓 إدارة الطلاب</b></summary>

- إضافة / تعديل / حذف الطلاب
- حقول: الاسم، الصف، ولي الأمر، واتساب، هاتف، ملاحظات
- **توليد باركود تلقائي** عند إنشاء الطالب (ZFE-001, ZFE-002, ...)
- عرض الباركود في modal مع زر طباعة البطاقة
- بحث بالاسم أو الصف أو الباركود

</details>

<details>
<summary><b>5. ✅ نظام الحضور</b></summary>

- حقل مسح الباركود مع Enter للتسجيل السريع
- إشعار فوري بنتيجة المسح (حاضر / تم مسبقاً)
- **محاكاة رسالة واتساب** لولي الأمر
- إحصائيات يومية (حاضر / غائب / النسبة)
- رسم بياني شهري للحضور
- فلترة بالتاريخ والحالة

</details>

<details>
<summary><b>6. 💳 إدارة المصاريف</b></summary>

- مسح الباركود لتسجيل الدفع
- **محاكاة إشعار واتساب** عند الدفع
- Pie chart لتوزيع حالة المصاريف
- عرض المبلغ المحصل والمتبقي
- فلترة بالحالة (مدفوع / غير مدفوع)

</details>

<details>
<summary><b>7. 📝 الامتحانات</b></summary>

- إدخال نتائج الامتحانات يدوياً
- تقدير تلقائي (ممتاز / جيد جداً / جيد / ضعيف)
- شريط تقدم مرئي لكل نتيجة
- **كشف الطلاب الضعفاء** (أقل من 60%) تلقائياً
- Bar chart لمتوسط أداء المواد

</details>

<details>
<summary><b>8. 💻 الامتحانات الأونلاين</b></summary>

- إنشاء امتحان: عنوان + مادة + صف + مدة + درجة كلية
- إضافة أسئلة اختيار متعدد (4 خيارات)
- تحديد الإجابة الصحيحة لكل سؤال
- **مؤقت تنازلي** أثناء أداء الامتحان
- **تصحيح تلقائي** وعرض النتيجة بشكل مرئي
- حفظ النتائج وعرضها من لوحة الأدمن

</details>

<details>
<summary><b>9. 📈 التقارير والإحصائيات</b></summary>

- Area chart لتطور الحضور الشهري
- Bar chart لتحصيل المصاريف الشهري
- Horizontal Bar chart لأداء المواد الدراسية
- Pie chart لحالة الحضور اليومي
- Pie chart لحالة المصاريف الإجمالية

</details>

<details>
<summary><b>10. ⚙️ الإعدادات</b></summary>

- تبديل المظهر داكن / فاتح
- تعديل بيانات المعهد
- رسوم الاشتراك الشهري ويوم الاستحقاق
- إعدادات الإشعارات (تفعيل/تعطيل)
- تغيير كلمة المرور

</details>

---

## 🛠 التقنيات المستخدمة

```
Frontend Framework:  React 19 + Vite 7
Routing:             React Router DOM 7
Animations:          Framer Motion 12
Charts:              Recharts 3
Barcode:             react-barcode 1.6
Icons:               React Icons 5
HTTP Client:         Axios 1
CSS Framework:       Bootstrap 5 (utilities)
Fonts:               Cairo + Tajawal (Google Fonts)
```

---

## 📁 هيكل المشروع

```
zfe-system/
├── public/
├── src/
│   ├── assets/               # الصور والأيقونات الثابتة
│   ├── components/
│   │   ├── LoadingScreen.jsx  # شاشة التحميل المتحركة
│   │   ├── Sidebar.jsx        # القائمة الجانبية القابلة للطي
│   │   ├── Navbar.jsx         # شريط التنقل العلوي
│   │   └── ToastContainer.jsx # إشعارات Toast
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── StudentsPage.jsx
│   │   ├── AttendancePage.jsx
│   │   ├── PaymentsPage.jsx
│   │   ├── ExamsPage.jsx
│   │   ├── OnlineExamsPage.jsx
│   │   ├── ReportsPage.jsx
│   │   └── SettingsPage.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx      # التوجيه + PrivateRoute
│   ├── services/
│   │   └── api.js             # Mock API — 7 كائنات بيانات
│   ├── hooks/
│   │   └── useApp.jsx         # Context: User + Theme + Toast
│   ├── styles/
│   │   └── global.css         # CSS Variables + Dark/Light
│   ├── App.jsx
│   └── main.jsx
├── .env                       # VITE_API_URL
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 تشغيل المشروع

### المتطلبات

- **Node.js** >= 18
- **npm** >= 9

### خطوات التشغيل

```bash
# 1. استنساخ المستودع
git clone https://github.com/your-username/zfe-system.git

# 2. الدخول للمجلد
cd zfe-system

# 3. تثبيت المكتبات
npm install

# 4. تشغيل بيئة التطوير
npm run dev
```

ثم افتح المتصفح على: **http://localhost:5173**

### أوامر إضافية

```bash
# بناء نسخة الإنتاج
npm run build

# معاينة نسخة الإنتاج محلياً
npm run preview
```

---

## 🔑 بيانات الدخول التجريبية

| الحقل | القيمة |
|-------|--------|
| اسم المستخدم | `admin` |
| كلمة المرور | `admin123` |
| الدور | مدير النظام — صلاحيات كاملة |

---

## 🔌 API المُحاكاة

جميع البيانات تأتي من `src/services/api.js` — ملف Mock يُحاكي Backend حقيقي.

```javascript
// تسجيل حضور بالباركود
const result = await attendanceAPI.markAttendance('ZFE-001');
// { studentName, grade, time, status, whatsappSent: true }

// إنشاء طالب جديد
const student = await studentsAPI.create({
  name: 'أحمد محمد',
  grade: 'الصف الأول الابتدائي',
  parentName: 'محمد علي',
  whatsapp: '01012345678'
});
// { ...student, barcode: 'ZFE-009' } ← باركود تلقائي
```

### الـ APIs المتاحة

| الكائن | الوظائف |
|--------|---------|
| `authAPI` | `login()` / `logout()` |
| `studentsAPI` | `getAll` / `getById` / `create` / `update` / `delete` / `getByBarcode` |
| `attendanceAPI` | `getAll` / `markAttendance` / `getStats` / `getMonthlyStats` |
| `paymentsAPI` | `getAll` / `markPayment` / `getStats` / `getMonthlyStats` |
| `examsAPI` | `getAll` / `create` / `getPerformanceStats` / `getWeakStudents` |
| `onlineExamsAPI` | `getAll` / `getById` / `create` / `submitResult` / `getResults` |
| `dashboardAPI` | `getStats` / `getGradeStats` / `getNotifications` |

> 💡 لربط Backend حقيقي: استبدل وظائف Mock بـ `axios.get()` / `axios.post()` وعدّل `.env`

---

## 🎨 التخصيص

### تغيير الألوان الأساسية

```css
/* src/styles/global.css */
:root {
  --primary:   #1a56db;   /* اللون الأساسي */
  --secondary: #7c3aed;   /* اللون الثانوي */
  --accent:    #06b6d4;   /* لون التمييز   */
  --success:   #10b981;
  --warning:   #f59e0b;
  --danger:    #ef4444;
}
```

### إضافة صف دراسي جديد

```javascript
// src/pages/DashboardPage.jsx  و  src/pages/StudentsPage.jsx
const GRADES = [
  'الصف الأول الابتدائي',
  // ... الصفوف الموجودة
  'الصف الجديد',   // ← أضف هنا
];
```

### إضافة عنصر للقائمة الجانبية

```javascript
// src/components/Sidebar.jsx
import { FiStar } from 'react-icons/fi';

const navItems = [
  // ... العناصر الموجودة
  { path: '/new-page', icon: FiStar, label: 'الصفحة الجديدة' },
];
```

---

## 🔲 اختبار نظام الباركود

كل طالب يحصل تلقائياً على باركود فريد بصيغة `ZFE-XXX`:

| الطالب | الباركود |
|--------|---------|
| أحمد محمد علي | `ZFE-001` |
| فاطمة أحمد حسن | `ZFE-002` |
| عمر خالد إبراهيم | `ZFE-003` |
| ... | ... |

**لاختبار المسح:**
1. افتح صفحة **الحضور** أو **المصاريف**
2. اكتب في حقل المسح: `ZFE-001`
3. اضغط **Enter**
4. ✅ سيُسجَّل الحضور / الدفع فوراً مع إشعار

---

## 🤝 المساهمة

المساهمات مرحب بها!

```bash
# 1. Fork المستودع

# 2. أنشئ branch جديد
git checkout -b feature/اسم-الميزة

# 3. Commit التغييرات
git commit -m "feat: وصف الميزة الجديدة"

# 4. Push وافتح Pull Request
git push origin feature/اسم-الميزة
```

### معايير الكود

- استخدم **Functional Components** فقط
- اتبع نمط **Custom Hooks** للمنطق المشترك
- استخدم **CSS Variables** بدلاً من القيم الثابتة

---

## 📄 الرخصة

```
MIT License — يمكنك الاستخدام والتعديل والتوزيع بحرية.
```

---

<div align="center">

**صُنع بـ ❤️ لدعم التعليم العربي**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Arabic RTL](https://img.shields.io/badge/Language-Arabic_RTL-green?style=flat-square)](.)

</div>