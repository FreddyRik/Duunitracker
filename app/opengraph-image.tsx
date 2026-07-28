import { ImageResponse } from "next/og";
import { APP_NAME } from "@/lib/site-config";
import { fi } from "@/lib/i18n/messages/fi";

export const alt = APP_NAME;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at top, #132033 0%, #0b1220 42%, #080d16 100%)",
          color: "#e2e8f0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
            color: "#2dd4bf",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
              color: "#ffffff",
              fontSize: 30,
            }}
          >
            D
          </div>
          {APP_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            {fi.landing.headline}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: "#94a3b8",
              maxWidth: 920,
            }}
          >
            {fi.landing.subhead}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
