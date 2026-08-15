import {
  IDB_STORE_ATTACHMENTS,
  IDB_STORE_JOBS,
  IDB_STORE_META,
} from "@/lib/site-config";

type IdbMigration = (db: IDBDatabase) => void;

function migrateToV1(db: IDBDatabase): void {
  if (!db.objectStoreNames.contains(IDB_STORE_JOBS)) {
    db.createObjectStore(IDB_STORE_JOBS, { keyPath: "id" });
  }

  if (!db.objectStoreNames.contains(IDB_STORE_ATTACHMENTS)) {
    const attachments = db.createObjectStore(IDB_STORE_ATTACHMENTS, {
      keyPath: "id",
    });
    attachments.createIndex("jobId", "jobId", { unique: false });
  }

  if (!db.objectStoreNames.contains(IDB_STORE_META)) {
    db.createObjectStore(IDB_STORE_META, { keyPath: "key" });
  }
}

/**
 * Migrations keyed by the version they introduce. Adding a store or index
 * means adding the next integer and bumping IDB_SCHEMA_VERSION.
 */
export const IDB_MIGRATIONS: Record<number, IdbMigration> = {
  1: migrateToV1,
};

export function applyIdbMigrations(
  db: IDBDatabase,
  oldVersion: number,
  newVersion: number,
): void {
  for (let version = oldVersion + 1; version <= newVersion; version += 1) {
    const migrate = IDB_MIGRATIONS[version];
    if (!migrate) {
      throw new Error(`Missing IndexedDB migration for version ${version}`);
    }
    migrate(db);
  }
}
