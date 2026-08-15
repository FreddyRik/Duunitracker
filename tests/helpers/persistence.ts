import { resetJobsLocalStoreForTests } from "@/lib/jobs-local-store";
import { resetOfflineStoreForTests } from "@/lib/offline-adapter";
import { resetStorageMigrationForTests } from "@/lib/storage-migration";

export async function resetClientPersistence(): Promise<void> {
  resetJobsLocalStoreForTests();
  resetStorageMigrationForTests();
  await resetOfflineStoreForTests();
  if (typeof window !== "undefined") {
    window.localStorage.clear();
  }
}
