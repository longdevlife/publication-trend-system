import { Link, Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-14 items-center gap-6">
          <Link to="/" className="font-bold">
            Publication Trend
          </Link>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/search" className="hover:text-foreground">Search</Link>
            <Link to="/trends" className="hover:text-foreground">Trends</Link>
            <Link to="/reports" className="hover:text-foreground">Reports</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Publication Trend System · FPT University WDP301
      </footer>
    </div>
  );
}
