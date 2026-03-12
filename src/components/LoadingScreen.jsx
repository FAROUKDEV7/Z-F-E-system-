import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0d1117',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>

      {/* Background particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            borderRadius: '50%',
            background: `rgba(20,184,166, ${Math.random() * 0.4 + 0.2})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        style={{ textAlign: 'center', zIndex: 1 }}
      >

        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 24,
            background: '#14b8a6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 0 40px rgba(20,184,166,0.4)',
            fontSize: '2.2rem',
            color: 'white',
            fontWeight: 900,
            fontFamily: 'Cairo, sans-serif'
          }}
        >
          Z
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: '3rem',
            fontWeight: 900,
            fontFamily: 'Cairo, sans-serif',
            color: '#14b8a6',
            letterSpacing: '0.1em'
          }}
        >
          Z.F.E
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            color: '#8b949e',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '1.1rem',
            marginTop: '0.5rem'
          }}
        >
          نظام إدارة المعهد التعليمي
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ marginTop: '2.5rem' }}
        >
          <div style={{
            width: 200,
            height: 4,
            background: '#21262d',
            borderRadius: 2,
            margin: '0 auto'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, delay: 0.5 }}
              style={{
                height: '100%',
                background: '#14b8a6',
                borderRadius: 2
              }}
            />
          </div>

          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              color: '#6e7681',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '0.8rem',
              marginTop: '0.8rem'
            }}
          >
            جاري التحميل...
          </motion.p>

        </motion.div>
      </motion.div>
    </div>
  );
}