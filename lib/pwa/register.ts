import { SERVICE_WORKER_PATH } from "@/lib/site-config";

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;
  if (process.env.NODE_ENV !== "production") return null;

  try {
    const registration = await navigator.serviceWorker.register(
      SERVICE_WORKER_PATH,
      {
        scope: "/",
        updateViaCache: "none",
      },
    );
    await registration.update();
    return registration;
  } catch (error) {
    console.error("Service worker registration failed", error);
    return null;
  }
}
