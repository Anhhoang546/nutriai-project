import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const {
      ingredients,
      calorieLimit,
      dietType,
      cookingMethods,
      timeLimit,
      extraNote,
    } = await req.json();

    // ── Xây dựng context từ filters ──────────────────────────
    const isVegetarian = ["Chay", "Thuần chay"].includes(dietType);
    const isVegan = dietType === "Thuần chay";
    const isKeto = dietType === "Keto";
    const isLowCarb = dietType === "Low-carb" || isKeto;

    // Xác định macro ratio phù hợp theo chế độ ăn
    let macroGuidance = "";
    if (isKeto) {
      macroGuidance = "Tỷ lệ macro: 70% chất béo, 25% protein, 5% carb. Carb dưới 20g/bữa.";
    } else if (isLowCarb) {
      macroGuidance = "Tỷ lệ macro: 40% protein, 35% chất béo, 25% carb. Carb dưới 50g/bữa.";
    } else if (isVegetarian) {
      macroGuidance = "Đảm bảo đủ protein từ thực vật (đậu, đậu phụ, trứng nếu không thuần chay). Tỷ lệ: 25% protein, 50% carb, 25% béo.";
    } else {
      macroGuidance = "Tỷ lệ cân bằng: 30% protein, 45% carb, 25% chất béo lành mạnh.";
    }

    // Xây dựng dietary restrictions
    const restrictions: string[] = [];
    if (isVegan) restrictions.push("TUYỆT ĐỐI không dùng thịt, cá, hải sản, trứng, sữa, mật ong");
    else if (isVegetarian) restrictions.push("Không dùng thịt và cá, được dùng trứng và sữa");
    if (isKeto) restrictions.push("Không dùng cơm, bánh mì, mì, khoai tây, đường, hoa quả ngọt");
    if (isLowCarb && !isKeto) restrictions.push("Hạn chế tối đa tinh bột, không dùng cơm/bánh mì trắng");
    if (extraNote) restrictions.push(`Yêu cầu đặc biệt của người dùng: ${extraNote}`);

    const restrictionText = restrictions.length > 0
      ? restrictions.map(r => `  ⚠️ ${r}`).join("\n")
      : "  ✅ Không có hạn chế đặc biệt";

    // Cooking preferences
    const cookingText = cookingMethods?.length > 0
      ? `Ưu tiên cách nấu: ${cookingMethods.join(", ")}`
      : "Linh hoạt về cách nấu";

    const timeText = timeLimit
      ? `Thời gian nấu tối đa: ${timeLimit}`
      : "Thời gian linh hoạt";

    // ── PROMPT CHÍNH ─────────────────────────────────────────
    const prompt = `Bạn là chuyên gia dinh dưỡng và đầu bếp có kinh nghiệm, am hiểu ẩm thực Việt Nam và quốc tế.

═══════════════════════════════════════
THÔNG TIN ĐẦU VÀO TỪ NGƯỜI DÙNG:
═══════════════════════════════════════
📦 Nguyên liệu hiện có: ${ingredients.join(", ")}
🔥 Giới hạn calories: TỐI ĐA ${calorieLimit} kcal/bữa
🥗 Chế độ ăn: ${dietType || "Thường"}
🍳 ${cookingText}
⏱️ ${timeText}

📊 Hướng dẫn macro (${dietType || "Thường"}):
${macroGuidance}

🚫 Ràng buộc BẮT BUỘC:
${restrictionText}

═══════════════════════════════════════
NGUYÊN TẮC GỢI Ý:
═══════════════════════════════════════
1. LINH HOẠT về nguồn gốc món ăn: Ưu tiên món Việt Nam quen thuộc, nhưng hoàn toàn có thể gợi ý món châu Á (Nhật, Hàn, Thái...) hoặc món quốc tế đơn giản (salad, omelet, sandwich...) nếu phù hợp hơn với nguyên liệu.

2. THÔNG MINH với nguyên liệu: Tối đa hóa việc sử dụng nguyên liệu người dùng đã có. Ghi rõ nguyên liệu nào "có sẵn" và nguyên liệu nào cần "mua thêm".

3. THỰC TẾ về calories: Tính toán chính xác dựa trên lượng nguyên liệu thực tế. Calories PHẢI dưới ${calorieLimit} kcal.

4. ĐA DẠNG 3 món: Không gợi ý 3 món có cùng nguyên liệu chính hoặc cùng cách nấu. Đảm bảo sự đa dạng về hương vị và cách chế biến.

5. THỰC DỤNG: Cách làm rõ ràng, ngắn gọn, người không biết nấu cũng làm được.

═══════════════════════════════════════
FORMAT TRẢ LỜI - CHỈ JSON, KHÔNG THÊM GÌ KHÁC:
═══════════════════════════════════════
{
  "recipes": [
    {
      "name": "Tên món (tiếng Việt hoặc tên phổ biến)",
      "origin": "Việt Nam / Nhật Bản / Quốc tế / ...",
      "calories": 350,
      "prep_time": "15 phút",
      "difficulty": "Dễ",
      "ingredients_available": ["Trứng - 2 quả", "Cà chua - 1 quả"],
      "ingredients_needed": ["Dầu ăn - 1 muỗng canh"],
      "instructions": "Bước 1: ...\nBước 2: ...\nBước 3: ...",
      "nutrition": {
        "protein_g": 18,
        "carb_g": 12,
        "fat_g": 14,
        "fiber_g": 3
      },
      "why_recommend": "Lý do ngắn gọn tại sao món này phù hợp với người dùng",
      "tip": "1 mẹo nhỏ để món ngon hơn"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Bạn là chuyên gia dinh dưỡng và đầu bếp chuyên nghiệp. 
Nhiệm vụ: Gợi ý ĐÚNG 3 món ăn phù hợp nhất với yêu cầu.
Quy tắc tuyệt đối: 
- Chỉ trả về JSON thuần túy, không markdown, không giải thích
- Calories phải chính xác và thực tế
- Tôn trọng tuyệt đối các dietary restrictions`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2500,
      temperature: 0.65,
    });

    const text = completion.choices[0]?.message?.content || "";

    // Parse JSON an toàn
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AI không trả về đúng format, vui lòng thử lại" },
        { status: 500 }
      );
    }

    let data;
    try {
      data = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json(
        { error: "Lỗi parse JSON từ AI, vui lòng thử lại" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Groq error:", error);
    return NextResponse.json(
      { error: "Lỗi kết nối AI, vui lòng thử lại sau" },
      { status: 500 }
    );
  }
}