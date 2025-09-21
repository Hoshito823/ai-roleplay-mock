"use client";

import { useRouter } from "next/navigation";
import { BarChart3, Users, Target, TrendingUp, Play, Clock, Award, Settings, Brain, Heart, Shield, Zap } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const mockStats = {
    totalSessions: 24,
    avgScore: 87,
    completionRate: 92,
    improvementTrend: "+15%"
  };

  const emotionStats = {
    avgEmotionStability: 82,
    customerTrustGrowth: "+28%",
    positiveSignals: 156,
    negativeDetections: 12
  };

  const recentSessions = [
    {
      id: "1",
      scenario: "新規顧客へのプレゼンテーション",
      date: "2024-01-15",
      score: 89,
      duration: "12分"
    },
    {
      id: "2",
      scenario: "価格交渉シミュレーション",
      date: "2024-01-14",
      score: 85,
      duration: "8分"
    },
    {
      id: "3",
      scenario: "クレーム対応トレーニング",
      date: "2024-01-13",
      score: 92,
      duration: "15分"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">AI Sales Platform</h1>
              <nav className="hidden md:flex space-x-8">
                <button className="text-blue-600 font-medium">ダッシュボード</button>
                <button
                  onClick={() => router.push('/roleplay')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ロールプレイ
                </button>
              </nav>
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">ダッシュボード</h2>
          <p className="text-gray-600">AI営業トレーニングの進捗とパフォーマンスを確認しましょう</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">総セッション数</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalSessions}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">平均スコア</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.avgScore}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">完了率</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.completionRate}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">改善トレンド</p>
                <p className="text-2xl font-bold text-green-600">{mockStats.improvementTrend}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">最近のセッション</h3>
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{session.scenario}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>{session.date}</span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {session.duration}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                        session.score >= 90 ? 'bg-green-100 text-green-800' :
                        session.score >= 80 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {session.score}点
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">クイックアクション</h3>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/roleplay')}
                  className="w-full flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>新しいロールプレイを始める</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <BarChart3 className="w-5 h-5" />
                  <span>詳細レポートを見る</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Users className="w-5 h-5" />
                  <span>チーム成績を確認</span>
                </button>
              </div>
            </div>

            {/* Progress Chart Placeholder */}
            <div className="bg-white p-6 rounded-lg shadow-sm border mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">成績推移</h3>
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-sm">チャート（準備中）</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emotion Analysis Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">感情解析ダッシュボード</h2>

          {/* Emotion Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">平均感情安定度</p>
                  <p className="text-2xl font-bold text-blue-600">{emotionStats.avgEmotionStability}%</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">顧客信頼度向上</p>
                  <p className="text-2xl font-bold text-green-600">{emotionStats.customerTrustGrowth}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ポジティブシグナル</p>
                  <p className="text-2xl font-bold text-orange-600">{emotionStats.positiveSignals}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ネガティブ検出</p>
                  <p className="text-2xl font-bold text-red-600">{emotionStats.negativeDetections}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Brain className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-indigo-900">AI感情解析インサイト</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-indigo-800 mb-2">今週のハイライト</h4>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>• 顧客との信頼関係構築が前週比28%向上</li>
                  <li>• ポジティブシグナル検出率が15%アップ</li>
                  <li>• 営業中のストレスレベルが平均12%減少</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-indigo-800 mb-2">改善提案</h4>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>• 初回コンタクトでの共感表現を強化</li>
                  <li>• 価格提示タイミングの最適化を検討</li>
                  <li>• クロージング前の感情状態確認を習慣化</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}