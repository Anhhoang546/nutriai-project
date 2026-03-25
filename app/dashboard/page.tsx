"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/app/components/Sidebar";

// ── TYPES ──────────────────────────────────────────────────────
interface MealLog {
  id: number;
  food_name: string;
  meal_type: string;
  calories: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  eaten_at: string;
}

interface UserProfile {
  full_name: string;
  daily_calorie_target: number;
}

// Helper SVG circle
function getStrokeDashOffset(percent: number) {
  const circumference = 226.2;
  return circumference - (percent / 100) * circumference;
}

// Helper: nhóm bữa ăn theo meal_type
function groupByMealType(meals: MealLog[]) {
  const groups: Record<string, MealLog[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  };
  meals.forEach((m) => {
    if (groups[m.meal_type]) groups[m.meal_type].push(m);
  });
  return groups;
}

const MEAL_LABELS: Record<string, { label: string; emoji: string }> = {
  breakfast: { label: "Bữa sáng", emoji: "☀️" },
  lunch: { label: "Bữa trưa", emoji: "🌤" },
  dinner: { label: "Bữa tối", emoji: "🌙" },
  snack: { label: "Snack", emoji: "🍎" },
};

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile>({
    full_name: "Người dùng",
    daily_calorie_target: 1400,
  });
  const [todayMeals, setTodayMeals] = useState<MealLog[]>([]);
  interface WeekDay {
    day: string;
    calories: number;
    isToday: boolean;
  }
  const [weekHistory, setWeekHistory] = useState<WeekDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
  
  // Lấy userId từ localStorage
      const userId = localStorage.getItem("nutriai_user_id");
      if (!userId) {
        setLoading(false);
        return;
  }

  // Lấy đúng user đang đăng nhập
    const { data: userData } = await supabase
      .from("users")
      .select("full_name, daily_calorie_target")
      .eq("user_id", userId)  // ← thêm dòng này
      .single();              // ← bỏ .limit(1)
      if (userData) setUser(userData);

      // Ngày hôm nay theo định dạng YYYY-MM-DD
      const today = new Date().toISOString().split("T")[0];

      // Lấy bữa ăn hôm nay
      const { data: mealsData } = await supabase
        .from("meal_logs")
        .select("*")
        .eq("user_id", userId)
        .eq("eaten_at", today);
      
      setTodayMeals(mealsData || []); 

      // Lấy calories 7 ngày gần nhất
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const fromDate = sevenDaysAgo.toISOString().split("T")[0];

      const { data: historyData } = await supabase
        .from("meal_logs")
        .select("eaten_at, calories")
        .eq("user_id", userId)
        .gte("eaten_at", fromDate);

      // Nhóm theo ngày
      const caloriesByDay: Record<string, number> = {};
      (historyData || []).forEach((row) => {
        const d = row.eaten_at;
        caloriesByDay[d] = (caloriesByDay[d] || 0) + row.calories;
      });

      // Tạo mảng 7 ngày
      const history = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split("T")[0];
        const dayIndex = d.getDay(); // 0=CN,1=T2,...
        const dayLabel = dayIndex === 0 ? "CN" : DAYS[dayIndex - 1];
        return {
          day: dayLabel,
          calories: caloriesByDay[dateStr] || 0,
          isToday: dateStr === today,
        };
      });

      setWeekHistory(history);
      setLoading(false);
    }

    fetchData();
  }, []);

  // Tính tổng từ todayMeals
  const totalCalories = todayMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = todayMeals.reduce((s, m) => s + (m.protein_g || 0), 0);
  const totalCarb = todayMeals.reduce((s, m) => s + (m.carb_g || 0), 0);
  const totalFat = todayMeals.reduce((s, m) => s + (m.fat_g || 0), 0);

  const calorieTarget = user.daily_calorie_target || 1400;
  const caloriePercent = Math.min(
    Math.round((totalCalories / calorieTarget) * 100),
    100
  );
  const calorieRemaining = Math.max(calorieTarget - totalCalories, 0);

  // Macro targets (ước tính từ calorie target)
  const proteinTarget = Math.round((calorieTarget * 0.25) / 4);
  const carbTarget = Math.round((calorieTarget * 0.50) / 4);
  const fatTarget = Math.round((calorieTarget * 0.25) / 9);

  const MACROS = [
    {
      name: "Đạm",
      current: Math.round(totalProtein),
      target: proteinTarget,
      percent: Math.min(Math.round((totalProtein / proteinTarget) * 100), 100),
      colorClass: "text-emerald-500",
    },
    {
      name: "Tinh bột",
      current: Math.round(totalCarb),
      target: carbTarget,
      percent: Math.min(Math.round((totalCarb / carbTarget) * 100), 100),
      colorClass: "text-blue-500",
    },
    {
      name: "Béo",
      current: Math.round(totalFat),
      target: fatTarget,
      percent: Math.min(Math.round((totalFat / fatTarget) * 100), 100),
      colorClass: "text-orange-400",
    },
  ];

  const mealGroups = groupByMealType(todayMeals);
  const maxCaloriesInWeek = Math.max(...weekHistory.map((d) => d.calories), 1);

  return (
      <div className="flex min-h-screen bg-[#f0fff4] text-slate-900 font-[family-name:var(--font-be-vietnam)]">      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
        <main className="ml-[224px] flex-1 overflow-y-auto">
        <div className="p-10 max-w-7xl mx-auto pr-[150px]">
          {/* Đã bỏ thanh trắng lạc quẻ, làm chữ to ra bằng 2 trang kia */}
          <h2 className="text-4xl font-black text-slate-900 mb-2">
            Xin chào, {user.full_name} 👋
          </h2>
          <p className="text-slate-500 mb-10 text-lg">
            Xem tổng quan về chế độ dinh dưỡng của bạn
          </p>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-400 text-lg">
              Đang tải dữ liệu...
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* LEFT COLUMN */}
            <div className="xl:col-span-2 space-y-8">
              {/* Calorie Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                      Calo hôm nay
                    </h3>
                    <p className="text-3xl font-bold mt-1">
                      {totalCalories.toLocaleString()}{" "}
                      <span className="text-slate-400 text-lg font-normal">
                        / {calorieTarget.toLocaleString()} kcal
                      </span>
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase ${
                      calorieRemaining === 0
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {calorieRemaining === 0
                      ? "Đã đạt mục tiêu!"
                      : `CÒN LẠI ${calorieRemaining} kcal`}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        caloriePercent > 100 ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{ width: `${caloriePercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Tiến độ</span>
                    <span className="text-green-600 font-bold">
                      {caloriePercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Macro Row */}
              <div className="grid grid-cols-3 gap-4">
                {MACROS.map((macro) => (
                  <div
                    key={macro.name}
                    className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center"
                  >
                    <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 80 80"
                      >
                        <circle
                          cx="40" cy="40" fill="transparent" r="36"
                          stroke="#f1f5f9" strokeWidth="6"
                        />
                        <circle
                          className={macro.colorClass}
                          cx="40" cy="40" fill="transparent" r="36"
                          stroke="currentColor"
                          strokeDasharray="226.2"
                          strokeDashoffset={getStrokeDashOffset(macro.percent)}
                          strokeWidth="6"
                        />
                      </svg>
                      <span className="absolute text-sm font-bold">
                        {macro.percent}%
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      {macro.name}
                    </p>
                    <p className="text-sm font-bold mt-0.5">
                      {macro.current}/{macro.target}g
                    </p>
                  </div>
                ))}
              </div>

              {/* Meal Log */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 flex justify-between items-center border-b border-slate-100">
                  <h3 className="text-lg font-bold">Nhật ký bữa ăn</h3>
                  <Link href="/meals" className="text-green-600 text-sm font-semibold hover:underline">
                    + Thêm bữa ăn
                  </Link>
                </div>
                <div className="p-6 space-y-6">
                  {todayMeals.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">
                      Chưa có bữa ăn nào hôm nay. Hãy thêm bữa ăn đầu tiên!
                    </p>
                  ) : (
                    Object.entries(mealGroups).map(([type, meals]) => {
                      if (meals.length === 0) return null;
                      const totalCal = meals.reduce((s, m) => s + m.calories, 0);
                      const { label, emoji } = MEAL_LABELS[type];
                      return (
                        <div key={type}>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-slate-700">
                              {label} {emoji}
                            </h4>
                            <span className="text-slate-500 text-sm">
                              {Math.round(totalCal)} kcal
                            </span>
                          </div>
                          {meals.map((meal) => (
                            <div
                              key={meal.id}
                              className="flex items-center justify-between py-2 border-t border-slate-50"
                            >
                              <span className="text-slate-700 text-sm">
                                {meal.food_name}
                              </span>
                              <span className="text-slate-500 text-sm">
                                {Math.round(meal.calories)} kcal
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
              {/* 7-day chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">
                  Lịch sử Calo 7 ngày
                </h3>
                <div className="h-40 flex items-end justify-between gap-2 relative">
                  <div className="absolute w-full border-t border-dashed border-slate-300 top-[15%]">
                    <span className="absolute right-0 -top-4 text-[10px] text-slate-400">
                      Target {calorieTarget}
                    </span>
                  </div>
                  {weekHistory.map((item) => (
                    <div
                      key={item.day}
                      className="flex flex-col items-center flex-1 gap-2"
                    >
                      <div
                        className={`w-full rounded-t ${
                          item.isToday
                            ? "bg-green-500"
                            : "bg-slate-100"
                        }`}
                        style={{
                          height: `${Math.round(
                            (item.calories / maxCaloriesInWeek) * 100
                          )}%`,
                          minHeight: item.calories > 0 ? "4px" : "0",
                        }}
                      />
                      <span
                        className={`text-xs font-medium ${
                          item.isToday
                            ? "text-green-600 font-bold"
                            : "text-slate-400"
                        }`}
                      >
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Add */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold mb-4">Thêm bữa ăn nhanh</h3>
                <div className="grid grid-cols-2 gap-3">
                  {["Bữa sáng", "Bữa trưa", "Bữa tối", "Bữa phụ"].map(
                    (label) => (
                      <Link
                        key={label}
                        href="/meals"
                        className="flex items-center justify-center gap-2 p-3 border border-green-500 text-green-600 rounded-lg text-sm font-bold hover:bg-green-500 hover:text-white transition-all"
                      >
                        + {label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </main>
    </div>
  );
}