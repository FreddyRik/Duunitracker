import {
  isQuotaExceededError,
  StorageError,
} from "@/lib/browser-storage";

export function toStorageError(error: unknown): StorageError {
  if (error instanceof StorageError) return error;
  if (isQuotaExceededError(error)) {
    return new StorageError("quota", "Browser storage is full");
  }
  if (error instanceof Error && error.message) {
    return new StorageError("unavailable", error.message);
  }
  return new StorageError("unavailable", "Browser storage is unavailable");
}

export function requestDone<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(toStorageError(request.error));
  });
}

export function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(toStorageError(tx.error));
    tx.onabort = () => reject(toStorageError(tx.error));
  });
}
