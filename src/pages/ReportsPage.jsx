import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { attendanceAPI, paymentsAPI, examsAPI } from '../services/api';

export default function ReportsPage() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);
  const [perfData, setPerfData] = useState([]);
  const [payStats, setPayStats] = useState(null);
  const [attStats, setAttStats] = useState(null);

  useEffect(() => {
    attendanceAPI.getMonthlyStats().then(setAttendanceData);
    paymentsAPI.getMonthlyStats().then(setPaymentsData);
    examsAPI.getPerformanceStats().then(setPerfData);
    paymentsAPI.getStats().then(setPayStats);
    attendanceAPI.getStats().then(setAttStats);
  }, []);

  const pieColors = ['#10b981', '#ef4444'];
  const piePayData = payStats ? [
    { name: 'مدفوع', value: payStats.paid },
    { name: 'غير مدفوع', value: payStats.unpaid }
  ] : [];
  const pieAttData = attStats ? [
    { name: 'حاضر', value: attStats.presentToday },
    { name: 'غائب', value: attStats.absentToday }
  ] : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '0.75rem', fontFamily: 'Cairo', fontSize: '0.8rem' }}>
        <p style={{ fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-primary)' }}>{label}</p>
        {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">التقارير والإحصائيات</h1>
          <p className="page-subtitle">تحليل شامل لأداء المعهد</p>
        </div>
      </div>

      {/* Summary row */}
      {attStats && payStats && (
        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          {[
            { label: 'نسبة الحضور', value: `${attStats.attendanceRate}%`, color: 'var(--success)', icon: '✅' },
            { label: 'نسبة التحصيل المالي', value: `${payStats.collectionRate}%`, color: 'var(--primary)' , icon: '💰' },
            { label: 'المبلغ المحصل', value: `${payStats.totalAmount.toLocaleString()} ج.م`, color: 'var(--warning)', icon: '📈' },
            { label: 'المتبقي', value: `${payStats.pendingAmount.toLocaleString()} ج.م`, color: 'var(--danger)', icon: '⏳' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div className="stat-card-value" style={{ color: s.color, fontSize: '1.5rem' }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="zfe-card">
          <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>
            📊 تطور الحضور خلال الشهر
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" tick={{ fontFamily: 'Cairo', fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontFamily: 'Cairo', fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="حاضر" stroke="#10b981" fill="url(#attGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="zfe-card">
          <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>
            💳 تحصيل المصاريف الشهري
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={paymentsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fontFamily: 'Cairo', fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontFamily: 'Cairo', fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="مدفوع" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="غير_مدفوع" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Legend wrapperStyle={{ fontFamily: 'Cairo', fontSize: 12 }} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="zfe-card">
          <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>📚 متوسط أداء المواد</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={perfData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontFamily: 'Cairo', fontSize: 10, fill: 'var(--text-muted)' }} />
              <YAxis dataKey="subject" type="category" tick={{ fontFamily: 'Cairo', fontSize: 10, fill: 'var(--text-muted)' }} width={85} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avg" fill="var(--primary)" radius={[0, 4, 4, 0]} name="المتوسط" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="zfe-card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>👥 الحضور اليوم</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieAttData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {pieAttData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontFamily: 'Cairo', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="zfe-card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>💰 حالة المصاريف</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={piePayData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {piePayData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', fontFamily: 'Cairo', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}