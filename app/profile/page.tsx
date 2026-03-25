"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/app/components/Sidebar";

interface UserProfile {
  full_name: string;
  email: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  goal: string;
  activity_level: string;
  bmr: number;
  tdee: number;
  daily_calorie_target: number;
}

const GOAL_LABELS: Record<string, string> = {
  lose_weight: "Giảm cân",
  gain_muscle: "Tăng cơ",
  maintain: "Duy trì vóc dáng",
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "Ít vận động (Văn phòng)",
  light: "Vận động nhẹ (1-2 lần/tuần)",
  moderate: "Vận động vừa (3-5 lần/tuần)",
  active: "Vận động mạnh (Hàng ngày)",
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Edit state
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("");
  const [activity, setActivity] = useState("");

  const userId = typeof window !== "undefined"
    ? localStorage.getItem("nutriai_user_id") : null;

  useEffect(() => {
    if (!userId) { router.push("/login"); return; }
    async function load() {
      const { data } = await supabase.from("users").select("*")
        .eq("user_id", userId).single();
      if (data) {
        setProfile(data);
        setWeight(String(data.weight_kg));
        setHeight(String(data.height_cm));
        setGoal(data.goal);
        setActivity(data.activity_level);
      }
      setLoading(false);
    }
    load();
  }, [userId, router]);

  async function handleSave() {
    if (!userId) return;
    setSaving(true);

    // Tính lại BMR/TDEE
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const age = profile?.age || 25;
    const gender = profile?.gender || "female";
    const base = 10 * w + 6.25 * h - 5 * age;
    const bmr = gender === "male" ? base + 5 : base - 161;
    const multipliers: Record<string, number> = {
      sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725
    };
    const tdee = bmr * (multipliers[activity] || 1.2);
    const adjustments: Record<string, number> = {
      lose_weight: -500, gain_muscle: 300, maintain: 0
    };
    const target = tdee + (adjustments[goal] || 0);

    const { error } = await supabase.from("users").update({
      weight_kg: w,
      height_cm: h,
      goal,
      activity_level: activity,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      daily_calorie_target: Math.round(target),
    }).eq("user_id", userId);

    if (!error) {
      setSuccessMsg("Đã cập nhật thông tin! ✅");
      setTimeout(() => setSuccessMsg(""), 3000);
      // Reload profile
      const { data } = await supabase.from("users").select("*")
        .eq("user_id", userId).single();
      if (data) setProfile(data);
    }
    setSaving(false);
  }

  if (loading) return (
    <div className="flex min-h-screen" style={{ fontFamily: "var(--font-landing), sans-serif" }}>
      <Sidebar />
      <main className="flex-1 flex items-center justify-center text-slate-400">Đang tải...</main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f0fff4] font-[family-name:var(--font-be-vietnam)]">
      <Sidebar />
      <main className="flex-1 p-10 max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Hồ sơ cá nhân</h2>
        <p className="text-slate-500 mb-8">Cập nhật thông tin để tính chính xác calories mục tiêu</p>

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            {successMsg}
          </div>
        )}

        {/* Thông tin cố định */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <h3 className="font-bold text-slate-700 mb-4">Thông tin tài khoản</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: "Họ tên", value: profile?.full_name },
              { label: "Email", value: profile?.email },
              { label: "Tuổi", value: `${profile?.age} tuổi` },
              { label: "Giới tính", value: profile?.gender === "male" ? "Nam" : "Nữ" },
            ].map(item => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                <p className="font-semibold text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chỉ số tính toán */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <h3 className="font-bold text-slate-700 mb-4">Chỉ số dinh dưỡng</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "BMR", value: profile?.bmr, unit: "kcal/ngày" },
              { label: "TDEE", value: profile?.tdee, unit: "kcal/ngày" },
              { label: "Mục tiêu", value: profile?.daily_calorie_target, unit: "kcal/ngày" },
            ].map(item => (
              <div key={item.label} className="rounded-xl p-3"
                style={{ backgroundColor: "var(--color-accent)" }}>
                <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                <p className="text-xl font-black" style={{ color: "var(--color-primary)" }}>
                  {item.value?.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">{item.unit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chỉnh sửa */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-4">Cập nhật thông tin</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Cân nặng (kg)
                </label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 outline-none text-sm"
                  style={{ "--tw-ring-color": "var(--color-primary)" } as React.CSSProperties} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Chiều cao (cm)
                </label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Mục tiêu sức khỏe
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(GOAL_LABELS).map(([val, label]) => (
                  <button key={val} type="button" onClick={() => setGoal(val)}
                    className="py-2.5 rounded-xl text-sm font-medium border-2 transition-all"
                    style={goal === val
                      ? { borderColor: "var(--color-primary)", backgroundColor: "var(--color-accent)", color: "var(--color-primary)" }
                      : { borderColor: "#e2e8f0", color: "#475569" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Mức độ vận động
              </label>
              <select value={activity} onChange={e => setActivity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm">
                {Object.entries(ACTIVITY_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "var(--color-primary)" }}>
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}