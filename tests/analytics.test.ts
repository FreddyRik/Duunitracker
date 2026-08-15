import { describe, expect, it } from "vitest";
import {
  addDays,
  applicationDate,
  buildFunnel,
  buildOfficialReport,
  buildQuotaProgress,
  buildResponseTimeMetrics,
  inclusiveDayCount,
  isSubmittedApplication,
  jobsAppliedInRange,
  lastMonthRange,
  quotaTargetForRangeDays,
  resolvePresetRange,
  responseDelayDays,
  rollingFourWeekRange,
  thisMonthRange,
  weekWindows,
} from "@/lib/analytics";
import {
  EMPLOYMENT_QUOTA_APPLICATIONS,
  EMPLOYMENT_QUOTA_PERIOD_DAYS,
} from "@/lib/site-config";
import { createTestJob } from "@/tests/helpers/job";

describe("date ranges", () => {
  it("counts an inclusive 4-week window as 28 days", () => {
    const range = rollingFourWeekRange("2026-08-15");
    expect(range).toEqual({ start: "2026-07-19", end: "2026-08-15" });
    expect(inclusiveDayCount(range)).toBe(EMPLOYMENT_QUOTA_PERIOD_DAYS);
  });

  it("clips this month to today", () => {
    expect(thisMonthRange("2026-08-15")).toEqual({
      start: "2026-08-01",
      end: "2026-08-15",
    });
  });

  it("returns the previous calendar month", () => {
    expect(lastMonthRange("2026-08-15")).toEqual({
      start: "2026-07-01",
      end: "2026-07-31",
    });
  });

  it("rejects inverted custom ranges", () => {
    const resolved = resolvePresetRange("custom", "2026-08-15", {
      start: "2026-08-20",
      end: "2026-08-01",
    });
    expect(resolved.error).toBe("order");
    expect(resolved.range).toEqual(rollingFourWeekRange("2026-08-15"));
  });

  it("splits a 28-day range into four week windows", () => {
    const windows = weekWindows({ start: "2026-08-01", end: "2026-08-28" });
    expect(windows).toHaveLength(4);
    expect(windows[0]).toEqual({ start: "2026-08-01", end: "2026-08-07" });
    expect(windows[3]).toEqual({ start: "2026-08-22", end: "2026-08-28" });
  });

  it("scales the quota target with the selected length", () => {
    expect(quotaTargetForRangeDays(28)).toBe(EMPLOYMENT_QUOTA_APPLICATIONS);
    expect(quotaTargetForRangeDays(14)).toBe(2);
    expect(quotaTargetForRangeDays(56)).toBe(8);
  });

  it("walks across month boundaries", () => {
    expect(addDays("2026-08-31", 1)).toBe("2026-09-01");
  });
});

describe("application funnel", () => {
  const jobs = [
    createTestJob({ id: "saved", status: "Saved", dateApplied: null }),
    createTestJob({
      id: "waiting-1",
      status: "Applied",
      applied: true,
      dateApplied: "2026-08-01",
    }),
    createTestJob({
      id: "waiting-2",
      status: "Applied",
      applied: true,
      dateApplied: "2026-08-02",
    }),
    createTestJob({
      id: "interview",
      status: "Interview",
      dateApplied: "2026-08-03",
      interviewDate: "2026-08-20",
    }),
    createTestJob({
      id: "offer",
      status: "Offer",
      dateApplied: "2026-08-04",
      interviewDate: "2026-08-18",
    }),
    createTestJob({
      id: "rejected",
      status: "Rejected",
      dateApplied: "2026-08-05",
    }),
    createTestJob({
      id: "saved-after-apply",
      status: "Saved",
      dateApplied: "2026-08-06",
    }),
  ];

  it("treats a stamped date as submitted even when status is Saved", () => {
    expect(isSubmittedApplication(jobs[6])).toBe(true);
    expect(isSubmittedApplication(jobs[0])).toBe(false);
  });

  it("builds conversion stages with drop-offs", () => {
    const funnel = buildFunnel(jobs);
    const byId = Object.fromEntries(
      funnel.stages.map((stage) => [stage.id, stage]),
    );

    expect(funnel.submittedCount).toBe(6);
    expect(funnel.waitingCount).toBe(2);
    expect(funnel.respondedCount).toBe(3);
    expect(byId.applied.count).toBe(6);
    expect(byId.inReview.count).toBe(5);
    expect(byId.interview.count).toBe(2);
    expect(byId.offer.count).toBe(1);
    expect(byId.rejected.count).toBe(1);
    expect(byId.inReview.dropOffPercent).toBe(16.7);
    expect(byId.interview.dropOffPercent).toBe(60);
    expect(byId.offer.dropOffPercent).toBe(50);
    expect(byId.rejected.dropOffPercent).toBeNull();
  });
});

