import { ImageResponse } from "next/og";
import { APP_NAME } from "@/lib/site-config";

export function createPwaIconResponse(size: number, maskable: boolean) {
  const inset = maskable ? Math.round(size * 0.18) : 0;
  const inner = size - inset * 2;
  const fontSize = Math.round(inner * 0.52);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141413",
          padding: inset,
        }}
      >
        <div
          style={{
            width: inner,
            height: inner,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#141413",
            color: "#f7f7f5",
            fontSize,
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {APP_NAME.charAt(0)}
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
