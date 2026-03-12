import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ============================
// MOCK DATA STORE
// ============================
let students = [
  { id: 1, name: 'أحمد محمد علي', grade: 'الصف الأول الابتدائي', parentName: 'محمد علي', whatsapp: '01012345678', phone: '01012345678', notes: 'طالب متميز', barcode: 'ZFE-001', createdAt: '2024-01-15' },
  { id: 2, name: 'فاطمة أحمد حسن', grade: 'الصف الثاني الابتدائي', parentName: 'أحمد حسن', whatsapp: '01098765432', phone: '01098765432', notes: '', barcode: 'ZFE-002', createdAt: '2024-01-16' },
  { id: 3, name: 'عمر خالد إبراهيم', grade: 'الصف الثالث الابتدائي', parentName: 'خالد إبراهيم', whatsapp: '01155667788', phone: '01155667788', notes: 'يحتاج متابعة', barcode: 'ZFE-003', createdAt: '2024-01-17' },
  { id: 4, name: 'مريم يوسف محمود', grade: 'الصف الرابع الابتدائي', parentName: 'يوسف محمود', whatsapp: '01234567890', phone: '01234567890', notes: '', barcode: 'ZFE-004', createdAt: '2024-01-18' },
  { id: 5, name: 'كريم سامي عبدالله', grade: 'الصف الخامس الابتدائي', parentName: 'سامي عبدالله', whatsapp: '01187654321', phone: '01187654321', notes: 'موهوب في الرياضيات', barcode: 'ZFE-005', createdAt: '2024-01-19' },
  { id: 6, name: 'نور إسلام رضا', grade: 'الصف السادس الابتدائي', parentName: 'إسلام رضا', whatsapp: '01022334455', phone: '01022334455', notes: '', barcode: 'ZFE-006', createdAt: '2024-01-20' },
  { id: 7, name: 'يوسف طارق منير', grade: 'الصف الأول الإعدادي', parentName: 'طارق منير', whatsapp: '01099887766', phone: '01099887766', notes: '', barcode: 'ZFE-007', createdAt: '2024-01-21' },
  { id: 8, name: 'سارة هشام النجار', grade: 'الصف الثاني الإعدادي', parentName: 'هشام النجار', whatsapp: '01144556677', phone: '01144556677', notes: 'ممتازة في اللغة العربية', barcode: 'ZFE-008', createdAt: '2024-01-22' },
];

let attendance = [
  { id: 1, studentId: 1, studentName: 'أحمد محمد علي', grade: 'الصف الأول الابتدائي', date: '2024-03-10', time: '08:15', status: 'حاضر' },
  { id: 2, studentId: 2, studentName: 'فاطمة أحمد حسن', grade: 'الصف الثاني الابتدائي', date: '2024-03-10', time: '08:20', status: 'حاضر' },
  { id: 3, studentId: 3, studentName: 'عمر خالد إبراهيم', grade: 'الصف الثالث الابتدائي', date: '2024-03-10', time: '', status: 'غائب' },
  { id: 4, studentId: 4, studentName: 'مريم يوسف محمود', grade: 'الصف الرابع الابتدائي', date: '2024-03-10', time: '08:30', status: 'حاضر' },
  { id: 5, studentId: 5, studentName: 'كريم سامي عبدالله', grade: 'الصف الخامس الابتدائي', date: '2024-03-10', time: '08:10', status: 'حاضر' },
];

let payments = [
  { id: 1, studentId: 1, studentName: 'أحمد محمد علي', grade: 'الصف الأول الابتدائي', amount: 500, status: 'مدفوع', paymentDate: '2024-03-01', month: 'مارس 2024' },
  { id: 2, studentId: 2, studentName: 'فاطمة أحمد حسن', grade: 'الصف الثاني الابتدائي', amount: 500, status: 'مدفوع', paymentDate: '2024-03-02', month: 'مارس 2024' },
  { id: 3, studentId: 3, studentName: 'عمر خالد إبراهيم', grade: 'الصف الثالث الابتدائي', amount: 500, status: 'غير مدفوع', paymentDate: null, month: 'مارس 2024' },
  { id: 4, studentId: 4, studentName: 'مريم يوسف محمود', grade: 'الصف الرابع الابتدائي', amount: 500, status: 'غير مدفوع', paymentDate: null, month: 'مارس 2024' },
  { id: 5, studentId: 5, studentName: 'كريم سامي عبدالله', grade: 'الصف الخامس الابتدائي', amount: 500, status: 'مدفوع', paymentDate: '2024-03-05', month: 'مارس 2024' },
];

