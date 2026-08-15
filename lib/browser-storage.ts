import type { StorageErrorCode } from "@/types/storage";

export class StorageError extends Error {
  readonly code: StorageErrorCode;

  constructor(code: StorageErrorCode, message: string) {
    super(message);
    this.name = "StorageError";
    this.code = code;
  }
}

export function isStorageError(error: unknown): error is StorageError {
  return error instanceof StorageError;
}

export function isQuotaExceededError(error: unknown): boolean {
  if (typeof DOMException !== "undefined" && error instanceof DOMException) {
    return (
      error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      error.code === 22 ||
      error.code === 1014
    );
  }

  return error instanceof Error && error.name === "QuotaExceededError";
}

function assertBrowser(): void {
  if (typeof window === "undefined") {
    throw new StorageError(
      "unavailable",
      "Storage is only available in the browser",
    );
  }
}

export function readStorageItem(key: string): string | null {
  assertBrowser();
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    throw new StorageError(
      "unavailable",
      error instanceof Error ? error.message : "Browser storage is unavailable",
    );
  }
}

export function writeStorageItem(key: string, value: string): void {
  assertBrowser();
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    if (isQuotaExceededError(error)) {
      throw new StorageError("quota", "Browser storage is full");
    }
    throw new StorageError(
      "unavailable",
      error instanceof Error ? error.message : "Browser storage is unavailable",
    );
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Preference cleanup must not crash the UI.
  }
}

/** Theme, locale, and reminder writes must never take down the app. */
export function readStorageItemSoft(key: string): string | null {
  try {
    return readStorageItem(key);
  } catch {
    return null;
  }
}

export function writeStorageItemSoft(key: string, value: string): boolean {
  try {
    writeStorageItem(key, value);
    return true;
  } catch {
    return false;
  }
}
