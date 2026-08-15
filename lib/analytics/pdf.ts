import { formatDate } from "@/lib/format";
import { formatTemplate, statusLabel } from "@/lib/i18n";
import type { Messages } from "@/lib/i18n/types";
import { APP_NAME } from "@/lib/site-config";
import type { OfficialReportData } from "@/types/analytics";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const FONT_SIZE = 9;
const TITLE_SIZE = 16;
const LINE_HEIGHT = 12;
const ROW_HEIGHT = 14;

type PdfPage = {
  commands: string[];
};

function winAnsiByte(code: number): string {
  return `\\${code.toString(8).padStart(3, "0")}`;
}

/** Helvetica WinAnsi string. Characters outside Latin-1 become "?". */
export function encodePdfText(value: string): string {
  let out = "";
  for (const char of value) {
    if (char === "\\" || char === "(" || char === ")") {
      out += `\\${char}`;
      continue;
    }
    const code = char.codePointAt(0) ?? 0;
    if (code === 0x2013 || code === 0x2014) {
      out += "-";
      continue;
    }
    if (code === 0x2018 || code === 0x2019) {
      out += "'";
      continue;
    }
    if (code === 0x201c || code === 0x201d) {
      out += '"';
      continue;
    }
    if (code === 0xa0) {
      out += " ";
      continue;
    }
    if (code >= 32 && code <= 126) {
      out += char;
      continue;
    }
    if (code <= 255) {
      out += winAnsiByte(code);
      continue;
    }
    out += "?";
  }
  return out;
}

function textCommand(
  x: number,
  y: number,
  size: number,
  value: string,
): string {
  return `BT /F1 ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${encodePdfText(value)}) Tj ET`;
}

function lineCommand(x1: number, y1: number, x2: number, y2: number): string {
  return `${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`;
}

