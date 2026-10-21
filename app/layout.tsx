import type { Metadata } from "next"
import {
  DM_Sans,
  Fraunces,
  JetBrains_Mono,
  Literata,
  Nunito,
} from "next/font/google"
import "./globals.css"

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-card-sans",
})
const fontSerif = Literata({
  subsets: ["latin"],
  variable: "--font-card-serif",
})
const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-card-display",
})
const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-card-mono",
})
const fontRounded = Nunito({
  subsets: ["latin"],
  variable: "--font-card-rounded",
})

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
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontDisplay.variable} ${fontMono.variable} ${fontRounded.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
