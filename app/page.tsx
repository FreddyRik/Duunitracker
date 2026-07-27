import { readJobs } from "@/lib/jobs-store";
import { Dashboard } from "@/components/Dashboard";

export default async function HomePage() {
  const jobs = await readJobs();
  return <Dashboard initialJobs={jobs} />;
}
