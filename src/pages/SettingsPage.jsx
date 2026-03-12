import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiSave, FiBell, FiShield, FiInfo } from 'react-icons/fi';
import { useApp } from '../hooks/useApp';

export default function SettingsPage() {
  const { theme, toggleTheme, addToast, user } = useApp();
  const [settings, setSettings] = useState({
    instituteName: 'معهد Z.F.E التعليمي',
    whatsappEnabled: true,
    autoNotifyAbsent: true,
    autoNotifyUnpaid: true,
    paymentAmount: 500,
    paymentDueDay: 10,
  });

  const save = () => addToast('تم حفظ الإعدادات بنجاح ✅');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">الإعدادات</h1>
          <p className="page-subtitle">ضبط إعدادات النظام</p>
        </div>
        <button className="btn-zfe btn-primary-zfe" onClick={save}><FiSave size={16} /> حفظ الإعدادات</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* General */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="zfe-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
            <FiInfo color="var(--primary-light)" size={18} />
            <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '1rem' }}>بيانات المعهد</h3>
          </div>
          <div className="form-group">
            <label className="form-label">اسم المعهد</label>
            <input className="input-zfe" value={settings.instituteName} onChange={e => setSettings({ ...settings, instituteName: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">رسوم الاشتراك الشهري (ج.م)</label>
            <input className="input-zfe" type="number" value={settings.paymentAmount} onChange={e => setSettings({ ...settings, paymentAmount: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">يوم استحقاق الرسوم (رقم اليوم في الشهر)</label>
            <input className="input-zfe" type="number" min="1" max="28" value={settings.paymentDueDay} onChange={e => setSettings({ ...settings, paymentDueDay: e.target.value })} />
          </div>
        </motion.div>

        {/* Theme */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="zfe-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
            {theme === 'dark' ? <FiMoon color="var(--primary-light)" size={18} /> : <FiSun color="var(--warning)" size={18} />}
            <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '1rem' }}>المظهر</h3>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['dark', 'light'].map(t => (
              <button
                key={t}
                onClick={theme !== t ? toggleTheme : undefined}
                style={{
                  flex: 1, padding: '1rem', borderRadius: 12, border: `2px solid ${theme === t ? 'var(--primary)' : 'var(--border-color)'}`,
                  background: theme === t ? 'rgba(26,86,219,0.1)' : 'var(--bg-primary)',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{t === 'dark' ? '🌙' : '☀️'}</div>
                <div style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: theme === t ? 'var(--primary-light)' : 'var(--text-secondary)' }}>
                  {t === 'dark' ? 'المظهر الداكن' : 'المظهر الفاتح'}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="zfe-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
            <FiBell color="var(--primary-light)" size={18} />
            <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '1rem' }}>إعدادات الإشعارات</h3>
          </div>
          {[
            { key: 'whatsappEnabled', label: 'تفعيل إشعارات الواتساب', desc: 'إرسال رسائل تلقائية لأولياء الأمور' },
            { key: 'autoNotifyAbsent', label: 'إشعار الغياب', desc: 'إرسال رسالة عند غياب الطالب' },
            { key: 'autoNotifyUnpaid', label: 'إشعار المصاريف المتأخرة', desc: 'تذكير بسداد الرسوم عند التأخر' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{item.label}</div>
                <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              <div
                onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                style={{
                  width: 44, height: 24, borderRadius: 12, cursor: 'pointer', transition: 'all 0.3s',
                  background: settings[item.key] ? 'var(--primary)' : 'var(--border-color)',
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', background: 'white',
                  transition: 'all 0.3s',
                  left: settings[item.key] ? 22 : 2
                }} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Account */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="zfe-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
            <FiShield color="var(--primary-light)" size={18} />
            <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '1rem' }}>بيانات الحساب</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 12, marginBottom: '1rem' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.2rem', flexShrink: 0 }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{user?.name}</div>
              <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)' }}>مدير النظام | {user?.username}</div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">كلمة المرور الجديدة</label>
            <input className="input-zfe" type="password" placeholder="••••••••" />
          </div>
          <div className="form-group">
            <label className="form-label">تأكيد كلمة المرور</label>
            <input className="input-zfe" type="password" placeholder="••••••••" />
          </div>
          <button className="btn-zfe btn-primary-zfe" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            تغيير كلمة المرور
          </button>
        </motion.div>
      </div>
    </div>
  );
}