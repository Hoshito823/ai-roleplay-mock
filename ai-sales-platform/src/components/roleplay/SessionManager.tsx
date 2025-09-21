"use client";

import { useState, useEffect } from "react";

interface SessionManagerProps {
  isActive: boolean;
  onStart: () => void;
  onEnd: () => void;
}

export function SessionManager({ isActive, onStart, onEnd }: SessionManagerProps) {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // タイマー更新
  useEffect(() => {
    if (!isActive || isPaused || !startTime) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, startTime]);

  const handleStart = () => {
    setStartTime(new Date());
    setElapsedTime(0);
    setIsPaused(false);
    setShowSummary(false);
    onStart();
  };

  const handleEnd = () => {
    setShowSummary(true);
    // 2秒後にサマリーを閉じてセッション終了
    setTimeout(() => {
      setShowSummary(false);
      setStartTime(null);
      setElapsedTime(0);
      setIsPaused(false);
      onEnd();
    }, 3000);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getSessionRating = () => {
    if (elapsedTime < 300) return { rating: "短時間", color: "text-yellow-600", icon: "⚡" };
    if (elapsedTime < 900) return { rating: "適切", color: "text-green-600", icon: "✅" };
    if (elapsedTime < 1800) return { rating: "充実", color: "text-blue-600", icon: "🎯" };
    return { rating: "長時間", color: "text-purple-600", icon: "🏆" };
  };

  // セッション終了時のサマリーモーダル
  if (showSummary) {
    const sessionRating = getSessionRating();
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              セッション完了！
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">セッション時間</span>
                    <div className="font-semibold text-lg">{formatTime(elapsedTime)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">評価</span>
                    <div className={`font-semibold text-lg ${sessionRating.color}`}>
                      {sessionRating.icon} {sessionRating.rating}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                お疲れ様でした！詳細な分析結果は履歴からご確認いただけます。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="flex items-center space-x-4">
        <button
          onClick={handleStart}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          セッション開始
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Timer */}
      <div className="bg-gray-100 px-4 py-2 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">時間:</span>
          <span className="font-mono text-lg font-semibold text-gray-900">
            {formatTime(elapsedTime)}
          </span>
          {isPaused && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              一時停止中
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePause}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          {isPaused ? "再開" : "一時停止"}
        </button>
        <button
          onClick={handleEnd}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          終了
        </button>
      </div>

      {/* Session Info */}
      <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${isPaused ? "bg-yellow-400" : "bg-green-400"}`}></div>
          <span>{isPaused ? "一時停止中" : "進行中"}</span>
        </div>
        {startTime && (
          <span>
            開始: {startTime.toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        )}
      </div>
    </div>
  );
}