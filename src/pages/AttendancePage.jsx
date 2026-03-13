import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiSearch, FiCamera, FiX, FiMessageCircle, FiFilter, FiZap } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { attendanceAPI } from '../services/api';
import { useApp } from '../hooks/useApp';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';

const GRADES = [
  'الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي',
  'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي',
  'الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي',
  'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي',
];

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scannerActive, setScannerActive] = useState(false); // يضيء لما السكانر يستخدم
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const { addToast } = useApp();
  const inputRef = useRef();

  useEffect(() => { loadData(); }, [filterDate, filterStatus, filterGrade]);

  const loadData = async () => {
    const [recs, s, chart] = await Promise.all([
      attendanceAPI.getAll({ date: filterDate, status: filterStatus || undefined, grade: filterGrade || undefined }),
      attendanceAPI.getStats(),
      attendanceAPI.getMonthlyStats()
    ]);
    setRecords(recs); setStats(s); setChartData(chart);
  };

  // دالة تسجيل الحضور المشتركة بين اليدوي والسكانر
  const processBarcode = useCallback(async (code) => {
    if (!code.trim()) return;
    try {
      const result = await attendanceAPI.markAttendance(code.trim());
      setScanResult(result);
      if (result.alreadyMarked) {
        addToast(`${result.student.name} — تم تسجيل الحضور مسبقاً`, 'warning');
      } else {
        addToast(`✅ تم تسجيل حضور ${result.student.name}`);
        loadData();
      }
    } catch (e) {
      addToast(e.message, 'error');
      setScanResult(null);
    }
  }, []);

  // جهاز السكانر الحقيقي — يستقبل الباركود من أي مكان في الصفحة
  useBarcodeScanner(useCallback((code) => {
    setScannerActive(true);
    setScanInput(code);
    setTimeout(() => setScannerActive(false), 800);
    processBarcode(code);
  }, [processBarcode]));

  // الكتابة اليدوية في الـ input
  const handleManualScan = async () => {
    await processBarcode(scanInput);
    setScanInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">نظام الحضور</h1>
          <p className="page-subtitle">تسجيل الحضور بالباركود</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          {[
            { label: 'إجمالي الطلاب', value: stats.totalStudents, color: 'var(--primary)' },
            { label: 'حاضرون اليوم', value: stats.presentToday, color: 'var(--success)' },
            { label: 'غائبون', value: stats.absentToday, color: 'var(--danger)' },
            { label: 'نسبة الحضور', value: `${stats.attendanceRate}%`, color: 'var(--warning)' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
              <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Scanner Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="zfe-card">

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCamera color="var(--primary-light)" size={18} />
              <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '1rem' }}>مسح الباركود</h3>
            </div>
            {/* مؤشر السكانر */}
            <motion.div
              animate={{ opacity: scannerActive ? 1 : 0.35, scale: scannerActive ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.3rem 0.7rem', borderRadius: 20,
                background: scannerActive ? 'rgba(16,185,129,0.15)' : 'var(--bg-primary)',
                border: `1px solid ${scannerActive ? 'rgba(16,185,129,0.4)' : 'var(--border-color)'}`,
              }}
            >
              <motion.div
                animate={{ opacity: scannerActive ? [1, 0.3, 1] : 0.4 }}
                transition={{ duration: 0.5, repeat: scannerActive ? 2 : 0 }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: scannerActive ? '#10b981' : 'var(--text-muted)' }}
              />
              <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.72rem', fontWeight: 600, color: scannerActive ? '#10b981' : 'var(--text-muted)' }}>
                {scannerActive ? 'جاري المسح...' : 'جاهز'}
              </span>
            </motion.div>
          </div>

          {/* Input يدوي */}
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <FiSearch style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              ref={inputRef}
              className="input-zfe"
              style={{
                paddingRight: '2.5rem', textAlign: 'center',
                fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '0.1em',
                borderColor: scannerActive ? '#10b981' : undefined,
                transition: 'border-color 0.3s'
              }}
              placeholder="ZFE-001"
              value={scanInput}
              onChange={e => setScanInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleManualScan()}
              autoFocus
            />
          </div>
          <button className="btn-zfe btn-primary-zfe" style={{ width: '100%', justifyContent: 'center' }} onClick={handleManualScan}>
            <FiCheckCircle size={16} /> تسجيل الحضور
          </button>

          {/* تعليمات */}
          <div style={{
            marginTop: '1rem', padding: '0.85rem',
            background: 'var(--bg-primary)', borderRadius: 8,
            fontSize: '0.78rem', color: 'var(--text-muted)',
            fontFamily: 'Cairo, sans-serif', lineHeight: 2
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <FiZap size={12} color="#10b981" />
              <span style={{ color: '#10b981', fontWeight: 600 }}>جهاز سكانر USB/Bluetooth</span>
            </div>
            وجّه السكانر للباركود — يُسجَّل الحضور تلقائياً فوراً
            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>✏️ يدوياً:</span> اكتب الكود واضغط Enter
              <br />مثال: ZFE-001، ZFE-002...
            </div>
          </div>

          {/* Scan Result */}
          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: scanResult.alreadyMarked ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  border: `1px solid ${scanResult.alreadyMarked ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
                  borderRadius: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                      {scanResult.alreadyMarked ? '⚠️ تم التسجيل مسبقاً' : '✅ تم تسجيل الحضور'}
                    </div>
                    <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {scanResult.student?.name}<br/>
                      {scanResult.grade || scanResult.student?.grade}
                    </div>
                    {!scanResult.alreadyMarked && scanResult.whatsappSent && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem', fontSize: '0.78rem', color: '#10b981' }}>
                        <FiMessageCircle size={12} /> تم إرسال رسالة واتساب لولي الأمر
                      </div>
                    )}
                  </div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setScanResult(null)}><FiX size={14} /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="zfe-card">
          <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '1.2rem' }}>إحصائيات الحضور الشهرية</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" tick={{ fontFamily: 'Cairo', fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontFamily: 'Cairo', fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontFamily: 'Cairo', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontFamily: 'Cairo', fontSize: 12 }} />
              <Bar dataKey="حاضر" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="غائب" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Filters + Table */}
      <div className="zfe-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          {/* Filter controls */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: filterGrade ? '0.85rem' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontFamily: 'Cairo, sans-serif', fontSize: '0.82rem' }}>
              <FiFilter size={14} /> تصفية:
            </div>
            <input type="date" className="input-zfe" style={{ width: 170 }} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
            <select className="input-zfe" style={{ width: 150 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">كل الحالات</option>
              <option value="حاضر">✅ حاضر</option>
              <option value="غائب">❌ غائب</option>
            </select>
            <select className="input-zfe" style={{ width: 220 }} value={filterGrade} onChange={e => setFilterGrade(e.target.value)}>
              <option value="">كل الصفوف</option>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            {(filterGrade || filterStatus) && (
              <button
                className="btn-zfe btn-ghost-zfe"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                onClick={() => { setFilterGrade(''); setFilterStatus(''); }}
              >
                <FiX size={13} /> مسح الفلاتر
              </button>
            )}
          </div>

          {/* Grade summary badges — shown only when a grade is selected */}
          {filterGrade && (() => {
            const gradeRecs = records;
            const present = gradeRecs.filter(r => r.status === 'حاضر').length;
            const absent  = gradeRecs.filter(r => r.status === 'غائب').length;
            const total   = gradeRecs.length;
            return (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}
              >
                <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                  📚 {filterGrade}
                </span>
                <span className="badge-zfe badge-info">إجمالي: {total}</span>
                <span className="badge-zfe badge-success">✅ حاضر: {present}</span>
                <span className="badge-zfe badge-danger">❌ غائب: {absent}</span>
                {total > 0 && (
                  <span className="badge-zfe badge-warning">
                    نسبة الحضور: {Math.round((present / total) * 100)}%
                  </span>
                )}
              </motion.div>
            );
          })()}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-zfe">
            <thead>
              <tr>
                <th>اسم الطالب</th>
                <th>الصف</th>
                <th>التاريخ</th>
                <th>وقت الحضور</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-icon">📋</div><div>لا توجد سجلات</div></div></td></tr>
              ) : records.map((r, i) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.student_name}</td>
                  <td><span className="badge-zfe badge-primary">{r.grade}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{r.date}</td>
                  <td style={{ color: 'var(--text-secondary)', direction: 'ltr', textAlign: 'right' }}>{r.time || '—'}</td>
                  <td>
                    <span className={`badge-zfe ${r.status === 'حاضر' ? 'badge-success' : 'badge-danger'}`}>
                      {r.status === 'حاضر' ? '✅' : '❌'} {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}