let examResults = [
  { id: 1, studentId: 1, studentName: 'أحمد محمد علي', grade: 'الصف الأول الابتدائي', examName: 'امتحان الرياضيات', score: 85, totalScore: 100, date: '2024-03-05' },
  { id: 2, studentId: 2, studentName: 'فاطمة أحمد حسن', grade: 'الصف الثاني الابتدائي', examName: 'امتحان العلوم', score: 92, totalScore: 100, date: '2024-03-06' },
  { id: 3, studentId: 3, studentName: 'عمر خالد إبراهيم', grade: 'الصف الثالث الابتدائي', examName: 'امتحان اللغة العربية', score: 45, totalScore: 100, date: '2024-03-07' },
  { id: 4, studentId: 4, studentName: 'مريم يوسف محمود', grade: 'الصف الرابع الابتدائي', examName: 'امتحان اللغة الإنجليزية', score: 78, totalScore: 100, date: '2024-03-08' },
  { id: 5, studentId: 5, studentName: 'كريم سامي عبدالله', grade: 'الصف الخامس الابتدائي', examName: 'امتحان الرياضيات', score: 95, totalScore: 100, date: '2024-03-09' },
];

let onlineExams = [
  {
    id: 1,
    title: 'امتحان الرياضيات - الصف الأول',
    subject: 'الرياضيات',
    grade: 'الصف الأول الابتدائي',
    duration: 30,
    totalScore: 20,
    createdAt: '2024-03-01',
    link: 'exam/1',
    questions: [
      { id: 1, text: 'كم يساوي 5 + 3؟', choices: ['6', '8', '9', '7'], correct: 1 },
      { id: 2, text: 'كم يساوي 10 - 4؟', choices: ['5', '6', '7', '4'], correct: 1 },
    ]
  }
];

let onlineExamResults = [];
let nextStudentId = 9;
let nextAttendanceId = 6;
let nextPaymentId = 6;
let nextExamResultId = 6;
let nextOnlineExamId = 2;

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ============================
// AUTH API
// ============================
export const authAPI = {
  login: async (username, password) => {
    await delay(800);
    if (username === 'admin' && password === 'admin123') {
      return { success: true, user: { id: 1, name: 'المدير العام', username: 'admin', role: 'admin', avatar: null } };
    }
    throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
  },
  logout: async () => {
    await delay(300);
    return { success: true };
  }
};

