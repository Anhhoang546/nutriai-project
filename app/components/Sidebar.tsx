"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan" },
  { href: "/meals", label: "Nhật ký bữa ăn" },
  { href: "/ai-suggest", label: "Gợi ý AI" },
  {href: "/community", label: "Cộng đồng"},
  { href: "/pricing", label: "Nâng cấp" },
];

function LogoIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z" />
      <path d="M12 16c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4z" />
      <path d="M12 12c.5 0 1-.5 1-1s-.5-1-1-1-1 .5-1 1 .5 1 1 1z" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("nutriai_user_name");
    setUserName(name);
  }, []);

  function handleLogout() {
    localStorage.removeItem("nutriai_user_id");
    localStorage.removeItem("nutriai_user_name");
    router.push("/login");
  }

  // Lấy 2 chữ cái đầu tên để làm avatar
  const initials = userName
    ? userName.split(" ").slice(-2).map(w => w[0]).join("").toUpperCase()
    : "?";

  return (
    <aside className="w-56 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 shrink-0"
      style={{ fontFamily: "var(--font-landing), sans-serif" }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-opacity group-hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}>
            <LogoIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-tight"
            style={{ color: "var(--color-primary)" }}>
            NutriAI
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p className="px-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} 
              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={isActive
                ? { backgroundColor: "var(--color-primary)", color: "#fff" }
                : { color: "#475569" }
              }
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "#f8fafc"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = ""; }}
            >
              {item.label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-slate-100">
        {userName ? (
          // Đã đăng nhập
          <div className="space-y-1">
            <Link href="/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: "var(--color-primary)" }}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
                <p className="text-xs text-slate-400">Xem hồ sơ</p>
              </div>
            </Link>
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
              Đăng xuất
            </button>
          </div>
        ) : (
          // Chưa đăng nhập
          <div className="space-y-2">
            <Link href="/login"
              className="flex items-center justify-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:border-green-400 hover:text-green-600 transition-all">
              Đăng nhập
            </Link>
            <Link href="/register"
              className="flex items-center justify-center w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "var(--color-primary)" }}>
              Đăng ký miễn phí
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}