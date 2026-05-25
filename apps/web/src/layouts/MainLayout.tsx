import { Link, Outlet, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser, useLogout } from "@/features/auth";
import { useAuthStore } from "@/stores/auth-store";

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
          <div className="ml-auto">
            <UserMenu />
          </div>
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

function UserMenu() {
  const navigate = useNavigate();
  const isAuthed = useAuthStore((s) => !!s.tokens?.accessToken);
  const { data } = useCurrentUser();
  const logout = useLogout();

  if (!isAuthed) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/login">Sign in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/register">Sign up</Link>
        </Button>
      </div>
    );
  }

  const email = data?.user?.email ?? "Account";
  const fullName = data?.user?.fullName ?? email;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{fullName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="text-sm font-medium">{fullName}</div>
          <div className="text-xs text-muted-foreground">{email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate("/dashboard")}>
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            logout.mutate(undefined, {
              onSettled: () => navigate("/login", { replace: true }),
            });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
