import { describe, expect, it } from "vitest";
import {
  countAllFilters,
  countByFilter,
  filterJobs,
  groupByStatus,
  jobMatchesSearch,
  JOB_LIST_FILTERS,
  matchesFilter,
  orderJobsForDisplay,
} from "@/lib/job-insights";
import { createTestJob } from "@/tests/helpers/job";

const jobs = [
  createTestJob({
    id: "saved",
    title: "React Engineer",
    company: "North Studio",
    status: "Saved",
    description: "TypeScript and design systems",
  }),
  createTestJob({
    id: "applied",
    title: "Product Designer",
    company: "Aalto Digital",
    status: "Applied",
    applied: true,
    dateApplied: "2026-03-01",
    description: "Figma and user research",
  }),
  createTestJob({
    id: "interview",
    title: "Full Stack Developer",
    company: "Saaristo Works",
    status: "Interview",
    description: "Node.js APIs",
  }),
  createTestJob({
    id: "offer",
    title: "UI Designer",
    company: "Kaksi Labs",
    status: "Offer",
    description: "Visual design",
  }),
  createTestJob({
    id: "rejected",
    title: "Backend Developer",
    company: "Pohjoinen Studio",
    status: "Rejected",
    description: "PostgreSQL",
  }),
];

describe("matchesFilter", () => {
  it("treats All as a pass-through", () => {
    expect(jobs.every((job) => matchesFilter(job, "All"))).toBe(true);
  });

  it("matches a concrete status", () => {
    expect(matchesFilter(jobs[0], "Saved")).toBe(true);
    expect(matchesFilter(jobs[0], "Applied")).toBe(false);
  });

  it("treats Interview and Offer as InProgress", () => {
    expect(matchesFilter(jobs[2], "InProgress")).toBe(true);
    expect(matchesFilter(jobs[3], "InProgress")).toBe(true);
    expect(matchesFilter(jobs[1], "InProgress")).toBe(false);
    expect(matchesFilter(jobs[4], "InProgress")).toBe(false);
  });
});

describe("filterJobs", () => {
  it("returns every job when search is blank and status is All", () => {
    expect(filterJobs(jobs, { search: "  ", status: "All" })).toHaveLength(5);
  });

  it("filters by status", () => {
    const applied = filterJobs(jobs, { search: "", status: "Applied" });
    expect(applied.map((job) => job.id)).toEqual(["applied"]);
  });

  it("filters InProgress to interview and offer rows", () => {
    const inProgress = filterJobs(jobs, { search: "", status: "InProgress" });
    expect(inProgress.map((job) => job.id)).toEqual(["interview", "offer"]);
  });

  it("matches title, company, and description case-insensitively", () => {
    expect(
      filterJobs(jobs, { search: "react", status: "All" }).map((job) => job.id),
    ).toEqual(["saved"]);
    expect(
      filterJobs(jobs, { search: "AALTO", status: "All" }).map((job) => job.id),
    ).toEqual(["applied"]);
    expect(
      filterJobs(jobs, { search: "postgresql", status: "All" }).map(
        (job) => job.id,
      ),
    ).toEqual(["rejected"]);
  });

  it("combines search with a status filter", () => {
    const result = filterJobs(jobs, { search: "designer", status: "Offer" });
    expect(result.map((job) => job.id)).toEqual(["offer"]);
    expect(
      filterJobs(jobs, { search: "designer", status: "Saved" }),
    ).toHaveLength(0);
  });

  it("returns an empty list when nothing matches", () => {
    expect(
      filterJobs(jobs, { search: "cobol", status: "All" }),
    ).toHaveLength(0);
  });
});

describe("jobMatchesSearch", () => {
  it("treats an empty query as a match", () => {
    expect(jobMatchesSearch(jobs[0], "")).toBe(true);
  });
});

describe("countAllFilters", () => {
  it("agrees with per-filter counts in a single pass", () => {
    const counts = countAllFilters(jobs);
    for (const filter of JOB_LIST_FILTERS) {
      expect(counts[filter]).toBe(countByFilter(jobs, filter));
    }
    expect(counts.All).toBe(5);
    expect(counts.InProgress).toBe(2);
    expect(counts.Saved).toBe(1);
  });
});

describe("groupByStatus and orderJobsForDisplay", () => {
  it("groups in pipeline order and drops empty statuses", () => {
    const groups = groupByStatus(jobs);
    expect(groups.map((group) => group.status)).toEqual([
      "Interview",
      "Offer",
      "Applied",
      "Saved",
      "Rejected",
    ]);
  });

  it("keeps the incoming order when not grouped", () => {
    expect(orderJobsForDisplay(jobs, false)).toEqual(jobs);
  });

  it("flattens grouped rows in pipeline order for keyboard navigation", () => {
    expect(orderJobsForDisplay(jobs, true).map((job) => job.id)).toEqual([
      "interview",
      "offer",
      "applied",
      "saved",
      "rejected",
    ]);
  });
});
