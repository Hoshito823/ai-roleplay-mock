"use client";

// import { useState } from "react"; // 未使用のため削除

interface EmotionState {
  happiness: number;
  sadness: number;
  anger: number;
  surprise: number;
  fear: number;
  neutral: number;
}

interface StaticVRMAvatarProps {
  currentEmotion: EmotionState;
  isSpeaking: boolean;
  characterName: string;
  characterRole: string;
}

export function StaticVRMAvatar({
  currentEmotion,
  isSpeaking,
  characterName,
  characterRole,
}: StaticVRMAvatarProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Character Info - 上部に小さく表示 */}
      <div className="p-3 text-center">
        <h3 className="font-semibold text-gray-800 text-sm">{characterName}</h3>
        <p className="text-xs text-gray-600">{characterRole}</p>
        {isSpeaking && (
          <div className="flex items-center justify-center space-x-1 mt-2">
            <div className="w-1 h-2 bg-green-400 rounded animate-pulse"></div>
            <div className="w-1 h-3 bg-green-500 rounded animate-pulse" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-1 h-2 bg-green-400 rounded animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <span className="text-xs text-green-600 ml-2">話している</span>
          </div>
        )}
      </div>

      {/* Avatar Image - フルサイズ */}
      <div className="flex-1 relative flex items-center justify-center">
        <div className="w-full h-full max-w-md relative">
          <img
            src="/images/avatar.png"
            alt={`${characterName} - ${characterRole}`}
            className="w-full h-full object-cover object-center rounded-lg shadow-lg"
            onError={(e) => {
              console.error('Avatar image failed to load');
              e.currentTarget.src = '/images/avatar.jpg'; // fallback
            }}
          />

          {/* Speaking Indicator Overlay */}
          {isSpeaking && (
            <div className="absolute bottom-4 left-4 bg-green-500/90 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>話し中</span>
            </div>
          )}

          {/* Emotion Indicator (optional) */}
          <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {currentEmotion.happiness > 5 ? '😊' :
             currentEmotion.anger > 5 ? '😠' :
             currentEmotion.sadness > 5 ? '😢' :
             currentEmotion.surprise > 5 ? '😮' : '😐'}
          </div>
        </div>
      </div>
    </div>
  );
}