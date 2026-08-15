import type { JobApplication } from "@/types/job";

export function createTestJob(
  overrides: Partial<JobApplication> = {},
): JobApplication {
  return {
    id: "job-1",
    url: "https://duunitori.fi/tyopaikat/avoimet-tyopaikat/testi",
    title: "Frontend Developer",
    company: "Acme OY",
    location: "Helsinki",
    deadline: "2026-09-01",
    applied: false,
    status: "Saved",
    notes: "",
    dateApplied: null,
    interviewDate: null,
    contactName: null,
    contactEmail: null,
    salary: null,
    workType: "Hybrid",
    description: "Build UI components for the dashboard.",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    ...overrides,
  };
}
