"use client";

import Link from "next/link";
import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";

// --- MOCK DATA (Áp dụng tư duy tách data từ Claude AI) ---
// Dữ liệu mẫu cho Góc Chuyên Gia (Sẽ bị làm mờ nhẹ)
const MOCK_BLOGS = [
  { id: 1, title: "Hệ thống DASH Diet: Chìa khóa kiểm soát huyết áp", author: "NutriAI Expert", date: "Jan 10, 2026", image: "https://via.placeholder.com/300x180.png/2e9b57/ffffff?text=DASH+Diet" },
  { id: 2, title: "Hiểu đúng về Intermittent Fasting (Nhịn ăn gián đoạn)", author: "NutriAI Expert", date: "Jan 12, 2026", image: "https://via.placeholder.com/300x180.png/2e9b57/ffffff?text=IF" },
];

// Dữ liệu mẫu cho Bếp Nhà Nutri (Sẽ bị làm mờ nhẹ)
const MOCK_USER_POSTS = [
  { id: 1, title: "Bữa sáng 10 phút: Healthy Oats & Trứng", author: "Hà Thị Oanh", likes: 112, image: "https://via.placeholder.com/300x180.png/4ade80/ffffff?text=Bữa+Sáng" },
  { id: 2, title: "Guilt-free Dessert: Bánh Mousse Bơ", author: "Phạm Lê Khuê", likes: 89, image: "https://via.placeholder.com/300x180.png/4ade80/ffffff?text=Dessert" },
];

// Icon Clock (Sử dụng cách tách Micro-component từ Claude AI)
function ClockIcon() {
  return (
    <svg className="w-8 h-8 text-green-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// Bố cục khung cho từng section
interface SectionContainerProps {
  title: string;
  tagline: string;
  children: React.ReactNode;
}

function SectionContainer({ title, tagline, children }: SectionContainerProps) {
  return (
    <div className="relative mb-12 group">
      {/* Tiêu đề section - Không bị làm mờ */}
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Coming Soon</span>
      </div>
      <p className="text-slate-500 mb-6 relative z-10">{tagline}</p>

      {/* Vùng nội dung sẽ bị làm mờ - Đã sửa thành blur-[1px] (mờ nhẹ) */}
      {/* Thêm hiệu ứng hover nhẹ: khi hover vào thẻ card, độ mờ giảm nhẹ để gây tò mò */}
      <div className="blur-[0.5px] opacity-70 transition-all group-hover:blur-[0.5px]">
        {children}
      </div>

      {/* Lớp phủ "Locked" (Overlay) - Vẫn giữ nguyên, mt bù trừ cho tiêu đề section (2xl height + mb-6). mt: ~3rem */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl border border-slate-100/50 mt-[calc(1.5rem+1.5rem)] z-0">
        <ClockIcon />
        <p className="mt-2 text-sm font-semibold text-slate-600">Sắp ra mắt!</p>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Hàm xử lý Waitlist (Sẽ kết nối với n8n)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    // --- 🛠️ CHỖ NÀY LÀ ĐỂ KẾT NỐI VỚI n8n 🛠️ ---
    // Ví dụ: await fetch('YOUR_n8n_WEBHOOK_URL', { method: 'POST', body: JSON.stringify({ email }) });
    
    // Tạm thời chỉ giả lập đã gửi xong
    console.log("Gửi Waitlist:", email);
    setSubmitted(true);
    setEmail("");
  }

  return (
    <div className="flex min-h-screen bg-[#f0fff4] text-slate-900 font-[family-name:var(--font-be-vietnam)]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto"> {/* Bù trừ lề phải cho Sidebar */}
        <div className="max-w-5xl mx-auto px-8 py-14">

          {/* Hero & Waitlist Section */}
          <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm mb-14 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Cộng đồng Dinh dưỡng NutriAI 
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto mb-8">
              Nơi kết nối, chia sẻ công thức và học hỏi kiến thức dinh dưỡng chuẩn khoa học cùng hàng ngàn người sống khỏe.
            </p>

            {submitted ? (
              <div className="bg-green-50 text-green-700 font-medium px-6 py-4 rounded-xl max-w-lg mx-auto border border-green-200">
                🎉 Cảm ơn bạn! Chúng tôi đã ghi nhận email và sẽ thông báo ngay khi Cộng đồng ra mắt.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 border border-slate-200 rounded-full px-2 py-2 max-w-lg mx-auto shadow-inner">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn để gia nhập Waitlist"
                  className="flex-1 px-4 py-2.5 bg-transparent rounded-full text-sm outline-none w-full sm:w-auto"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all bg-[#2e9b57] text-white shadow-sm hover:bg-[#237d45] shrink-0 w-full sm:w-auto"
                >
                  Tham gia Hội Viên Sớm →
                </button>
              </form>
            )}
            <p className="text-xs text-slate-400 mt-4">* Đăng ký để trở thành 100 người đầu tiên trải nghiệm.</p>
          </div>

          {/* 1. Góc Chuyên Gia */}
          <SectionContainer title="Góc Chuyên Gia" tagline="Tổng hợp kiến thức dinh dưỡng, blog sức khỏe chuẩn khoa học từ hệ thống.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_BLOGS.map((blog) => (
                <div key={blog.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                  <img src={blog.image} alt={blog.title} className="w-full h-44 object-cover rounded-2xl" />
                  <h3 className="text-lg font-bold text-slate-900 truncate">{blog.title}</h3>
                  <div className="flex justify-between text-xs text-slate-400 mt-auto">
                    <span>{blog.author}</span>
                    <span>{blog.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionContainer>

          {/* 2. Bếp Nhà Nutri */}
          <SectionContainer title="Bếp Nhà Nutri" tagline="Cộng đồng chia sẻ công thức, bí quyết duy trì sức khỏe. Nơi bạn làm chủ nhà bếp!">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_USER_POSTS.map((post) => (
                <div key={post.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                  <img src={post.image} alt={post.title} className="w-full h-44 object-cover rounded-2xl" />
                  <h3 className="text-md font-bold text-slate-900 truncate">{post.title}</h3>
                  <div className="flex justify-between items-center text-xs text-slate-400 mt-auto">
                    <span>by {post.author}</span>
                    <span className="text-green-600 font-bold">{post.likes} ❤️</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionContainer>
          </div>
      </main>
    </div>
  );
}