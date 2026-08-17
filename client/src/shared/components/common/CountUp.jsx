import { useEffect, useRef, useState } from "react";


export default function CountUp({ value, duration = 1600, className }) {
  const raw = String(value);
  const match = raw.match(/([^\d]*)([\d.,]+)(.*)/);
  const prefix = match ? match[1] : "";
  const numeric = match ? parseFloat(match[2].replace(/,/g, "")) : NaN;
  const suffix = match ? match[3] : "";
  const decimals = match && match[2].includes(".")
    ? match[2].split(".")[1].length
    : 0;


  const shouldAnimate = (() => {
    if (!Number.isFinite(numeric)) return false;
    if (typeof window === "undefined") return false;
    if (!("IntersectionObserver" in window)) return false;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return false;
    }
    return true;
  })();

  const ref = useRef(null);
  const [display, setDisplay] = useState(() => {
    if (!Number.isFinite(numeric)) return raw;
    return shouldAnimate ? formatNumber(0, decimals) : formatNumber(numeric, decimals);
  });

  useEffect(() => {
    if (!shouldAnimate) return;

    const node = ref.current;
    if (!node) return;

    let rafId = null;
    let started = false;

    const run = () => {
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
  
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(formatNumber(numeric * eased, decimals));
        if (progress < 1) {
          rafId = window.requestAnimationFrame(tick);
        } else {
          setDisplay(formatNumber(numeric, decimals));
        }
      };
      rafId = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            run();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [shouldAnimate, numeric, decimals, duration]);

  if (!Number.isFinite(numeric)) {
    return <span className={className}>{raw}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function formatNumber(n, decimals) {
  return decimals > 0
    ? n.toFixed(decimals)
    : Math.round(n).toLocaleString();
}
