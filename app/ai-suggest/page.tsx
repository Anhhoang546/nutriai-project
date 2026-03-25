"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/app/components/Sidebar";

// ── TYPES ─────────────────────────────────────────────────────
interface Nutrition {
  protein_g: number;
  carb_g: number;
  fat_g: number;
  fiber_g: number;
}

interface Recipe {
  name: string;
  calories: number;
  prep_time: string;
  difficulty: string;
  ingredients_available: string[];
  ingredients_needed: string[];
  instructions: string;
  nutrition: Nutrition;
  why_recommend: string;
  tip: string;
}

const DIET_OPTIONS = ["Thường", "Chay", "Thuần chay", "Keto", "Low-carb"];
const COOKING_OPTIONS = ["Luộc", "Hấp", "Xào", "Nướng"];
const TIME_OPTIONS = ["<15 phút", "15-30 phút", ">30 phút"];
const FREE_LIMIT = 15;

const MEAL_TYPE_OPTIONS = [
  { id: "breakfast", label: "Bữa sáng", icon: "☀️" },
  { id: "lunch", label: "Bữa trưa", icon: "🌤" },
  { id: "dinner", label: "Bữa tối", icon: "🌙" },
  { id: "snack", label: "Bữa phụ", icon: "🍎" },
];

const CONDIMENT_KEYWORDS = [
  "muối", "tiêu", "đường", "dầu", "nước mắm", "tương", "ớt", "gừng bột",
  "bột ngọt", "hạt nêm", "giấm", "tỏi bột", "quế", "hồi", "mì chính",
  "bơ", "sốt", "mayonnaise", "mustard", "ketchup", "thìa", "muỗng", "thìa cà phê"
];

function isCondiment(ingredient: string): boolean {
  const lower = ingredient.toLowerCase();
  return CONDIMENT_KEYWORDS.some(k => lower.includes(k)) ||
    lower.includes("muỗng") || lower.includes("thìa") ||
    lower.includes("ml") || lower.includes("g dầu");
}

function formatInstructions(text: string): string[] {
  if (!text) return [];
  const byStep = text.split(/(?=Bước \d+:|(?<!\d)\d+\.\s)/);
  if (byStep.length > 1) return byStep.map(s => s.trim()).filter(Boolean);
  return text.split(/\.\s+(?=[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ])/i)
    .map(s => s.trim())
    .filter(s => s.length > 5)
    .map((s, i) => `Bước ${i + 1}: ${s.endsWith('.') ? s : s + '.'}`);
}

