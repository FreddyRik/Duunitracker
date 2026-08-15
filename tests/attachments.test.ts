/** @vitest-environment jsdom */
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import {
  deleteJobAttachment,
  listJobAttachmentMeta,
  putJobAttachment,
  readCoverLetterText,
} from "@/lib/attachments-store";
import { createJob, deleteJob, replaceJobs } from "@/lib/jobs-local-store";
import { getOfflineStore } from "@/lib/offline-adapter";
import { IDB_NAME, IDB_STORE_ATTACHMENTS, IDB_STORE_JOBS } from "@/lib/site-config";
import { createTestJob } from "@/tests/helpers/job";
import { resetClientPersistence } from "@/tests/helpers/persistence";
import { openTrackerDatabase } from "@/lib/idb/database";

describe("attachments store", () => {
  beforeEach(async () => {
    await resetClientPersistence();
  });

  it("stores a cover letter draft and a CV per job", async () => {
    const job = await createJob({
      url: "https://duunitori.fi/tyopaikat/avoimet-tyopaikat/testi",
      title: "Designer",
      company: "Studio",
    });
    const store = await getOfflineStore();

    await putJobAttachment(store, {
      jobId: job.id,
      kind: "cover_letter",
      filename: "cover-letter.txt",
      file: new Blob(["Hei,"], { type: "text/plain;charset=utf-8" }),
      replaceKind: true,
    });
    await putJobAttachment(store, {
      jobId: job.id,
      kind: "cv",
      filename: "cv.pdf",
      file: new Blob(["%PDF"], { type: "application/pdf" }),
      replaceKind: true,
    });

    const text = await readCoverLetterText(store, job.id);
    expect(text).toBe("Hei,");
    const meta = await listJobAttachmentMeta(store, job.id);
    expect(meta.some((item) => item.kind === "cv")).toBe(true);
  });

  it("replaces an existing CV instead of duplicating it", async () => {
    const job = createTestJob({ id: "job-cv" });
    await replaceJobs([job]);
    const store = await getOfflineStore();

    await putJobAttachment(store, {
      jobId: job.id,
      kind: "cv",
      filename: "old.pdf",
      file: new Blob(["old"], { type: "application/pdf" }),
      replaceKind: true,
    });
    await putJobAttachment(store, {
      jobId: job.id,
      kind: "cv",
      filename: "new.pdf",
      file: new Blob(["new"], { type: "application/pdf" }),
      replaceKind: true,
    });

    const meta = await listJobAttachmentMeta(store, job.id);
    const cvs = meta.filter((item) => item.kind === "cv");
    expect(cvs).toHaveLength(1);
    expect(cvs[0]?.filename).toBe("new.pdf");
  });

  it("cascades attachment deletes when a job is removed", async () => {
    const job = await createJob({
      url: "",
      title: "Role",
      company: "Acme",
    });
    const store = await getOfflineStore();
    const saved = await putJobAttachment(store, {
      jobId: job.id,
      kind: "other",
      filename: "notes.txt",
      file: new Blob(["x"], { type: "text/plain" }),
    });

    await deleteJob(job.id);
    const remaining = await listJobAttachmentMeta(store, job.id);
    expect(remaining).toHaveLength(0);
    await expect(deleteJobAttachment(store, saved.id)).resolves.toBeUndefined();
  });
});

describe("IndexedDB schema", () => {
  beforeEach(async () => {
    await resetClientPersistence();
  });

  it("creates jobs, attachments, and meta stores at version 1", async () => {
    const db = await openTrackerDatabase();
    expect(db.name).toBe(IDB_NAME);
    expect(db.objectStoreNames.contains(IDB_STORE_JOBS)).toBe(true);
    expect(db.objectStoreNames.contains(IDB_STORE_ATTACHMENTS)).toBe(true);
    expect(db.objectStoreNames.contains("meta")).toBe(true);
  });
});
