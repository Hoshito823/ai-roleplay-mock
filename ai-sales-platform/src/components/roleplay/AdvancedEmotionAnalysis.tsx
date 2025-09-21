"use client";

import { useState, useEffect } from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface NonverbalCues {
  voiceTone: {
    volume: number; // 0-10 (小声-大声)
    pace: number;   // 0-10 (ゆっくり-早口)
    stress: number; // 0-10 (平静-緊張)
    clarity: number; // 0-10 (不明瞭-明瞭)
  };
  textualContext: {
    hesitation: number;     // 迷い・躊躇
    decisiveness: number;   // 決断力
    enthusiasm: number;     // 熱意
    defensiveness: number;  // 守勢
    urgency: number;        // 緊急性
  };
  conversationFlow: {
    engagement: number;     // 会話への参加度
    receptiveness: number;  // 受容性
    resistance: number;     // 抵抗感
    trust: number;         // 信頼度
  };
}

interface KeyMoment {
  id: string;
  timestamp: Date;
  type: "key_question" | "emotional_shift" | "resistance_point" | "breakthrough";
  description: string;
  customerState: NonverbalCues;
  responseQuality: {
    appropriateness: number; // 0-10
    timing: number;         // 0-10
    empathy: number;        // 0-10
    effectiveness: number;  // 0-10
  };
  recommendation: string;
}

interface AdvancedEmotionAnalysisProps {
  isActive: boolean;
}

