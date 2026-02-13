import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1a1a] text-white">
      <header className="border-b border-gray-800 px-6 py-5">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight">GameFace</h1>
            <p className="text-sm text-gray-500">Emotion-driven game recommendations</p>
          </div>

          <nav className="flex gap-6 text-sm font-medium">
            <Link
              to="/"
              activeProps={{ className: "text-orange-500" }}
              inactiveProps={{ className: "text-gray-400 hover:text-white transition" }}
            >
              Upload
            </Link>
            <Link
              to="/history"
              activeProps={{ className: "text-orange-500" }}
              inactiveProps={{ className: "text-gray-400 hover:text-white transition" }}
            >
              History
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-800 px-6 py-4">
        <p className="text-center text-xs text-gray-600">
          Your photos are not stored. Images are analyzed in real-time and immediately discarded.
        </p>
      </footer>
    </div>
  );
}
