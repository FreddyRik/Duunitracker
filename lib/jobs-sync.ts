import { JOBS_SYNC_CHANNEL } from "@/lib/site-config";

type JobsChangedMessage = {
  type: "jobs-changed";
};

function isJobsChangedMessage(value: unknown): value is JobsChangedMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "jobs-changed"
  );
}

export function notifyJobsChanged(): void {
  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(JOBS_SYNC_CHANNEL);
  const message: JobsChangedMessage = { type: "jobs-changed" };
  channel.postMessage(message);
  channel.close();
}

export function subscribeJobsChanged(onChange: () => void): () => void {
  if (typeof BroadcastChannel === "undefined") {
    return () => undefined;
  }

  const channel = new BroadcastChannel(JOBS_SYNC_CHANNEL);
  channel.onmessage = (event: MessageEvent<unknown>) => {
    if (isJobsChangedMessage(event.data)) {
      onChange();
    }
  };
  return () => channel.close();
}
