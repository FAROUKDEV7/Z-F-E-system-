import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiPrinter, FiX } from 'react-icons/fi';
import Barcode from 'react-barcode';
import { studentsAPI } from '../services/api';
import { useApp } from '../hooks/useApp';

const GRADES = [
  'الصف الأول الابتدائي', 'الصف الثاني الابتدائي', 'الصف الثالث الابتدائي',
  'الصف الرابع الابتدائي', 'الصف الخامس الابتدائي', 'الصف السادس الابتدائي',
  'الصف الأول الإعدادي', 'الصف الثاني الإعدادي', 'الصف الثالث الإعدادي',
  'الصف الأول الثانوي', 'الصف الثاني الثانوي', 'الصف الثالث الثانوي',
];

const EMPTY_FORM = { name: '', grade: GRADES[0], parentName: '', whatsapp: '', phone: '', notes: '' };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useApp();
  const [searchParams] = useSearchParams();
  const gradeFilter = searchParams.get('grade') || '';
  const printRef = useRef();

  useEffect(() => { loadStudents(); }, [gradeFilter]);

  const loadStudents = async () => {
    const data = await studentsAPI.getAll(gradeFilter || null);
    setStudents(data);
  };

  const filtered = students.filter(s =>
    s.name.includes(search) || s.grade.includes(search) || s.barcode.includes(search)
  );

  // camelCase (JS) → snake_case (Django)
  const toBackend = (f) => ({
    name:        f.name,
    grade:       f.grade,
    parent_name: f.parentName,
    whatsapp:    f.whatsapp,
    phone:       f.phone || '',
    notes:       f.notes || '',
  });

  const handleSubmit = async () => {
    if (!form.name)       { addToast('اسم الطالب مطلوب', 'error'); return; }
    if (!form.parentName) { addToast('اسم ولي الأمر مطلوب', 'error'); return; }
    if (!form.whatsapp)   { addToast('رقم الواتساب مطلوب', 'error'); return; }
    setLoading(true);
    try {
      if (editId) {
        await studentsAPI.update(editId, toBackend(form));
        addToast('تم تحديث بيانات الطالب بنجاح');
      } else {
        await studentsAPI.create(toBackend(form));
        addToast('تم إضافة الطالب بنجاح وتم إنشاء الباركود ✅');
      }
      setShowModal(false); setForm(EMPTY_FORM); setEditId(null);
      loadStudents();
    } catch (e) { addToast(e.message, 'error'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل تريد حذف هذا الطالب؟')) return;
    await studentsAPI.delete(id);
    addToast('تم حذف الطالب', 'warning');
    loadStudents();
  };

  // snake_case (Django response) → camelCase (JS form)
  const handleEdit = (student) => {
    setForm({
      name:       student.name,
      grade:      student.grade,
      parentName: student.parent_name || student.parentName || '',
      whatsapp:   student.whatsapp,
      phone:      student.phone || '',
      notes:      student.notes || '',
    });
    setEditId(student.id); setShowModal(true);
  };

  const printBarcode = () => {
    const content = printRef.current;
    const win = window.open('', '_blank');
    win.document.write(`
      <html dir="rtl"><head>
      <style>
        body { font-family: Cairo, sans-serif; display: flex; justify-content: center; padding: 2rem; }
        .card { border: 2px solid #1a56db; border-radius: 12px; padding: 1.5rem; text-align: center; width: 300px; }
        h2 { margin: 0 0 0.5rem; font-size: 1.2rem; }
        p { color: #64748b; margin: 0 0 1rem; font-size: 0.85rem; }
        .institute { font-size: 0.75rem; color: #94a3b8; margin-top: 1rem; }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
      </head><body>
      <div class="card">${content.innerHTML}<p class="institute">معهد Z.F.E التعليمي</p></div>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">إدارة الطلاب</h1>
          {gradeFilter && <p className="page-subtitle">{gradeFilter}</p>}
        </div>
        <button className="btn-zfe btn-primary-zfe" onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); }}>
          <FiPlus size={16} /> إضافة طالب جديد
        </button>
      </div>

      {/* Search */}
      <div className="zfe-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <FiSearch style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input-zfe" style={{ paddingRight: '2.5rem' }} placeholder="بحث بالاسم أو الصف أو الباركود..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="zfe-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-zfe">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم الطالب</th>
                <th>الصف الدراسي</th>
                <th>ولي الأمر</th>
                <th>الواتساب</th>
                <th>الباركود</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon">👨‍🎓</div><div className="empty-state-text">لا يوجد طلاب</div></div></td></tr>
              ) : filtered.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                    {s.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.notes}</div>}
                  </td>
                  <td><span className="badge-zfe badge-primary">{s.grade}</span></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{s.parent_name || s.parentName}</td>
                  <td style={{ color: 'var(--text-secondary)', direction: 'ltr', textAlign: 'right' }}>{s.whatsapp}</td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', background: 'var(--bg-primary)', padding: '0.2rem 0.6rem', borderRadius: 6, color: 'var(--accent)' }}>
                      {s.barcode}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn-zfe btn-ghost-zfe" style={{ padding: '0.4rem 0.7rem' }} onClick={() => setShowBarcodeModal(s)} title="عرض الباركود">
                        🔷
                      </button>
                      <button className="btn-zfe btn-ghost-zfe" style={{ padding: '0.4rem 0.7rem' }} onClick={() => handleEdit(s)}>
                        <FiEdit2 size={14} />
                      </button>
                      <button className="btn-zfe btn-danger-zfe" style={{ padding: '0.4rem 0.7rem' }} onClick={() => handleDelete(s.id)}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="modal-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{editId ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)}><FiX /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: 'اسم الطالب *', key: 'name', span: 2 },
                  { label: 'اسم ولي الأمر', key: 'parentName' },
                  { label: 'رقم الواتساب', key: 'whatsapp' },
                  { label: 'رقم الهاتف', key: 'phone' },
                ].map(f => (
                  <div key={f.key} style={{ gridColumn: f.span === 2 ? 'span 2' : undefined }}>
                    <label className="form-label">{f.label}</label>
                    <input className="input-zfe" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">الصف الدراسي *</label>
                  <select className="input-zfe" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })}>
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">ملاحظات</label>
                  <textarea className="input-zfe" rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: 'vertical' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button className="btn-zfe btn-ghost-zfe" onClick={() => setShowModal(false)}>إلغاء</button>
                <button className="btn-zfe btn-primary-zfe" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'جاري الحفظ...' : (editId ? 'حفظ التعديلات' : 'إضافة الطالب')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barcode Modal */}
      <AnimatePresence>
        {showBarcodeModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" style={{ textAlign: 'center' }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="modal-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>بطاقة الطالب</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowBarcodeModal(null)}><FiX /></button>
              </div>
              <div ref={printRef} style={{ padding: '1rem' }}>
                <h2 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, marginBottom: '0.3rem' }}>{showBarcodeModal.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontFamily: 'Cairo, sans-serif', marginBottom: '1rem' }}>{showBarcodeModal.grade}</p>
                <div style={{ display: 'flex', justifyContent: 'center', background: 'white', padding: '1rem', borderRadius: 8 }}>
                  <Barcode value={showBarcodeModal.barcode} width={2} height={60} fontSize={14} />
                </div>
              </div>
              <button className="btn-zfe btn-primary-zfe" style={{ marginTop: '1rem' }} onClick={printBarcode}>
                <FiPrinter size={16} /> طباعة البطاقة
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}