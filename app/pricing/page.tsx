"use client";

import Link from "next/link";
import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";

const PLANS = [
  {
    id: "free",
    name: "Nutri-Free",
    tagline: "Bắt đầu hành trình sức khỏe",
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: "border-slate-200",
    headerBg: "bg-white",
    badge: null,
    cta: "Dùng miễn phí",
    ctaStyle: "border-2 border-slate-300 text-slate-700 hover:border-green-400 hover:text-green-600",
    features: [
      { text: "Theo dõi Calo & Macro cơ bản", available: true },
      { text: "15 lượt AI gợi ý món ăn / tuần", available: true },
      { text: "Database 500+ món ăn Việt Nam", available: true },
      { text: "Dashboard cơ bản", available: true },
      { text: "Nhật ký bữa ăn hàng ngày", available: true },
      { text: "Kế hoạch ăn 7 ngày tự động", available: false },
      { text: "Danh sách đi chợ tự động", available: false },
      { text: "Báo cáo dinh dưỡng qua email", available: false },
      { text: "Phân tích xu hướng 30 ngày", available: false },
      { text: "Xuất báo cáo PDF cá nhân", available: false },
    ],
  },
  {
    id: "pro",
    name: "Nutri-Pro",
    tagline: "Cho người nghiêm túc với sức khỏe",
    monthlyPrice: 79000,
    yearlyPrice: 65000,
    color: "border-green-500",
    headerBg: "bg-green-500",
    badge: "Phổ biến nhất",
    cta: "Dùng thử 7 ngày miễn phí",
    ctaStyle: "bg-green-500 text-white hover:bg-green-600",
    features: [
      { text: "Theo dõi Calo & Macro cơ bản", available: true },
      { text: "AI gợi ý món ăn không giới hạn", available: true },
      { text: "Database 500+ món ăn Việt Nam", available: true },
      { text: "Dashboard nâng cao", available: true },
      { text: "Nhật ký bữa ăn hàng ngày", available: true },
      { text: "Kế hoạch ăn 7 ngày tự động", available: true },
      { text: "Danh sách đi chợ tự động", available: true },
      { text: "Báo cáo dinh dưỡng qua email", available: true },
      { text: "Phân tích xu hướng 30 ngày", available: true },
      { text: "Xuất báo cáo PDF cá nhân", available: false },
    ],
  },
  {
    id: "elite",
    name: "Nutri-Elite",
    tagline: "Tối ưu hóa hoàn toàn",
    monthlyPrice: 159000,
    yearlyPrice: 129000,
    color: "border-slate-800",
    headerBg: "bg-slate-900",
    badge: null,
    cta: "Dùng thử 7 ngày miễn phí",
    ctaStyle: "bg-slate-900 text-white hover:bg-slate-800",
    features: [
      { text: "Tất cả tính năng Nutri-Pro", available: true },
      { text: "AI cá nhân hóa theo thể trạng đặc biệt", available: true },
      { text: "Smart Warning — cảnh báo lệch chế độ", available: true },
      { text: "Xuất báo cáo PDF cá nhân đẹp", available: true },
      { text: "Tối ưu thực đơn theo ngân sách", available: true },
      { text: "Nhắc nhở thông minh theo lịch cá nhân", available: true },
      { text: "Ưu tiên xử lý AI nhanh hơn", available: true },
      { text: "Hỗ trợ ưu tiên 24/7", available: true },
      { text: "Early access tính năng mới", available: true },
      { text: "Phân tích dinh dưỡng vi chất chi tiết", available: true },
    ],
  },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none"
      stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4 text-slate-300 shrink-0" fill="none"
      stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function formatPrice(price: number) {
  if (price === 0) return "0";
  return price.toLocaleString("vi-VN");
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f0fff4] text-slate-900 font-[family-name:var(--font-be-vietnam)]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-14">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Chọn gói phù hợp với bạn
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Bắt đầu miễn phí, nâng cấp khi bạn sẵn sàng.
              Hủy bất kỳ lúc nào, không ràng buộc.
            </p>

            {/* Toggle Monthly / Yearly */}
            <div className="inline-flex items-center gap-3 mt-8 bg-white border border-slate-200 rounded-full px-2 py-2 shadow-sm">
              <button
                type="button"
                onClick={() => setIsYearly(false)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  !isYearly
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Theo tháng
              </button>
              <button
                type="button"
                onClick={() => setIsYearly(true)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  isYearly
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Theo năm
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                  Tiết kiệm 18%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => {
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              const isPro = plan.id === "pro";

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-3xl border-2 ${plan.color} overflow-hidden shadow-sm ${
                    isPro ? "shadow-green-100 shadow-lg scale-[1.02]" : ""
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                      {plan.badge}
                    </div>
                  )}

                  {/* Header */}
                  <div className={`${plan.headerBg} px-6 pt-6 pb-8`}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                      isPro ? "text-green-100" : plan.id === "elite" ? "text-slate-400" : "text-slate-400"
                    }`}>
                      {plan.tagline}
                    </p>
                    <h2 className={`text-2xl font-extrabold mb-4 ${
                      isPro || plan.id === "elite" ? "text-white" : "text-slate-900"
                    }`}>
                      {plan.name}
                    </h2>

                    {/* Price */}
                    <div className="flex items-end gap-1">
                      <span className={`text-4xl font-black tracking-tight ${
                        isPro || plan.id === "elite" ? "text-white" : "text-slate-900"
                      }`}>
                        {price === 0 ? "0" : formatPrice(price)}
                      </span>
                      <span className={`text-sm mb-1.5 ${
                        isPro || plan.id === "elite" ? "text-white/70" : "text-slate-400"
                      }`}>
                        {price === 0 ? "" : "đ"}
                        {price > 0 && (
                          <span className="block text-xs">
                            {isYearly ? "/ tháng · tính theo năm" : "/ tháng"}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Yearly saving note */}
                    {isYearly && plan.yearlyPrice > 0 && (
                      <p className={`text-xs mt-2 ${
                        isPro ? "text-green-100" : "text-slate-400"
                      }`}>
                        Tương đương {formatPrice(plan.yearlyPrice * 12)}đ / năm
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="px-6 py-4 border-b border-slate-100">
                    <Link
                      href="/register"
                      className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${plan.ctaStyle}`}
                    >
                      {plan.cta}
                    </Link>
                  </div>

                  {/* Features */}
                  <div className="px-6 py-5 space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {feature.available ? <CheckIcon /> : <XIcon />}
                        <span className={`text-sm ${
                          feature.available ? "text-slate-700" : "text-slate-300"
                        } ${i === 0 && plan.id !== "free" ? "font-semibold" : ""}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom note */}
          <div className="mt-12 text-center space-y-2">
            <p className="text-slate-400 text-sm">
              * Tất cả gói đều có thể hủy bất kỳ lúc nào. Không tính phí ẩn.
            </p>
            <p className="text-slate-400 text-sm">
              🚧 NutriAI đang trong giai đoạn thử nghiệm — giá có thể thay đổi khi ra mắt chính thức.
            </p>
            <p className="text-slate-500 text-sm mt-4">
              Có câu hỏi?{" "}
              <a href="mailto:hello@nutriai.vn" className="text-green-600 font-semibold hover:underline">
                Liên hệ chúng tôi
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}