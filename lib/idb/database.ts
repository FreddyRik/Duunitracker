import { applyIdbMigrations } from "@/lib/idb/migrations";
import { requestDone, toStorageError } from "@/lib/idb/errors";
import { StorageError } from "@/lib/browser-storage";
import { IDB_NAME, IDB_SCHEMA_VERSION } from "@/lib/site-config";

let dbPromise: Promise<IDBDatabase> | null = null;

function assertIndexedDb(): IDBFactory {
  if (typeof indexedDB === "undefined") {
    throw new StorageError("unavailable", "IndexedDB is not available");
  }
  return indexedDB;
}

export function openTrackerDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    let factory: IDBFactory;
    try {
      factory = assertIndexedDb();
    } catch (error) {
      dbPromise = null;
      reject(toStorageError(error));
      return;
    }

    const request = factory.open(IDB_NAME, IDB_SCHEMA_VERSION);

    request.onupgradeneeded = (event) => {
      try {
        applyIdbMigrations(
          request.result,
          event.oldVersion,
          IDB_SCHEMA_VERSION,
        );
      } catch (error) {
        dbPromise = null;
        reject(toStorageError(error));
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };

    request.onerror = () => {
      dbPromise = null;
      reject(toStorageError(request.error));
    };

    request.onblocked = () => {
      dbPromise = null;
      reject(
        new StorageError(
          "unavailable",
          "IndexedDB upgrade is blocked by another tab",
        ),
      );
    };
  });

  return dbPromise;
}

export async function closeTrackerDatabase(): Promise<void> {
  if (!dbPromise) return;
  const pending = dbPromise;
  dbPromise = null;
  try {
    const db = await pending;
    db.close();
  } catch {
    // Closing after a failed open is a no-op.
  }
}

export async function deleteTrackerDatabase(): Promise<void> {
  await closeTrackerDatabase();
  const factory = assertIndexedDb();
  const request = factory.deleteDatabase(IDB_NAME);
  await requestDone(request);
}

export function resetTrackerDatabaseHandle(): void {
  dbPromise = null;
}
