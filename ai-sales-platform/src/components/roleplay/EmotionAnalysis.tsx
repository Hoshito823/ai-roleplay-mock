"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

interface EmotionData {
  timestamp: Date;
  overall: number;
  joy: number;
  anger: number;
  sadness: number;
  fear: number;
  surprise: number;
}

interface EmotionAnalysisProps {
  isActive: boolean;
}

export function EmotionAnalysis({ isActive }: EmotionAnalysisProps) {
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);

  // シミュレートされた感情データを生成
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const newEmotion: EmotionData = {
        timestamp: new Date(),
        overall: Math.random() * 10,
        joy: Math.random() * 10,
        anger: Math.random() * 5, // 怒りは低めに
        sadness: Math.random() * 4, // 悲しみも低めに
        fear: Math.random() * 3, // 恐れはさらに低めに
        surprise: Math.random() * 6
      };

      setCurrentEmotion(newEmotion);
      setEmotionHistory(prev => {
        const updated = [...prev, newEmotion];
        // 最新20件を保持
        return updated.slice(-20);
      });
    }, 3000); // 3秒ごとに更新

    return () => clearInterval(interval);
  }, [isActive]);

  const getEmotionDescription = (emotion: EmotionData) => {
    const { joy, anger, sadness, fear, surprise } = emotion;

    if (joy > 7) return { text: "非常にポジティブ", color: "text-green-600", icon: "😄" };
    if (joy > 5) return { text: "ポジティブ", color: "text-green-500", icon: "😊" };
    if (anger > 6) return { text: "やや緊張", color: "text-red-500", icon: "😠" };
    if (sadness > 5) return { text: "落ち着いている", color: "text-blue-500", icon: "😔" };
    if (fear > 4) return { text: "不安気味", color: "text-yellow-600", icon: "😰" };
    if (surprise > 7) return { text: "驚き", color: "text-purple-500", icon: "😲" };
    return { text: "安定", color: "text-gray-600", icon: "😐" };
  };

  const getOverallScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-green-500";
    if (score >= 4) return "text-yellow-500";
    if (score >= 2) return "text-orange-500";
    return "text-red-500";
  };

  const emotionColors = {
    joy: "#10b981",
    anger: "#ef4444",
    sadness: "#3b82f6",
    fear: "#f59e0b",
    surprise: "#8b5cf6"
  };

  const getAdvice = (emotion: EmotionData) => {
    const { joy, anger, sadness, fear } = emotion;

    if (joy > 7) return "素晴らしい感情状態です！この調子で積極的に進めましょう。";
    if (anger > 6) return "少し緊張が見られます。深呼吸して冷静に対応しましょう。";
    if (sadness > 5) return "落ち着いた状態です。相手の話をよく聞くチャンスです。";
    if (fear > 4) return "不安を感じています。自信を持って、準備した内容を思い出しましょう。";
    return "バランスの取れた状態です。このまま自然体で進めましょう。";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  if (!isActive) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <p>セッション開始後に感情分析が表示されます</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900">感情分析</h3>

      {/* Current Emotion Status */}
      {currentEmotion && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">現在の状態</h4>
          <div className="text-center">
            <div className="text-4xl mb-2">
              {getEmotionDescription(currentEmotion).icon}
            </div>
            <p className={`font-semibold ${getEmotionDescription(currentEmotion).color}`}>
              {getEmotionDescription(currentEmotion).text}
            </p>
            <div className={`text-2xl font-bold mt-2 ${getOverallScoreColor(currentEmotion.overall)}`}>
              {currentEmotion.overall.toFixed(1)}/10
            </div>
          </div>
        </div>
      )}

      {/* Emotion Breakdown */}
      {currentEmotion && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">感情の詳細</h4>
          <div className="space-y-3">
            {Object.entries({
              joy: { label: "喜び", icon: "😊" },
              anger: { label: "怒り", icon: "😠" },
              sadness: { label: "悲しみ", icon: "😔" },
              fear: { label: "恐れ", icon: "😰" },
              surprise: { label: "驚き", icon: "😲" }
            }).map(([key, { label, icon }]) => {
              const value = currentEmotion[key as keyof EmotionData] as number;
              const percentage = (value / 10) * 100;

              return (
                <div key={key} className="flex items-center space-x-2">
                  <span className="text-sm w-2">{icon}</span>
                  <span className="text-sm w-12 text-gray-600">{label}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: emotionColors[key as keyof typeof emotionColors]
                      }}
                    />
                  </div>
                  <span className="text-sm w-8 text-gray-500">
                    {value.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Emotion Trend */}
      {emotionHistory.length > 1 && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">感情推移</h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={emotionHistory}>
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTime}
                fontSize={10}
              />
              <YAxis domain={[0, 10]} fontSize={10} />
              <Line
                type="monotone"
                dataKey="overall"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Advice */}
      {currentEmotion && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">💡 アドバイス</h4>
          <p className="text-sm text-blue-800">
            {getAdvice(currentEmotion)}
          </p>
        </div>
      )}

      {/* Session Stats */}
      {emotionHistory.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">セッション統計</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">平均スコア</span>
              <div className="font-semibold">
                {(emotionHistory.reduce((sum, e) => sum + e.overall, 0) / emotionHistory.length).toFixed(1)}/10
              </div>
            </div>
            <div>
              <span className="text-gray-500">最高スコア</span>
              <div className="font-semibold">
                {Math.max(...emotionHistory.map(e => e.overall)).toFixed(1)}/10
              </div>
            </div>
            <div>
              <span className="text-gray-500">データ数</span>
              <div className="font-semibold">{emotionHistory.length}件</div>
            </div>
            <div>
              <span className="text-gray-500">経過時間</span>
              <div className="font-semibold">
                {Math.floor(emotionHistory.length * 3 / 60)}分
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}