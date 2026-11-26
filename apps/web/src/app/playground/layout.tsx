import { Sidebar } from "@/components/playground/sidebar";
import { UserMenu } from "@/components/playground/user-menu";

export default function PlaygroundLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="mx-auto grid w-full max-w-[1500px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[236px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <Sidebar />
      </aside>
      <div className="flex min-w-0 flex-col gap-8">
        <div className="flex items-center justify-between gap-4 border-b pb-4">
          <span className="mono-label text-muted-foreground">
            Playground / live deployment
          </span>
          <UserMenu />
        </div>
        {children}
      </div>
    </main>
  );
}
