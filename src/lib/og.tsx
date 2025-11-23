import { ImageResponse } from "next/og";

export function generateOGImage(props: { title: string; description?: string }) {
  const { title, description } = props;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <img
            src="https://usememos.com/logo-rounded.png"
            alt="Memos Logo"
            width="64"
            height="64"
            style={{
              marginRight: "24px",
            }}
          />
          <div
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#0f172a",
              letterSpacing: "-0.025em",
            }}
          >
            Memos
          </div>
        </div>

        <div
          style={{
            fontSize: "80px",
            fontWeight: "bold",
            color: "#0f172a",
            lineHeight: 1.1,
            marginBottom: "24px",
            letterSpacing: "-0.025em",
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>

        {description && (
          <div
            style={{
              fontSize: "36px",
              color: "#475569",
              lineHeight: 1.4,
              maxWidth: "1000px",
            }}
          >
            {description.length > 120 ? `${description.slice(0, 120)}...` : description}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: "24px",
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          usememos.com
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#0d9488",
              marginRight: "12px",
            }}
          />
          <div
            style={{
              fontSize: "24px",
              color: "#64748b",
              fontWeight: 500,
            }}
          >
            Privacy-first Note Taking
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
