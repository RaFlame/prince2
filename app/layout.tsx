import type { Metadata } from "next"
import Script from "next/script"
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
  title: "PRINCE2 Control",
  description:
    "PRINCE2 stjórnunaryfirlit — governance dashboard for project control.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="is" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${fontSans.variable} ${fontSerif.variable} ${fontDisplay.variable} ${fontMono.variable} ${fontRounded.variable} antialiased`}
      >
        <Script id="prince2-theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("prince2-theme");if(t==="dark"){document.documentElement.classList.add("dark");document.documentElement.dataset.theme="dark";document.documentElement.style.colorScheme="dark"}}catch(e){}})();`}
        </Script>
        {children}
      </body>
    </html>
  )
}
