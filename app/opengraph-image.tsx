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
          background: "linear-gradient(180deg, #fafaf8 0%, #f7f7f5 48%, #f3f3f0 100%)",
          color: "#141413",
          fontFamily: "system-ui, sans-serif",
          border: "1px solid #e4e4e0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#141413",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#141413",
              color: "#f7f7f5",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            D
          </div>
          {APP_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              maxWidth: 900,
              color: "#141413",
            }}
          >
            {fi.landing.headline}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "#6b6b66",
              maxWidth: 920,
            }}
          >
            {fi.landing.subhead}
          </div>
          <div
            style={{
              marginTop: 12,
              width: 64,
              height: 1,
              background: "#141413",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
