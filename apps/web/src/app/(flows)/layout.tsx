import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FlowsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Back
      </Link>
      {children}
    </main>
  );
}
