import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <motion.main
        animate={{ marginRight: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}
      >
        <Navbar onMenuToggle={() => setCollapsed(!collapsed)} />
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}