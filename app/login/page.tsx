"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu!");
      return;
    }

    setLoading(true);

    // Tìm user trong bảng users theo email
    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select("user_id, full_name, email")
      .eq("email", email)
      .single();

    if (dbError || !userData) {
      setError("Email không tồn tại. Vui lòng kiểm tra lại!");
      setLoading(false);
      return;
    }

    // Lưu thông tin user vào localStorage để dùng toàn app
    localStorage.setItem("nutriai_user_id", userData.user_id);
    localStorage.setItem("nutriai_user_name", userData.full_name);

    // Chuyển sang dashboard
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0fff4] font-[family-name:var(--font-be-vietnam)]">
      {/* Navbar */}
      {/* Header chuẩn theo Sidebar */}
      <header className="w-full px-6 lg:px-20 py-4 flex items-center justify-between border-b border-green-100 bg-white sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Ô vuông xanh chuẩn mã màu Sidebar */}
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-opacity group-hover:opacity-90 bg-[#2e9b57]">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z" />
              <path d="M12 16c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4z" />
              <path d="M12 12c.5 0 1-.5 1-1s-.5-1-1-1-1 .5-1 1 .5 1 1 1z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#2e9b57]">
            NutriAI
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-slate-500">Đã có tài khoản?</span>
          <Link href="/login" className="text-green-600 font-bold hover:underline">
            Đăng nhập
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-5xl">🥑</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-4">
              Chào mừng trở lại!
            </h2>
            <p className="text-slate-500 mt-2">
              Đăng nhập ngay để tiếp tục hành trình sức khỏe của bạn
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Email
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 px-4 py-3"
                placeholder="example@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Mật khẩu
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 px-4 py-3"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 mt-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập →"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-green-600 font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        © 2025 NutriAI. Made with healthy passion in Vietnam.
      </footer>
    </div>
  );
}