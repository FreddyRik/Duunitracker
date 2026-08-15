/** @vitest-environment jsdom */
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import {
  extractBackupJobs,
} from "@/lib/job-schema";
import {
  createJob,
  parseBackupDocument,
  parseJobsImport,
  readJobsDetailed,
  replaceJobs,
  serializeJobsBackup,
} from "@/lib/jobs-local-store";
import { JOBS_STORAGE_KEY, MAX_BACKUP_FILE_BYTES } from "@/lib/site-config";
import { JOBS_SCHEMA_VERSION } from "@/types/backup";
import { ValidationError } from "@/lib/validate";
import { createTestJob } from "@/tests/helpers/job";
import { resetClientPersistence } from "@/tests/helpers/persistence";

const newerJob = createTestJob({
  id: "job-new",
  title: "Newer Role",
  updatedAt: "2026-06-01T00:00:00.000Z",
});
const olderJob = createTestJob({
  id: "job-old",
  title: "Older Role",
  updatedAt: "2026-01-01T00:00:00.000Z",
});

function expectValidationCode(error: unknown, code: string) {
  expect(error).toBeInstanceOf(ValidationError);
  if (error instanceof ValidationError) {
    expect(error.code).toBe(code);
  }
}

describe("serializeJobsBackup and parseJobsImport", () => {
  it("round-trips jobs through the backup envelope", () => {
    const raw = serializeJobsBackup([newerJob, olderJob]);
    const parsed = JSON.parse(raw) as {
      schemaVersion: number;
      exportedAt: string;
      jobs: unknown[];
    };

    expect(parsed.schemaVersion).toBe(JOBS_SCHEMA_VERSION);
    expect(parsed.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(raw.endsWith("\n")).toBe(true);

    const imported = parseJobsImport(raw);
    expect(imported.map((job) => job.id)).toEqual(["job-new", "job-old"]);
    expect(imported[0]).toMatchObject({
      id: "job-new",
      title: "Newer Role",
      company: "Acme OY",
      status: "Saved",
    });
  });

  it("round-trips attachments in a versioned backup", () => {
    const raw = serializeJobsBackup([newerJob], [
      {
        id: "att-1",
        jobId: newerJob.id,
        kind: "cover_letter",
        filename: "cover-letter.txt",
        mimeType: "text/plain",
        size: 5,
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        dataBase64: btoa("hello"),
      },
    ]);
    const imported = parseBackupDocument(raw);
    expect(imported.attachments).toHaveLength(1);
    expect(imported.attachments[0]?.filename).toBe("cover-letter.txt");
  });

  it("imports a legacy bare job array", () => {
    const imported = parseJobsImport(JSON.stringify([olderJob, newerJob]));
    expect(imported.map((job) => job.id)).toEqual(["job-new", "job-old"]);
  });

  it("imports a schemaVersion 1 envelope without attachments", () => {
    const imported = parseBackupDocument(
      JSON.stringify({
        schemaVersion: 1,
        jobs: [newerJob],
      }),
    );
    expect(imported.jobs).toHaveLength(1);
    expect(imported.attachments).toEqual([]);
  });

  it("rejects invalid JSON", () => {
    try {
      parseJobsImport("{not json");
      expect.unreachable();
    } catch (error) {
      expectValidationCode(error, "invalid_json");
    }
  });

  it("rejects an empty job list", () => {
    try {
      parseJobsImport(JSON.stringify({ schemaVersion: 1, jobs: [] }));
      expect.unreachable();
    } catch (error) {
      expectValidationCode(error, "empty");
    }
  });

  it("rejects a backup from a newer schema version", () => {
    try {
      parseJobsImport(
        JSON.stringify({
          schemaVersion: JOBS_SCHEMA_VERSION + 1,
          jobs: [newerJob],
        }),
      );
      expect.unreachable();
    } catch (error) {
      expectValidationCode(error, "unsupported_version");
    }
  });

  it("rejects a job that fails the strict schema", () => {
    try {
      parseJobsImport(
        JSON.stringify([
          {
            ...newerJob,
            title: "",
          },
        ]),
      );
      expect.unreachable();
    } catch (error) {
      expectValidationCode(error, "invalid_schema");
    }
  });

  it("rejects a file over the size limit before parsing", () => {
    try {
      parseJobsImport("x".repeat(MAX_BACKUP_FILE_BYTES + 1));
      expect.unreachable();
    } catch (error) {
      expectValidationCode(error, "too_large");
    }
  });
});

describe("extractBackupJobs", () => {
  it("reads a raw array in either mode", () => {
    expect(extractBackupJobs([newerJob], "strict")).toHaveLength(1);
    expect(extractBackupJobs([newerJob], "lenient")).toHaveLength(1);
  });

  it("allows a newer schema version when reading stored data leniently", () => {
    const items = extractBackupJobs(
      { schemaVersion: 99, jobs: [newerJob] },
      "lenient",
    );
    expect(items).toHaveLength(1);
  });

  it("rejects a shapeless object", () => {
    try {
      extractBackupJobs({ hello: "world" }, "strict");
      expect.unreachable();
    } catch (error) {
      expectValidationCode(error, "invalid_shape");
    }
  });
});

describe("replaceJobs", () => {
  beforeEach(async () => {
    await resetClientPersistence();
  });

  it("writes a validated document and returns jobs newest-first", async () => {
    const stored = await replaceJobs([olderJob, newerJob]);
    expect(stored.map((job) => job.id)).toEqual(["job-new", "job-old"]);

    const detailed = await readJobsDetailed();
    expect(detailed.jobs.map((job) => job.id)).toEqual(["job-new", "job-old"]);
    expect(detailed.skippedCount).toBe(0);
  });

  it("rejects jobs that fail schema validation", async () => {
    await expect(
      replaceJobs([{ ...newerJob, title: "" }]),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

describe("IndexedDB migration from localStorage", () => {
  beforeEach(async () => {
    await resetClientPersistence();
  });

  it("copies a localStorage jobs document into IndexedDB", async () => {
    window.localStorage.setItem(
      JOBS_STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 1,
        jobs: [newerJob],
      }),
    );

    const created = await createJob({
      url: newerJob.url,
      title: "Migrated neighbour",
      company: "Nordic Labs",
    });
    expect(created.title).toBe("Migrated neighbour");

    const detailed = await readJobsDetailed();
    expect(detailed.jobs.some((job) => job.id === newerJob.id)).toBe(true);
    expect(window.localStorage.getItem(JOBS_STORAGE_KEY)).toBeNull();
  });
});
