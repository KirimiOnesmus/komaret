import { useEffect } from "react";
import { useLocation } from "react-router-dom";


export default function useScrollReveal(options = {}) {
  const {
    scopeSelector = "main",
    staggerStep = 70,
    maxStagger = 6,
    safetyTimeout = 3000,
  } = options;

  const { pathname } = useLocation();

  useEffect(() => {

    if (typeof window === "undefined") return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      return;
    }

    const scope = document.querySelector(scopeSelector);
    if (!scope) return;

    const INIT = "sr-init";
    const VISIBLE = "sr-in";
    const tagged = new Set();
    let safetyTimer = null;

    const skipPosition = new Set(["absolute", "fixed", "sticky"]);

    const canReveal = (el) => {
      if (!(el instanceof HTMLElement)) return false;
      if (tagged.has(el)) return false;
      if (el.hasAttribute("data-no-reveal")) return false;
  
      const pos = window.getComputedStyle(el).position;
      if (skipPosition.has(pos)) return false;
      return true;
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add(VISIBLE);
            obs.unobserve(entry.target); 
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const tag = (el, delayIndex = 0) => {
      if (!canReveal(el)) return;
      tagged.add(el);
      const steps = Math.min(delayIndex, maxStagger);
      if (steps > 0) {
        el.style.setProperty("--sr-delay", `${steps * staggerStep}ms`);
      }
      el.classList.add(INIT);
      observer.observe(el);
    };

  
    const isStaggerGrid = (el) =>
      el instanceof HTMLElement &&
      /(^|\s)grid(\s|$)|grid-cols|grid-flow/.test(el.className) &&
      el.children.length >= 2;

    const collect = () => {

      const pageRoot = scope.firstElementChild;
      if (pageRoot) {
        Array.from(pageRoot.children).forEach((child) => {
        
          if (isStaggerGrid(child)) return;
          tag(child, 0);
        });
      }


      scope.querySelectorAll('[class*="grid"]').forEach((grid) => {
        if (!(grid instanceof HTMLElement)) return;
        const items = Array.from(grid.children);
        if (items.length < 2) return;
        items.forEach((item, i) => tag(item, i));
      });
    };

    collect();


    let rafId = null;
    const mo = new MutationObserver(() => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        collect();
      });
    });
    mo.observe(scope, { childList: true, subtree: true });


    safetyTimer = window.setTimeout(() => {
      tagged.forEach((el) => el.classList.add(VISIBLE));
    }, safetyTimeout);


    return () => {
      observer.disconnect();
      mo.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
      if (safetyTimer) window.clearTimeout(safetyTimer);
      tagged.forEach((el) => {
        el.classList.remove(INIT, VISIBLE);
        el.style.removeProperty("--sr-delay");
      });
      tagged.clear();
    };
  }, [pathname, scopeSelector, staggerStep, maxStagger, safetyTimeout]);
}
