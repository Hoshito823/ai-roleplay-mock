"use client";

import { useState } from "react";

interface Scenario {
  id: string;
  title: string;
  description: string;
  industry: string;
  difficulty: "初級" | "中級" | "上級";
  type: string;
  character: {
    name: string;
    role: string;
    personality: string;
  };
  estimatedTime: number;
  tags: string[];
}

interface ScenarioSelectionProps {
  onScenarioSelect: (scenario: Scenario) => void;
}

const SCENARIOS: Scenario[] = [
  {
    id: "7",
    title: "製造業企業へのDX提案",
    description: "中小製造業の生産管理担当者に対して、業務効率化と在庫管理の改善を目的としたクラウドソリューションを提案するシナリオ",
    industry: "製造",
    difficulty: "中級",
    type: "新規開拓",
    character: {
      name: "田中 昭仁",
      role: "情報システム部 担当者",
      personality: "現状の業務に精通しているが、新技術への理解は限定的"
    },
    estimatedTime: 20,
    tags: ["B2B", "DX推進", "在庫管理"]
  },
  {
    id: "1",
    title: "新規IT企業への提案",
    description: "成長中のスタートアップ企業に新しいソフトウェアソリューションを提案するシナリオ",
    industry: "IT",
    difficulty: "初級",
    type: "新規開拓",
    character: {
      name: "田中 雄介",
      role: "CTOディレクター",
      personality: "論理的で詳細を重視する。ROIに敏感"
    },
    estimatedTime: 15,
    tags: ["B2B", "技術提案", "コスト重視"]
  },
  {
    id: "2",
    title: "製薬会社でのクレーム対応",
    description: "医療機器の不具合に関するクレームを適切に処理し、信頼関係を回復するシナリオ",
    industry: "製薬",
    difficulty: "上級",
    type: "クレーム対応",
    character: {
      name: "佐藤 美咲",
      role: "品質管理責任者",
      personality: "厳格で安全性を最優先。感情的になりやすい"
    },
    estimatedTime: 25,
    tags: ["クレーム", "医療", "信頼回復"]
  },
  {
    id: "3",
    title: "金融機関での価格交渉",
    description: "銀行向けセキュリティシステムの価格交渉を行うシナリオ",
    industry: "金融",
    difficulty: "中級",
    type: "価格交渉",
    character: {
      name: "山田 健太郎",
      role: "調達部長",
      personality: "交渉慣れしており、コスト削減に強い関心"
    },
    estimatedTime: 20,
    tags: ["価格交渉", "セキュリティ", "B2B"]
  },
  {
    id: "4",
    title: "小売チェーンへの販売拡大提案",
    description: "既存顧客の小売チェーンに新商品ラインの導入を提案するシナリオ",
    industry: "小売",
    difficulty: "初級",
    type: "既存フォロー",
    character: {
      name: "鈴木 亜希子",
      role: "商品企画マネージャー",
      personality: "協力的だが慎重。データと実績を重視"
    },
    estimatedTime: 12,
    tags: ["既存顧客", "新商品", "データ重視"]
  },
  {
    id: "5",
    title: "大手商社での契約更新交渉",
    description: "長期パートナーシップ契約の更新交渉を行うシナリオ",
    industry: "商社",
    difficulty: "上級",
    type: "契約更新",
    character: {
      name: "高橋 直樹",
      role: "事業本部長",
      personality: "経験豊富で戦略的思考。長期的視点を重視"
    },
    estimatedTime: 30,
    tags: ["契約更新", "長期パートナー", "戦略的"]
  },
  {
    id: "6",
    title: "教育機関でのデジタル化提案",
    description: "大学に対してデジタル化ソリューションを提案するシナリオ",
    industry: "教育",
    difficulty: "中級",
    type: "新規開拓",
    character: {
      name: "小林 智子",
      role: "IT推進室長",
      personality: "イノベーションに興味があるが予算制約を気にする"
    },
    estimatedTime: 18,
    tags: ["教育", "デジタル化", "予算制約"]
  }
];

const INDUSTRIES = ["全て", "IT", "製造", "製薬", "金融", "小売", "商社", "教育"];
const DIFFICULTIES = ["全て", "初級", "中級", "上級"];
const TYPES = ["全て", "新規開拓", "既存フォロー", "クレーム対応", "価格交渉", "契約更新"];

export function ScenarioSelection({ onScenarioSelect }: ScenarioSelectionProps) {
  const [selectedIndustry, setSelectedIndustry] = useState("全て");
  const [selectedDifficulty, setSelectedDifficulty] = useState("全て");
  const [selectedType, setSelectedType] = useState("全て");

  const filteredScenarios = SCENARIOS.filter(scenario => {
    return (
      (selectedIndustry === "全て" || scenario.industry === selectedIndustry) &&
      (selectedDifficulty === "全て" || scenario.difficulty === selectedDifficulty) &&
      (selectedType === "全て" || scenario.type === selectedType)
    );
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "初級": return "bg-green-100 text-green-800";
      case "中級": return "bg-yellow-100 text-yellow-800";
      case "上級": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">フィルター</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">業界</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {INDUSTRIES.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">難易度</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {DIFFICULTIES.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">タイプ</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenarios.map(scenario => (
          <div
            key={scenario.id}
            className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onScenarioSelect(scenario)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                  {scenario.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(scenario.difficulty)}`}>
                  {scenario.difficulty}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {scenario.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">業界:</span>
                  <span className="font-medium">{scenario.industry}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">タイプ:</span>
                  <span className="font-medium">{scenario.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">予想時間:</span>
                  <span className="font-medium">{scenario.estimatedTime}分</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="mb-2">
                  <p className="text-sm text-gray-500">相手役</p>
                  <p className="font-medium text-gray-900">{scenario.character.name}</p>
                  <p className="text-sm text-gray-600">{scenario.character.role}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {scenario.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                このシナリオを開始
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredScenarios.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">選択した条件に合うシナリオがありません</p>
          <p className="text-gray-400 text-sm mt-2">フィルター条件を変更してください</p>
        </div>
      )}
    </div>
  );
}