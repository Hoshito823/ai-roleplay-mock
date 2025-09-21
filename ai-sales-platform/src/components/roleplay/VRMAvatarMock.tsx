"use client";

import { useState, useEffect } from "react";

interface EmotionState {
  happiness: number;
  sadness: number;
  anger: number;
  surprise: number;
  fear: number;
  neutral: number;
}

interface VRMAvatarMockProps {
  currentEmotion: EmotionState;
  isSpeaking: boolean;
  characterName: string;
  characterRole: string;
}

export function VRMAvatarMock({
  currentEmotion,
  isSpeaking,
  characterName,
  characterRole
}: VRMAvatarMockProps) {
  const [eyeBlinkAnimation, setEyeBlinkAnimation] = useState(false);
  const [headTiltAngle, setHeadTiltAngle] = useState(0);
  const [lipSyncAnimation, setLipSyncAnimation] = useState(0);

  // まばたきアニメーション
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlinkAnimation(true);
      setTimeout(() => setEyeBlinkAnimation(false), 150);
    }, 2000 + Math.random() * 3000); // 2-5秒間隔

    return () => clearInterval(blinkInterval);
  }, []);

  // 頭の動きアニメーション
  useEffect(() => {
    const headMoveInterval = setInterval(() => {
      setHeadTiltAngle(Math.random() * 10 - 5); // -5から5度
    }, 3000);

    return () => clearInterval(headMoveInterval);
  }, []);

  // リップシンクアニメーション
  useEffect(() => {
    if (isSpeaking) {
      const lipSyncInterval = setInterval(() => {
        setLipSyncAnimation(Math.random() * 0.8 + 0.2); // 0.2-1.0
      }, 100);

      return () => clearInterval(lipSyncInterval);
    } else {
      setLipSyncAnimation(0);
    }
  }, [isSpeaking]);

  // 主要感情を決定
  const getDominantEmotion = (): keyof EmotionState => {
    const emotions = Object.entries(currentEmotion);
    return emotions.reduce((max, current) =>
      current[1] > max[1] ? current : max
    )[0] as keyof EmotionState;
  };

  const dominantEmotion = getDominantEmotion();

  // 表情に基づく顔の特徴
  const getFacialFeatures = () => {
    const intensity = currentEmotion[dominantEmotion] / 10;

    switch (dominantEmotion) {
      case "happiness":
        return {
          eyeShape: eyeBlinkAnimation ? "😊" : "😊",
          eyebrowHeight: 2 + intensity * 3,
          mouthShape: `scaleY(${0.5 + intensity * 0.5})`,
          cheekColor: `rgba(255, 182, 193, ${intensity * 0.3})`,
          overallExpression: "😊"
        };
      case "sadness":
        return {
          eyeShape: eyeBlinkAnimation ? "😢" : "😢",
          eyebrowHeight: -intensity * 3,
          mouthShape: `scaleY(${1 - intensity * 0.3}) scaleX(${0.8})`,
          cheekColor: `rgba(173, 216, 230, ${intensity * 0.2})`,
          overallExpression: "😢"
        };
      case "anger":
        return {
          eyeShape: eyeBlinkAnimation ? "😠" : "😠",
          eyebrowHeight: -intensity * 4,
          mouthShape: `scaleY(${0.6}) scaleX(${1.2})`,
          cheekColor: `rgba(255, 99, 99, ${intensity * 0.4})`,
          overallExpression: "😠"
        };
      case "surprise":
        return {
          eyeShape: eyeBlinkAnimation ? "😲" : "😲",
          eyebrowHeight: 4 + intensity * 2,
          mouthShape: `scaleY(${1.5 + intensity * 0.5}) scaleX(${0.8})`,
          cheekColor: `rgba(255, 255, 255, ${intensity * 0.1})`,
          overallExpression: "😲"
        };
      case "fear":
        return {
          eyeShape: eyeBlinkAnimation ? "😰" : "😰",
          eyebrowHeight: 1 + intensity * 2,
          mouthShape: `scaleY(${0.8}) scaleX(${0.9})`,
          cheekColor: `rgba(240, 248, 255, ${intensity * 0.2})`,
          overallExpression: "😰"
        };
      default:
        return {
          eyeShape: eyeBlinkAnimation ? "😐" : "😐",
          eyebrowHeight: 0,
          mouthShape: "scale(1)",
          cheekColor: "transparent",
          overallExpression: "😐"
        };
    }
  };

  const facialFeatures = getFacialFeatures();

  return (
    <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg">
      {/* Character Info */}
      <div className="text-center mb-4">
        <h3 className="font-semibold text-gray-900">{characterName}</h3>
        <p className="text-sm text-gray-600">{characterRole}</p>
      </div>

      {/* 3D Avatar Mock Container */}
      <div className="relative bg-white rounded-lg p-8 shadow-inner min-h-96 flex flex-col items-center justify-center">
        {/* VRM-style lighting effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-gray-100 rounded-lg opacity-30"></div>

        {/* Avatar Face Mock */}
        <div
          className="relative z-10 transition-transform duration-300"
          style={{
            transform: `rotate(${headTiltAngle}deg)`,
            filter: `hue-rotate(${currentEmotion[dominantEmotion] * 5}deg)`
          }}
        >
          {/* Face Base */}
          <div className="w-32 h-40 bg-gradient-to-b from-orange-100 to-orange-200 rounded-full relative mx-auto mb-4 shadow-lg">
            {/* Cheek Color */}
            <div
              className="absolute inset-4 rounded-full transition-colors duration-500"
              style={{ backgroundColor: facialFeatures.cheekColor }}
            ></div>

            {/* Eyes */}
            <div className="absolute top-12 left-8 right-8 flex justify-between">
              <div
                className={`w-6 h-6 bg-white rounded-full flex items-center justify-center transition-all duration-200`}
                style={{
                  transform: eyeBlinkAnimation ? "scaleY(0.1)" : "scaleY(1)",
                  marginTop: `${facialFeatures.eyebrowHeight}px`
                }}
              >
                <div className="w-4 h-4 bg-amber-800 rounded-full"></div>
              </div>
              <div
                className={`w-6 h-6 bg-white rounded-full flex items-center justify-center transition-all duration-200`}
                style={{
                  transform: eyeBlinkAnimation ? "scaleY(0.1)" : "scaleY(1)",
                  marginTop: `${facialFeatures.eyebrowHeight}px`
                }}
              >
                <div className="w-4 h-4 bg-amber-800 rounded-full"></div>
              </div>
            </div>

            {/* Eyebrows */}
            <div className="absolute top-8 left-6 right-6 flex justify-between">
              <div
                className="w-8 h-1 bg-amber-700 rounded transition-all duration-300"
                style={{
                  transform: `translateY(${facialFeatures.eyebrowHeight}px) ${
                    dominantEmotion === "anger" ? "rotate(-15deg)" : "rotate(0deg)"
                  }`
                }}
              ></div>
              <div
                className="w-8 h-1 bg-amber-700 rounded transition-all duration-300"
                style={{
                  transform: `translateY(${facialFeatures.eyebrowHeight}px) ${
                    dominantEmotion === "anger" ? "rotate(15deg)" : "rotate(0deg)"
                  }`
                }}
              ></div>
            </div>

            {/* Nose */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-3 bg-orange-300 rounded-full shadow-sm"></div>
            </div>

            {/* Mouth */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
              <div
                className={`w-8 h-3 rounded-full transition-all duration-200 ${
                  dominantEmotion === "happiness" ? "bg-red-400" :
                  dominantEmotion === "sadness" ? "bg-blue-300" :
                  dominantEmotion === "anger" ? "bg-red-500" :
                  "bg-pink-300"
                }`}
                style={{
                  transform: facialFeatures.mouthShape,
                  opacity: isSpeaking ? 0.5 + lipSyncAnimation * 0.5 : 0.8
                }}
              >
                {isSpeaking && (
                  <div className="absolute inset-0 bg-black rounded-full opacity-20 animate-pulse"></div>
                )}
              </div>
            </div>
          </div>

          {/* Overall Expression Emoji (for clarity) */}
          <div className="text-center">
            <div className="text-4xl mb-2 transition-all duration-500">
              {facialFeatures.overallExpression}
            </div>
            <div className="text-xs text-gray-500">
              {dominantEmotion} ({Math.round(currentEmotion[dominantEmotion] * 10)}%)
            </div>
          </div>
        </div>

        {/* VRM Simulation Indicators */}
        <div className="absolute bottom-4 left-4 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-green-400 animate-pulse" : "bg-gray-300"}`}></div>
            <span>VRM SIM</span>
          </div>
        </div>

        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="absolute top-4 right-4">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-blue-400 rounded animate-pulse"></div>
              <div className="w-1 h-6 bg-blue-500 rounded animate-pulse" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-1 h-5 bg-blue-400 rounded animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Emotion Indicators */}
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-gray-700">BlendShape Values</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(currentEmotion).map(([emotion, value]) => (
            <div key={emotion} className="flex justify-between">
              <span className="capitalize">{emotion}:</span>
              <span className="font-mono">{(value * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* VRM Technical Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
        <div className="font-medium text-gray-700 mb-1">VRM Status (Mock)</div>
        <div className="space-y-1 text-gray-600">
          <div>• Model: business_character_01.vrm</div>
          <div>• BlendShapes: Active ({Object.keys(currentEmotion).length})</div>
          <div>• LipSync: {isSpeaking ? "Active" : "Idle"}</div>
          <div>• HeadTrack: Enabled</div>
        </div>
      </div>
    </div>
  );
}