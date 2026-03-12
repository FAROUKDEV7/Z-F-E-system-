import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useApp } from "../hooks/useApp";
import { authAPI } from "../services/api";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "admin", password: "admin123" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      setError("الرجاء إدخال جميع البيانات");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await authAPI.login(form.username, form.password);
      login(res.user);
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        fontFamily: "Cairo, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "#a4fff43a",
          backdropFilter: "blur(20px)",
          border: "1px solid #14b8a6",
          borderRadius: 24,
          padding: "2.5rem",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 0 40px rgba(20,184,166,0.4)",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 18,
              background: "#14b8a6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 0 40px rgba(20,184,166,0.4)",
              fontSize: "1.8rem",
              color: "white",
              fontWeight: 900,
            }}
          >
            Z
          </div>
          <h1
            style={{
              color: "white",
              fontSize: "1.8rem",
              fontWeight: 800,
              margin: 0,
            }}
          >
            Z.F.E
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.88rem",
              marginTop: "0.3rem",
            }}
          >
            نظام إدارة المعهد التعليمي
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Username */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.82rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              اسم المستخدم
            </label>
            <div style={{ position: "relative" }}>
              <FiUser
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                }}
                size={16}
              />
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="أدخل اسم المستخدم"
                style={{
                  width: "100%",
                  padding: "0.75rem 2.8rem 0.75rem 1rem",
                  background: "#041a1698",
                  border: "1.5px solid #43b3a68a",
                  borderRadius: 10,
                  color: "white",
                  fontFamily: "Cairo, sans-serif",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#14b8a6")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(20,184,166,0.4)")
                }
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "0.82rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              كلمة المرور
            </label>
            <div style={{ position: "relative" }}>
              <FiLock
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                }}
                size={16}
              />
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="أدخل كلمة المرور"
                style={{
                  width: "100%",
                  padding: "0.75rem 2.8rem 0.75rem 2.8rem",
                  background: "#041a1698",
                  border: "1.5px solid #43b3a68a",
                  borderRadius: 10,
                  color: "white",
                  fontFamily: "Cairo, sans-serif",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#14b8a6")}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(20,184,166,0.4)")
                }
              />
              <button
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: 8,
                padding: "0.7rem 1rem",
                color: "#ef4444",
                fontSize: "0.85rem",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {error}
            </motion.div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.85rem",
              background: "#14b8a6",
              border: "none",
              borderRadius: 12,
              color: "white",
              fontFamily: "Cairo, sans-serif",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s",
              boxShadow: "rgba(20,184,166,0.4)",
            }}
          >
            {loading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                جاري تسجيل الدخول...
              </span>
            ) : (
              "تسجيل الدخول"
            )}
          </button>

          <p
            style={{
              textAlign: "center",
              color: "#64748b",
              fontSize: "0.78rem",
              marginTop: "1.2rem",
            }}
          >
            المستخدم: admin | كلمة المرور: admin123
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
