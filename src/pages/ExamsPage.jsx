import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiAlertTriangle, FiFilter } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { examsAPI } from '../services/api';
import { useApp } from '../hooks/useApp';

const GRADES = [
  'الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي',
  'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي',
  'الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي',
  'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي',
];

const EMPTY_FORM = { studentName: '', grade: GRADES[0], examName: '', score: '', totalScore: '100', date: new Date().toISOString().split('T')[0] };

export default function ExamsPage() {
  const [allResults, setAllResults] = useState([]);
  const [results, setResults] = useState([]);
  const [perfData, setPerfData] = useState([]);
  const [weakStudents, setWeakStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [filterGrade, setFilterGrade] = useState('');
  const { addToast } = useApp();

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (filterGrade) {
      setResults(allResults.filter(r => r.grade === filterGrade));
    } else {
      setResults(allResults);
    }
  }, [filterGrade, allResults]);

  const loadData = async () => {
    const [r, p, w] = await Promise.all([examsAPI.getAll(), examsAPI.getPerformanceStats(), examsAPI.getWeakStudents()]);
    setAllResults(r); setResults(r); setPerfData(p); setWeakStudents(w);
  };

  const handleSubmit = async () => {
    if (!form.studentName || !form.examName || !form.score) { addToast('يرجى تعبئة جميع الحقول المطلوبة', 'error'); return; }
    if (parseFloat(form.score) > parseFloat(form.totalScore)) { addToast('الدرجة لا يمكن أن تتجاوز الدرجة الكلية', 'error'); return; }
    setLoading(true);
    try {
      await examsAPI.create({ ...form, score: parseFloat(form.score), totalScore: parseFloat(form.totalScore) });
      addToast('تم إضافة نتيجة الامتحان بنجاح');
      setShowModal(false); setForm(EMPTY_FORM); loadData();
    } catch (e) { addToast(e.message, 'error'); }
    finally { setLoading(false); }
  };

  const getGrade = (score, total) => {
    const pct = (score / total) * 100;
    if (pct >= 90) return { label: 'ممتاز', color: 'var(--success)' };
    if (pct >= 75) return { label: 'جيد جداً', color: 'var(--primary)' };
    if (pct >= 60) return { label: 'جيد', color: 'var(--warning)' };
    return { label: 'ضعيف', color: 'var(--danger)' };
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">الامتحانات</h1>
          <p className="page-subtitle">إدارة نتائج الامتحانات وتحليل الأداء</p>
        </div>
        <button className="btn-zfe btn-primary-zfe" onClick={() => setShowModal(true)}>
          <FiPlus size={16} /> إضافة نتيجة
        </button>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="zfe-card">
          <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, marginBottom: '1rem' }}>متوسط الأداء بالمادة</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={perfData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="subject" tick={{ fontFamily: 'Cairo', fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis domain={[0, 100]} tick={{ fontFamily: 'Cairo', fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontFamily: 'Cairo', fontSize: 12 }} />
              <Bar dataKey="avg" fill="var(--primary)" radius={[4, 4, 0, 0]} name="المتوسط" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weak Students */}
        <div className="zfe-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FiAlertTriangle color="var(--warning)" size={18} />
            <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>طلاب يحتاجون متابعة</h3>
          </div>
          {weakStudents.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '2rem' }}>🎉</div>
              <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem', marginTop: '0.5rem' }}>جميع الطلاب بحالة جيدة</div>
            </div>
          ) : weakStudents.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '0.88rem' }}>{s.studentName}</div>
                <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.examName}</div>
              </div>
              <span className="badge-zfe badge-danger">{s.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="zfe-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          {/* Filter controls */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: filterGrade ? '0.85rem' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontFamily: 'Cairo, sans-serif', fontSize: '0.82rem' }}>
              <FiFilter size={14} /> تصفية بالصف:
            </div>
            <select
              className="input-zfe"
              style={{ width: 220 }}
              value={filterGrade}
              onChange={e => setFilterGrade(e.target.value)}
            >
              <option value="">كل الصفوف</option>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            {filterGrade && (
              <button
                className="btn-zfe btn-ghost-zfe"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                onClick={() => setFilterGrade('')}
              >
                <FiX size={13} /> مسح
              </button>
            )}
            <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.82rem', color: 'var(--text-muted)', marginRight: 'auto' }}>
              {results.length} نتيجة
            </span>
          </div>

          {/* Grade summary badges */}
          {filterGrade && (() => {
            const avg = results.length > 0
              ? Math.round(results.reduce((s, r) => s + (r.score / r.totalScore) * 100, 0) / results.length)
              : 0;
            const excellent = results.filter(r => (r.score / r.totalScore) >= 0.9).length;
            const good      = results.filter(r => (r.score / r.totalScore) >= 0.6 && (r.score / r.totalScore) < 0.9).length;
            const weak      = results.filter(r => (r.score / r.totalScore) < 0.6).length;
            return (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}
              >
                <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                  📚 {filterGrade}
                </span>
                <span className="badge-zfe badge-info">إجمالي: {results.length}</span>
                <span className="badge-zfe badge-success">⭐ ممتاز: {excellent}</span>
                <span className="badge-zfe badge-warning">📗 جيد: {good}</span>
                <span className="badge-zfe badge-danger">⚠️ ضعيف: {weak}</span>
                <span className="badge-zfe badge-primary">متوسط الصف: {avg}%</span>
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
                <th>الامتحان</th>
                <th>الدرجة</th>
                <th>النسبة</th>
                <th>التقدير</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => {
                const g = getGrade(r.score, r.totalScore);
                const pct = Math.round((r.score / r.totalScore) * 100);
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                    <td><span className="badge-zfe badge-primary">{r.grade}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.examName}</td>
                    <td style={{ fontWeight: 700 }}>{r.score}/{r.totalScore}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ flex: 1, height: 6, background: 'var(--bg-primary)', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: g.color, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: g.color, minWidth: 35 }}>{pct}%</span>
                      </div>
                    </td>
                    <td><span className="badge-zfe" style={{ background: `${g.color}15`, color: g.color }}>{g.label}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{r.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="modal-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>إضافة نتيجة امتحان</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><FiX /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">اسم الطالب *</label>
                  <input className="input-zfe" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">الصف الدراسي</label>
                  <select className="input-zfe" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}>
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">اسم الامتحان *</label>
                  <input className="input-zfe" value={form.examName} onChange={e => setForm({ ...form, examName: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">الدرجة *</label>
                  <input className="input-zfe" type="number" min="0" value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">الدرجة الكلية</label>
                  <input className="input-zfe" type="number" min="1" value={form.totalScore} onChange={e => setForm({ ...form, totalScore: e.target.value })} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">التاريخ</label>
                  <input className="input-zfe" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button className="btn-zfe btn-ghost-zfe" onClick={() => setShowModal(false)}>إلغاء</button>
                <button className="btn-zfe btn-primary-zfe" onClick={handleSubmit} disabled={loading}>{loading ? 'جاري الحفظ...' : 'حفظ النتيجة'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}