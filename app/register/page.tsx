"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ACTIVITY_OPTIONS = [
  { label: "Ít vận động (Văn phòng)", value: "sedentary" },
  { label: "Vận động nhẹ (1-2 lần/tuần)", value: "light" },
  { label: "Vận động vừa (3-5 lần/tuần)", value: "moderate" },
  { label: "Vận động mạnh (Hàng ngày)", value: "active" },
];

const GOALS = [
  { id: "lose_weight", label: "Giảm cân", icon: "📉" },
  { id: "gain_muscle", label: "Tăng cơ", icon: "💪" },
  { id: "maintain", label: "Duy trì", icon: "🎯" },
];

// Tính BMR (Mifflin-St Jeor)
function calcBMR(weight: number, height: number, age: number, gender: string) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

// Tính TDEE
function calcTDEE(bmr: number, activity: string) {
  const map: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };
  return bmr * (map[activity] || 1.2);
}

// Tính calories mục tiêu
function calcTarget(tdee: number, goal: string) {
  if (goal === "lose_weight") return tdee - 500;
  if (goal === "gain_muscle") return tdee + 300;
  return tdee;
}

export default function RegisterPage() {
  const router = useRouter();
  const [gender, setGender] = useState<"male" | "female">("male");
  const [selectedGoal, setSelectedGoal] = useState("lose_weight");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("sedentary");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Kiểm tra điền đủ thông tin
    if (!fullName || !email || !password || !age || !height || !weight) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    try {
      // Tính toán chỉ số dinh dưỡng
      const bmr = calcBMR(
        parseFloat(weight),
        parseFloat(height),
        parseInt(age),
        gender
      );
      const tdee = calcTDEE(bmr, activity);
      const dailyTarget = calcTarget(tdee, selectedGoal);

      // Lưu vào bảng users trong Supabase
      const { error: dbError } = await supabase.from("users").insert({
        email,
        full_name: fullName,
        age: parseInt(age),
        gender,
        height_cm: parseFloat(height),
        weight_kg: parseFloat(weight),
        goal: selectedGoal,
        activity_level: activity,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        daily_calorie_target: Math.round(dailyTarget),
        plan: "free",
      });

      if (dbError) {
        setError("Lỗi khi tạo tài khoản: " + dbError.message);
        setLoading(false);
        return;
      }

      // Đăng ký thành công → chuyển sang dashboard
      router.push("/dashboard");
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại!");
      setLoading(false);
    }
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

      <main className="flex-grow flex flex-col lg:flex-row">
        {/* Form đăng ký */}
        <section className="w-full lg:w-1/2 p-8 lg:p-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3 text-center">
              Bắt đầu hành trình  của bạn cùng NutriAI!
            </h2>
            <p className="text-slate-600 mb-8 text-lg text-center">
              Tạo tài khoản để nhận kế hoạch dinh dưỡng cá nhân hóa ngay hôm nay
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Họ tên */}
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Họ và tên
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 px-4 py-3"
                  placeholder="Nhập họ và tên của bạn"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Email + Mật khẩu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 px-4 py-3"
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
                    className="w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 px-4 py-3"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Giới tính + Tuổi */}
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[140px] space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Giới tính
                  </label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                        gender === "male" ? "bg-white shadow-sm" : "text-slate-500"
                      }`}
                    >
                      Nam
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                        gender === "female" ? "bg-white shadow-sm" : "text-slate-500"
                      }`}
                    >
                      Nữ
                    </button>
                  </div>
                </div>
                <div className="w-24 space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Tuổi
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 px-4 py-3"
                    placeholder="22"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </div>

              {/* Chiều cao + Cân nặng */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Chiều cao (cm)
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 px-4 py-3"
                    placeholder="170"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Cân nặng (kg)
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 px-4 py-3"
                    placeholder="65"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>

              {/* Mức độ vận động */}
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Mức độ vận động
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 px-4 py-3"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                >
                  {ACTIVITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mục tiêu */}
              <div className="space-y-3">
                <label className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Mục tiêu sức khỏe
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`border-2 rounded-xl p-3 flex flex-col items-center text-center transition hover:bg-green-50 ${
                        selectedGoal === goal.id
                          ? "border-green-500 bg-green-50"
                          : "border-slate-200"
                      }`}
                    >
                      <span className="text-2xl mb-1">{goal.icon}</span>
                      <span className="text-xs font-bold">{goal.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? "Đang tạo tài khoản..." : "Tạo kế hoạch của tôi →"}
              </button>

              <p className="text-center text-xs text-slate-400">
                Bằng cách đăng ký, bạn đồng ý với Điều khoản dịch vụ của chúng tôi.
              </p>
            </form>
          </div>
        </section>

        {/* Right panel */}
        <section className="hidden lg:flex w-1/2 bg-green-50 p-20 flex-col items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm mb-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              🍽️ Gợi ý thực đơn hôm nay
            </h3>
            {[
              { name: "Salad Ức Gà & Trứng", kcal: "320kcal", protein: "25g Protein" },
              { name: "Cá Hồi & Gạo Lứt", kcal: "450kcal", protein: "35g Protein" },
            ].map((meal) => (
              <div key={meal.name} className="flex items-center gap-3 py-3 border-t border-slate-50">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-xl">🥗</div>
                <div>
                  <p className="font-bold text-sm">{meal.name}</p>
                  <p className="text-xs text-slate-400">{meal.kcal} • {meal.protein}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 text-white p-6 rounded-2xl w-full max-w-sm">
            <h3 className="font-bold mb-4">📊 Tiến độ cá nhân</h3>
            <div className="flex items-end gap-2 h-20 mb-4">
              {[65, 80, 45, 85, 70].map((h, i) => (
                <div key={i} className="flex-1 bg-green-500 rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between text-sm border-t border-white/10 pt-4">
              <div>
                <p className="text-white/60">Cân nặng hiện tại</p>
                <p className="font-black text-xl">68.0kg</p>
              </div>
              <div className="text-right">
                <p className="text-white/60">Giảm được</p>
                <p className="font-black text-xl text-green-400">-4.0kg</p>
              </div>
            </div>
          </div>
          <p className="text-slate-500 text-sm text-center mt-6">
            Hơn 10,000 người Việt đã thay đổi cuộc sống cùng NutriAI
          </p>
        </section>
      </main>

      <footer className="w-full py-6 border-t border-green-100 bg-white text-center">
        <p className="text-slate-400 text-sm">© 2025 NutriAI. Made with healthy passion in Vietnam.</p>
      </footer>
    </div>
  );
}