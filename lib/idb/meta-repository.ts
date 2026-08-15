import { requestDone, transactionDone } from "@/lib/idb/errors";
import { IDB_STORE_META } from "@/lib/site-config";
import type { IdbMetaRecord } from "@/types/idb";

export async function getMetaValue(
  db: IDBDatabase,
  key: string,
): Promise<string | null> {
  const tx = db.transaction(IDB_STORE_META, "readonly");
  const row = await requestDone<IdbMetaRecord | undefined>(
    tx.objectStore(IDB_STORE_META).get(key),
  );
  await transactionDone(tx);
  return row?.value ?? null;
}

export async function setMetaValue(
  db: IDBDatabase,
  key: string,
  value: string,
): Promise<void> {
  const record: IdbMetaRecord = { key, value };
  const tx = db.transaction(IDB_STORE_META, "readwrite");
  tx.objectStore(IDB_STORE_META).put(record);
  await transactionDone(tx);
}
