import { describe, expect, it } from "vitest";
import {
  buildDashboardImportUrl,
  readDashboardImportQuery,
  toShareIntake,
} from "@/lib/share-target/intake";
import {
  extractHttpUrls,
  pickSharedJobUrl,
  pickSharedTitle,
  tryParseHttpUrl,
} from "@/lib/share-target/url";

const DUUNITORI_JOB =
  "https://duunitori.fi/tyopaikat/tyo/frontend-kehittaja-abc123";
const OTHER_JOB = "https://www.oikotie.fi/tyopaikat/123";

describe("extractHttpUrls", () => {
  it("reads a bare http(s) URL", () => {
    expect(extractHttpUrls(DUUNITORI_JOB)).toEqual([DUUNITORI_JOB]);
  });

  it("pulls a URL out of surrounding Android share text", () => {
    expect(
      extractHttpUrls(`Frontend-kehittäjä\n${DUUNITORI_JOB}`),
    ).toEqual([DUUNITORI_JOB]);
  });

  it("strips trailing punctuation and markdown wrappers", () => {
    expect(extractHttpUrls(`See <${DUUNITORI_JOB}>.`)).toEqual([
      DUUNITORI_JOB,
    ]);
    expect(extractHttpUrls(`[job](${DUUNITORI_JOB})`)).toEqual([
      DUUNITORI_JOB,
    ]);
  });

  it("rejects javascript and credentialed URLs", () => {
    expect(extractHttpUrls("javascript:alert(1)")).toEqual([]);
    expect(extractHttpUrls("https://user:pass@duunitori.fi/tyo")).toEqual([]);
  });
});

describe("pickSharedJobUrl", () => {
  it("prefers the url field when it is a valid http(s) link", () => {
    expect(
      pickSharedJobUrl({
        title: "Ignored",
        text: OTHER_JOB,
        url: DUUNITORI_JOB,
      }),
    ).toBe(DUUNITORI_JOB);
  });

  it("falls back to text when Android omits url", () => {
    expect(
      pickSharedJobUrl({
        title: "Frontend-kehittäjä",
        text: DUUNITORI_JOB,
        url: "",
      }),
    ).toBe(DUUNITORI_JOB);
  });

  it("falls back to title when only title contains a URL", () => {
    expect(
      pickSharedJobUrl({
        title: DUUNITORI_JOB,
        text: "Check this role",
        url: "",
      }),
    ).toBe(DUUNITORI_JOB);
  });

  it("prefers a Duunitori posting when several URLs are present", () => {
    expect(
      pickSharedJobUrl({
        title: "",
        text: `From Oikotie ${OTHER_JOB} or Duunitori ${DUUNITORI_JOB}`,
        url: "https://twitter.com/someone/status/1",
      }),
    ).toBe(DUUNITORI_JOB);
  });
});

describe("pickSharedTitle", () => {
  it("uses the share title when it is not itself a URL", () => {
    expect(
      pickSharedTitle(
        {
          title: "Frontend-kehittäjä",
          text: DUUNITORI_JOB,
          url: "",
        },
        DUUNITORI_JOB,
      ),
    ).toBe("Frontend-kehittäjä");
  });

  it("takes the text line before the URL when title is missing", () => {
    expect(
      pickSharedTitle(
        {
          title: "",
          text: `UI-suunnittelija\n${DUUNITORI_JOB}`,
          url: "",
        },
        DUUNITORI_JOB,
      ),
    ).toBe("UI-suunnittelija");
  });

  it("does not treat a URL as a job title", () => {
    expect(
      pickSharedTitle(
        {
          title: DUUNITORI_JOB,
          text: DUUNITORI_JOB,
          url: DUUNITORI_JOB,
        },
        DUUNITORI_JOB,
      ),
    ).toBe("");
  });
});

describe("tryParseHttpUrl", () => {
  it("accepts https job links and rejects non-http schemes", () => {
    expect(tryParseHttpUrl(DUUNITORI_JOB)).toBe(DUUNITORI_JOB);
    expect(tryParseHttpUrl("ftp://duunitori.fi/tyo")).toBeNull();
  });
});

describe("share target intake", () => {
  it("redirects to the dashboard with importUrl and autoParse", () => {
    const incoming = new URL(
      `https://duunitracker.vercel.app/share-target?title=${encodeURIComponent("Frontend-kehittäjä")}&text=${encodeURIComponent(DUUNITORI_JOB)}`,
    );
    const dest = buildDashboardImportUrl(incoming);
    expect(dest.pathname).toBe("/app");
    expect(dest.searchParams.get("importUrl")).toBe(DUUNITORI_JOB);
    expect(dest.searchParams.get("autoParse")).toBe("true");
    expect(dest.searchParams.get("importTitle")).toBe("Frontend-kehittäjä");
  });

  it("passes a title-only share through without autoParse", () => {
    const incoming = new URL(
      "https://duunitracker.vercel.app/share-target?title=Designer",
    );
    const dest = buildDashboardImportUrl(incoming);
    expect(dest.searchParams.get("importUrl")).toBeNull();
    expect(dest.searchParams.get("autoParse")).toBeNull();
    expect(dest.searchParams.get("importTitle")).toBe("Designer");
  });

  it("reads dashboard query params back into an intake payload", () => {
    const params = new URLSearchParams({
      importUrl: DUUNITORI_JOB,
      autoParse: "true",
      importTitle: "Frontend-kehittäjä",
    });
    expect(readDashboardImportQuery(params)).toEqual({
      url: DUUNITORI_JOB,
      title: "Frontend-kehittäjä",
      autoParse: true,
    });
  });

  it("builds intake from Android-style text-only shares", () => {
    expect(
      toShareIntake({
        title: "",
        text: DUUNITORI_JOB,
        url: "",
      }),
    ).toEqual({
      url: DUUNITORI_JOB,
      title: "",
      autoParse: true,
    });
  });
});
