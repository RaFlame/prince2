import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PRINCE2 Control | Myndgreiningareftirlit um borð",
  description:
    "Stjórnunaryfirlit fyrir myndgreiningareftirlit Fiskistofu — PRINCE2 governance dashboard for onboard camera-based monitoring.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="is">
      <body className="antialiased">{children}</body>
    </html>
  )
}
