import { pickSharedJobUrl, pickSharedTitle } from "@/lib/share-target/url";
import { JOB_FIELD_LIMITS, SHARE_INTAKE_STORAGE_KEY } from "@/lib/site-config";
import { isRecord } from "@/lib/validate";
import type {
  ShareIntakePayload,
  ShareTargetFields,
} from "@/types/share-target";

export const SHARE_TARGET_PATH = "/share-target";
export const DASHBOARD_PATH = "/app";
export const IMPORT_URL_PARAM = "importUrl";
export const AUTO_PARSE_PARAM = "autoParse";
export const IMPORT_TITLE_PARAM = "importTitle";

export function parseShareTargetFields(
  searchParams: URLSearchParams,
): ShareTargetFields {
  return {
    title: searchParams.get("title") ?? "",
    text: searchParams.get("text") ?? "",
    url: searchParams.get("url") ?? "",
  };
}

export function toShareIntake(fields: ShareTargetFields): ShareIntakePayload {
  const url = pickSharedJobUrl(fields) ?? "";
  const title = pickSharedTitle(fields, url || null);
  return {
    url,
    title,
    autoParse: url.length > 0,
  };
}

export function buildDashboardImportUrl(requestUrl: URL): URL {
  const intake = toShareIntake(parseShareTargetFields(requestUrl.searchParams));
  const dest = new URL(DASHBOARD_PATH, requestUrl.origin);
  if (intake.url) dest.searchParams.set(IMPORT_URL_PARAM, intake.url);
  if (intake.autoParse) dest.searchParams.set(AUTO_PARSE_PARAM, "true");
  if (intake.title) dest.searchParams.set(IMPORT_TITLE_PARAM, intake.title);
  return dest;
}

export function readDashboardImportQuery(
  searchParams: URLSearchParams,
): ShareIntakePayload | null {
  const url = (searchParams.get(IMPORT_URL_PARAM)?.trim() ?? "").slice(
    0,
    JOB_FIELD_LIMITS.url,
  );
  const title = (searchParams.get(IMPORT_TITLE_PARAM)?.trim() ?? "").slice(
    0,
    JOB_FIELD_LIMITS.title,
  );
  const autoParse = searchParams.get(AUTO_PARSE_PARAM) === "true";
  if (!url && !title && !autoParse) return null;
  return {
    url,
    title,
    autoParse: autoParse && url.length > 0,
  };
}

export function clearDashboardImportQuery(): void {
  const current = new URL(window.location.href);
  current.searchParams.delete(IMPORT_URL_PARAM);
  current.searchParams.delete(AUTO_PARSE_PARAM);
  current.searchParams.delete(IMPORT_TITLE_PARAM);
  const next = `${current.pathname}${current.search}${current.hash}`;
  window.history.replaceState(window.history.state, "", next);
}

function isShareIntakePayload(value: unknown): value is ShareIntakePayload {
  if (!isRecord(value)) return false;
  return (
    typeof value.url === "string" &&
    typeof value.title === "string" &&
    typeof value.autoParse === "boolean"
  );
}

function persistShareIntake(payload: ShareIntakePayload): void {
  try {
    sessionStorage.setItem(SHARE_INTAKE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Private mode or quota — in-memory consume still works for this load.
  }
}

function readPersistedShareIntake(): ShareIntakePayload | null {
  try {
    const raw = sessionStorage.getItem(SHARE_INTAKE_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isShareIntakePayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearPersistedShareIntake(): void {
  try {
    sessionStorage.removeItem(SHARE_INTAKE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function consumeDashboardShareIntake(): ShareIntakePayload | null {
  const fromQuery = readDashboardImportQuery(
    new URLSearchParams(window.location.search),
  );
  if (fromQuery) {
    persistShareIntake(fromQuery);
    clearDashboardImportQuery();
    return fromQuery;
  }
  return readPersistedShareIntake();
}
