import Link from "next/link";

// === DỮ LIỆU HARDCODE ===
const FLOATING_STAT = {
  today: 1450,
  target: 2000,
  progressPercent: 72.5,
};

const FEATURES = [
  {
    title: "Theo dõi Calo hàng ngày",
    description:
      "Ghi lại bữa ăn chỉ bằng hình ảnh hoặc giọng nói. Hệ thống AI tự động phân tích thành phần dinh dưỡng tức thì.",
    icon: (
      <>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </>
    ),
  },
  {
    title: "Gợi ý Công thức AI",
    description:
      "Dựa trên nguyên liệu có sẵn trong tủ lạnh và khẩu vị của bạn để tạo ra những công thức nấu ăn chuẩn Việt.",
    icon: (
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    ),
  },
  {
    title: "Lên kế hoạch bữa ăn 7 ngày",
    description:
      "Lịch trình ăn uống khoa học được thiết kế riêng cho mục tiêu tăng cơ, giảm mỡ hoặc duy trì sức khỏe của bạn.",
    icon: (
      <>
        <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </>
    ),
  },
];

const COMMUNITY_ITEMS = [
  "Chia sẻ công thức độc quyền từ người dùng khắp Việt Nam.",
  "Tham gia thử thách sức khỏe hàng tuần để nhận phần thưởng hấp dẫn.",
  "Nhận tư vấn trực tiếp từ các chuyên gia dinh dưỡng hàng đầu.",
];

const FOOTER_PRODUCT_LINKS = [
  { label: "Tính năng chính", href: "#" },
  { label: "Gói Premium", href: "#" },
  { label: "Mobile App", href: "#" },
  { label: "Bản cập nhật", href: "#" },
];

const FOOTER_SUPPORT_LINKS = [
  { label: "Trung tâm trợ giúp", href: "#" },
  { label: "Câu hỏi thường gặp", href: "#" },
  { label: "Chính sách bảo mật", href: "#" },
  { label: "Điều khoản dịch vụ", href: "#" },
];

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuChgjDepDe2LpYjmAPn36citTiGGj4V2xpdNeaY0a4dXKofVf3o00g2dWlHLvwn7cHrEULkwk9S4af2TXA8TwvzCFIViAvUOdqXaWZAiHSSjG0rLp9f2_kvN7DQ9XhbCWQ4hWqWw2zIOoGiGqyrr8kk7pen9_pBsQyuYBcr5BDGuc2mkL8d3_fQnPqACIgfT56e3KVwvPBRXBDRyhKIlR3Jlwm9k587xTyqzEg65EwRqXeUf7_N-iYUTqDvg991pa2MSfTap4rE8YgT";

const COMMUNITY_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1XhpiB-QOrUmofOnrVria0tQ5T6wARumR17sKMMv4AHmWQb1W1z9W1g2h-GMebGoFsRl7v_Akcj7atdhIoV5Z-Hbs6QD3O072YiDQlhq1_oTgRe-d1x9zMUDFem3pih2XD9f6IVZtsa_OEBuhzl5p4UJrnoXZQdbH1IYMpkc5Wk2145ZGuRwmESoQTgMvnflHMmz0wTHXKO8W254H40jSwHGPIanfwYoT4_wIbGXAVlJAx5khT-o-JwC5tZ5och_OCFdUI-NOz_tM",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDj3GARJxaf4ramI0rqTRw3L2s0llxOq2hV5k8Qyy2Ofv0A7vXa6L3l0f18tPq7CUJfP4HNDtzEq4wWWAii9xE76NbcO4epwJJR7DQoCvNSmsa2dsQbPqiFHuW7ETc_qAMDbvEizkuh9-I--CNgDTd3i5gOy0W4VVo8hjtfsGql1qr_53hNtaYH0Y6NTUwBMu_f6U_4sioWO3-bqHjELJ5PCMgXGuf2ST3gGkjb9uzgyM82OCm_C6AtnUc3i-mdY5XgwxtaUQMu-J2a",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ8BpeZ5URpiIC88PKG8AszQs2au2qGQP_0k-czAmD_iozi3mWfzPGxZKV5zaKdhnsid3fOCjYuCMe354-pajtTRB1YxzJK08yA-LHR-g3TwZHFfHWb852vMaD14havRW9JOs_1uVMKQwvMZjdxXnGuYL4x5Mnacv9OX9By4H_wI2dUjLvIScsWM-LTVq9ywx3fYe6gQfqDgOwdMEfOzWmgwL8UJkLYStfMNc-HRZxXOuyRrrc1h_XqfjHw6PIvP_yTHo628Qtq8Q0",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBmHohK_NEGOQSJyRShRL7yQjyTiV25Mzf2ur7JbaU8V1zJ_KID825so1-NB7sylYcrWw1yXDNYJazm1Bo1wdnkXLGPPl3evibJcbEXtZy6h-5jY2ZeRmHnP-52W6voDEdEI_-eOsCcouzi5Rt3EUrnNzMnYnkvHQeihr_FUO-Xk8NmHdyyQ-PMyOVCk3_EIiRNOPCQIvBtm1DHBhWHFK-4AraZEvScxK1XzdXHx4oDxur6Tzgt9Rq60AwKTm3QSx9LnJR0W3WnLpQV",
];

function LogoIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z" />
      <path d="M12 16c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4z" />
      <path d="M12 12c.5 0 1-.5 1-1s-.5-1-1-1-1 .5-1 1 .5 1 1 1z" />
    </svg>
  );
}

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-accent text-secondary overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
        <nav className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <LogoIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold text-primary tracking-tight">
              NutriAI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="font-medium hover:text-primary transition-colors"
            >
              Tính năng
            </a>
            <a
              href="#community"
              className="font-medium hover:text-primary transition-colors"
            >
              Cộng đồng
            </a>
            <a
              href="#support"
              className="font-medium hover:text-primary transition-colors"
            >
              Hỗ trợ
            </a>
          </div>
          <Link
            href="/register"
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all shadow-md shadow-green-200"
          >
            Bắt đầu ngay
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 hero-gradient overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                Trợ Lý <span className="text-primary">Dinh Dưỡng AI</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                Giúp những người trẻ bận rộn duy trì chế độ ăn uống lành mạnh
                với sự hỗ trợ từ trí tuệ nhân tạo, tối ưu hóa sức khỏe mỗi ngày.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-green-200 text-center"
                >
                  Bắt đầu miễn phí
                </Link>
                <a
                  href="#features"
                  className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary hover:text-white transition-all text-center"
                >
                  Xem cách hoạt động
                </a>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO_IMAGE}
                  alt="Healthy Vietnamese Food"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 md:left-0 z-20 glass-card p-6 rounded-2xl shadow-xl w-64 border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-500 uppercase">
                    Calo hôm nay
                  </span>
                  <span className="bg-green-100 text-primary p-1 rounded-full">
                    <CheckIcon />
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">
                    {FLOATING_STAT.today.toLocaleString()}
                  </span>
                  <span className="text-gray-400 font-medium">
                    / {FLOATING_STAT.target.toLocaleString()} kcal
                  </span>
                </div>
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${FLOATING_STAT.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white" id="features">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Mọi thứ bạn cần để ăn ngon, sống khỏe
            </h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl bg-accent border border-green-50 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-primary">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 bg-secondary text-white overflow-hidden" id="community">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-8">
                Tham gia cộng đồng Dinh Dưỡng Khỏe
              </h2>
              <ul className="space-y-6 mb-10">
                {COMMUNITY_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <div className="mt-1 bg-primary p-1 rounded-full flex-shrink-0">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-lg opacity-90">{item}</p>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-block bg-primary hover:opacity-90 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all shadow-xl shadow-black/20"
              >
                Tham gia ngay
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={COMMUNITY_IMAGES[0]}
                    alt="Healthy Lifestyle"
                    className="rounded-2xl w-full h-64 object-cover"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={COMMUNITY_IMAGES[1]}
                    alt="Vietnamese Meal"
                    className="rounded-2xl w-full h-40 object-cover"
                  />
                </div>
                <div className="space-y-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={COMMUNITY_IMAGES[2]}
                    alt="Vietnamese Meal"
                    className="rounded-2xl w-full h-40 object-cover"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={COMMUNITY_IMAGES[3]}
                    alt="Healthy Lifestyle"
                    className="rounded-2xl w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-green-50" id="support">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <LogoIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-extrabold text-primary tracking-tight">
                  NutriAI
                </span>
              </div>
              <p className="text-gray-500 leading-relaxed">
                Nền tảng dinh dưỡng ứng dụng trí tuệ nhân tạo hàng đầu cho thế
                hệ trẻ Việt Nam.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <svg
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <svg
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <svg
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Sản phẩm</h4>
              <ul className="space-y-4 text-gray-500">
                {FOOTER_PRODUCT_LINKS.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Hỗ trợ</h4>
              <ul className="space-y-4 text-gray-500">
                {FOOTER_SUPPORT_LINKS.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Liên hệ</h4>
              <ul className="space-y-4 text-gray-500">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <a
                    href="mailto:hello@nutriai.vn"
                    className="hover:text-primary transition-colors"
                  >
                    hello@nutriai.vn
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <path
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <span>Quận 1, TP. Hồ Chí Minh</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-10 text-center text-gray-400 text-sm">
            <p>© 2024 NutriAI. All rights reserved. Khởi tạo sức khỏe Việt.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}