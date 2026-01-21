import { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/chatService';
import { mockDevices } from '../data/devices';
import type { Device } from '../data/devices';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Xin chào! 👋 Tôi là Lumi AI, tôi có thể giúp bạn tra cứu thông tin thiết bị. Bạn muốn tìm hiểu gì?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isProcessingRef = useRef(false);

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  // Tạo context HTML từ dữ liệu thiết bị
  const buildDeviceContextHtml = (query: string): { contextHtml: string; matched: Device[] } => {
    const q = normalizeText(query);
    if (!q) return { contextHtml: '', matched: [] };

    const scored = mockDevices
      .map((d) => {
        const haystack = normalizeText(
          [
            d.name,
            d.category,
            d.description,
            ...d.features,
            ...Object.keys(d.specifications),
            ...Object.values(d.specifications),
          ].join(' ')
        );

        let score = 0;
        if (normalizeText(d.name).includes(q)) score += 10;
        if (normalizeText(d.category).includes(q)) score += 6;
        if (haystack.includes(q)) score += 3;
        // bonus theo từng token
        const tokens = q.split(' ').filter(Boolean);
        for (const t of tokens) {
          if (t.length < 2) continue;
          if (normalizeText(d.name).includes(t)) score += 2;
          else if (haystack.includes(t)) score += 1;
        }
        return { device: d, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const matched = scored.map((s) => s.device);
    if (matched.length === 0) {
      return {
        matched,
        contextHtml:
          '<h3>Dữ liệu thiết bị hiện có</h3><p><strong>Không tìm thấy</strong> thiết bị phù hợp trong danh sách hiện tại.</p>',
      };
    }

    const deviceBlocks = matched
      .map((d) => {
        const topSpecs = Object.entries(d.specifications).slice(0, 6);
        const topFeatures = d.features.slice(0, 6);

        return `
          <section>
            <h3>${d.name}</h3>
            <p><strong>Loại:</strong> ${d.category}</p>
            <p><strong>Mô tả:</strong> ${d.description}</p>
            <h4>Thông số kỹ thuật (trích)</h4>
            <table>
              <tbody>
                ${topSpecs.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}
              </tbody>
            </table>
            <h4>Tính năng (trích)</h4>
            <ul>
              ${topFeatures.map((f) => `<li>${f}</li>`).join('')}
            </ul>
          </section>`;
                })
                .join('\n<hr />\n');

              return {
                matched,
                contextHtml: `<h2>DỮ LIỆU THIẾT BỊ TRÊN WEBSITE (Mock)</h2>
          <p>Chỉ sử dụng thông tin trong các mục dưới đây để trả lời. Nếu thiếu, hãy nói thiếu.</p>
          ${deviceBlocks}`,
    };
  };

  // Hàm cuộn xuống để hiển thị tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Gửi tin nhắn và xử lý response từ Gemini API
  const handleSendMessage = async () => {
    const messageText = inputValue.trim();
    if (!messageText || isProcessingRef.current) return;
    
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setInputValue('');
    isProcessingRef.current = true;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const { contextHtml } = buildDeviceContextHtml(messageText);
      const response = await sendMessageToGemini(messageText, contextHtml);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: '❌ Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
      isProcessingRef.current = false;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 hover:bg-[#00A85F] rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
        >
          <img src="/src/assets/ai (1).png" alt="AI" className="w-10 h-10" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-linear-to-r from-[#008C4F] to-[#008C4F] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                🤖
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">AI Assistant</h3>
                <p className="text-white/80 text-xs">Tra cứu thông tin thiết bị</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-white/80 transition-colors"
              aria-label="Đóng chatbot"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.isBot
                      ? 'bg-gray-200 text-gray-900 rounded-2xl rounded-tl-md'
                      : 'bg-[#008C4F] text-white rounded-2xl rounded-tr-md'
                  } px-3 py-2 shadow-sm`}
                >
                  {message.isBot ? (
                    <div
                      className="text-sm leading-relaxed prose prose-sm max-w-none chatbot-html"
                      dangerouslySetInnerHTML={{ __html: message.text }}
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-white/70'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-2xl rounded-tl-md px-3 py-2">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder="Nhập câu hỏi..."
                className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2 text-sm border border-gray-200 focus:border-[#008C4F] focus:ring-2 focus:ring-[#008C4F]/20 outline-none transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="w-9 h-9 bg-[#008C4F] hover:bg-[#00A85F] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for HTML content */}
      <style>{`
        .chatbot-html h1,
        .chatbot-html h2,
        .chatbot-html h3,
        .chatbot-html h4 {
          font-weight: 600;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .chatbot-html h1 { font-size: 1.25rem; }
        .chatbot-html h2 { font-size: 1.125rem; }
        .chatbot-html h3 { font-size: 1rem; }
        .chatbot-html h4 { font-size: 0.875rem; }
        .chatbot-html p {
          margin: 0.5rem 0;
        }
        .chatbot-html ul,
        .chatbot-html ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        .chatbot-html li {
          margin: 0.25rem 0;
        }
        .chatbot-html strong {
          font-weight: 600;
        }
        .chatbot-html em {
          font-style: italic;
        }
        .chatbot-html code {
          background-color: rgba(0, 0, 0, 0.1);
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: monospace;
        }
        .chatbot-html pre {
          background-color: rgba(0, 0, 0, 0.1);
          padding: 0.5rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin: 0.5rem 0;
        }
        .chatbot-html pre code {
          background-color: transparent;
          padding: 0;
        }
        .chatbot-html a {
          color: #008C4F;
          text-decoration: underline;
        }
        .chatbot-html table {
          width: 100%;
          border-collapse: collapse;
          margin: 0.5rem 0;
        }
        .chatbot-html th,
        .chatbot-html td {
          border: 1px solid rgba(0, 0, 0, 0.2);
          padding: 0.375rem;
          text-align: left;
        }
        .chatbot-html th {
          background-color: rgba(0, 0, 0, 0.1);
          font-weight: 600;
        }
        .chatbot-html blockquote {
          border-left: 3px solid rgba(0, 0, 0, 0.2);
          padding-left: 0.75rem;
          margin: 0.5rem 0;
          font-style: italic;
        }
      `}</style>
    </>
  );
}
