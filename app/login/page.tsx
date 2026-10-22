import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="neo-deck flex min-h-screen items-center justify-center text-[var(--ink)]">
          <p className="text-sm text-[var(--mute-slate)]">…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
