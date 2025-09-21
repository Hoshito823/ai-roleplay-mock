'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  Download,
  RotateCcw,
  MessageSquare,
  TrendingUp,
  Users,
  Target,
  Heart,
  Save,
  Brain,
  Zap,
  Shield,
  ThumbsUp,
  TrendingDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

type JudgmentType = 'good' | 'warning' | 'bad';

interface Criterion {
  id: string;
  title: string;
  judgment: JudgmentType;
  reason: string;
  evidence?: string;
}

interface EvaluationCategory {
  id: string;
  title: string;
  subtitle: string;
  score: number;
  overallJudgment: JudgmentType;
  criteria: Criterion[];
  improvement: string;
  icon: React.ReactNode;
}

interface ConversationEntry {
  id: string;
  speaker: 'user' | 'ai';
  text: string;
  timestamp: number;
  tags?: string[];
  favorabilityPoints?: number;
  emotionScores?: {
    userStress: number;
    userConfidence: number;
    customerTrust: number;
    customerInterest: number;
  };
}

interface EmotionTimelineData {
  timestamp: number;
  userStress: number;
  userConfidence: number;
  customerTrust: number;
  customerInterest: number;
  customerSatisfaction: number;
}

export default function RoleplayResultEmotionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('hearing');
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedCriteria, setExpandedCriteria] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const overallScore = 71;

  const scenario = {
    title: "新規開拓：IT企業への営業提案",
    premise: "中小IT企業の社長に対して、業務効率化ツールの提案を行う",
    goal: "課題を引き出し、具体的な提案で関心を獲得する",
    userRole: "営業担当者",
    aiRole: "IT企業社長"
  };

  // 感情解析モックデータ
  const emotionMetrics = {
    userEmotionStability: 78, // 自己感情安定度
    customerTrustChange: 65,  // 顧客信頼度変化
    negativeDetections: 3,    // ネガティブ検出回数
    positiveSignals: 8        // ポジティブシグナル発生回数
  };

  // 時系列感情データ
  const emotionTimelineData: EmotionTimelineData[] = [
    { timestamp: 0, userStress: 30, userConfidence: 70, customerTrust: 50, customerInterest: 40, customerSatisfaction: 50 },
    { timestamp: 60, userStress: 25, userConfidence: 75, customerTrust: 55, customerInterest: 60, customerSatisfaction: 55 },
    { timestamp: 120, userStress: 35, userConfidence: 65, customerTrust: 60, customerInterest: 70, customerSatisfaction: 62 },
    { timestamp: 180, userStress: 40, userConfidence: 60, customerTrust: 65, customerInterest: 65, customerSatisfaction: 65 },
    { timestamp: 240, userStress: 45, userConfidence: 55, customerTrust: 60, customerInterest: 55, customerSatisfaction: 58 },
    { timestamp: 300, userStress: 35, userConfidence: 70, customerTrust: 75, customerInterest: 80, customerSatisfaction: 75 },
    { timestamp: 360, userStress: 30, userConfidence: 75, customerTrust: 80, customerInterest: 85, customerSatisfaction: 78 },
    { timestamp: 420, userStress: 25, userConfidence: 80, customerTrust: 85, customerInterest: 90, customerSatisfaction: 82 },
    { timestamp: 480, userStress: 20, userConfidence: 85, customerTrust: 90, customerInterest: 85, customerSatisfaction: 85 },
    { timestamp: 512, userStress: 15, userConfidence: 90, customerTrust: 95, customerInterest: 88, customerSatisfaction: 88 }
  ];

  // 押しどころ（ポジティブシグナル）
  const positiveSignals = [
    {
      timestamp: 300,
      type: '信頼獲得',
      description: 'お客様が具体的な課題を詳しく話し始めた瞬間',
      impact: 'high'
    },
    {
      timestamp: 420,
      type: '共感共鳴',
      description: '「まさにそれが一番の問題なんです」という強い同意',
      impact: 'high'
    },
    {
      timestamp: 480,
      type: '関心向上',
      description: '導入コストや実装期間について積極的に質問',
      impact: 'medium'
    }
  ];

  const evaluationCategories: EvaluationCategory[] = [
    {
      id: 'hearing',
      title: 'ヒアリング',
      subtitle: '顧客の現状や課題、ニーズを十分に引き出せているか',
      score: 85,
      overallJudgment: 'good',
      icon: <MessageSquare className="w-5 h-5" />,
      criteria: [
        {
          id: 'open_questions',
          title: 'オープンクエスチョンを効果的に活用している',
          judgment: 'good',
          reason: '「現在の業務で一番時間がかかっているのはどのような作業ですか？」など、相手の状況を深掘りする質問ができている',
          evidence: '「現在の業務で一番時間がかかっているのはどのような作業ですか？」'
        },
        {
          id: 'listening',
          title: '相手の発言を最後まで聞いている',
          judgment: 'good',
          reason: '相手の回答を遮ることなく、適切なタイミングで次の質問に移行している',
        },
        {
          id: 'followup',
          title: '回答に対する適切なフォローアップができている',
          judgment: 'warning',
          reason: '基本的な質問はできているが、より深い課題の掘り下げが不足している',
          evidence: '「なるほど、それは大変ですね」で終わってしまい、具体的な影響について追求できていない'
        }
      ],
      improvement: '相手の回答に対して「具体的にはどのような影響がありますか？」「それによってどんな問題が生じていますか？」など、さらに深掘りする質問を追加しましょう。'
    },
    {
      id: 'proposal',
      title: '提案力',
      subtitle: '顧客のニーズに合った適切な提案ができているか',
      score: 68,
      overallJudgment: 'warning',
      icon: <TrendingUp className="w-5 h-5" />,
      criteria: [
        {
          id: 'needs_match',
          title: 'ヒアリング内容を踏まえた提案になっている',
          judgment: 'good',
          reason: '顧客が抱える「手作業による時間ロス」の課題に対して、自動化ツールの提案を行っている',
        },
        {
          id: 'concrete',
          title: '具体的なメリットを数値で示している',
          judgment: 'warning',
          reason: '「効率化できます」という抽象的な表現に留まり、具体的な削減時間や費用対効果が示せていない',
        },
        {
          id: 'differentiation',
          title: '競合との差別化ポイントが明確',
          judgment: 'bad',
          reason: '他社製品との違いについて言及できておらず、なぜこの製品を選ぶべきかが不明確',
        }
      ],
      improvement: '提案時には「月間○○時間の削減」「年間○○万円のコスト削減」など具体的な数値を示し、競合他社との明確な差別化ポイントを説明しましょう。'
    },
    {
      id: 'qa',
      title: '質疑応答',
      subtitle: '顧客の質問や懸念に的確に応答できているか',
      score: 72,
      overallJudgment: 'warning',
      icon: <Users className="w-5 h-5" />,
      criteria: [
        {
          id: 'quick_response',
          title: '質問に対して迅速に回答している',
          judgment: 'good',
          reason: '相手の質問を正しく理解し、適切なタイミングで回答できている',
        },
        {
          id: 'accurate',
          title: '回答内容が正確で具体的',
          judgment: 'warning',
          reason: '基本的な回答はできているが、技術的な詳細について曖昧な部分がある',
          evidence: '「詳細は技術部門に確認します」という回答が多く、その場で答えられない質問が複数あった'
        }
      ],
      improvement: 'よくある質問については事前に準備し、技術的な詳細についても基本的な内容は答えられるようにしておきましょう。'
    },
    {
      id: 'explanation',
      title: '説明力',
      subtitle: '分かりやすく論理的な説明ができているか',
      score: 65,
      overallJudgment: 'warning',
      icon: <Target className="w-5 h-5" />,
      criteria: [
        {
          id: 'logical',
          title: '論理的な順序で説明している',
          judgment: 'warning',
          reason: '情報の整理が不十分で、話の流れが分かりにくい部分がある',
        },
        {
          id: 'easy_words',
          title: '相手に合わせた言葉で説明している',
          judgment: 'good',
          reason: '専門用語を避け、相手の理解レベルに合わせた説明ができている',
        }
      ],
      improvement: '説明する際は「結論→理由→具体例」の順序を意識し、要点を整理してから話すようにしましょう。'
    },
    {
      id: 'empathy',
      title: '寄り添い',
      subtitle: '顧客の立場に立った共感的な対応ができているか',
      score: 78,
      overallJudgment: 'good',
      icon: <Heart className="w-5 h-5" />,
      criteria: [
        {
          id: 'understanding',
          title: '相手の課題や困りごとに共感を示している',
          judgment: 'good',
          reason: '「それは本当に大変ですね」「お忙しい中お時間をいただき」など、適切な共感表現ができている',
          evidence: '「月末の作業が大変で」→「それは本当に大変ですね。毎月その作業にどのくらいの時間を取られているのですか？」'
        },
        {
          id: 'tone',
          title: '適切な話し方・態度で接している',
          judgment: 'good',
          reason: '丁寧で親しみやすい口調を保ち、相手との距離感を適切に保っている',
        }
      ],
      improvement: '既に良好な関係構築ができています。この調子で相手の立場に立った提案を心がけてください。'
    }
  ];

  const conversations: ConversationEntry[] = [
    {
      id: '1',
      speaker: 'user',
      text: 'おはようございます。本日はお忙しい中お時間をいただき、ありがとうございます。',
      timestamp: 0,
      tags: ['挨拶', '感謝'],
      favorabilityPoints: 2,
      emotionScores: { userStress: 30, userConfidence: 70, customerTrust: 50, customerInterest: 40 }
    },
    {
      id: '2',
      speaker: 'ai',
      text: 'こちらこそ、よろしくお願いします。どのようなご提案でしょうか？',
      timestamp: 3,
      tags: ['応答']
    },
    {
      id: '3',
      speaker: 'user',
      text: '現在の業務で一番時間がかかっているのはどのような作業ですか？',
      timestamp: 8,
      tags: ['ヒアリング', 'オープンクエスチョン'],
      favorabilityPoints: 3,
      emotionScores: { userStress: 25, userConfidence: 75, customerTrust: 55, customerInterest: 60 }
    },
    {
      id: '4',
      speaker: 'ai',
      text: '月末の売上集計や請求書作成が一番大変ですね。手作業で行っているので、毎月3日ほどかかってしまいます。',
      timestamp: 12,
      tags: ['課題提示']
    },
    {
      id: '5',
      speaker: 'user',
      text: 'それは本当に大変ですね。毎月その作業にどのくらいの時間を取られているのですか？',
      timestamp: 18,
      tags: ['共感', 'フォローアップ'],
      favorabilityPoints: 2,
      emotionScores: { userStress: 35, userConfidence: 65, customerTrust: 60, customerInterest: 70 }
    },
    {
      id: '6',
      speaker: 'ai',
      text: '私と経理担当で大体48時間くらいでしょうか。その間は他の業務が止まってしまうのが痛いです。',
      timestamp: 25,
      tags: ['具体的回答']
    },
    {
      id: '7',
      speaker: 'user',
      text: '弊社の業務効率化ツールを使えば、その作業を大幅に短縮できます。自動化により効率化が可能です。',
      timestamp: 32,
      tags: ['提案', '抽象的'],
      favorabilityPoints: 1,
      emotionScores: { userStress: 35, userConfidence: 70, customerTrust: 75, customerInterest: 80 }
    },
    {
      id: '8',
      speaker: 'ai',
      text: '具体的にはどのような機能があるのですか？導入コストも気になります。',
      timestamp: 38,
      tags: ['質問', '懸念'],
      emotionScores: { userStress: 25, userConfidence: 80, customerTrust: 85, customerInterest: 90 }
    }
  ];

  const summary = {
    averageCharsPerMinute: 464,
    totalExchanges: 8,
    duration: '8分32秒'
  };

  const getJudgmentIcon = (judgment: JudgmentType) => {
    switch (judgment) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'bad':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getJudgmentColor = (judgment: JudgmentType) => {
    switch (judgment) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'bad':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEmotionColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const toggleCriteria = (criteriaId: string) => {
    setExpandedCriteria(prev =>
      prev.includes(criteriaId)
        ? prev.filter(id => id !== criteriaId)
        : [...prev, criteriaId]
    );
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const jumpToTimestamp = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="sticky top-0 bg-white shadow-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-6">
              <button
                onClick={() => scrollToSection('overview')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                概要
              </button>
              <button
                onClick={() => scrollToSection('emotion-analysis')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                感情解析
              </button>
              <button
                onClick={() => scrollToSection('evaluation')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                評価
              </button>
              <button
                onClick={() => scrollToSection('conversation')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                会話ログ
              </button>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                <Save className="w-4 h-4" />
                <span>履歴保存</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4" />
                <span>PDF出力</span>
              </button>
              <button
                onClick={() => router.push('/roleplay')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>再挑戦</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Section */}
        <section id="overview" className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Overall Score */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">総合スコア</h2>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallScore / 100)}`}
                      className={getScoreColor(overallScore)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                      {overallScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluation Tabs */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">評価観点</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {evaluationCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveTab(category.id);
                      scrollToSection('evaluation');
                    }}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      activeTab === category.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      {category.icon}
                    </div>
                    <div className="text-sm font-medium">{category.title}</div>
                    <div className={`text-lg font-bold ${getScoreColor(category.score)}`}>
                      {category.score}点
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scenario Info */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">シナリオ情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">案件タイトル</h3>
                <p className="text-gray-900">{scenario.title}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">シーンの前提</h3>
                <p className="text-gray-900">{scenario.premise}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">ゴール</h3>
                <p className="text-gray-900">{scenario.goal}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">役割</h3>
                <p className="text-gray-900">
                  <span className="block">あなた: {scenario.userRole}</span>
                  <span className="block">相手: {scenario.aiRole}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Emotion Analysis Section */}
        <section id="emotion-analysis" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">感情解析結果</h2>

          {/* Emotion Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold">自己感情安定度</h3>
                </div>
                <span className={`text-2xl font-bold ${getEmotionColor(emotionMetrics.userEmotionStability)}`}>
                  {emotionMetrics.userEmotionStability}%
                </span>
              </div>
              <p className="text-sm text-gray-600">ストレスレベルの変動を抑え、安定した営業ができています。</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">顧客信頼度変化</h3>
                </div>
                <span className={`text-2xl font-bold ${getEmotionColor(emotionMetrics.customerTrustChange)}`}>
                  +{emotionMetrics.customerTrustChange}%
                </span>
              </div>
              <p className="text-sm text-gray-600">会話を通じて顧客の信頼度が着実に向上しました。</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold">ネガティブ検出</h3>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {emotionMetrics.negativeDetections}回
                </span>
              </div>
              <p className="text-sm text-gray-600">顧客の懸念や不安を感じ取った瞬間の回数です。</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">ポジティブシグナル</h3>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {emotionMetrics.positiveSignals}回
                </span>
              </div>
              <p className="text-sm text-gray-600">顧客の関心や共感を獲得できた重要な瞬間です。</p>
            </div>
          </div>

          {/* Emotion Timeline Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">感情スコア推移</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emotionTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatTime}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    labelFormatter={(value) => `時間: ${formatTime(value as number)}`}
                    formatter={(value, name) => {
                      const labels: { [key: string]: string } = {
                        'userStress': 'あなたのストレス',
                        'userConfidence': 'あなたの自信',
                        'customerTrust': '顧客の信頼',
                        'customerInterest': '顧客の関心',
                        'customerSatisfaction': '顧客の満足度'
                      };
                      return [`${value}%`, labels[name as string] || name];
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="userStress"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="あなたのストレス"
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="userConfidence"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="あなたの自信"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="customerTrust"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="顧客の信頼"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="customerInterest"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="顧客の関心"
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="customerSatisfaction"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="顧客の満足度"
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 押しどころ（ポジティブシグナル）*/}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">押しどころ（ポジティブシグナル）</h3>
            <div className="space-y-4">
              {positiveSignals.map((signal, index) => (
                <div key={index} className={`border-l-4 pl-4 py-3 ${
                  signal.impact === 'high' ? 'border-green-500 bg-green-50' :
                  signal.impact === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Zap className={`w-4 h-4 ${
                        signal.impact === 'high' ? 'text-green-600' :
                        signal.impact === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <span className="font-medium">{signal.type}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        signal.impact === 'high' ? 'bg-green-200 text-green-800' :
                        signal.impact === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {signal.impact === 'high' ? '高インパクト' :
                         signal.impact === 'medium' ? '中インパクト' : '低インパクト'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{formatTime(signal.timestamp)}</span>
                  </div>
                  <p className="text-gray-700">{signal.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 改善提案 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mt-8">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">感情解析に基づく改善提案</h3>
            </div>
            <div className="space-y-3 text-blue-800">
              <p>
                <strong>✓ 優れた点：</strong>
                会話後半（5分以降）で顧客の信頼度と関心度が大幅に向上しており、関係構築が成功しています。
                自己感情も安定しており、冷静な対応ができていました。
              </p>
              <p>
                <strong>⚠ 改善点：</strong>
                会話中盤（3-4分）でストレスレベルが上昇し、自信が低下する場面がありました。
                この時期により具体的な提案を準備しておくことで、さらなる安定感を得られるでしょう。
              </p>
              <p>
                <strong>💡 次回への提案：</strong>
                ポジティブシグナルを検出した瞬間（特に5分と7分の地点）では、さらに積極的に深掘りや提案を行うことで、
                より高い成果を期待できます。
              </p>
            </div>
          </div>
        </section>

        {/* Evaluation Details Section */}
        <section id="evaluation" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">観点別評価詳細</h2>

          {evaluationCategories.map((category, index) => (
            <div key={category.id} className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500">#{String(index + 1).padStart(2, '0')}</span>
                    {category.icon}
                    <h3 className="text-xl font-bold">{category.title}</h3>
                    {getJudgmentIcon(category.overallJudgment)}
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                    {category.score}点
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{category.subtitle}</p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {category.criteria.map((criterion) => (
                    <div key={criterion.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleCriteria(criterion.id)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          {getJudgmentIcon(criterion.judgment)}
                          <span className="font-medium">{criterion.title}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm border ${getJudgmentColor(criterion.judgment)}`}>
                          {criterion.judgment === 'good' ? '○' : criterion.judgment === 'warning' ? '△' : '×'}
                        </div>
                      </button>

                      {expandedCriteria.includes(criterion.id) && (
                        <div className="px-4 pb-4 border-t border-gray-100">
                          <div className="mt-3">
                            <h4 className="font-medium text-gray-700 mb-2">判定理由</h4>
                            <p className="text-gray-600 mb-3">{criterion.reason}</p>

                            {criterion.evidence && (
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">発話エビデンス</h4>
                                <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                                  <p className="text-gray-700 italic">&quot;{criterion.evidence}&quot;</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">改善提案</h4>
                  <p className="text-blue-800">{category.improvement}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Conversation Log Section */}
        <section id="conversation" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">会話ログ</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Roleplay Screenshot */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">録画されたロープレ</h3>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src="/images/avatar.png"
                  alt="ロールプレイ画面のスクリーンショット"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Avatar image failed to load');
                    // Fallback display
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                          <div class="text-center">
                            <div class="w-16 h-16 text-gray-400 mx-auto mb-2">📹</div>
                            <p class="text-gray-500">ロールプレイ画面</p>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? '停止' : '再生'}</span>
                </button>
              </div>

              {/* Summary Info */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{summary.averageCharsPerMinute}</div>
                  <div className="text-sm text-gray-500">文字/分</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{summary.totalExchanges}</div>
                  <div className="text-sm text-gray-500">ラリー数</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{summary.duration}</div>
                  <div className="text-sm text-gray-500">合計時間</div>
                </div>
              </div>
            </div>

            {/* Conversation List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">発話ログ一覧</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => jumpToTimestamp(conv.timestamp)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          conv.speaker === 'user' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <span className={`font-medium text-sm ${
                          conv.speaker === 'user' ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {conv.speaker === 'user' ? 'あなた' : '相手'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {Math.floor(conv.timestamp / 60)}:{String(conv.timestamp % 60).padStart(2, '0')}
                      </span>
                    </div>

                    <p className="text-gray-900 mb-2 text-sm leading-relaxed">{conv.text}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {conv.tags?.map((tag) => (
                          <span key={tag} className={`px-2 py-1 text-xs rounded ${
                            conv.speaker === 'user'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      {conv.favorabilityPoints && (
                        <span className="text-sm text-green-600 font-medium">
                          +{conv.favorabilityPoints}pt
                        </span>
                      )}
                    </div>

                    {/* Emotion Scores for User Messages */}
                    {conv.speaker === 'user' && conv.emotionScores && (
                      <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-red-600 font-medium">{conv.emotionScores.userStress}%</div>
                          <div className="text-gray-500">ストレス</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-600 font-medium">{conv.emotionScores.userConfidence}%</div>
                          <div className="text-gray-500">自信</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-600 font-medium">{conv.emotionScores.customerTrust}%</div>
                          <div className="text-gray-500">信頼</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-600 font-medium">{conv.emotionScores.customerInterest}%</div>
                          <div className="text-gray-500">関心</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}