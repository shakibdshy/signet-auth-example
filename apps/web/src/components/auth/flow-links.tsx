import Link from "next/link";

const linkClass =
  "mono-label text-muted-foreground transition-colors hover:text-foreground";

export function ToSignUpLink() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="mono-label text-muted-foreground">No account yet?</span>
      <Link href="/sign-up" className={linkClass}>
        Create one →
      </Link>
    </div>
  );
}

export function SignInAlternativesLinks() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <Link href="/sign-in/magic-link" className={linkClass}>
        Magic link instead →
      </Link>
      <Link href="/sign-in/otp" className={linkClass}>
        One-time code instead →
      </Link>
      <Link href="/forgot-password" className={linkClass}>
        Forgot password? →
      </Link>
    </div>
  );
}

export function ToSignInLink() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="mono-label text-muted-foreground">Already have an account?</span>
      <Link href="/sign-in" className={linkClass}>
        Sign in →
      </Link>
    </div>
  );
}
