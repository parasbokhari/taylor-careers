import { ImageResponse } from "next/og";

export const alt = "Taylor Careers";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "#f5f9ff",
          color: "#25282a",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "96px",
            height: "8px",
            marginBottom: "40px",
            background: "#2458f1",
          }}
        />
        <div
          style={{
            fontSize: "78px",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "0",
          }}
        >
          Taylor Careers
        </div>
        <div
          style={{
            maxWidth: "840px",
            marginTop: "28px",
            fontSize: "34px",
            lineHeight: 1.25,
            color: "#505457",
          }}
        >
          Explore open positions and build what is next with Taylor.
        </div>
      </div>
    ),
    size,
  );
}