export function AdvancedEmotionAnalysis({ isActive }: AdvancedEmotionAnalysisProps) {
  const [currentCues, setCurrentCues] = useState<NonverbalCues | null>(null);
  const [keyMoments, setKeyMoments] = useState<KeyMoment[]>([]);
  const [customerPersonality] = useState({
    analytical: 8,
    relationship: 5,
    urgency: 6,
    risktaking: 3
  });

  // シミュレートされたノンバーバル分析
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const newCues: NonverbalCues = {
        voiceTone: {
          volume: Math.random() * 10,
          pace: Math.random() * 10,
          stress: Math.random() * 8,
          clarity: 7 + Math.random() * 3
        },
        textualContext: {
          hesitation: Math.random() * 7,
          decisiveness: 3 + Math.random() * 7,
          enthusiasm: Math.random() * 10,
          defensiveness: Math.random() * 6,
          urgency: Math.random() * 8
        },
        conversationFlow: {
          engagement: 4 + Math.random() * 6,
          receptiveness: Math.random() * 10,
          resistance: Math.random() * 5,
          trust: 3 + Math.random() * 7
        }
      };

      setCurrentCues(newCues);

      // キーモーメントの検出（15%の確率）
      if (Math.random() < 0.15) {
        const momentTypes = ["key_question", "emotional_shift", "resistance_point", "breakthrough"] as const;
        const type = momentTypes[Math.floor(Math.random() * momentTypes.length)];

        const keyMoment: KeyMoment = {
          id: Date.now().toString(),
          timestamp: new Date(),
          type,
          description: getKeyMomentDescription(type, newCues),
          customerState: newCues,
          responseQuality: {
            appropriateness: 4 + Math.random() * 6,
            timing: 3 + Math.random() * 7,
            empathy: 5 + Math.random() * 5,
            effectiveness: 4 + Math.random() * 6
          },
          recommendation: getRecommendation(type, newCues)
        };

        setKeyMoments(prev => [...prev, keyMoment].slice(-10)); // 最新10件保持
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isActive]);

  const getKeyMomentDescription = (type: KeyMoment["type"], cues: NonverbalCues): string => {
    switch (type) {
      case "key_question":
        return cues.textualContext.hesitation > 6
          ? "顧客が重要な懸念事項について質問しましたが、迷いが見られます"
          : "顧客が核心的な質問をしました。決断に近づいている可能性があります";
      case "emotional_shift":
        return cues.conversationFlow.resistance > 4
          ? "顧客の感情が防御的に変化しました。警戒心が高まっています"
          : "顧客の感情がポジティブに変化しました。関心が高まっています";
      case "resistance_point":
        return "顧客が抵抗を示しています。価格や条件に懸念があるようです";
      case "breakthrough":
        return "顧客の心理的な壁が崩れました。信頼関係が構築されています";
    }
  };

  const getRecommendation = (type: KeyMoment["type"], cues: NonverbalCues): string => {
    switch (type) {
      case "key_question":
        return cues.textualContext.hesitation > 6
          ? "共感を示しつつ、具体的な事例で不安を解消しましょう"
          : "このタイミングで具体的な提案に移行することを検討してください";
      case "emotional_shift":
        return cues.conversationFlow.resistance > 4
          ? "一歩下がって、顧客の立場に寄り添う姿勢を見せましょう"
          : "この好機を活かして、より深い話題に進んでください";
      case "resistance_point":
        return "直接的な売り込みを控え、顧客の懸念を丁寧にヒアリングしましょう";
      case "breakthrough":
        return "信頼関係を活かして、次のステップへの提案を行いましょう";
    }
  };

  const getMomentIcon = (type: KeyMoment["type"]): string => {
    switch (type) {
      case "key_question": return "❓";
      case "emotional_shift": return "🔄";
      case "resistance_point": return "🛑";
      case "breakthrough": return "✨";
    }
  };

  const getMomentColor = (type: KeyMoment["type"]): string => {
    switch (type) {
      case "key_question": return "border-l-blue-400 bg-blue-50";
      case "emotional_shift": return "border-l-purple-400 bg-purple-50";
      case "resistance_point": return "border-l-red-400 bg-red-50";
      case "breakthrough": return "border-l-green-400 bg-green-50";
    }
  };

  const getResponseQualityColor = (score: number): string => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const radarData = currentCues ? [
    { subject: '熱意', A: currentCues.textualContext.enthusiasm },
    { subject: '決断力', A: currentCues.textualContext.decisiveness },
    { subject: '受容性', A: currentCues.conversationFlow.receptiveness },
    { subject: '信頼度', A: currentCues.conversationFlow.trust },
    { subject: '参加度', A: currentCues.conversationFlow.engagement },
    { subject: '明瞭性', A: currentCues.voiceTone.clarity }
  ] : [];

  if (!isActive) {
    return (
      <div className="h-full p-6 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">🎭</div>
          <p>セッション開始後に高度な感情分析が表示されます</p>
          <p className="text-sm mt-2">ノンバーバルな要素も含めた総合分析</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 space-y-6 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900">高度感情分析</h3>

      {/* Customer Personality Profile */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-3">顧客パーソナリティ</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span>分析型</span>
            <span className="font-semibold">{customerPersonality.analytical}/10</span>
          </div>
          <div className="flex justify-between">
            <span>関係重視</span>
            <span className="font-semibold">{customerPersonality.relationship}/10</span>
          </div>
          <div className="flex justify-between">
            <span>urgency</span>
            <span className="font-semibold">{customerPersonality.urgency}/10</span>
          </div>
          <div className="flex justify-between">
            <span>リスク許容</span>
            <span className="font-semibold">{customerPersonality.risktaking}/10</span>
          </div>
        </div>
      </div>

      {/* Current Nonverbal Analysis */}
      {currentCues && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">ノンバーバル分析</h4>

          {/* Voice Tone */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">声色・話し方</h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>音量</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${(currentCues.voiceTone.volume / 10) * 100}%` }}
                    />
                  </div>
                  <span>{currentCues.voiceTone.volume.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>話速</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-purple-500 h-1 rounded-full"
                      style={{ width: `${(currentCues.voiceTone.pace / 10) * 100}%` }}
                    />
                  </div>
                  <span>{currentCues.voiceTone.pace.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>緊張度</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-red-500 h-1 rounded-full"
                      style={{ width: `${(currentCues.voiceTone.stress / 10) * 100}%` }}
                    />
                  </div>
                  <span>{currentCues.voiceTone.stress.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer State Radar */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">顧客状態レーダー</h5>
            <ResponsiveContainer width="100%" height={120}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" fontSize={10} />
                <PolarRadiusAxis domain={[0, 10]} fontSize={8} />
                <Radar name="現在状態" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Key Moments */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="font-medium text-gray-900 mb-3">キーモーメント</h4>
        {keyMoments.length === 0 ? (
          <p className="text-sm text-gray-500">まだキーモーメントは検出されていません</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {keyMoments.slice(-5).reverse().map((moment) => (
              <div key={moment.id} className={`p-3 border-l-4 rounded ${getMomentColor(moment.type)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getMomentIcon(moment.type)}</span>
                    <span className="text-sm font-medium">
                      {moment.timestamp.toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{moment.description}</p>

                {/* Response Quality */}
                <div className="grid grid-cols-4 gap-2 mb-2 text-xs">
                  <div className="text-center">
                    <div className={`font-semibold ${getResponseQualityColor(moment.responseQuality.appropriateness)}`}>
                      {moment.responseQuality.appropriateness.toFixed(1)}
                    </div>
                    <div className="text-gray-500">適切性</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-semibold ${getResponseQualityColor(moment.responseQuality.timing)}`}>
                      {moment.responseQuality.timing.toFixed(1)}
                    </div>
                    <div className="text-gray-500">タイミング</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-semibold ${getResponseQualityColor(moment.responseQuality.empathy)}`}>
                      {moment.responseQuality.empathy.toFixed(1)}
                    </div>
                    <div className="text-gray-500">共感性</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-semibold ${getResponseQualityColor(moment.responseQuality.effectiveness)}`}>
                      {moment.responseQuality.effectiveness.toFixed(1)}
                    </div>
                    <div className="text-gray-500">効果</div>
                  </div>
                </div>

                <div className="bg-white bg-opacity-50 p-2 rounded text-xs">
                  <strong>推奨:</strong> {moment.recommendation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Session Insights */}
      {keyMoments.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-3">💡 セッション洞察</h4>
          <div className="text-sm space-y-2">
            <p>
              <strong>検出されたパターン:</strong>
              {keyMoments.filter(m => m.type === "resistance_point").length > 2
                ? " 顧客に強い懸念があります。信頼構築を優先しましょう。"
                : keyMoments.filter(m => m.type === "breakthrough").length > 1
                ? " 良好な関係が築けています。具体的な提案に進みましょう。"
                : " バランスの取れた進行です。顧客の反応を注意深く観察してください。"
              }
            </p>
            <p>
              <strong>平均応答品質:</strong>
              <span className={getResponseQualityColor(
                keyMoments.reduce((sum, m) =>
                  sum + (m.responseQuality.appropriateness + m.responseQuality.effectiveness) / 2, 0
                ) / keyMoments.length
              )}>
                {(keyMoments.reduce((sum, m) =>
                  sum + (m.responseQuality.appropriateness + m.responseQuality.effectiveness) / 2, 0
                ) / keyMoments.length).toFixed(1)}/10
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}