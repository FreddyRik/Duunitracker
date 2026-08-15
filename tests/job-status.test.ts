import { describe, expect, it } from "vitest";
import { todayDateString } from "@/lib/format";
import { buildStatusUpdate } from "@/lib/job-status";
import {
  applyAppliedSideEffects,
  applyStatusSideEffects,
} from "@/lib/job-validation";
import { JOB_STATUSES, type JobStatus } from "@/types/job";
import { createTestJob } from "@/tests/helpers/job";

describe("buildStatusUpdate", () => {
  it("marks Applied and stamps today's date when none exists", () => {
    const job = createTestJob({ status: "Saved", applied: false });
    expect(buildStatusUpdate(job, "Applied")).toEqual({
      status: "Applied",
      applied: true,
      dateApplied: todayDateString(),
    });
  });

  it("keeps an existing dateApplied when moving to Applied", () => {
    const job = createTestJob({
      status: "Saved",
      dateApplied: "2026-02-01",
    });
    expect(buildStatusUpdate(job, "Applied")).toEqual({
      status: "Applied",
      applied: true,
    });
  });

  it("clears the applied flag for every non-Applied status", () => {
    const job = createTestJob({
      status: "Applied",
      applied: true,
      dateApplied: "2026-02-01",
    });
    const others = JOB_STATUSES.filter((status) => status !== "Applied");
    for (const status of others) {
      expect(buildStatusUpdate(job, status)).toEqual({
        status,
        applied: false,
      });
    }
  });
});

describe("applyStatusSideEffects", () => {
  it("returns the patch unchanged when status is omitted", () => {
    const job = createTestJob();
    const patch = { notes: "hello" };
    expect(applyStatusSideEffects(job, patch)).toEqual(patch);
  });

  it("sets applied and dateApplied when status becomes Applied", () => {
    const job = createTestJob({ status: "Saved", dateApplied: null });
    expect(applyStatusSideEffects(job, { status: "Applied" })).toEqual({
      status: "Applied",
      applied: true,
      dateApplied: todayDateString(),
    });
  });

  it("does not overwrite an explicit dateApplied on the patch", () => {
    const job = createTestJob({ status: "Saved" });
    expect(
      applyStatusSideEffects(job, {
        status: "Applied",
        dateApplied: "2026-04-12",
      }),
    ).toEqual({
      status: "Applied",
      applied: true,
      dateApplied: "2026-04-12",
    });
  });

  it("sets applied to false when leaving Applied", () => {
    const job = createTestJob({
      status: "Applied",
      applied: true,
      dateApplied: "2026-02-01",
    });
    expect(applyStatusSideEffects(job, { status: "Interview" })).toEqual({
      status: "Interview",
      applied: false,
    });
  });
});

describe("applyAppliedSideEffects", () => {
  it("promotes Saved to Applied when the applied checkbox is turned on", () => {
    const job = createTestJob({ status: "Saved", dateApplied: null });
    expect(applyAppliedSideEffects(job, { applied: true })).toEqual({
      applied: true,
      dateApplied: todayDateString(),
      status: "Applied",
    });
  });

  it("does not override an explicit status on the same patch", () => {
    const job = createTestJob({ status: "Saved" });
    expect(
      applyAppliedSideEffects(job, { applied: true, status: "Interview" }),
    ).toEqual({
      applied: true,
      dateApplied: todayDateString(),
      status: "Interview",
    });
  });

  it("demotes Applied back to Saved when applied is turned off", () => {
    const job = createTestJob({
      status: "Applied",
      applied: true,
      dateApplied: "2026-02-01",
    });
    expect(applyAppliedSideEffects(job, { applied: false })).toEqual({
      applied: false,
      status: "Saved",
    });
  });

  it("does not change Interview when unchecking applied", () => {
    const job = createTestJob({ status: "Interview", applied: false });
    expect(applyAppliedSideEffects(job, { applied: false })).toEqual({
      applied: false,
    });
  });
});

describe("status pipeline coverage", () => {
  it("can move a saved job through every pipeline status", () => {
    const job = createTestJob({ status: "Saved" });
    const sequence: JobStatus[] = [
      "Applied",
      "Interview",
      "Offer",
      "Rejected",
    ];
    let current = job;
    for (const status of sequence) {
      const patch = applyStatusSideEffects(
        current,
        buildStatusUpdate(current, status),
      );
      expect(patch.status).toBe(status);
      expect(patch.applied).toBe(status === "Applied");
      current = { ...current, ...patch };
    }
  });
});
