import { useEffect, useRef, useCallback } from 'react';

/**
 * useBarcodeScanner
 * 
 * يدعم طريقتين في نفس الوقت:
 * 1. كتابة يدوية في الـ input + Enter
 * 2. جهاز Scanner حقيقي — بيكتب بسرعة < SCANNER_SPEED_MS ثم Enter
 * 
 * الـ Scanner بيتصرف كـ HID Keyboard، بيكتب كل الحروف خلال أقل من 50ms
 * ثم يرسل Enter. نحن نستخدم هذا الفارق لنميّز بين المستخدم والسكانر.
 */

const SCANNER_SPEED_MS = 50;   // أقصى فترة بين ضغطتين للسكانر
const MIN_BARCODE_LEN  = 3;    // أقل طول مقبول للباركود

export function useBarcodeScanner(onScan) {
  const bufferRef    = useRef('');
  const lastKeyTime  = useRef(0);
  const timerRef     = useRef(null);

  const flush = useCallback(() => {
    const code = bufferRef.current.trim();
    bufferRef.current = '';
    if (code.length >= MIN_BARCODE_LEN) {
      onScan(code.toUpperCase());
    }
  }, [onScan]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // تجاهل الضغطات من داخل input/textarea عشان متتعارضش مع الكتابة اليدوية
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const now = Date.now();
      const gap = now - lastKeyTime.current;
      lastKeyTime.current = now;

      // لو Enter — نفّذ
      if (e.key === 'Enter') {
        clearTimeout(timerRef.current);
        flush();
        return;
      }

      // لو الفارق أكبر من حد السكانر → buffer جديد
      if (gap > SCANNER_SPEED_MS * 3) {
        bufferRef.current = '';
      }

      // أضف الحرف للـ buffer (حروف مرئية فقط)
      if (e.key.length === 1) {
        bufferRef.current += e.key;
      }

      // مؤقت احتياطي: لو السكانر ما بعتش Enter، نفّذ بعد 300ms
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, 300);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timerRef.current);
    };
  }, [flush]);
}