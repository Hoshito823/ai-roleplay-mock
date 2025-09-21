"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  emotionAnalysis?: {
    sentiment: "positive" | "negative" | "neutral";
    confidence: number;
    emotions: {
      joy: number;
      anger: number;
      sadness: number;
      fear: number;
      surprise: number;
    };
  };
}

interface Scenario {
  id: string;
  title: string;
  character: {
    name: string;
    role: string;
    personality: string;
  };
}

interface ChatInterfaceProps {
  scenario: Scenario;
  isSessionActive: boolean;
}

const MOCK_AI_RESPONSES = [
  "こんにちは！本日はお時間をいただき、ありがとうございます。",
  "なるほど、興味深いご提案ですね。詳細について教えていただけますか？",
  "コストについてですが、予算の制約がございまして...",
  "この機能は我々のニーズに合いそうですが、実装時期はどの程度を想定されていますか？",
  "競合他社の製品と比較した場合の御社の優位性は何でしょうか？",
  "ROIについてはどの程度を見込んでいらっしゃいますか？",
  "セキュリティ面での対策についても確認させてください。",
  "もう少し検討させていただく時間をいただけますでしょうか？"
];

export function ChatInterface({ scenario, isSessionActive }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初期メッセージを設定
  useEffect(() => {
    if (isSessionActive && messages.length === 0) {
      const initialMessage: Message = {
        id: "1",
        content: "こんにちは！本日はお忙しい中お時間をいただき、ありがとうございます。",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, [isSessionActive, messages.length]);

  // メッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 感情分析をシミュレート
  const analyzeEmotion = (text: string) => {
    // 簡単なキーワードベースの感情分析シミュレーション
    const positiveWords = ["ありがとう", "素晴らしい", "興味深い", "良い", "素敵"];
    const negativeWords = ["問題", "困る", "心配", "不安", "難しい"];

    const hasPositive = positiveWords.some(word => text.includes(word));
    const hasNegative = negativeWords.some(word => text.includes(word));

    let sentiment: "positive" | "negative" | "neutral" = "neutral";
    if (hasPositive && !hasNegative) sentiment = "positive";
    if (hasNegative && !hasPositive) sentiment = "negative";

    return {
      sentiment,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      emotions: {
        joy: Math.random() * (sentiment === "positive" ? 0.8 : 0.3),
        anger: Math.random() * (sentiment === "negative" ? 0.6 : 0.2),
        sadness: Math.random() * (sentiment === "negative" ? 0.5 : 0.1),
        fear: Math.random() * 0.3,
        surprise: Math.random() * 0.4,
      }
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !isSessionActive) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      emotionAnalysis: analyzeEmotion(inputMessage)
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // AIの返答をシミュレート
    setTimeout(() => {
      const aiResponse = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3秒の遅延
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getEmotionColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "border-l-green-400";
      case "negative": return "border-l-red-400";
      default: return "border-l-gray-400";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {scenario.character.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{scenario.character.name}</h3>
            <p className="text-sm text-gray-500">{scenario.character.role}</p>
          </div>
          {isTyping && (
            <span className="text-sm text-gray-400 ml-auto">入力中...</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === "user"
                  ? `bg-blue-500 text-white ${message.emotionAnalysis ? `border-l-4 ${getEmotionColor(message.emotionAnalysis.sentiment)}` : ""}`
                  : "bg-white text-gray-900 shadow-sm"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-between mt-1">
                <p className={`text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                  {formatTime(message.timestamp)}
                </p>
                {message.emotionAnalysis && (
                  <span className={`text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-400"}`}>
                    感情: {message.emotionAnalysis.sentiment === "positive" ? "😊" :
                           message.emotionAnalysis.sentiment === "negative" ? "😟" : "😐"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 shadow-sm max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        {!isSessionActive ? (
          <div className="text-center text-gray-500 py-4">
            セッションを開始してチャットを始めましょう
          </div>
        ) : (
          <div className="flex space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="メッセージを入力..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              送信
            </button>
          </div>
        )}
      </div>
    </div>
  );
}