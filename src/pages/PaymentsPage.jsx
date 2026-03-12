import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiCheckCircle, FiDollarSign, FiMessageCircle, FiX, FiFilter, FiZap } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { paymentsAPI } from '../services/api';
import { useApp } from '../hooks/useApp';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';

const GRADES = [
  'الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي',
  'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي',
  'الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي',
  'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي',
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const { addToast } = useApp();
  const inputRef = useRef();

  useEffect(() => { loadData(); }, [filterStatus, filterGrade]);

  const loadData = async () => {
    const [pays, s] = await Promise.all([
      paymentsAPI.getAll({ status: filterStatus || undefined, grade: filterGrade || undefined }),
      paymentsAPI.getStats()
    ]);
    setPayments(pays); setStats(s);
  };

  // دالة الدفع المشتركة
  const processBarcode = useCallback(async (code) => {
    if (!code.trim()) return;
    try {
      const result = await paymentsAPI.markPayment(code.trim());
      setScanResult(result);
      if (result.alreadyPaid) {
        addToast(`${result.student.name} — تم سداد المصاريف مسبقاً`, 'warning');
      } else {
        addToast(`✅ تم تسجيل دفع مصاريف ${result.student.name}`);
        loadData();
      }
    } catch (e) {
      addToast(e.message, 'error');
    }
  }, []);

  // جهاز السكانر الحقيقي
  useBarcodeScanner(useCallback((code) => {
    setScannerActive(true);
    setScanInput(code);
    setTimeout(() => setScannerActive(false), 800);
    processBarcode(code);
  }, [processBarcode]));

  // كتابة يدوية
  const handleManualScan = async () => {
    await processBarcode(scanInput);
    setScanInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const pieData = stats ? [
    { name: 'مدفوع', value: stats.paid },
    { name: 'غير مدفوع', value: stats.unpaid },
  ] : [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">إدارة المصاريف</h1>
          <p className="page-subtitle">متابعة المدفوعات وتحصيل الرسوم</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          {[
            { label: 'إجمالي الطلاب', value: stats.total, color: 'var(--primary)' },
            { label: 'مدفوع', value: stats.paid, color: 'var(--success)' },
            { label: 'غير مدفوع', value: stats.unpaid, color: 'var(--danger)' },
            { label: 'نسبة التحصيل', value: `${stats.collectionRate}%`, color: 'var(--warning)' },
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
        <motion.div className="zfe-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiDollarSign color="var(--primary)" size={18} />
              <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '1rem' }}>مسح باركود المصاريف</h3>
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
          <input
            ref={inputRef}
            className="input-zfe"
            style={{
              textAlign: 'center', fontFamily: 'monospace', fontSize: '1.1rem', marginBottom: '0.75rem',
              borderColor: scannerActive ? '#10b981' : undefined,
              transition: 'border-color 0.3s'
            }}
            placeholder="ZFE-001"
            value={scanInput}
            onChange={e => setScanInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleManualScan()}
            autoFocus
          />
          <button className="btn-zfe btn-primary-zfe" style={{ width: '100%', justifyContent: 'center' }} onClick={handleManualScan}>
            <FiCheckCircle size={16} /> تسجيل الدفع
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
            وجّه السكانر للباركود — يُسجَّل الدفع تلقائياً فوراً
            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>✏️ يدوياً:</span> اكتب الكود واضغط Enter
            </div>
          </div>

          <AnimatePresence>
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  marginTop: '1rem', padding: '1rem',
                  background: scanResult.alreadyPaid ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                  border: `1px solid ${scanResult.alreadyPaid ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
                  borderRadius: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, marginBottom: '0.3rem' }}>
                      {scanResult.alreadyPaid ? '⚠️ تم الدفع مسبقاً' : '✅ تم تسجيل الدفع'}
                    </div>
                    <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      {scanResult.student?.name}
                    </div>
                    {!scanResult.alreadyPaid && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.5rem', fontSize: '0.78rem', color: '#10b981' }}>
                        <FiMessageCircle size={12} /> تم إرسال إشعار لولي الأمر
                      </div>
                    )}
                  </div>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setScanResult(null)}><FiX size={14} /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pie Chart */}
        {stats && (
          <motion.div className="zfe-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>توزيع حالة المصاريف</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontFamily: 'Cairo', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ fontFamily: 'Cairo, sans-serif' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>المبلغ المحصل</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{stats.totalAmount.toLocaleString()} ج.م</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>المبلغ المتبقي</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{stats.pendingAmount.toLocaleString()} ج.م</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Table */}
      <div className="zfe-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          {/* Filter controls */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: filterGrade ? '0.85rem' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontFamily: 'Cairo, sans-serif', fontSize: '0.82rem' }}>
              <FiFilter size={14} /> تصفية:
            </div>
            <select className="input-zfe" style={{ width: 165 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">كل الحالات</option>
              <option value="مدفوع">✅ مدفوع</option>
              <option value="غير مدفوع">⏳ غير مدفوع</option>
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

          {/* Grade summary badges */}
          {filterGrade && (() => {
            const paid   = payments.filter(p => p.status === 'مدفوع').length;
            const unpaid = payments.filter(p => p.status === 'غير مدفوع').length;
            const total  = payments.length;
            const totalAmt = paid * 500;
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
                <span className="badge-zfe badge-success">✅ مدفوع: {paid}</span>
                <span className="badge-zfe badge-danger">⏳ غير مدفوع: {unpaid}</span>
                <span className="badge-zfe badge-warning">💰 محصّل: {totalAmt.toLocaleString()} ج.م</span>
                {total > 0 && (
                  <span className="badge-zfe badge-primary">
                    نسبة التحصيل: {Math.round((paid / total) * 100)}%
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
                <th>الشهر</th>
                <th>المبلغ</th>
                <th>حالة الدفع</th>
                <th>تاريخ الدفع</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">💳</div><div>لا توجد سجلات</div></div></td></tr>
              ) : payments.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.studentName}</td>
                  <td><span className="badge-zfe badge-primary">{p.grade}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.month}</td>
                  <td style={{ fontWeight: 600, color: 'var(--success)' }}>{p.amount} ج.م</td>
                  <td>
                    <span className={`badge-zfe ${p.status === 'مدفوع' ? 'badge-success' : 'badge-danger'}`}>
                      {p.status === 'مدفوع' ? '✅' : '⏳'} {p.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.paymentDate || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}