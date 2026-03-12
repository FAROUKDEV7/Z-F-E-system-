import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiLink, FiCopy, FiClock, FiPlay, FiTrash2 } from 'react-icons/fi';
import { onlineExamsAPI } from '../services/api';
import { useApp } from '../hooks/useApp';

export default function OnlineExamsPage() {
  const [exams, setExams] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [takeExam, setTakeExam] = useState(null);
  const [viewResults, setViewResults] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const { addToast } = useApp();

  // Create form state
  const [examForm, setExamForm] = useState({ title: '', subject: '', grade: '', duration: 30, totalScore: 100 });
  const [questions, setQuestions] = useState([{ text: '', choices: ['', '', '', ''], correct: 0 }]);

  // Take exam state
  const [studentName, setStudentName] = useState('');
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(null);
  const timerRef = useRef();

  useEffect(() => { onlineExamsAPI.getAll().then(setExams); }, []);

  useEffect(() => {
    if (takeExam) {
      setTimeLeft(takeExam.duration * 60);
      setAnswers({});
      setSubmitted(null);
    }
    return () => clearInterval(timerRef.current);
  }, [takeExam]);

  useEffect(() => {
    if (takeExam && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); handleSubmitExam(); return 0; }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [takeExam, submitted]);

  const handleSubmitExam = async () => {
    clearInterval(timerRef.current);
    if (!studentName.trim()) { addToast('يرجى إدخال اسمك', 'error'); return; }
    const result = await onlineExamsAPI.submitResult(takeExam.id, studentName, answers);
    setSubmitted(result);
  };

  const addQuestion = () => setQuestions([...questions, { text: '', choices: ['', '', '', ''], correct: 0 }]);
  const removeQuestion = (i) => setQuestions(questions.filter((_, idx) => idx !== i));
  const updateQuestion = (i, field, value) => setQuestions(questions.map((q, idx) => idx === i ? { ...q, [field]: value } : q));
  const updateChoice = (qi, ci, value) => setQuestions(questions.map((q, idx) => idx === qi ? { ...q, choices: q.choices.map((c, ci2) => ci2 === ci ? value : c) } : q));

  const handleCreateExam = async () => {
    if (!examForm.title || questions.some(q => !q.text)) { addToast('يرجى تعبئة جميع البيانات', 'error'); return; }
    const exam = await onlineExamsAPI.create({ ...examForm, questions });
    setExams([...exams, exam]);
    addToast('تم إنشاء الامتحان بنجاح 🎉');
    setShowCreate(false);
    setExamForm({ title: '', subject: '', grade: '', duration: 30, totalScore: 100 });
    setQuestions([{ text: '', choices: ['', '', '', ''], correct: 0 }]);
  };

  const loadResults = async (exam) => {
    const res = await onlineExamsAPI.getResults(exam.id);
    setExamResults(res); setViewResults(exam);
  };

  const formatTime = (secs) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">الامتحانات الأونلاين</h1>
          <p className="page-subtitle">إنشاء وإدارة الامتحانات الإلكترونية</p>
        </div>
        <button className="btn-zfe btn-primary-zfe" onClick={() => setShowCreate(true)}>
          <FiPlus size={16} /> إنشاء امتحان جديد
        </button>
      </div>

      {/* Exams Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
        {exams.map((exam, i) => (
          <motion.div key={exam.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="zfe-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{exam.title}</div>
                <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{exam.subject} | {exam.grade}</div>
              </div>
              <span className="badge-zfe badge-primary">{exam.questions?.length || 0} سؤال</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontFamily: 'Cairo, sans-serif', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span>⏱️ {exam.duration} دقيقة</span>
              <span>📊 {exam.totalScore} درجة</span>
              <span>📅 {exam.createdAt}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="btn-zfe btn-primary-zfe" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }} onClick={() => setTakeExam(exam)}>
                <FiPlay size={13} /> ابدأ الامتحان
              </button>
              <button className="btn-zfe btn-ghost-zfe" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }} onClick={() => loadResults(exam)}>
                📊 النتائج
              </button>
              <button
                className="btn-zfe btn-ghost-zfe"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
                onClick={() => { navigator.clipboard.writeText(window.location.origin + '/' + exam.link); addToast('تم نسخ رابط الامتحان'); }}
              >
                <FiCopy size={13} />
              </button>
            </div>
          </motion.div>
        ))}
        {exams.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state-icon">📝</div>
            <div className="empty-state-text">لا توجد امتحانات. قم بإنشاء امتحان جديد!</div>
          </div>
        )}
      </div>

      {/* Create Exam Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" style={{ maxWidth: 680 }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="modal-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>إنشاء امتحان جديد</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowCreate(false)}><FiX /></button>
              </div>
              {/* Exam Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">عنوان الامتحان *</label>
                  <input className="input-zfe" value={examForm.title} onChange={e => setExamForm({ ...examForm, title: e.target.value })} placeholder="مثال: امتحان الرياضيات - الفصل الأول" />
                </div>
                {[{ label: 'المادة', key: 'subject', ph: 'الرياضيات' }, { label: 'الصف', key: 'grade', ph: 'الصف الأول' }].map(f => (
                  <div key={f.key}>
                    <label className="form-label">{f.label}</label>
                    <input className="input-zfe" value={examForm[f.key]} onChange={e => setExamForm({ ...examForm, [f.key]: e.target.value })} placeholder={f.ph} />
                  </div>
                ))}
                <div>
                  <label className="form-label">المدة (دقيقة)</label>
                  <input className="input-zfe" type="number" min="5" value={examForm.duration} onChange={e => setExamForm({ ...examForm, duration: parseInt(e.target.value) })} />
                </div>
                <div>
                  <label className="form-label">الدرجة الكلية</label>
                  <input className="input-zfe" type="number" min="1" value={examForm.totalScore} onChange={e => setExamForm({ ...examForm, totalScore: parseInt(e.target.value) })} />
                </div>
              </div>
              {/* Questions */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>الأسئلة ({questions.length})</span>
                  <button className="btn-zfe btn-ghost-zfe" style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem' }} onClick={addQuestion}>
                    <FiPlus size={13} /> إضافة سؤال
                  </button>
                </div>
                <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {questions.map((q, qi) => (
                    <div key={qi} style={{ background: 'var(--bg-primary)', borderRadius: 10, padding: '1rem', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.82rem', color: 'var(--text-muted)', paddingTop: '0.6rem', flexShrink: 0 }}>س{qi + 1}</span>
                        <input className="input-zfe" value={q.text} onChange={e => updateQuestion(qi, 'text', e.target.value)} placeholder="نص السؤال..." style={{ flex: 1 }} />
                        {questions.length > 1 && (
                          <button className="btn-zfe btn-danger-zfe" style={{ padding: '0.4rem 0.6rem' }} onClick={() => removeQuestion(qi)}><FiTrash2 size={12} /></button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {q.choices.map((ch, ci) => (
                          <div key={ci} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            <input
                              type="radio" name={`q${qi}`} checked={q.correct === ci}
                              onChange={() => updateQuestion(qi, 'correct', ci)}
                              style={{ accentColor: 'var(--success)', cursor: 'pointer' }}
                            />
                            <input className="input-zfe" style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem' }} value={ch} onChange={e => updateChoice(qi, ci, e.target.value)} placeholder={`الخيار ${ci + 1}`} />
                          </div>
                        ))}
                      </div>
                      <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.72rem', color: 'var(--success)', marginTop: '0.4rem' }}>
                        ✓ الإجابة الصحيحة: الخيار {q.correct + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button className="btn-zfe btn-ghost-zfe" onClick={() => setShowCreate(false)}>إلغاء</button>
                <button className="btn-zfe btn-primary-zfe" onClick={handleCreateExam}>إنشاء الامتحان</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Take Exam Modal */}
      <AnimatePresence>
        {takeExam && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" style={{ maxWidth: 620 }} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{submitted.percentage >= 60 ? '🎉' : '📚'}</div>
                  <h2 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, marginBottom: '0.5rem' }}>انتهى الامتحان!</h2>
                  <p style={{ fontFamily: 'Cairo, sans-serif', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{submitted.studentName}</p>
                  <div style={{ fontSize: '3rem', fontWeight: 900, color: submitted.percentage >= 60 ? '#10b981' : '#ef4444', marginBottom: '0.5rem' }}>
                    {submitted.score}/{submitted.totalQuestions}
                  </div>
                  <div style={{ fontSize: '1.2rem', color: submitted.percentage >= 60 ? '#10b981' : '#ef4444', marginBottom: '1.5rem' }}>
                    {submitted.percentage}% — {submitted.percentage >= 90 ? 'ممتاز' : submitted.percentage >= 75 ? 'جيد جداً' : submitted.percentage >= 60 ? 'جيد' : 'يحتاج مراجعة'}
                  </div>
                  <button className="btn-zfe btn-primary-zfe" onClick={() => { setTakeExam(null); setSubmitted(null); }}>إغلاق</button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>{takeExam.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: timeLeft < 60 ? 'rgba(239,68,68,0.1)' : 'var(--bg-primary)', padding: '0.4rem 0.8rem', borderRadius: 8 }}>
                      <FiClock size={14} color={timeLeft < 60 ? '#ef4444' : 'var(--text-muted)'} />
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: timeLeft < 60 ? '#ef4444' : 'var(--text-primary)' }}>{formatTime(timeLeft)}</span>
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">اسمك الكامل *</label>
                    <input className="input-zfe" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="أدخل اسمك" />
                  </div>
                  <div style={{ maxHeight: 340, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {takeExam.questions.map((q, qi) => (
                      <div key={qi} style={{ background: 'var(--bg-primary)', borderRadius: 10, padding: '1rem' }}>
                        <div style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                          {qi + 1}. {q.text}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {q.choices.map((ch, ci) => (
                            <label key={ci} style={{
                              display: 'flex', alignItems: 'center', gap: '0.75rem',
                              padding: '0.6rem 0.8rem', borderRadius: 8, cursor: 'pointer',
                              background: answers[qi] === ci ? 'rgba(26,86,219,0.15)' : 'var(--bg-card)',
                              border: `1px solid ${answers[qi] === ci ? 'rgba(26,86,219,0.4)' : 'var(--border-color)'}`,
                              fontFamily: 'Cairo, sans-serif', fontSize: '0.88rem',
                              transition: 'all 0.15s'
                            }}>
                              <input type="radio" name={`q${qi}`} checked={answers[qi] === ci} onChange={() => setAnswers({ ...answers, [qi]: ci })} style={{ accentColor: 'var(--primary)' }} />
                              {ch}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.2rem', justifyContent: 'flex-end' }}>
                    <button className="btn-zfe btn-ghost-zfe" onClick={() => setTakeExam(null)}>إلغاء</button>
                    <button className="btn-zfe btn-primary-zfe" onClick={handleSubmitExam}>تسليم الامتحان</button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Modal */}
      <AnimatePresence>
        {viewResults && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" style={{ maxWidth: 560 }} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <div className="modal-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>نتائج: {viewResults.title}</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setViewResults(null)}><FiX /></button>
              </div>
              {examResults.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📊</div>
                  <div>لا توجد نتائج بعد</div>
                </div>
              ) : (
                <table className="table-zfe">
                  <thead><tr><th>اسم الطالب</th><th>الدرجة</th><th>النسبة</th></tr></thead>
                  <tbody>
                    {examResults.map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                        <td>{r.score}/{r.totalQuestions}</td>
                        <td><span className={`badge-zfe ${r.percentage >= 60 ? 'badge-success' : 'badge-danger'}`}>{r.percentage}%</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}