import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          0: "#ffffff",
          1: "#f7f7f8",
          2: "#efefef",
          3: "#e2e2e5",
        },
        ink: {
          DEFAULT: "#111118",
          secondary: "#4a4a5a",
          muted: "#8888a0",
        },
        accent: {
          DEFAULT: "#2563eb",
          light: "#dbeafe",
          hover: "#1d4ed8",
        },
        editor: {
          bg: "#fdfdfe",
          gutter: "#f0f0f3",
          line: "#f5f5f8",
          cursor: "#2563eb",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        editor: ['"JetBrains Mono"', "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#111118",
            "--tw-prose-headings": "#111118",
            "--tw-prose-links": "#2563eb",
            "--tw-prose-code": "#d63384",
            "--tw-prose-pre-bg": "#f5f5f8",
            maxWidth: "none",
            fontFamily: '"DM Sans", sans-serif',
            lineHeight: "1.75",
            code: {
              backgroundColor: "#f5f5f8",
              borderRadius: "0.375rem",
              padding: "0.125rem 0.375rem",
              fontWeight: "500",
            },
            pre: {
              backgroundColor: "#f5f5f8",
              border: "1px solid #efefef",
            },
            blockquote: {
              color: "#4a4a5a",
              borderLeftColor: "#2563eb",
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
