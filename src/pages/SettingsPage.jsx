import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiSave, FiBell, FiInfo, FiMessageSquare, FiRefreshCw, FiSend } from 'react-icons/fi';
import { useApp } from '../hooks/useApp';
import api, { paymentsAPI } from '../services/api';

const Toggle = ({ checked, onChange, label }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
    padding:'0.75rem 0', borderBottom:'1px solid var(--border-color)' }}>
    <span style={{ fontFamily:'Cairo,sans-serif', fontSize:'0.9rem', color:'var(--text-secondary)' }}>{label}</span>
    <button onClick={() => onChange(!checked)} style={{
      width:48, height:26, borderRadius:13, border:'none', cursor:'pointer',
      background: checked ? 'var(--primary)' : 'var(--bg-primary)',
      position:'relative', transition:'background 0.2s',
      boxShadow:'inset 0 0 0 1px var(--border-color)',
    }}>
      <span style={{
        position:'absolute', top:3, width:20, height:20, borderRadius:'50%',
        background:'white', transition:'right 0.2s',
        right: checked ? 4 : 24, boxShadow:'0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  </div>
);

export default function SettingsPage() {
  const { theme, toggleTheme, addToast } = useApp();
  const [saving, setSaving]       = useState(false);
  const [loading, setLoading]     = useState(true);
  const [settings, setSettings]   = useState({
    name: 'معهد Z.F.E التعليمي',
    monthly_fee: 500,
    payment_due_day: 10,
    institute_phone: '',
    whatsapp_attendance: true,
    whatsapp_payment: true,
    whatsapp_absent: false,
    whatsapp_unpaid: false,
  });
  const [waReady, setWaReady]         = useState(false);
  const [waChecking, setWaChecking]   = useState(false);
  const [testPhone, setTestPhone]     = useState('');
  const [testSending, setTestSending] = useState(false);
  const [creatingPayments, setCreatingPayments] = useState(false);
  const pollRef = useRef(null);

  useEffect(() => {
    paymentsAPI.getSettings()
      .then(data => { setSettings(data); setLoading(false); })
      .catch(() => setLoading(false));
    checkWa();
    return () => clearInterval(pollRef.current);
  }, []);

  const checkWa = async () => {
    setWaChecking(true);
    try {
      const d = await api.get('/auth/whatsapp/status/').then(r => r.data);
      setWaReady(d.ready);
      if (!d.ready) startPoll();
      else clearInterval(pollRef.current);
    } catch { setWaReady(false); }
    finally { setWaChecking(false); }
  };

  const startPoll = () => {
    clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const d = await api.get('/auth/whatsapp/status/').then(r => r.data);
        setWaReady(d.ready);
        if (d.ready) { clearInterval(pollRef.current); addToast('✅ واتساب متصل!'); }
      } catch {}
    }, 5000);
  };

  const set = (k, v) => setSettings(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await paymentsAPI.saveSettings(settings);
      addToast('✅ تم حفظ الإعدادات بنجاح');
    } catch (e) { addToast(e.message || 'خطأ في الحفظ', 'error'); }
    finally { setSaving(false); }
  };

  const createMonthlyPayments = async () => {
    if (!confirm('هل تريد إنشاء مصاريف الشهر الحالي لكل الطلاب؟')) return;
    setCreatingPayments(true);
    try {
      await api.post('/payments/create-monthly/');
      addToast('✅ تم إنشاء مصاريف الشهر الحالي لكل الطلاب');
    } catch (e) { addToast(e.message || 'خطأ', 'error'); }
    finally { setCreatingPayments(false); }
  };

  const sendTest = async () => {
    if (!testPhone) { addToast('أدخل رقم الهاتف', 'error'); return; }
    setTestSending(true);
    try {
      const d = await api.post('/auth/whatsapp/status/', {
        phone: testPhone,
        message: `✅ رسالة اختبار من ${settings.name} 🎓`,
      }).then(r => r.data);
      if (d.success) addToast('✅ تم الإرسال بنجاح!');
      else addToast('فشل الإرسال — تأكد من اتصال الواتساب', 'error');
    } catch (e) { addToast(e.message, 'error'); }
    finally { setTestSending(false); }
  };

  if (loading) return (
    <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)', fontFamily:'Cairo,sans-serif' }}>
      ⏳ جاري التحميل...
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">الإعدادات</h1>
          <p className="page-subtitle">إعدادات النظام والواتساب</p>
        </div>
        <button className="btn-zfe btn-primary-zfe" onClick={save} disabled={saving}>
          <FiSave size={16} /> {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>

        {/* بيانات المعهد */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="zfe-card">
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem' }}>
            <FiInfo color="var(--primary-light)" size={18} />
            <h3 style={{ fontFamily:'Cairo,sans-serif', fontWeight:700, fontSize:'1rem' }}>بيانات المعهد</h3>
          </div>
          <div className="form-group">
            <label className="form-label">اسم المعهد</label>
            <input className="input-zfe" value={settings.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">الرسوم الشهرية (ج.م)</label>
            <input className="input-zfe" type="number" value={settings.monthly_fee} onChange={e => set('monthly_fee', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">يوم استحقاق الرسوم</label>
            <input className="input-zfe" type="number" min="1" max="28" value={settings.payment_due_day} onChange={e => set('payment_due_day', e.target.value)} />
          </div>
        </motion.div>

        {/* المظهر */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }} className="zfe-card">
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem' }}>
            {theme === 'dark' ? <FiMoon color="var(--primary-light)" size={18}/> : <FiSun color="var(--warning)" size={18}/>}
            <h3 style={{ fontFamily:'Cairo,sans-serif', fontWeight:700, fontSize:'1rem' }}>المظهر</h3>
          </div>
          <div style={{ display:'flex', gap:'1rem' }}>
            {['dark','light'].map(t => (
              <button key={t} onClick={theme !== t ? toggleTheme : undefined} style={{
                flex:1, padding:'1rem', borderRadius:12,
                border:`2px solid ${theme===t ? 'var(--primary)' : 'var(--border-color)'}`,
                background: theme===t ? 'rgba(26,86,219,0.1)' : 'var(--bg-primary)',
                cursor:'pointer', transition:'all 0.2s',
              }}>
                <div style={{ fontSize:'1.5rem', marginBottom:'0.4rem' }}>{t==='dark'?'🌙':'☀️'}</div>
                <div style={{ fontFamily:'Cairo,sans-serif', fontWeight:600, fontSize:'0.9rem',
                  color:theme===t ? 'var(--primary-light)' : 'var(--text-secondary)' }}>
                  {t==='dark'?'داكن':'فاتح'}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* مصاريف الشهر */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }} className="zfe-card">
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
            <span style={{ fontSize:'1.2rem' }}>💰</span>
            <h3 style={{ fontFamily:'Cairo,sans-serif', fontWeight:700, fontSize:'1rem' }}>مصاريف الشهر</h3>
          </div>
          <p style={{ fontFamily:'Cairo,sans-serif', fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'1rem' }}>
            النظام بيعمل مصاريف الشهر الجديد تلقائياً كل أول الشهر.
            لو عايز تعملها يدوياً دلوقتي اضغط الزرار.
          </p>
          <button className="btn-zfe btn-primary-zfe" onClick={createMonthlyPayments} disabled={creatingPayments}>
            💰 {creatingPayments ? 'جاري الإنشاء...' : `إنشاء مصاريف ${new Date().toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}`}
          </button>
        </motion.div>

        {/* إعداد الواتساب */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} className="zfe-card">
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.2rem' }}>
            <FiMessageSquare color="#25D366" size={18}/>
            <h3 style={{ fontFamily:'Cairo,sans-serif', fontWeight:700, fontSize:'1rem' }}>إعداد الواتساب</h3>
            <span style={{
              marginRight:'auto', fontSize:'0.75rem', padding:'0.2rem 0.75rem',
              borderRadius:20, fontFamily:'Cairo,sans-serif',
              background: waReady ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.1)',
              color: waReady ? 'var(--success)' : 'var(--danger)',
            }}>
              {waReady ? '✅ متصل' : '❌ غير متصل'}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">📱 رقم واتساب المعهد (المُرسِل)</label>
            <input className="input-zfe" dir="ltr" style={{ textAlign:'left' }}
              placeholder="201012345678"
              value={settings.institute_phone}
              onChange={e => set('institute_phone', e.target.value)} />
            <small style={{ fontFamily:'Cairo,sans-serif', fontSize:'0.75rem', color:'var(--text-muted)' }}>
              بالصيغة الدولية بدون + — مصر: 20 + الرقم
            </small>
          </div>

          <div style={{
            background: waReady ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.07)',
            border: `1px solid ${waReady ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)'}`,
            borderRadius:10, padding:'0.9rem', marginBottom:'1rem',
          }}>
            {waReady ? (
              <p style={{ fontFamily:'Cairo,sans-serif', fontSize:'0.85rem', color:'var(--success)', margin:0 }}>
                ✅ خدمة الواتساب شغّالة — الرسائل بتتبعت تلقائياً
              </p>
            ) : (
              <div>
                <p style={{ fontFamily:'Cairo,sans-serif', fontSize:'0.85rem', color:'var(--danger)', margin:'0 0 0.5rem' }}>
                  ❌ خدمة الواتساب مش شغّالة
                </p>
                <p style={{ fontFamily:'Cairo,sans-serif', fontSize:'0.78rem', color:'var(--text-muted)', margin:'0 0 0.4rem' }}>
                  شغّل الخدمة في terminal جديد:
                </p>
                <code style={{ fontFamily:'monospace', fontSize:'0.78rem', background:'var(--bg-primary)',
                  padding:'0.25rem 0.6rem', borderRadius:6, color:'var(--text-primary)', display:'block', marginBottom:'0.4rem' }}>
                  cd zfe-whatsapp &amp;&amp; node server.js
                </code>
                <a href="http://localhost:3001/qr" target="_blank" rel="noreferrer"
                  style={{ fontFamily:'Cairo,sans-serif', fontSize:'0.78rem', color:'var(--primary-light)' }}>
                  ثم افتح هنا لسكن QR Code ←
                </a>
              </div>
            )}
          </div>

          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', flexWrap:'wrap' }}>
            <button className="btn-zfe btn-ghost-zfe" onClick={checkWa} disabled={waChecking} style={{ fontSize:'0.82rem' }}>
              <FiRefreshCw size={13}/> {waChecking ? 'جاري الفحص...' : 'فحص الاتصال'}
            </button>
            {waReady && <>
              <input className="input-zfe" placeholder="01012345678 اختبار" value={testPhone}
                onChange={e => setTestPhone(e.target.value)} dir="ltr"
                style={{ flex:1, minWidth:150, textAlign:'left', fontSize:'0.85rem' }}
                onKeyDown={e => e.key==='Enter' && sendTest()} />
              <button className="btn-zfe btn-primary-zfe" onClick={sendTest} disabled={testSending} style={{ fontSize:'0.82rem' }}>
                <FiSend size={13}/> {testSending ? '...' : 'اختبار'}
              </button>
            </>}
          </div>
        </motion.div>

        {/* إعدادات الإشعارات */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }} className="zfe-card">
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
            <FiBell color="var(--primary-light)" size={18}/>
            <h3 style={{ fontFamily:'Cairo,sans-serif', fontWeight:700, fontSize:'1rem' }}>متى تتبعت رسالة واتساب؟</h3>
          </div>
          <Toggle checked={settings.whatsapp_attendance} onChange={v=>set('whatsapp_attendance',v)} label="✅ عند تسجيل الحضور"/>
          <Toggle checked={settings.whatsapp_payment}    onChange={v=>set('whatsapp_payment',v)}    label="💰 عند سداد المصاريف"/>
          <Toggle checked={settings.whatsapp_absent}     onChange={v=>set('whatsapp_absent',v)}     label="⚠️ عند تسجيل الغياب"/>
          <Toggle checked={settings.whatsapp_unpaid}     onChange={v=>set('whatsapp_unpaid',v)}     label="🔔 تذكير بالمصاريف المتأخرة"/>
        </motion.div>

      </div>
    </div>
  );
}