export default function AISuggestPage() {
  const [ingredients, setIngredients] = useState<string[]>(["Trứng", "Cà chua", "Hành tây"]);
  const [inputIngredient, setInputIngredient] = useState("");
  const [calorieValue, setCalorieValue] = useState(600);
  const [selectedDiet, setSelectedDiet] = useState("Thường");
  const [selectedCooking, setSelectedCooking] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [extraNote, setExtraNote] = useState("");

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasResult, setHasResult] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedMealType, setSelectedMealType] = useState("lunch");
  const [successMsg, setSuccessMsg] = useState("");

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("nutriai_user_id")
      : null;

  useEffect(() => {
    if (!userId) return;
    async function loadUsage() {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const { count } = await supabase
        .from("ai_requests")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", sevenDaysAgo.toISOString());
      setUsageCount(count || 0);
    }
    loadUsage();
  }, [userId]);

  function addIngredient() {
    const trimmed = inputIngredient.trim();
    if (!trimmed || ingredients.includes(trimmed)) return;
    setIngredients(prev => [...prev, trimmed]);
    setInputIngredient("");
  }

  function removeIngredient(ing: string) {
    setIngredients(prev => prev.filter(i => i !== ing));
  }

  function toggleCooking(opt: string) {
    setSelectedCooking(prev =>
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    );
  }

  async function handleSuggest() {
    if (ingredients.length === 0) {
      setError("Vui lòng nhập ít nhất 1 nguyên liệu!");
      return;
    }
    if (usageCount >= FREE_LIMIT) {
      setError(`Bạn đã dùng hết ${FREE_LIMIT} lượt miễn phí tuần này!`);
      return;
    }
    setLoading(true);
    setError("");
    setHasResult(false);
    setRecipes([]);

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients, calorieLimit: calorieValue,
          dietType: selectedDiet, cookingMethods: selectedCooking,
          timeLimit: selectedTime, extraNote,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Có lỗi xảy ra, vui lòng thử lại!");
        return;
      }
      setRecipes(data.recipes || []);
      setHasResult(true);
      if (userId) {
        await supabase.from("ai_requests").insert({
          user_id: userId,
          request_type: "recipe_suggest",
          input_data: { ingredients, calorie_limit: calorieValue },
          output_data: data,
          tokens_used: 0,
          model_used: "llama-3.3-70b-versatile",
          status: "success",
        });
        setUsageCount(prev => prev + 1);
      }
    } catch {
      setError("Mất kết nối, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }

  function openAddModal(recipe: Recipe) {
    setSelectedRecipe(recipe);
    setSelectedMealType("lunch");
    setShowMealModal(true);
  }

  async function confirmAddToLog() {
    if (!selectedRecipe || !userId) return;
    const today = new Date().toISOString().split("T")[0];
    const { error: dbErr } = await supabase.from("meal_logs").insert({
      user_id: userId,
      food_name: selectedRecipe.name,
      meal_type: selectedMealType,
      amount_g: 300,
      calories: selectedRecipe.calories,
      protein_g: selectedRecipe.nutrition.protein_g,
      carb_g: selectedRecipe.nutrition.carb_g,
      fat_g: selectedRecipe.nutrition.fat_g,
      eaten_at: today,
    });
    setShowMealModal(false);
    if (!dbErr) {
      const mealLabel = MEAL_TYPE_OPTIONS.find(m => m.id === selectedMealType)?.label;
      setSuccessMsg(`Đã thêm "${selectedRecipe.name}" vào ${mealLabel}! ✅`);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  }

  const usagePercent = Math.round((usageCount / FREE_LIMIT) * 100);
  const remaining = FREE_LIMIT - usageCount;

  return (
    // Đã FIX: Trả lại nền xanh #f0fff4, và ép font Be Vietnam Pro vào đây
    <div className="flex min-h-screen bg-[#f0fff4] text-slate-900 font-[family-name:var(--font-be-vietnam)]">

      {/* ── MODAL CHỌN BỮA ĂN ─────────────────────────────── */}
      {showMealModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-1">Thêm vào nhật ký</h3>
            <p className="text-slate-500 text-sm mb-6">Chọn bữa ăn cho <strong>{selectedRecipe.name}</strong></p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {MEAL_TYPE_OPTIONS.map(meal => (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => setSelectedMealType(meal.id)}
                  className={`py-4 rounded-2xl font-bold text-sm flex flex-col items-center gap-1 transition-all border-2 ${
                    selectedMealType === meal.id
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-green-300"
                  }`}
                >
                  <span className="text-2xl">{meal.icon}</span>
                  {meal.label}
                </button>
              ))}
            </div>
            <div className="bg-green-50 rounded-2xl px-4 py-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-green-700">{selectedRecipe.name}</span>
                <span className="text-sm font-black text-green-600">{selectedRecipe.calories} kcal</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Đạm {selectedRecipe.nutrition.protein_g}g · Carb {selectedRecipe.nutrition.carb_g}g · Béo {selectedRecipe.nutrition.fat_g}g
              </p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowMealModal(false)} className="flex-1 py-3 border-2 border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-colors">Hủy</button>
              <button type="button" onClick={confirmAddToLog} className="flex-1 py-3 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-colors">✅ Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <Sidebar />

      {/* ── MAIN ────────────────────────────────────────────── */}
      {/* Đã FIX: Chỉnh ml-[256px] (chuẩn w-64 của Tailwind) để màn hình không bị đẩy lệch */}
      <main className="ml-[224px] flex-1 overflow-y-auto">
        <div className="p-10 max-w-5xl mx-auto pr-[224px]">
          <h2 className="text-4xl font-black text-slate-900 mb-2">
            Gợi ý món ăn bằng AI ✨
          </h2>
          <p className="text-slate-500 mb-10 text-lg">
            Nhập nguyên liệu bạn có, AI sẽ thiết kế bữa ăn hoàn hảo
          </p>

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">

              {/* LEFT */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-3">🥦 Nguyên liệu hiện có</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {ingredients.map(ing => (
                      <span key={ing} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                        {ing}
                        <button type="button" onClick={() => removeIngredient(ing)} className="ml-1 text-green-500 hover:text-red-500 font-bold text-base leading-none">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputIngredient}
                      onChange={e => setInputIngredient(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addIngredient()}
                      placeholder="Gõ nguyên liệu + Enter để thêm..."
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none text-sm"
                    />
                    <button type="button" onClick={addIngredient} className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors">
                      + Thêm
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chế độ ăn</p>
                  <div className="flex flex-wrap gap-2">
                    {DIET_OPTIONS.map(opt => (
                      <button key={opt} type="button" onClick={() => setSelectedDiet(opt)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedDiet === opt ? "bg-green-500 text-white" : "border border-green-400 text-slate-600 hover:bg-green-50"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cách nấu ưa thích</p>
                  <div className="flex flex-wrap gap-2">
                    {COOKING_OPTIONS.map(opt => (
                      <button key={opt} type="button" onClick={() => toggleCooking(opt)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCooking.includes(opt) ? "bg-green-500 text-white" : "border border-green-400 text-slate-600 hover:bg-green-50"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thời gian nấu</p>
                  <div className="flex flex-wrap gap-2">
                    {TIME_OPTIONS.map(opt => (
                      <button key={opt} type="button" onClick={() => setSelectedTime(selectedTime === opt ? "" : opt)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTime === opt ? "bg-green-500 text-white" : "border border-green-400 text-slate-600 hover:bg-green-50"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Yêu cầu khác (tùy chọn)</p>
                  <textarea value={extraNote} onChange={e => setExtraNote(e.target.value)} placeholder="VD: không dùng hành, ít dầu mỡ..." rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-500 outline-none text-sm resize-none" />
                </div>
              </div>

              {/* RIGHT: Calorie */}
              <div>
                <h3 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-4">🔥 Giới hạn Calories</h3>
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <div className="text-center mb-6">
                    <span className="text-5xl font-black text-green-600">{calorieValue}</span>
                    <span className="text-xl text-green-500 font-bold"> kcal</span>
                    <p className="text-slate-400 text-sm mt-1">tối đa mỗi bữa</p>
                  </div>
                  {/* Đã FIX: Thêm class bg-green-200 để thanh trượt hiện rõ nền, không bị tàng hình */}
                  <input type="range" min={200} max={1500} step={50} value={calorieValue}
                    onChange={e => setCalorieValue(Number(e.target.value))}
                    className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between mt-2 text-xs text-slate-400">
                    <span>200 kcal</span>
                    <span>1500 kcal</span>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs font-bold text-slate-400 mb-3">Chọn nhanh:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ label: "Nhẹ 🥗", value: 300 }, { label: "Vừa 🍱", value: 500 }, { label: "No 🍚", value: 700 }, { label: "Nhiều 🍖", value: 1000 }].map(preset => (
                        <button key={preset.value} type="button" onClick={() => setCalorieValue(preset.value)} className={`py-2 rounded-xl text-sm font-bold transition-colors ${calorieValue === preset.value ? "bg-green-500 text-white" : "bg-white border border-green-200 text-slate-600 hover:bg-green-50"}`}>
                          {preset.label}
                          <span className="block text-xs font-normal">{preset.value} kcal</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm font-medium">⚠️ {error}</div>}

            <button type="button" onClick={handleSuggest} disabled={loading || usageCount >= FREE_LIMIT} className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-green-500/30 transition-all active:scale-[0.98]">
              {loading ? <><span className="animate-spin inline-block">⟳</span> AI đang phân tích... vui lòng chờ</> : <>✨ Gợi ý món ăn ngay <span className="text-sm font-normal opacity-80">(còn {remaining} lượt)</span></>}
            </button>
          </section>

          {successMsg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">{successMsg}</div>}

          {hasResult && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">🍽️ Kết quả gợi ý từ AI</h3>
                <span className="text-sm text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">{recipes.length} món phù hợp</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recipes.map((recipe, idx) => {
                  const steps = formatInstructions(recipe.instructions);
                  const mainIngredients = recipe.ingredients_needed?.filter(i => !isCondiment(i)) || [];
                  const condiments = recipe.ingredients_needed?.filter(i => isCondiment(i)) || [];
                  return (
                    <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 text-white">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex gap-2 text-xs">
                            <span className="bg-white/20 px-2 py-1 rounded-full">⏱ {recipe.prep_time}</span>
                            <span className="bg-white/20 px-2 py-1 rounded-full">👨‍🍳 {recipe.difficulty}</span>
                          </div>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">#{idx + 1}</span>
                        </div>
                        <h4 className="text-lg font-extrabold leading-tight mb-2">{recipe.name}</h4>
                        <p className="text-3xl font-black">{recipe.calories} <span className="text-sm font-normal opacity-80">kcal</span></p>
                      </div>
                      <div className="p-5 flex-1 space-y-4">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          {[{ label: "Đạm", value: recipe.nutrition.protein_g, color: "text-green-600", bg: "bg-green-50" }, { label: "Carb", value: recipe.nutrition.carb_g, color: "text-blue-600", bg: "bg-blue-50" }, { label: "Béo", value: recipe.nutrition.fat_g, color: "text-orange-500", bg: "bg-orange-50" }].map(m => (
                            <div key={m.label} className={`${m.bg} rounded-xl py-2`}>
                              <p className={`text-base font-black ${m.color}`}>{m.value}g</p>
                              <p className="text-xs text-slate-400">{m.label}</p>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-green-600 uppercase mb-2">✅ Nguyên liệu có sẵn</p>
                          <div className="flex flex-wrap gap-1">
                            {recipe.ingredients_available?.map((ing, i) => <span key={i} className="text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded-lg">{ing}</span>)}
                          </div>
                        </div>
                        {mainIngredients.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-orange-500 uppercase mb-2">🛒 Cần mua thêm</p>
                            <div className="flex flex-wrap gap-1">
                              {mainIngredients.map((ing, i) => <span key={i} className="text-xs bg-orange-50 border border-orange-200 text-orange-600 px-2 py-1 rounded-lg">{ing}</span>)}
                            </div>
                          </div>
                        )}
                        {condiments.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">🧂 Gia vị</p>
                            <p className="text-xs text-slate-500">{condiments.map(c => c.split(" - ")[0]).join(" · ")}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase mb-2">Cách thực hiện</p>
                          <div className="space-y-2">
                            {steps.map((step, i) => (
                              <div key={i} className="flex gap-2 text-sm text-slate-600">
                                <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-700 rounded-full text-xs flex items-center justify-center font-bold mt-0.5">{i + 1}</span>
                                <span className="leading-relaxed">{step.replace(/^Bước \d+:\s*/i, "").replace(/^\d+\.\s*/, "")}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {recipe.tip && (
                          <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2">
                            <p className="text-xs text-yellow-700">💡 {recipe.tip}</p>
                          </div>
                        )}
                      </div>
                      <div className="p-5 pt-0">
                        <button type="button" onClick={() => openAddModal(recipe)} className="w-full border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm">
                          ➕ Thêm vào nhật ký hôm nay
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {!hasResult && !loading && (
            <div className="text-center py-20">
              <div className="text-8xl mb-4">🤖</div>
              <p className="text-xl font-bold text-slate-400">AI đang chờ nguyên liệu của bạn!</p>
              <p className="text-slate-300 mt-2">Nhập nguyên liệu và nhấn gợi ý để bắt đầu</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}