"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ScenarioSelection } from "@/components/roleplay/ScenarioSelection";
import { StaticVRMAvatar } from "@/components/roleplay/StaticVRMAvatar";
import { Mic, MicOff, Pause, CheckCircle, Loader2 } from "lucide-react";
import Papa from "papaparse";
import { DifficultyLevel } from "@prisma/client";

interface Scenario {
  id: string;
  title: string;
  description: string;
  industry: string;
  difficulty: DifficultyLevel;
  type: string;
  character: {
    name: string;
    role: string;
    personality: string;
  };
}

interface ConversationEntry {
  id: string;
  speaker: 'user' | 'ai';
  text: string;
  timestamp: string;
  evaluationTags?: string[];
  favorabilityPoints?: number;
}

interface ScenarioData {
  role: 'user' | 'ai';
  text: string;
}

export default function RoleplayPage() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [isMicOn, setIsMicOn] = useState(false);
  const [currentEmotion] = useState({
    happiness: 6,
    sadness: 2,
    anger: 1,
    surprise: 2,
    fear: 1,
    neutral: 5
  });
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 会話モック関連の状態
  const [scenarioData, setScenarioData] = useState<ScenarioData[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStep, setConversationStep] = useState<'ready' | 'recording' | 'responding'>('ready');

  // 会話ログの自動スクロール用ref
  const conversationLogRef = useRef<HTMLDivElement>(null);

  // scenarioDataの変更を監視
  useEffect(() => {
    console.log('scenarioData state changed:', scenarioData);
  }, [scenarioData]);

  const handleScenarioSelect = async (scenario: Scenario) => {
    setSelectedScenario(scenario);

    // シナリオ選択後、少し遅延してセッションを自動開始
    setTimeout(async () => {
      await handleSessionStart();
    }, 500);
  };

  // CSVシナリオを読み込む
  const loadScenario = async () => {
    try {
      console.log('Loading scenario CSV...');
      const response = await fetch('/scenario.csv');
      console.log('CSV response status:', response.status);
      const csvText = await response.text();
      console.log('CSV text length:', csvText.length);
      console.log('CSV text preview:', csvText.substring(0, 200));

      Papa.parse<ScenarioData>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('Papa.parse complete callback called');
          console.log('Raw results:', results);
          console.log('Loaded scenario data:', results.data);
          console.log('Data length:', results.data.length);
          console.log('First item:', results.data[0]);
          console.log('Errors:', results.errors);
          setScenarioData(results.data);
          console.log('setScenarioData called with:', results.data);
        },
        error: (error: Error) => {
          console.error('CSV parsing error:', error);
        }
      });
    } catch (error) {
      console.error('Failed to load scenario:', error);
    }
  };

  const handleSessionStart = async () => {
    console.log('Session start called');
    setIsSessionActive(true);

    // 会話ログをクリア
    setConversations([]);
    setCurrentScenarioIndex(0);
    setConversationStep('ready');

    // CSVシナリオを読み込み
    console.log('About to load scenario...');
    await loadScenario();
    console.log('Scenario loading completed');

    console.log('Session initialization completed');
  };


  const handleSessionPause = () => {
    setIsSessionActive(false);
  };

  const handleSessionComplete = () => {
    // Navigate to result page
    router.push('/roleplay-result');
  };

  // Enterキーが押されたときの処理
  const handleEnterPress = useCallback(() => {
    console.log('handleEnterPress called', {
      isSessionActive,
      currentScenarioIndex,
      scenarioDataLength: scenarioData.length,
      conversationStep,
      scenarioData
    });

    if (!isSessionActive || currentScenarioIndex >= scenarioData.length) return;

    if (conversationStep === 'ready') {
      // ステップ1: 「音声を記録中」を表示
      setConversationStep('recording');
      setIsLoading(true);
    } else if (conversationStep === 'recording') {
      // ステップ2: ユーザー側の会話を表示
      const currentData = scenarioData[currentScenarioIndex];
      if (currentData && currentData.role === 'user') {
        const newConversation: ConversationEntry = {
          id: Date.now().toString(),
          speaker: 'user',
          text: currentData.text,
          timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
          evaluationTags: ['ヒアリング', '質問'],
          favorabilityPoints: Math.floor(Math.random() * 3) + 1
        };

        setConversations(prev => [...prev, newConversation]);
        setCurrentScenarioIndex(prev => prev + 1);
        setConversationStep('responding');
        setIsLoading(false);

        // 新しいメッセージが追加された後、最下部にスクロール
        setTimeout(() => {
          if (conversationLogRef.current) {
            conversationLogRef.current.scrollTop = conversationLogRef.current.scrollHeight;
          }
        }, 100);
      }
    } else if (conversationStep === 'responding') {
      // ステップ3: 「応答を生成中...」を表示してAI応答
      setIsLoading(true);
      setIsSpeaking(true);

      const delay = 2000 + Math.random() * 1000; // 2-3秒のランダム遅延

      setTimeout(() => {
        const currentData = scenarioData[currentScenarioIndex];
        if (currentData && currentData.role === 'ai') {
          const newConversation: ConversationEntry = {
            id: Date.now().toString(),
            speaker: 'ai',
            text: currentData.text,
            timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
            evaluationTags: ['応答', '説明'],
            favorabilityPoints: undefined
          };

          setConversations(prev => [...prev, newConversation]);
          setCurrentScenarioIndex(prev => prev + 1);

          // 新しいメッセージが追加された後、最下部にスクロール
          setTimeout(() => {
            if (conversationLogRef.current) {
              conversationLogRef.current.scrollTop = conversationLogRef.current.scrollHeight;
            }
          }, 100);
        }

        setIsLoading(false);
        setIsSpeaking(false);
        setConversationStep('ready'); // 次のサイクルに戻る
      }, delay);
    }
  }, [isSessionActive, currentScenarioIndex, scenarioData, conversationStep, setConversations, setCurrentScenarioIndex, setConversationStep, setIsLoading, setIsSpeaking]);

  // Enterキー押下で会話を進める
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.key, 'isSessionActive:', isSessionActive);
      if (e.key === 'Enter' && isSessionActive) {
        e.preventDefault();
        console.log('Enter pressed, conversationStep:', conversationStep, 'isLoading:', isLoading);
        // responding状態でisLoadingがtrueの場合は何もしない（AI応答待ち中）
        if (conversationStep === 'responding' && isLoading) {
          console.log('Blocked: AI responding');
          return;
        }
        handleEnterPress();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isSessionActive, conversationStep, isLoading, handleEnterPress]);


  if (!selectedScenario) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Roleplay for CAC Identity</h1>
          <p className="text-gray-600">
            リアルなビジネスシーンでAIと練習し、感情分析を通じて商談スキルを向上させましょう
          </p>
        </div>
        <ScenarioSelection onScenarioSelect={handleScenarioSelect} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Conversation Log */}
        <div className="w-80 bg-gray-50 border-r flex flex-col">
          {/* Scenario Info Card */}
          <div className="bg-white m-3 p-3 rounded-lg shadow-sm border flex-shrink-0">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">{selectedScenario.title}</h3>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">前提:</span> {selectedScenario.description}</p>
              <p><span className="font-medium">ゴール:</span> 課題を引き出し、具体的な提案で関心を獲得する</p>
              <p><span className="font-medium">役割:</span> あなた: 営業担当者 / 相手: {selectedScenario.character.role}</p>
            </div>
          </div>

          {/* Conversation Log */}
          <div className="flex-1 px-3 pb-3 min-h-0">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">会話ログ</h3>
            <div ref={conversationLogRef} className="space-y-2 h-full overflow-y-auto">
              {conversations.map((conv) => (
                <div key={conv.id} className="bg-white p-2 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium text-xs ${
                      conv.speaker === 'user' ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {conv.speaker === 'user' ? 'あなた' : selectedScenario.character.name}
                    </span>
                    <span className="text-xs text-gray-500">{conv.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-900 mb-1 leading-relaxed">{conv.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {conv.evaluationTags?.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {conv.favorabilityPoints && (
                      <span className="text-xs text-green-600 font-medium">
                        好感度+{conv.favorabilityPoints}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Animation */}
              {isLoading && (
                <div className="bg-white p-3 rounded-lg shadow-sm border flex items-center space-x-2">
                  <Loader2 className={`w-4 h-4 animate-spin ${conversationStep === 'recording' ? 'text-red-500' : 'text-blue-500'}`} />
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    {conversationStep === 'recording' ? '音声を記録中...' : '応答を生成中...'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Area - AI Avatar */}
        <div className="flex-1 bg-gradient-to-b from-blue-50 to-white relative min-h-0">
          {/* VRM Avatar Display */}
          <div className="absolute inset-0">
            <StaticVRMAvatar
              currentEmotion={currentEmotion}
              isSpeaking={isSpeaking}
              characterName={selectedScenario.character.name}
              characterRole={selectedScenario.character.role}
            />
          </div>


          {/* Control Buttons (Top Right) */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {/* マイクコントロール */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full transition-colors ${
                isMicOn ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button
              onClick={handleSessionPause}
              className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              <Pause className="w-4 h-4" />
              <span>中断する</span>
            </button>
            <button
              onClick={handleSessionComplete}
              className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>完了する</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}