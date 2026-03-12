import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiCheckSquare,
  FiDollarSign,
  FiAlertTriangle,
  FiBookOpen,
  FiArrowLeft,
} from "react-icons/fi";
import { dashboardAPI } from "../services/api";

const GRADES = [
  { name: 'الصف الأول الابتدائي', color: 'var(--primary)', emoji: '🏫' },
  { name: 'الصف الثاني الابتدائي', color: 'var(--primary)', emoji: '📚' },
  { name: 'الصف الثالث الابتدائي', color: 'var(--primary)', emoji: '✏️' },
  { name: 'الصف الرابع الابتدائي', color: 'var(--success)', emoji: '📐' },
  { name: 'الصف الخامس الابتدائي', color: 'var(--success)', emoji: '🔢' },
  { name: 'الصف السادس الابتدائي', color: 'var(--success)', emoji: '🎓' },
  { name: 'الصف الأول الإعدادي', color: 'var(--warning)', emoji: '📖' },
  { name: 'الصف الثاني الإعدادي', color: 'var(--warning)', emoji: '🔬' },
  { name: 'الصف الثالث الإعدادي', color: 'var(--warning)', emoji: '🧪' },
  { name: 'الصف الأول الثانوي', color: 'var(--danger)', emoji: '🏆' },
  { name: 'الصف الثاني الثانوي', color: 'var(--danger)', emoji: '⭐' },
  { name: 'الصف الثالث الثانوي', color: 'var(--danger)', emoji: '🎯' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [gradeStats, setGradeStats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardAPI.getStats().then(setStats);
    dashboardAPI.getGradeStats().then(setGradeStats);
  }, []);

  const statCards = stats
    ? [
        {
          label: "إجمالي الطلاب",
          value: stats.totalStudents,
          icon: FiUsers,
          bg: "var(--primary-bg)",
        },
        {
          label: "حاضرون اليوم",
          value: stats.presentToday,
          icon: FiCheckSquare,
          bg: "var(--success-bg)",
        },
        {
          label: "لم يسددوا المصاريف",
          value: stats.unpaidPayments,
          icon: FiDollarSign,
          bg: "var(--warning-bg)",
        },
        {
          label: "طلاب يحتاجون متابعة",
          value: stats.weakStudents,
          icon: FiAlertTriangle,
          bg: "var(--danger-bg)",
        },
      ]
    : [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">لوحة التحكم</h1>
          <p className="page-subtitle">مرحباً بك في نظام Z.F.E التعليمي</p>
        </div>
        <div
          style={{
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            fontFamily: "Cairo, sans-serif",
          }}
        >
          {new Date().toLocaleDateString("ar-EG", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: "2rem" }}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <div
              className="stat-card-glow"
              style={{ background: card.color }}
            />
            <div className="stat-card-icon" style={{ background: card.bg }}>
              <card.icon size={22} color={card.color} />
            </div>
            <div className="stat-card-value">{card.value}</div>
            <div className="stat-card-label">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Rates */}
      {stats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.2rem",
            marginBottom: "2rem",
          }}
        >
          {[
            {
              label: "نسبة الحضور اليوم",
              value: stats.attendanceRate,
              color: "var(--success)",
            },
            {
              label: "نسبة تحصيل المصاريف",
              value: stats.collectionRate,
              color: "var(--primary)",
            },
          ].map((item) => (
            <div key={item.label} className="zfe-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.8rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "Cairo, sans-serif",
                    fontSize: "0.88rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: "Cairo, sans-serif",
                    fontWeight: 800,
                    fontSize: "1.3rem",
                    color: item.color,
                  }}
                >
                  {item.value}%
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  background: "var(--bg-primary)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{
                    height: "100%",
                    background: item.color,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Grades Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.2rem",
          }}
        >
          <FiBookOpen color="var(--primary)" size={20} />
          <h2
            style={{
              fontFamily: "Cairo, sans-serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            الصفوف الدراسية
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {GRADES.map((grade, i) => {
            const gs = gradeStats.find((g) => g.grade === grade.name);
            return (
              <motion.div
                key={grade.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  navigate(`/students?grade=${encodeURIComponent(grade.name)}`)
                }
                style={{
                  background: "var(--bg-card)",
                  border: `1px solid ${grade.color}25`,
                  borderRadius: 16,
                  padding: "1.2rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 80,
                    height: 80,
                    borderRadius: "0 16px 0 80px",
                    background: `${grade.color}15`,
                  }}
                />
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                  {grade.emoji}
                </div>
                <div
                  style={{
                    fontFamily: "Cairo, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    color: "var(--text-primary)",
                    lineHeight: 1.4,
                    marginBottom: "0.6rem",
                  }}
                >
                  {grade.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Cairo, sans-serif",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    {gs ? `${gs.students} طالب` : "عرض"}
                  </span>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: `${grade.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FiArrowLeft size={12} color={grade.color} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
