export default function FlowsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">{children}</main>;
}