// ============================
// STUDENTS API
// ============================
export const studentsAPI = {
  getAll: async (grade = null) => {
    await delay(400);
    if (grade) return students.filter(s => s.grade === grade);
    return [...students];
  },
  getById: async (id) => {
    await delay(200);
    const student = students.find(s => s.id === id);
    if (!student) throw new Error('الطالب غير موجود');
    return student;
  },
  create: async (data) => {
    await delay(600);
    const newStudent = {
      id: nextStudentId++,
      ...data,
      barcode: `ZFE-${String(nextStudentId - 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    students.push(newStudent);
    const payment = {
      id: nextPaymentId++,
      studentId: newStudent.id,
      studentName: newStudent.name,
      grade: newStudent.grade,
      amount: 500,
      status: 'غير مدفوع',
      paymentDate: null,
      month: new Date().toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })
    };
    payments.push(payment);
    return newStudent;
  },
  update: async (id, data) => {
    await delay(500);
    const idx = students.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('الطالب غير موجود');
    students[idx] = { ...students[idx], ...data };
    return students[idx];
  },
  delete: async (id) => {
    await delay(400);
    students = students.filter(s => s.id !== id);
    return { success: true };
  },
  getByBarcode: async (barcode) => {
    await delay(300);
    const student = students.find(s => s.barcode === barcode);
    if (!student) throw new Error('الطالب غير موجود');
    return student;
  }
};

// ============================
// ATTENDANCE API
// ============================
export const attendanceAPI = {
  getAll: async (filters = {}) => {
    await delay(400);
    let data = [...attendance];
    if (filters.date)   data = data.filter(a => a.date === filters.date);
    if (filters.grade)  data = data.filter(a => a.grade === filters.grade);
    if (filters.status) data = data.filter(a => a.status === filters.status);
    return data;
  },
  markAttendance: async (barcode) => {
    await delay(500);
    const student = students.find(s => s.barcode === barcode);
    if (!student) throw new Error('الطالب غير موجود - تأكد من الباركود');
    const today = new Date().toISOString().split('T')[0];
    const existing = attendance.find(a => a.studentId === student.id && a.date === today);
    if (existing) {
      return { ...existing, alreadyMarked: true, student };
    }
    const record = {
      id: nextAttendanceId++,
      studentId: student.id,
      studentName: student.name,
      grade: student.grade,
      date: today,
      time: new Date().toLocaleTimeString('ar-EG'),
      status: 'حاضر'
    };
    attendance.push(record);
    // Simulate WhatsApp
    console.log(`[WhatsApp Simulation] إلى ${student.whatsapp}: تم تسجيل حضور الطالب ${student.name} اليوم في معهد Z.F.E`);
    return { ...record, student, whatsappSent: true };
  },
  getStats: async () => {
    await delay(300);
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    return {
      totalStudents: students.length,
      presentToday: todayAttendance.filter(a => a.status === 'حاضر').length,
      absentToday: students.length - todayAttendance.filter(a => a.status === 'حاضر').length,
      attendanceRate: Math.round((todayAttendance.filter(a => a.status === 'حاضر').length / students.length) * 100)
    };
  },
  getMonthlyStats: async () => {
    await delay(300);
    return [
      { day: '1', حاضر: 7, غائب: 1 },
      { day: '5', حاضر: 8, غائب: 0 },
      { day: '10', حاضر: 6, غائب: 2 },
      { day: '15', حاضر: 7, غائب: 1 },
      { day: '20', حاضر: 5, غائب: 3 },
      { day: '25', حاضر: 8, غائب: 0 },
    ];
  }
};

// ============================
// PAYMENTS API
// ============================
export const paymentsAPI = {
  getAll: async (filters = {}) => {
    await delay(400);
    let data = [...payments];
    if (filters.status) data = data.filter(p => p.status === filters.status);
    if (filters.grade)  data = data.filter(p => p.grade === filters.grade);
    return data;
  },
  markPayment: async (barcode) => {
    await delay(500);
    const student = students.find(s => s.barcode === barcode);
    if (!student) throw new Error('الطالب غير موجود');
    const payIdx = payments.findIndex(p => p.studentId === student.id && p.status === 'غير مدفوع');
    if (payIdx === -1) {
      return { alreadyPaid: true, student };
    }
    payments[payIdx].status = 'مدفوع';
    payments[payIdx].paymentDate = new Date().toISOString().split('T')[0];
    console.log(`[WhatsApp Simulation] إلى ${student.whatsapp}: تم سداد المصاريف الخاصة بالطالب ${student.name}`);
    return { ...payments[payIdx], student, whatsappSent: true };
  },
  getStats: async () => {
    await delay(300);
    const paid = payments.filter(p => p.status === 'مدفوع').length;
    const unpaid = payments.filter(p => p.status === 'غير مدفوع').length;
    return {
      total: payments.length,
      paid,
      unpaid,
      totalAmount: paid * 500,
      pendingAmount: unpaid * 500,
      collectionRate: Math.round((paid / payments.length) * 100)
    };
  },
  getMonthlyStats: async () => {
    await delay(300);
    return [
      { month: 'يناير', مدفوع: 7, غير_مدفوع: 1 },
      { month: 'فبراير', مدفوع: 6, غير_مدفوع: 2 },
      { month: 'مارس', مدفوع: 5, غير_مدفوع: 3 },
    ];
  }
};

// ============================
// EXAMS API
// ============================
export const examsAPI = {
  getAll: async (filters = {}) => {
    await delay(400);
    let data = [...examResults];
    if (filters.grade) data = data.filter(e => e.grade === filters.grade);
    if (filters.studentName) data = data.filter(e => e.studentName.includes(filters.studentName));
    return data;
  },
  create: async (data) => {
    await delay(500);
    const record = { id: nextExamResultId++, ...data };
    examResults.push(record);
    return record;
  },
  getPerformanceStats: async () => {
    await delay(300);
    return [
      { subject: 'الرياضيات', avg: 80 },
      { subject: 'العلوم', avg: 75 },
      { subject: 'اللغة العربية', avg: 70 },
      { subject: 'الإنجليزية', avg: 65 },
      { subject: 'التربية الإسلامية', avg: 88 },
    ];
  },
  getWeakStudents: async () => {
    await delay(400);
    return examResults
      .filter(e => (e.score / e.totalScore) < 0.6)
      .map(e => ({ ...e, percentage: Math.round((e.score / e.totalScore) * 100) }));
  }
};

// ============================
// ONLINE EXAMS API
// ============================
export const onlineExamsAPI = {
  getAll: async () => {
    await delay(400);
    return [...onlineExams];
  },
  getById: async (id) => {
    await delay(200);
    const exam = onlineExams.find(e => e.id === parseInt(id));
    if (!exam) throw new Error('الامتحان غير موجود');
    return exam;
  },
  create: async (data) => {
    await delay(600);
    const exam = {
      id: nextOnlineExamId++,
      ...data,
      createdAt: new Date().toISOString().split('T')[0],
      link: `exam/${nextOnlineExamId - 1}`,
      results: []
    };
    onlineExams.push(exam);
    return exam;
  },
  submitResult: async (examId, studentName, answers) => {
    await delay(500);
    const exam = onlineExams.find(e => e.id === parseInt(examId));
    if (!exam) throw new Error('الامتحان غير موجود');
    let score = 0;
    exam.questions.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });
    const result = {
      id: onlineExamResults.length + 1,
      examId,
      examTitle: exam.title,
      studentName,
      score,
      totalQuestions: exam.questions.length,
      percentage: Math.round((score / exam.questions.length) * 100),
      submittedAt: new Date().toISOString()
    };
    onlineExamResults.push(result);
    return result;
  },
  getResults: async (examId) => {
    await delay(300);
    return onlineExamResults.filter(r => r.examId === parseInt(examId));
  }
};

// ============================
// DASHBOARD API
// ============================
export const dashboardAPI = {
  getStats: async () => {
    await delay(500);
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today && a.status === 'حاضر');
    const unpaidPayments = payments.filter(p => p.status === 'غير مدفوع');
    const weakStudents = examResults.filter(e => (e.score / e.totalScore) < 0.6);
    return {
      totalStudents: students.length,
      presentToday: todayAttendance.length,
      unpaidPayments: unpaidPayments.length,
      weakStudents: weakStudents.length,
      attendanceRate: Math.round((todayAttendance.length / students.length) * 100),
      collectionRate: Math.round((payments.filter(p => p.status === 'مدفوع').length / payments.length) * 100),
    };
  },
  getGradeStats: async () => {
    await delay(300);
    const grades = [...new Set(students.map(s => s.grade))];
    return grades.map(grade => ({
      grade,
      students: students.filter(s => s.grade === grade).length,
      present: attendance.filter(a => a.grade === grade && a.status === 'حاضر').length,
    }));
  },
  getNotifications: async () => {
    await delay(200);
    const unpaid = payments.filter(p => p.status === 'غير مدفوع');
    const weak = examResults.filter(e => (e.score / e.totalScore) < 0.6);
    const notifs = [
      ...unpaid.map(p => ({
        id: `pay-${p.id}`,
        type: 'warning',
        message: `${p.studentName} لم يسدد المصاريف بعد`,
        time: 'منذ 2 ساعة'
      })),
      ...weak.map(e => ({
        id: `weak-${e.id}`,
        type: 'danger',
        message: `${e.studentName} يحتاج متابعة - درجة ${e.score}/${e.totalScore}`,
        time: 'منذ يوم'
      }))
    ];
    return notifs.slice(0, 8);
  }
};

export default {
  auth: authAPI,
  students: studentsAPI,
  attendance: attendanceAPI,
  payments: paymentsAPI,
  exams: examsAPI,
  onlineExams: onlineExamsAPI,
  dashboard: dashboardAPI,
};