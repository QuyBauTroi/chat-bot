const API_URL = import.meta.env.VITE_API_CHAT_BOT_URL;
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export async function sendMessageToGemini(message: string, contextHtml?: string): Promise<string> {
  try {
    const instruction =
      'Bạn là trợ lý AI chuyên về tra cứu thông tin thiết bị trên website.\n\n' +
      'QUY TẮC BẮT BUỘC:\n' +
      '- Nếu có phần CONTEXT, CHỈ được dùng dữ liệu trong CONTEXT để trả lời. Tuyệt đối không bịa thêm thông số.\n' +
      '- Nếu CONTEXT không có thông tin cần thiết, hãy trả lời: "Không tìm thấy thông tin trong dữ liệu hiện có" và gợi ý người dùng thử từ khóa khác.\n\n' +
      'FORMAT:\n' +
      '- Luôn trả lời bằng HTML.\n' +
      '- Có thể dùng các thẻ: <h1>, <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <code>, <pre>, <table>, <a>, <blockquote>.\n' +
      '- Không bọc toàn trang bằng <html>/<body>.\n' +
      '- Trả lời bằng tiếng Việt, ngắn gọn, có cấu trúc.\n\n';

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  instruction +
                  (contextHtml
                    ? `CONTEXT (chỉ dùng dữ liệu dưới đây, không bịa thêm):\n${contextHtml}\n\n---\nCÂU HỎI NGƯỜI DÙNG:\n${message}`
                    : `CÂU HỎI NGƯỜI DÙNG (không có context thiết bị kèm theo):\n${message}`),
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    
    // Extract text from response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from AI');
    }

    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}
