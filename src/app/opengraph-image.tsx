import { ImageResponse } from "next/og";

export const alt = "Tally — Money decisions, made calmer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #4c1d95 100%)",
          color: "white",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 22,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 28px rgba(99,102,241,0.45)",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 64 64">
              <g
                stroke="#ffffff"
                strokeWidth={5}
                strokeLinecap="round"
                fill="none"
              >
                <line x1="20" y1="18" x2="20" y2="46" />
                <line x1="29" y1="18" x2="29" y2="46" />
                <line x1="38" y1="18" x2="38" y2="46" />
                <line x1="47" y1="18" x2="47" y2="46" />
                <line x1="14" y1="44" x2="52" y2="20" />
              </g>
            </svg>
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>
            Tally
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 980,
          }}
        >
          Money decisions, made calmer.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            color: "#cbd5e1",
            maxWidth: 900,
          }}
        >
          Budget fit · cash tracking · fair splits · travel timing · smart receipts
        </div>
      </div>
    ),
    { ...size },
  );
}
