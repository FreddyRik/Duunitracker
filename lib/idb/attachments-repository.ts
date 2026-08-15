import { requestDone, transactionDone } from "@/lib/idb/errors";
import { IDB_STORE_ATTACHMENTS } from "@/lib/site-config";
import type { IdbAttachmentRecord } from "@/types/idb";
import type { JobAttachmentRecord } from "@/types/attachment";

async function toStoredAttachment(
  record: JobAttachmentRecord,
): Promise<IdbAttachmentRecord> {
  return {
    id: record.id,
    jobId: record.jobId,
    kind: record.kind,
    filename: record.filename,
    mimeType: record.mimeType,
    size: record.size,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    payload: await record.payload.arrayBuffer(),
  };
}

export async function listAttachmentRecords(
  db: IDBDatabase,
): Promise<unknown[]> {
  const tx = db.transaction(IDB_STORE_ATTACHMENTS, "readonly");
  const rows = await requestDone(tx.objectStore(IDB_STORE_ATTACHMENTS).getAll());
  await transactionDone(tx);
  return rows;
}

export async function listAttachmentRecordsByJob(
  db: IDBDatabase,
  jobId: string,
): Promise<unknown[]> {
  const rows = await listAttachmentRecords(db);
  return rows.filter(
    (row) =>
      typeof row === "object" &&
      row !== null &&
      "jobId" in row &&
      row.jobId === jobId,
  );
}

export async function getAttachmentRecord(
  db: IDBDatabase,
  id: string,
): Promise<unknown> {
  const tx = db.transaction(IDB_STORE_ATTACHMENTS, "readonly");
  const row = await requestDone(tx.objectStore(IDB_STORE_ATTACHMENTS).get(id));
  await transactionDone(tx);
  return row ?? null;
}

export async function putAttachmentRecord(
  db: IDBDatabase,
  record: JobAttachmentRecord,
): Promise<void> {
  const stored = await toStoredAttachment(record);
  const tx = db.transaction(IDB_STORE_ATTACHMENTS, "readwrite");
  tx.objectStore(IDB_STORE_ATTACHMENTS).put(stored);
  await transactionDone(tx);
}

export async function removeAttachmentRecord(
  db: IDBDatabase,
  id: string,
): Promise<void> {
  const tx = db.transaction(IDB_STORE_ATTACHMENTS, "readwrite");
  tx.objectStore(IDB_STORE_ATTACHMENTS).delete(id);
  await transactionDone(tx);
}

export async function removeAttachmentRecordsByJob(
  db: IDBDatabase,
  jobId: string,
): Promise<void> {
  const rows = await listAttachmentRecordsByJob(db, jobId);
  const tx = db.transaction(IDB_STORE_ATTACHMENTS, "readwrite");
  const store = tx.objectStore(IDB_STORE_ATTACHMENTS);
  for (const row of rows) {
    if (
      typeof row === "object" &&
      row !== null &&
      "id" in row &&
      typeof row.id === "string"
    ) {
      store.delete(row.id);
    }
  }
  await transactionDone(tx);
}

export async function replaceAllAttachmentRecords(
  db: IDBDatabase,
  records: JobAttachmentRecord[],
): Promise<void> {
  const stored: IdbAttachmentRecord[] = [];
  for (const record of records) {
    stored.push(await toStoredAttachment(record));
  }
  const tx = db.transaction(IDB_STORE_ATTACHMENTS, "readwrite");
  const store = tx.objectStore(IDB_STORE_ATTACHMENTS);
  store.clear();
  for (const record of stored) {
    store.put(record);
  }
  await transactionDone(tx);
}
