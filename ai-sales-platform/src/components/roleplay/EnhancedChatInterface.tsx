"use client";

import { useState, useEffect, useRef } from "react";
import { StaticVRMAvatar } from "./StaticVRMAvatar";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  contextualAnalysis?: {
    messageType: "question" | "statement" | "objection" | "request" | "emotional";
    subtext: string; // 行間に隠された意味
    voiceHints: string; // 声色のヒント
    expressionHints: string; // 表情のヒント
    keyMoments: string[]; // このメッセージで重要なポイント
    hiddenConcerns: string[]; // 表面化していない懸念
  };
  responseEvaluation?: {
    contextReading: number; // 文脈読み取り精度 0-10
    empathyLevel: number;   // 共感レベル 0-10
    timing: number;         // タイミング 0-10
    strategicValue: number; // 戦略的価値 0-10
    improvements: string[]; // 改善点
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

interface EnhancedChatInterfaceProps {
  scenario: Scenario;
  isSessionActive: boolean;
}

// AIの複雑な応答パターン
const AI_RESPONSES_WITH_CONTEXT = [
  {
    response: "こんにちは。本日はお忙しい中、ありがとうございます...",
    subtext: "初対面の緊張と、時間を取られることへの軽い抵抗感",
    voiceHints: "やや慎重なトーン、声量は控えめ",
    expressionHints: "微笑みつつも少し距離を置いた表情",
    hiddenConcerns: ["時間的制約", "営業への警戒心"]
  },
  {
    response: "なるほど、興味深いお話ですね。ただ、現在の状況を考えると...",
    subtext: "関心は示すが、即座の決断は避けたい意図",
    voiceHints: "やや上がり調子だが、後半でトーンダウン",
    expressionHints: "眉をわずかに寄せ、考え込む表情",
    hiddenConcerns: ["予算の制約", "社内承認プロセス"]
  },
  {
    response: "価格についてですが、もう少し詳しく...",
    subtext: "価格に関心があるが、高すぎることへの懸念",
    voiceHints: "慎重で探るような話し方",
    expressionHints: "目を細めて資料を見つめる",
    hiddenConcerns: ["ROI", "競合他社との比較"]
  },
  {
    response: "技術的な面では理解できるのですが、実際の運用となると...",
    subtext: "技術は評価するが、実装の複雑さを心配している",
    voiceHints: "前半は明確、後半は不安げ",
    expressionHints: "理解を示すうなずきから、困惑の表情に変化",
    hiddenConcerns: ["導入コスト", "スタッフのトレーニング"]
  },
  {
    response: "他社の事例もお聞かせいただけますか？",
    subtext: "決断前にリスクを最小化したい慎重な姿勢",
    voiceHints: "しっかりとした口調で質問",
    expressionHints: "真剣な表情で身を乗り出す",
    hiddenConcerns: ["導入失敗のリスク", "同業他社の評価"]
  },
  {
    response: "うーん、検討する必要がありますね...",
    subtext: "まだ確信が持てず、時間をかけて判断したい",
    voiceHints: "ためらいがちで声量も小さめ",
    expressionHints: "視線をそらし、手で顎を触る",
    hiddenConcerns: ["決断への不安", "上司への説明"]
  }
];

export function EnhancedChatInterface({ scenario, isSessionActive }: EnhancedChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showContextHints, setShowContextHints] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState({
    happiness: 6,
    sadness: 2,
    anger: 1,
    surprise: 2,
    fear: 1,
    neutral: 5
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSessionActive && messages.length === 0) {
      const initialData = AI_RESPONSES_WITH_CONTEXT[0];
      const initialMessage: Message = {
        id: "1",
        content: initialData.response,
        sender: "ai",
        timestamp: new Date(),
        contextualAnalysis: {
          messageType: "statement",
          subtext: initialData.subtext,
          voiceHints: initialData.voiceHints,
          expressionHints: initialData.expressionHints,
          keyMoments: ["初回接触", "信頼関係構築の開始"],
          hiddenConcerns: initialData.hiddenConcerns
        }
      };
      setMessages([initialMessage]);
    }
  }, [isSessionActive, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 応答の質を評価
  const evaluateResponse = (userMessage: string, previousAiMessage: Message): Message["responseEvaluation"] => {
    const contextClues = previousAiMessage.contextualAnalysis;
    if (!contextClues) return undefined;

    // キーワードベースの分析（実際はより高度なNLP処理）
    const empathyWords = ["理解", "わかります", "そうですね", "おっしゃる通り"];
    const questionWords = ["いかがでしょうか", "どう思われますか", "ご質問"];
    const pressureWords = ["すぐに", "今すぐ", "決めて", "購入"];

    const hasEmpathy = empathyWords.some(word => userMessage.includes(word));
    const asksQuestions = questionWords.some(word => userMessage.includes(word));
    const isPushy = pressureWords.some(word => userMessage.includes(word));

    // 文脈読み取り評価
    const contextReading = (() => {
      if (contextClues.hiddenConcerns.some(concern =>
        userMessage.includes(concern) || userMessage.includes("予算") || userMessage.includes("時間")
      )) return 8 + Math.random() * 2;
      return 4 + Math.random() * 4;
    })();

    // 共感レベル評価
    const empathyLevel = hasEmpathy ? 7 + Math.random() * 3 : 3 + Math.random() * 4;

    // タイミング評価
    const timing = (() => {
      if (contextClues.messageType === "objection" && !isPushy) return 7 + Math.random() * 3;
      if (contextClues.messageType === "question" && asksQuestions) return 6 + Math.random() * 3;
      return 4 + Math.random() * 4;
    })();

    // 戦略的価値評価
    const strategicValue = (() => {
      if (asksQuestions && hasEmpathy) return 8 + Math.random() * 2;
      if (isPushy) return 2 + Math.random() * 3;
      return 5 + Math.random() * 3;
    })();

    const improvements = [];
    if (!hasEmpathy) improvements.push("相手の立場への共感を示しましょう");
    if (!asksQuestions && contextClues.messageType === "question") improvements.push("質問で顧客の真意を探りましょう");
    if (isPushy) improvements.push("プレッシャーを与えず、顧客のペースに合わせましょう");
    if (contextReading < 6) improvements.push("顧客の隠れた懸念に注意を向けましょう");

    return {
      contextReading,
      empathyLevel,
      timing,
      strategicValue,
      improvements
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !isSessionActive) return;

    const lastAiMessage = messages.filter(m => m.sender === "ai").pop();
    const responseEval = lastAiMessage ? evaluateResponse(inputMessage, lastAiMessage) : undefined;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      responseEvaluation: responseEval
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // AIの返答をシミュレート
    setTimeout(() => {
      setIsSpeaking(true);

      const responseData = AI_RESPONSES_WITH_CONTEXT[Math.floor(Math.random() * AI_RESPONSES_WITH_CONTEXT.length)];

      // 感情状態を更新（文脈に基づいて）
      const newEmotion = { ...currentEmotion };

      if (responseData.hiddenConcerns.includes("予算")) {
        newEmotion.fear = Math.min(8, newEmotion.fear + 2);
        newEmotion.happiness = Math.max(2, newEmotion.happiness - 1);
      } else if (responseData.response.includes("興味深い")) {
        newEmotion.happiness = Math.min(8, newEmotion.happiness + 2);
        newEmotion.surprise = Math.min(6, newEmotion.surprise + 1);
      } else if (responseData.response.includes("検討")) {
        newEmotion.neutral = Math.min(8, newEmotion.neutral + 1);
        newEmotion.fear = Math.min(6, newEmotion.fear + 1);
      }

      setCurrentEmotion(newEmotion);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseData.response,
        sender: "ai",
        timestamp: new Date(),
        contextualAnalysis: {
          messageType: Math.random() > 0.5 ? "question" : "statement",
          subtext: responseData.subtext,
          voiceHints: responseData.voiceHints,
          expressionHints: responseData.expressionHints,
          keyMoments: ["顧客の反応変化", "新たな懸念の表出"],
          hiddenConcerns: responseData.hiddenConcerns
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // スピーキングアニメーション（メッセージの長さに基づく）
      setTimeout(() => setIsSpeaking(false), responseData.response.length * 50);
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getEvaluationColor = (score: number): string => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* VRM Avatar Background */}
      <div className="absolute top-0 right-0 w-96 h-full z-0 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-l from-gray-100/80 to-transparent">
          <StaticVRMAvatar
            currentEmotion={currentEmotion}
            isSpeaking={isSpeaking}
            characterName={scenario.character.name}
            characterRole={scenario.character.role}
          />
        </div>
      </div>

      {/* Chat Section */}
      <div className="relative z-10 flex flex-col h-full bg-white/95 mr-96">
        {/* Chat Header with Context Toggle */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {scenario.character.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{scenario.character.name}</h3>
                <p className="text-sm text-gray-500">{scenario.character.role}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-green-400 animate-pulse" : "bg-gray-300"}`}></div>
                  <span className="text-xs text-gray-500">{isSpeaking ? "話している" : "待機中"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowContextHints(!showContextHints)}
                className={`text-sm px-3 py-1 rounded ${
                  showContextHints
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600"
                }`}
              >
                文脈ヒント {showContextHints ? "ON" : "OFF"}
              </button>
              {isTyping && (
                <span className="text-sm text-gray-400">思考中...</span>
              )}
            </div>
          </div>
        </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-900 shadow-sm"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === "user" ? "text-blue-100" : "text-gray-500"
                }`}>
                  {message.timestamp.toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </div>

            {/* Context Analysis for AI messages */}
            {message.sender === "ai" && message.contextualAnalysis && showContextHints && (
              <div className="ml-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded text-sm">
                <div className="space-y-2">
                  <div>
                    <strong>💭 行間の意味:</strong>
                    <span className="ml-2 text-gray-700">{message.contextualAnalysis.subtext}</span>
                  </div>
                  <div>
                    <strong>🎵 声色:</strong>
                    <span className="ml-2 text-gray-700">{message.contextualAnalysis.voiceHints}</span>
                  </div>
                  <div>
                    <strong>😐 表情:</strong>
                    <span className="ml-2 text-gray-700">{message.contextualAnalysis.expressionHints}</span>
                  </div>
                  {message.contextualAnalysis.hiddenConcerns.length > 0 && (
                    <div>
                      <strong>🤔 隠れた懸念:</strong>
                      <div className="ml-2 flex flex-wrap gap-1">
                        {message.contextualAnalysis.hiddenConcerns.map((concern, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                            {concern}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Response Evaluation for User messages */}
            {message.sender === "user" && message.responseEvaluation && showContextHints && (
              <div className="mr-4 bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-sm">
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <span className="text-gray-600">文脈読み取り:</span>
                    <span className={`ml-2 font-semibold ${getEvaluationColor(message.responseEvaluation.contextReading)}`}>
                      {message.responseEvaluation.contextReading.toFixed(1)}/10
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">共感性:</span>
                    <span className={`ml-2 font-semibold ${getEvaluationColor(message.responseEvaluation.empathyLevel)}`}>
                      {message.responseEvaluation.empathyLevel.toFixed(1)}/10
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">タイミング:</span>
                    <span className={`ml-2 font-semibold ${getEvaluationColor(message.responseEvaluation.timing)}`}>
                      {message.responseEvaluation.timing.toFixed(1)}/10
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">戦略的価値:</span>
                    <span className={`ml-2 font-semibold ${getEvaluationColor(message.responseEvaluation.strategicValue)}`}>
                      {message.responseEvaluation.strategicValue.toFixed(1)}/10
                    </span>
                  </div>
                </div>
                {message.responseEvaluation.improvements.length > 0 && (
                  <div>
                    <strong>💡 改善提案:</strong>
                    <ul className="ml-4 list-disc list-inside text-gray-700">
                      {message.responseEvaluation.improvements.map((improvement, idx) => (
                        <li key={idx}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
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
          <div className="space-y-2">
            <div className="flex space-x-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="相手の感情や文脈を読み取って応答してください..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={2}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                送信
              </button>
            </div>
            <div className="text-xs text-gray-500">
              💡 ヒント: 相手の声色・表情・隠れた懸念を読み取って、適切なタイミングで共感を示しましょう
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}