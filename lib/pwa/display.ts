import type { NavigatorWithStandalone } from "@/types/pwa";

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  const nav: NavigatorWithStandalone = window.navigator;
  return nav.standalone === true;
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const classicIos = /iPad|iPhone|iPod/.test(ua);
  const ipadOs =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return (classicIos || ipadOs) && !("MSStream" in window);
}
