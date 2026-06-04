import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-400 mb-4">Signal Lost</p>
        <h1 className="font-bricolage text-4xl mb-3">Page Not Found</h1>
        <p className="text-sm text-white/50 mb-6">
          This AstroVision route does not exist. Return to mission control to continue exploring.
        </p>
        <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-neutral-200">
          Open Dashboard
        </Link>
      </div>
    </main>
  );
}
