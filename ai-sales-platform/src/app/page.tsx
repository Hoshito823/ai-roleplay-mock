import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI商談プラットフォーム
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            感情解析技術を活用したAI商談ロールプレイシステムで、
            営業スキルを向上させましょう
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Dashboard Card */}
          <Link href="/dashboard">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="text-center">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📊</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">ダッシュボード</h2>
                <p className="text-gray-600 mb-6">
                  KPI表示、商談履歴、進捗管理などの
                  分析機能をご利用いただけます
                </p>
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li>✅ 商談成功率・感情スコア表示</li>
                  <li>✅ 過去の商談記録一覧</li>
                  <li>✅ 詳細な分析グラフ</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Roleplay Card */}
          <Link href="/roleplay">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="text-center">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🎭</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">AIロールプレイ</h2>
                <p className="text-gray-600 mb-6">
                  リアルなビジネスシーンでAIと練習し、
                  感情分析を通じてスキルアップ
                </p>
                <ul className="text-sm text-gray-500 space-y-2 text-left">
                  <li>✅ 業界別・難易度別シナリオ</li>
                  <li>✅ リアルタイム感情分析</li>
                  <li>✅ AI による改善アドバイス</li>
                </ul>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">主要機能</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-semibold mb-3">シナリオ選択</h4>
              <p className="text-gray-600">
                IT、製薬、金融など様々な業界のリアルな商談シナリオ
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-xl font-semibold mb-3">リアルタイムチャット</h4>
              <p className="text-gray-600">
                AIキャラクターとの自然な対話で実践的な練習
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h4 className="text-xl font-semibold mb-3">感情分析</h4>
              <p className="text-gray-600">
                リアルタイムで感情状態を可視化し、改善点を特定
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