function truncate(value: string, maxChars: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, Math.max(1, maxChars - 3))}...`;
}

function wrapText(value: string, maxChars: number): string[] {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current.length === 0 ? word : `${current} ${word}`;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }
    if (current.length > 0) lines.push(current);
    if (word.length > maxChars) {
      lines.push(truncate(word, maxChars));
      current = "";
    } else {
      current = word;
    }
  }
  if (current.length > 0) lines.push(current);
  return lines;
}

function addPage(): PdfPage {
  return { commands: ["0.15 0.15 0.15 RG", "0.15 0.15 0.15 rg"] };
}

function buildXref(offsets: number[]): string {
  const lines = ["xref", `0 ${offsets.length + 1}`, "0000000000 65535 f "];
  for (const offset of offsets) {
    lines.push(`${String(offset).padStart(10, "0")} 00000 n `);
  }
  return `${lines.join("\n")}\n`;
}

function assemblePdf(pages: PdfPage[]): Uint8Array {
  const objects: string[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");

  const pageCount = pages.length;
  const pageIds = pages.map((_, index) => 3 + index);
  const contentIds = pages.map((_, index) => 3 + pageCount + index);
  const fontId = 3 + pageCount * 2;

  objects.push(
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`,
  );

  for (let index = 0; index < pageCount; index += 1) {
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Contents ${contentIds[index]} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`,
    );
  }

  for (const page of pages) {
    const stream = page.commands.join("\n");
    objects.push(
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    );
  }

  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");

  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [encoder.encode("%PDF-1.4\n")];
  const offsets: number[] = [];
  let cursor = chunks[0].byteLength;

  objects.forEach((body, index) => {
    const block = encoder.encode(`${index + 1} 0 obj\n${body}\nendobj\n`);
    offsets.push(cursor);
    chunks.push(block);
    cursor += block.byteLength;
  });

  const xrefOffset = cursor;
  const xref = encoder.encode(buildXref(offsets));
  chunks.push(xref);
  cursor += xref.byteLength;

  const trailer = encoder.encode(
    `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
  );
  chunks.push(trailer);

  const output = new Uint8Array(cursor + trailer.byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

function drawHeader(
  page: PdfPage,
  report: OfficialReportData,
  t: Messages,
  y: number,
): number {
  const generated = new Date(report.generatedAt);
  const generatedLabel = Number.isNaN(generated.getTime())
    ? report.generatedAt
    : generated.toISOString().slice(0, 16).replace("T", " ");

  page.commands.push(textCommand(MARGIN, y, TITLE_SIZE, t.analytics.reportOfficialTitle));
  y -= 16;
  page.commands.push(textCommand(MARGIN, y, FONT_SIZE, `${APP_NAME} · ${t.analytics.reportOfficialSubtitle}`));
  y -= 18;
  page.commands.push(
    textCommand(
      MARGIN,
      y,
      FONT_SIZE,
      `${t.analytics.reportPeriod}: ${formatDate(report.range.start)} - ${formatDate(report.range.end)}`,
    ),
  );
  y -= LINE_HEIGHT;
  page.commands.push(
    textCommand(MARGIN, y, FONT_SIZE, `${t.analytics.reportGenerated}: ${generatedLabel}`),
  );
  y -= LINE_HEIGHT;
  page.commands.push(
    textCommand(
      MARGIN,
      y,
      FONT_SIZE,
      `${t.analytics.reportQuotaLabel}: ${formatTemplate(t.analytics.reportQuotaValue, {
        applied: report.quota.appliedCount,
        target: report.quota.targetCount,
        days: report.quota.rangeDays,
      })}`,
    ),
  );
  y -= 18;
  return y;
}

function drawTableHeader(page: PdfPage, t: Messages, y: number): number {
  const columns: { x: number; label: string }[] = [
    { x: MARGIN, label: t.analytics.colDate },
    { x: MARGIN + 62, label: t.analytics.colEmployer },
    { x: MARGIN + 168, label: t.analytics.colPosition },
    { x: MARGIN + 292, label: t.analytics.colLocation },
    { x: MARGIN + 368, label: t.analytics.colStatus },
    { x: MARGIN + 430, label: t.analytics.colUrl },
  ];
  for (const column of columns) {
    page.commands.push(textCommand(column.x, y, 8, column.label.toUpperCase()));
  }
  y -= 4;
  page.commands.push(
    lineCommand(MARGIN, y, PAGE_WIDTH - MARGIN, y),
  );
  return y - 10;
}

/**
 * Builds a printable A4 PDF of the official activity report.
 * Uses built-in Helvetica so the file stays self-contained (no extra packages).
 */
export function buildOfficialReportPdf(
  report: OfficialReportData,
  t: Messages,
): Uint8Array {
  const pages: PdfPage[] = [];
  let page = addPage();
  pages.push(page);
  let y = PAGE_HEIGHT - MARGIN;

  y = drawHeader(page, report, t, y);
  y = drawTableHeader(page, t, y);

  if (report.rows.length === 0) {
    page.commands.push(textCommand(MARGIN, y, FONT_SIZE, t.analytics.reportNoApplications));
    y -= 24;
  } else {
    for (const row of report.rows) {
      if (y < MARGIN + 80) {
        page = addPage();
        pages.push(page);
        y = PAGE_HEIGHT - MARGIN;
        y = drawTableHeader(page, t, y);
      }

      const cells = [
        { x: MARGIN, text: formatDate(row.dateApplied), max: 10 },
        { x: MARGIN + 62, text: row.company, max: 18 },
        { x: MARGIN + 168, text: row.title, max: 20 },
        { x: MARGIN + 292, text: row.location ?? "-", max: 12 },
        { x: MARGIN + 368, text: statusLabel(t, row.status), max: 12 },
        { x: MARGIN + 430, text: row.url || "-", max: 20 },
      ];
      for (const cell of cells) {
        page.commands.push(
          textCommand(cell.x, y, FONT_SIZE, truncate(cell.text, cell.max)),
        );
      }
      y -= ROW_HEIGHT;
    }
    y -= 8;
  }

  const disclaimerLines = wrapText(t.analytics.reportDisclaimer, 92);
  const footerHeight = 36 + disclaimerLines.length * LINE_HEIGHT + 40;
  if (y < MARGIN + footerHeight) {
    page = addPage();
    pages.push(page);
    y = PAGE_HEIGHT - MARGIN;
  }

  for (const line of disclaimerLines) {
    page.commands.push(textCommand(MARGIN, y, 8, line));
    y -= LINE_HEIGHT;
  }

  y -= 28;
  page.commands.push(textCommand(MARGIN, y, FONT_SIZE, t.analytics.reportSignature));
  page.commands.push(
    textCommand(PAGE_WIDTH / 2, y, FONT_SIZE, t.analytics.reportDateLine),
  );
  y -= 6;
  page.commands.push(lineCommand(MARGIN, y, MARGIN + 180, y));
  page.commands.push(lineCommand(PAGE_WIDTH / 2, y, PAGE_WIDTH / 2 + 180, y));

  return assemblePdf(pages);
}

export function officialReportPdfFilename(report: OfficialReportData): string {
  return `tyonhaku-raportti-${report.range.start}-${report.range.end}.pdf`;
}
