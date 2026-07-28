import { ImageResponse } from "next/og";
import { APP_NAME } from "@/lib/site-config";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
          color: "#ffffff",
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {APP_NAME.charAt(0)}
      </div>
    ),
    {
      ...size,
    },
  );
}