describe("quota progress", () => {
  const range = { start: "2026-08-01", end: "2026-08-28" };

  it("counts applications inside the window against the 4/4-week target", () => {
    const jobs = [
      createTestJob({
        id: "a",
        status: "Applied",
        dateApplied: "2026-08-01",
      }),
      createTestJob({
        id: "b",
        status: "Interview",
        dateApplied: "2026-08-08",
      }),
      createTestJob({
        id: "c",
        status: "Rejected",
        dateApplied: "2026-08-15",
      }),
      createTestJob({
        id: "d",
        status: "Offer",
        dateApplied: "2026-08-22",
      }),
      createTestJob({
        id: "outside",
        status: "Applied",
        dateApplied: "2026-07-01",
      }),
    ];

    const quota = buildQuotaProgress(jobs, range);
    expect(quota.appliedCount).toBe(4);
    expect(quota.targetCount).toBe(4);
    expect(quota.met).toBe(true);
    expect(quota.remaining).toBe(0);
    expect(quota.weeks.map((week) => week.count)).toEqual([1, 1, 1, 1]);
  });

  it("reports remaining applications when the quota is short", () => {
    const jobs = [
      createTestJob({
        id: "only",
        status: "Applied",
        dateApplied: "2026-08-03",
      }),
    ];
    const quota = buildQuotaProgress(jobs, range);
    expect(quota.met).toBe(false);
    expect(quota.remaining).toBe(3);
  });
});

describe("response time", () => {
  it("uses interviewDate when present", () => {
    const job = createTestJob({
      status: "Interview",
      dateApplied: "2026-08-01",
      interviewDate: "2026-08-11",
    });
    expect(responseDelayDays(job)).toBe(10);
  });

  it("averages delays by company and status", () => {
    const jobs = [
      createTestJob({
        id: "north-1",
        company: "North Studio",
        status: "Interview",
        dateApplied: "2026-08-01",
        interviewDate: "2026-08-11",
      }),
      createTestJob({
        id: "north-2",
        company: "North Studio",
        status: "Rejected",
        dateApplied: "2026-08-01",
        interviewDate: "2026-08-06",
      }),
      createTestJob({
        id: "waiting",
        company: "Aalto Digital",
        status: "Applied",
        applied: true,
        dateApplied: "2026-08-02",
      }),
    ];

    const metrics = buildResponseTimeMetrics(jobs);
    expect(metrics.respondedCount).toBe(2);
    expect(metrics.pendingCount).toBe(1);
    expect(metrics.overall?.averageDays).toBe(7.5);
    expect(metrics.byCompany[0]?.label).toBe("North Studio");
    expect(metrics.byCompany[0]?.averageDays).toBe(7.5);
  });

  it("ignores a response dated before the application", () => {
    const job = createTestJob({
      status: "Interview",
      dateApplied: "2026-08-10",
      interviewDate: "2026-08-01",
    });
    expect(responseDelayDays(job)).toBeNull();
  });
});

describe("official report", () => {
  it("lists applications in the period, sorted by date then company", () => {
    const jobs = [
      createTestJob({
        id: "later",
        company: "Zebra Oy",
        title: "Designer",
        status: "Applied",
        dateApplied: "2026-08-10",
      }),
      createTestJob({
        id: "earlier-b",
        company: "Beta Oy",
        title: "Engineer",
        status: "Interview",
        dateApplied: "2026-08-02",
      }),
      createTestJob({
        id: "earlier-a",
        company: "Aalto Digital",
        title: "PM",
        status: "Rejected",
        dateApplied: "2026-08-02",
      }),
      createTestJob({
        id: "saved",
        status: "Saved",
        dateApplied: null,
      }),
    ];

    const report = buildOfficialReport(
      jobs,
      { start: "2026-08-01", end: "2026-08-31" },
      "2026-08-15T09:00:00.000Z",
    );

    expect(report.rows.map((row) => row.company)).toEqual([
      "Aalto Digital",
      "Beta Oy",
      "Zebra Oy",
    ]);
    expect(jobsAppliedInRange(jobs, report.range)).toHaveLength(3);
    expect(report.quota.appliedCount).toBe(3);
    expect(report.funnel.submittedCount).toBe(3);
    expect(applicationDate(jobs[3])).toBeNull();
  });
});
