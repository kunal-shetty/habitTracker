import { LoginButton } from "@/components/auth/login-button"

export default function LoginPage() {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-6">
            <div className="w-full max-w-sm space-y-8 text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome to Habitual</h1>
                    <p className="text-muted-foreground">Sign in to track your habits and build streaks</p>
                </div>

                    <LoginButton />

                <p className="text-xs text-muted-foreground px-8">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    )
}
