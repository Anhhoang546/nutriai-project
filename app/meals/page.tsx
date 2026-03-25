"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/app/components/Sidebar";
interface FoodItem {
  food_id: number;
  name: string;
  calories_per_100g: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
}

interface MealLog {
  id: number;
  food_name: string;
  meal_type: string;
  amount_g: number;
  calories: number;
  eaten_at: string;
}

interface NutritionToday {
  calories: number;
  protein: number;
  carb: number;
  fat: number;
  fiber: number;
  target: number;
}

const MEAL_TYPES = [
  { id: "breakfast", label: "Sáng", icon: "☀️" },
  { id: "lunch", label: "Trưa", icon: "🌤" },
  { id: "dinner", label: "Tối", icon: "🌙" },
  { id: "snack", label: "Phụ", icon: "🍎" },
];

export default function MealsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedMeal, setSelectedMeal] = useState("breakfast");
  const [grams, setGrams] = useState("");
  const [todayMeals, setTodayMeals] = useState<MealLog[]>([]);
  const [nutrition, setNutrition] = useState<NutritionToday>({
    calories: 0, protein: 0, carb: 0, fat: 0, fiber: 0, target: 1400,
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Lấy user_id từ localStorage
  const userId = typeof window !== "undefined"
    ? localStorage.getItem("nutriai_user_id")
    : null;

  // Load bữa ăn hôm nay + nutrition target khi vào trang
  useEffect(() => {
    if (!userId) return;
    fetchTodayData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function fetchTodayData() {
    // Lấy target calories từ bảng users
    const { data: userData } = await supabase
      .from("users")
      .select("daily_calorie_target")
      .eq("user_id", userId)
      .single();

    // Lấy bữa ăn hôm nay
    const { data: mealsData } = await supabase
      .from("meal_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("eaten_at", today);

    const meals = mealsData || [];
    setTodayMeals(meals);

    // Tính tổng dinh dưỡng
    setNutrition({
      calories: meals.reduce((s, m) => s + (m.calories || 0), 0),
      protein: meals.reduce((s, m) => s + (m.protein_g || 0), 0),
      carb: meals.reduce((s, m) => s + (m.carb_g || 0), 0),
      fat: meals.reduce((s, m) => s + (m.fat_g || 0), 0),
      fiber: 0,
      target: userData?.daily_calorie_target || 1400,
    });
  }

  // Tìm kiếm món ăn trong Supabase
  async function handleSearch(query: string) {
    setSearchQuery(query);
    setSelectedFood(null);
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }
    const { data } = await supabase
      .from("food_items")
      .select("food_id, name, calories_per_100g, protein_g, carb_g, fat_g")
      .ilike("name", `%${query}%`)
      .limit(6);
    setSearchResults(data || []);
  }

  // Chọn món ăn từ kết quả tìm kiếm
  function selectFood(food: FoodItem) {
    setSelectedFood(food);
    setSearchQuery(food.name);
    setSearchResults([]);
  }

  // Tính calories preview
  const previewCalories = selectedFood && grams
    ? Math.round((selectedFood.calories_per_100g * parseFloat(grams)) / 100)
    : null;

  // Thêm bữa ăn vào Supabase
  async function handleAddMeal() {
    if (!selectedFood || !grams || !userId) {
      alert("Vui lòng chọn món ăn và nhập số gram!");
      return;
    }
    setLoading(true);
    const g = parseFloat(grams);
    const { error } = await supabase.from("meal_logs").insert({
      user_id: userId,
      food_id: selectedFood.food_id,
      food_name: selectedFood.name,
      meal_type: selectedMeal,
      amount_g: g,
      calories: Math.round((selectedFood.calories_per_100g * g) / 100),
      protein_g: Math.round((selectedFood.protein_g * g) / 100 * 10) / 10,
      carb_g: Math.round((selectedFood.carb_g * g) / 100 * 10) / 10,
      fat_g: Math.round((selectedFood.fat_g * g) / 100 * 10) / 10,
      eaten_at: today,
    });

    if (error) {
      alert("Lỗi khi thêm bữa ăn: " + error.message);
    } else {
      setSuccessMsg(`Đã thêm ${selectedFood.name} vào nhật ký! ✅`);
      setTimeout(() => setSuccessMsg(""), 3000);
      setSearchQuery("");
      setSelectedFood(null);
      setGrams("");
      fetchTodayData(); // Reload data
    }
    setLoading(false);
  }

  // Xóa bữa ăn
  async function handleDelete(id: number) {
    await supabase.from("meal_logs").delete().eq("id", id);
    fetchTodayData();
  }

  return (
    <div className="flex min-h-screen bg-[#f0fff4] text-slate-900 font-[family-name:var(--font-be-vietnam)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
        <main className="ml-[224px] flex-1 overflow-y-auto">
        <div className="p-10 max-w-5xl mx-auto pr-[224px]">
          <h2 className="text-4xl font-black text-slate-900 mb-2">
            Ghi nhận bữa ăn
          </h2>
          <p className="text-slate-500 mb-10 text-lg">
            Thêm món ăn vào nhật ký dinh dưỡng hàng ngày
          </p>
          {/* Nutrition Summary */}
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
            <div className="mb-3">
              <p className="text-sm text-slate-600 mb-1">
                Calo hôm nay:{" "}
                <span className="font-bold">
                  {Math.round(nutrition.calories).toLocaleString()} /{" "}
                  {nutrition.target.toLocaleString()} kcal
                </span>
                {" — "}
                <span className={nutrition.calories > nutrition.target
                  ? "font-bold text-red-500"
                  : "font-bold text-green-600"
                }>
                  {nutrition.calories <= nutrition.target
                    ? `Còn lại ${Math.round(nutrition.target - nutrition.calories)} kcal`
                    : `Vượt ${Math.round(nutrition.calories - nutrition.target)} kcal`}
                </span>
              </p>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (nutrition.calories / nutrition.target) * 100)}%`,
                    backgroundColor: nutrition.calories > nutrition.target ? "#ef4444" : "#2E9B57",
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Chất đạm", current: Math.round(nutrition.protein), target: 100, color: "bg-green-500" },
                { label: "Tinh bột", current: Math.round(nutrition.carb), target: 200, color: "bg-blue-500" },
                { label: "Chất béo", current: Math.round(nutrition.fat), target: 60, color: "bg-orange-400" },
                { label: "Chất xơ", current: Math.round(nutrition.fiber), target: 25, color: "bg-violet-500" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl border border-slate-100 p-3">
                  <p className="text-xs font-semibold text-slate-400 mb-1">{m.label}</p>
                  <p className="text-sm font-bold">{m.current} / {m.target}g</p>
                  <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.color}`}
                      style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Add Meal */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
            <h3 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-4">
              Thêm món ăn
            </h3>

            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
                {successMsg}
              </div>
            )}

            <div className="space-y-4">
              {/* Search box */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Tìm kiếm món ăn... (VD: cơm, phở, trứng)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none"
                />
                {/* Dropdown kết quả */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-10 mt-1 overflow-hidden">
                    {searchResults.map((food) => (
                      <button
                        key={food.food_id}
                        type="button"
                        onClick={() => selectFood(food)}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <span className="font-medium text-slate-800">{food.name}</span>
                        <span className="text-slate-400 text-sm ml-2">
                          {food.calories_per_100g} kcal/100g
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Preview calories */}
              {selectedFood && grams && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm">
                  <span className="font-bold text-green-700">
                    {selectedFood.name} {grams}g
                  </span>
                  <span className="text-green-600"> = </span>
                  <span className="font-bold text-green-700 text-lg">
                    {previewCalories} kcal
                  </span>
                </div>
              )}

              {/* Bữa + Gram */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Chọn bữa
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {MEAL_TYPES.map((meal) => (
                      <button
                        key={meal.id}
                        type="button"
                        onClick={() => setSelectedMeal(meal.id)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          selectedMeal === meal.id
                            ? "bg-green-500 text-white"
                            : "border border-green-300 text-slate-600 hover:bg-green-50"
                        }`}
                      >
                        {meal.icon} {meal.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Số gram
                  </label>
                  <input
                    type="number"
                    value={grams}
                    onChange={(e) => setGrams(e.target.value)}
                    placeholder="VD: 200"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddMeal}
                disabled={loading || !selectedFood || !grams}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? "Đang thêm..." : "➕ Thêm vào nhật ký"}
              </button>
            </div>
          </section>

          {/* Danh sách bữa ăn hôm nay */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              📅 Bữa ăn hôm nay
            </h3>
            {todayMeals.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                Chưa có bữa ăn nào. Thêm món ăn ở trên!
              </div>
            ) : (
              <div className="space-y-3">
                {todayMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-slate-100"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                      🍽️
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{meal.food_name}</h4>
                      <p className="text-sm text-slate-400">
                        {MEAL_TYPES.find(m => m.id === meal.meal_type)?.label || meal.meal_type}
                        {" • "}{meal.amount_g}g • {Math.round(meal.calories)} kcal
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(meal.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}