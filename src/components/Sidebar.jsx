import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiCheckSquare,
  FiDollarSign,
  FiFileText,
  FiMonitor,
  FiBarChart2,
  FiSettings,
  FiChevronLeft,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { useApp } from "../hooks/useApp";
import { authAPI } from "../services/api";

const navItems = [
  { path: "/dashboard", icon: FiHome, label: "الصفحة الرئيسية" },
  { path: "/students", icon: FiUsers, label: "الطلاب" },
  { path: "/attendance", icon: FiCheckSquare, label: "الحضور" },
  { path: "/payments", icon: FiDollarSign, label: "المصاريف" },
  { path: "/exams", icon: FiFileText, label: "الامتحانات" },
  { path: "/online-exams", icon: FiMonitor, label: "الامتحانات الأونلاين" },
  { path: "/reports", icon: FiBarChart2, label: "التقارير" },
  { path: "/settings", icon: FiSettings, label: "الإعدادات" },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authAPI.logout();
    logout();
    navigate("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{
        background: "var(--sidebar-bg)",
        borderLeft: "1px solid var(--border-color)",
        height: "100vh",
        position: "fixed",
        right: 0,
        top: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "1.2rem 1rem",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            flexShrink: 0,
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 900,
            fontSize: "1rem",
            fontFamily: "Cairo, sans-serif",
          }}
        >
          Z
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                style={{
                  fontFamily: "Cairo, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  color: "var(--text-primary)",
                  lineHeight: 1.2,
                }}
              >
                Z.F.E
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  fontFamily: "Cairo, sans-serif",
                }}
              >
                النظام التعليمي
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            marginRight: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
            <FiChevronLeft size={18} />
          </motion.div>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.75rem 0.6rem", overflowY: "auto" }}>
        {navItems.map((item, i) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.75rem",
                borderRadius: 10,
                marginBottom: "0.15rem",
                textDecoration: "none",
                color: isActive ? "white" : "var(--text-secondary)",
                background: isActive ? "var(--primary)" : "transparent",
                boxShadow: isActive
                  ? "0 6px 18px rgba(20,184,166,0.35)"
                  : "none",
                fontFamily: "Cairo, sans-serif",
                fontWeight: isActive ? 600 : 400,
                fontSize: "0.88rem",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                overflow: "hidden",
              })}
            >
              <item.icon size={18} style={{ flexShrink: 0 }} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* User + Logout */}
      <div
        style={{
          padding: "0.75rem 0.6rem",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.6rem 0.75rem",
            marginBottom: "0.4rem",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: 'var(--primary)',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: "0.8rem",
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0) || "M"}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ minWidth: 0 }}
              >
                <div
                  style={{
                    fontFamily: "Cairo, sans-serif",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.name}
                </div>
                <div
                  style={{
                    fontFamily: "Cairo, sans-serif",
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                  }}
                >
                  مدير النظام
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.6rem 0.75rem",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--danger)",
            fontFamily: "Cairo, sans-serif",
            fontSize: "0.85rem",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <FiLogOut size={16} style={{ flexShrink: 0 }} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                تسجيل الخروج
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
