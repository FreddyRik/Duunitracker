import { describe, expect, it } from "vitest";
import { IDB_MIGRATIONS, applyIdbMigrations } from "@/lib/idb/migrations";
import { IDB_SCHEMA_VERSION } from "@/lib/site-config";

describe("IndexedDB migrations", () => {
  it("has a migration for every schema version", () => {
    for (let version = 1; version <= IDB_SCHEMA_VERSION; version += 1) {
      expect(IDB_MIGRATIONS[version]).toBeTypeOf("function");
    }
  });

  it("throws when a version is missing", () => {
    const db = {
      objectStoreNames: { contains: () => true },
    } as unknown as IDBDatabase;

    expect(() => applyIdbMigrations(db, 0, IDB_SCHEMA_VERSION + 1)).toThrow(
      /Missing IndexedDB migration/,
    );
  });
});
