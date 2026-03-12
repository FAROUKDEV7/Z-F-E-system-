import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../hooks/useApp";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  const icons = {
    success: <FiCheckCircle color="var(--success)" size={18} />,
    error: <FiAlertCircle color="var(--danger)" size={18} />,
    warning: <FiAlertTriangle color="var(--warning)" size={18} />,
    info: <FiAlertCircle color="var(--primary)" size={18} />,
  };

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`toast toast-${toast.type}`}
          >
            {icons[toast.type] || icons.success}
            <span
              style={{
                flex: 1,
                fontFamily: "Cairo, sans-serif",
                fontSize: "0.88rem",
              }}
            >
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                transition: "0.2s",
                display: "flex",
              }}
            >
              <FiX size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
