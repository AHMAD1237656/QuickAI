"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Zap, ChevronDown, User, LogOut } from "lucide-react";
import { getProfile, logoutUser } from "@/lib/api";

export default function Navbar({ title = "Dashboard", onMenuClick = () => {} }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    getProfile()
      .then((data) => mounted && setUser(data))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-paper-200 bg-paper-50/85 px-4 backdrop-blur-md lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          className="shrink-0 rounded-lg p-2 text-ink-700 hover:bg-paper-200 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-[17px] font-semibold tracking-tight text-ink-950">
          {title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {user && (
          <div className="hidden items-center gap-1.5 rounded-full border border-signal-200 bg-signal-50 px-3 py-1.5 text-sm font-medium text-signal-700 sm:flex">
            <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
            {user.credits} credits remaining
          </div>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-paper-200 py-1 pl-1 pr-2.5 transition hover:border-ink-600/20 hover:bg-white"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-950 text-xs font-semibold text-white">
              {user?.username ? user.username[0].toUpperCase() : "?"}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-ink-600" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 w-52 animate-fade-in overflow-hidden rounded-xl border border-paper-200 bg-white shadow-card-hover">
              <div className="border-b border-paper-100 px-3.5 py-3">
                <p className="truncate text-sm font-medium text-ink-950">
                  {user?.username}
                </p>
                <p className="truncate text-xs text-ink-600">{user?.email}</p>
              </div>
              <a
                href="/profile"
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-ink-700 hover:bg-paper-100"
              >
                <User className="h-4 w-4" />
                View profile
              </a>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
