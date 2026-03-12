import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiSun, FiMoon, FiMenu } from 'react-icons/fi';
import { useApp } from '../hooks/useApp';
import { dashboardAPI } from '../services/api';

export default function Navbar({ onMenuToggle }) {
  const { user, theme, toggleTheme, notifications, setNotifications } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    dashboardAPI.getNotifications().then(setNotifications).catch(() => {});
  }, []);

  return (
    <nav style={{
      background: 'var(--navbar-bg)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 1.5rem',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(10px)',
    }}>
      {/* Left - Menu + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onMenuToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
          <FiMenu size={20} />
        </button>
        <div>
          <div style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
            معهد Z.F.E التعليمي
          </div>
          <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            نظام إدارة متكامل
          </div>
        </div>
      </div>

      {/* Right - Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative' }}
          >
            <FiBell size={16} />
            {notifications.length > 0 && (
              <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--danger)', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <>
                <div style={{ position: 'fixed', inset: 0 }} onClick={() => setShowNotifs(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    position: 'absolute', top: '110%', left: 0,
                    background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                    borderRadius: 12, width: 320, maxHeight: 400, overflowY: 'auto',
                    boxShadow: 'var(--shadow-lg)', zIndex: 200
                  }}
                >
                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    الإشعارات ({notifications.length})
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'Cairo, sans-serif', fontSize: '0.85rem' }}>لا توجد إشعارات</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.type === 'danger' ? 'var(--danger)' : 'var(--warning)', flexShrink: 0, marginTop: 5 }} />
                        <div>
                          <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.82rem', color: 'var(--text-primary)' }}>{n.message}</div>
                          <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{n.time}</div>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ display: 'none' }} className="d-md-block">
            <div style={{ fontFamily: 'Cairo, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}