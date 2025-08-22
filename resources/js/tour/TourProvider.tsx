import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { driver, type Driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export type Step = {
  element?: string;
  popover: {
    title: string;
    description: string;
    side?: 'left' | 'right' | 'top' | 'bottom';
    align?: 'start' | 'center' | 'end';
  };

  beforeStep?: () => void;
  afterStep?: () => void;
};

type TourOptions = { cursor?: boolean; onDone?: () => void; headerOffsetPx?: number };

type TourContextType = {
  start: (steps: Step[], opts?: TourOptions) => void;
  stop: () => void;
  isRunning: boolean;
};

const TourCtx = createContext<TourContextType>({ start: () => {}, stop: () => {}, isRunning: false });
export const useTour = () => useContext(TourCtx);

// Cursor animasi sederhana
const Cursor: React.FC<{ x: number; y: number; visible: boolean }> = ({ x, y, visible }) => (
  <div
    style={{
      position: 'fixed',
      left: x,
      top: y,
      width: 24,
      height: 24,
      borderRadius: '50%',
      border: '2px solid rgba(59,130,246,0.9)',
      transform: 'translate(-50%,-50%)',
      pointerEvents: 'none',
      transition: 'left .35s ease, top .35s ease, transform .15s',
      boxShadow: '0 0 0 6px rgba(59,130,246,.15)',
      opacity: visible ? 1 : 0,
      zIndex: 999999,
    }}
  />
);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRunning, setRunning] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const drvRef = useRef<Driver | null>(null);

  const stop = () => {
    drvRef.current?.destroy();
    drvRef.current = null;
    setRunning(false);
    setCursor((c) => ({ ...c, visible: false }));
  };

  const start = (steps: Step[], opts?: TourOptions) => {
    // guard kalau tidak ada window (SSR) atau steps kosong
    if (typeof window === 'undefined' || !steps?.length) return;

    const headerOffset = opts?.headerOffsetPx ?? 0;

    const drv = driver({
      showProgress: true,
      animate: true,
      nextBtnText: 'Lanjut',
      prevBtnText: 'Kembali',
      doneBtnText: 'Selesai',
      overlayColor: 'rgba(17,24,39,.6)',
      allowClose: true,
      onDestroyed: () => {
        setRunning(false);
        setCursor((c) => ({ ...c, visible: false }));
        opts?.onDone?.();
      },
      // Scroll behavior lebih smooth + compensasi header
      onDeselected: () => window.scrollBy({ top: 0, behavior: 'instant' as ScrollBehavior }),
    });

    // Map langkah + cursor animasi
    const mapped = steps.map((s) => {
      return {
        element: s.element,
        popover: s.popover,
        onHighlighted: (element: Element | undefined) => {
          // element bisa undefined kalau selector tidak ada; skip saja
          if (!element) return;

          s.beforeStep?.();

          const rect = element.getBoundingClientRect();
          // posisi tengah elemen + kompensasi scroll + offset header
          const centerX = rect.left + rect.width / 2 + window.scrollX;
          const centerY = rect.top + rect.height / 2 + window.scrollY - headerOffset;

          if (opts?.cursor) {
            setCursor({ x: centerX, y: centerY, visible: true });
          }

          // pastikan target terlihat (kompensasi header)
          const targetTop = Math.max(0, rect.top + window.scrollY - 120 - headerOffset);
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        },
        onDeselected: () => {
          s.afterStep?.();
        },
      };
    });

    drv.setSteps(mapped);
    drvRef.current = drv;

    setRunning(true);
    drv.drive();
  };

  const ctx = useMemo(() => ({ start, stop, isRunning }), [isRunning]);

  return (
    <TourCtx.Provider value={ctx}>
      {children}
      <Cursor x={cursor.x} y={cursor.y} visible={cursor.visible} />
    </TourCtx.Provider>
  );
};
