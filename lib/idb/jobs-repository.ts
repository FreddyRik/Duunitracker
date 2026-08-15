import { requestDone, transactionDone } from "@/lib/idb/errors";
import { IDB_STORE_JOBS } from "@/lib/site-config";
import type { JobApplication } from "@/types/job";

export async function countJobs(db: IDBDatabase): Promise<number> {
  const tx = db.transaction(IDB_STORE_JOBS, "readonly");
  const count = await requestDone(tx.objectStore(IDB_STORE_JOBS).count());
  await transactionDone(tx);
  return count;
}

export async function listJobRecords(db: IDBDatabase): Promise<unknown[]> {
  const tx = db.transaction(IDB_STORE_JOBS, "readonly");
  const rows = await requestDone(tx.objectStore(IDB_STORE_JOBS).getAll());
  await transactionDone(tx);
  return rows;
}

export async function putJobRecord(
  db: IDBDatabase,
  job: JobApplication,
): Promise<void> {
  const tx = db.transaction(IDB_STORE_JOBS, "readwrite");
  tx.objectStore(IDB_STORE_JOBS).put(job);
  await transactionDone(tx);
}

export async function removeJobRecord(
  db: IDBDatabase,
  id: string,
): Promise<void> {
  const tx = db.transaction(IDB_STORE_JOBS, "readwrite");
  tx.objectStore(IDB_STORE_JOBS).delete(id);
  await transactionDone(tx);
}

export async function replaceAllJobRecords(
  db: IDBDatabase,
  jobs: JobApplication[],
): Promise<void> {
  const tx = db.transaction(IDB_STORE_JOBS, "readwrite");
  const store = tx.objectStore(IDB_STORE_JOBS);
  store.clear();
  for (const job of jobs) {
    store.put(job);
  }
  await transactionDone(tx);
}
