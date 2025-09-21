"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function AvatarDemoPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const vrmRef = useRef<VRM>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const expressionTimerRef = useRef<NodeJS.Timeout>();

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentExpression, setCurrentExpression] = useState("neutral");
  const [avatarPosition, setAvatarPosition] = useState({ x: 0, y: -1.2, z: -0.15 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Three.js基本設定
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // レンダラーのサイズ設定
    const canvasWidth = 800;
    const canvasHeight = 600;

    const camera = new THREE.PerspectiveCamera(
      30,
      canvasWidth / canvasHeight, // キャンバスのアスペクト比を使用
      0.1,
      1000
    );
    camera.position.set(0, 0.5, 1.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // ライティング
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // リサイズハンドリング
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        const aspect = canvasWidth / canvasHeight;
        cameraRef.current.aspect = aspect;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(canvasWidth, canvasHeight);

        // 再レンダリング
        if (sceneRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // VRMローダー
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(
      "/models/character.vrm",
      (gltf) => {
        const vrm = gltf.userData.vrm as VRM;
        if (vrm) {
          // VRM位置とスケール調整
          vrm.scene.position.set(avatarPosition.x, avatarPosition.y, avatarPosition.z);
          vrm.scene.scale.setScalar(1.0); // スケール調整
          vrm.scene.rotation.y = Math.PI; // 前向きに

          scene.add(vrm.scene);
          vrmRef.current = vrm;
          setIsLoaded(true);

          // 初期レンダリング
          camera.lookAt(0, 0, 0);
          renderer.render(scene, camera);

          // 表情変更開始
          startExpressionCycle();

          console.log("VRM loaded successfully");
        }
      },
      undefined,
      (error) => {
        console.error("VRM loading error:", error);
        setError("VRMの読み込みに失敗しました");
      }
    );

    // クリーンアップ
    return () => {
      if (expressionTimerRef.current) {
        clearInterval(expressionTimerRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        try {
          mountRef.current.removeChild(renderer.domElement);
        } catch (e) {
          console.warn("Renderer cleanup error:", e);
        }
      }
      renderer.dispose();
    };
  }, []);

  // アバター位置変更のuseEffect
  useEffect(() => {
    if (vrmRef.current && rendererRef.current && sceneRef.current && cameraRef.current) {
      vrmRef.current.scene.position.set(avatarPosition.x, avatarPosition.y, avatarPosition.z);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [avatarPosition]);

  const updateAvatarPosition = (axis: 'x' | 'y' | 'z', value: number) => {
    setAvatarPosition(prev => ({ ...prev, [axis]: value }));
  };

  const startExpressionCycle = () => {
    const expressions = ["neutral", "happy", "sad", "surprised", "angry"];
    let currentIndex = 0;

    const changeExpression = () => {
      if (!vrmRef.current?.expressionManager) return;

      // 全表情をリセット
      expressions.forEach(exp => {
        try {
          vrmRef.current?.expressionManager?.setValue(exp, 0);
        } catch (e) {
          // 表情が存在しない場合はスキップ
        }
      });

      // 現在の表情を適用
      const expression = expressions[currentIndex];
      try {
        vrmRef.current.expressionManager.setValue(expression, 1.0);
        setCurrentExpression(expression);
        console.log(`Expression changed to: ${expression}`);
      } catch (e) {
        console.warn(`Expression ${expression} not found`);
      }

      // VRM更新とレンダリング
      if (vrmRef.current) {
        vrmRef.current.update(0.016);
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      // 次の表情へ
      currentIndex = (currentIndex + 1) % expressions.length;
    };

    // 5秒ごとに表情変更
    expressionTimerRef.current = setInterval(changeExpression, 5000);

    // 初回実行
    setTimeout(changeExpression, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
          VRM Avatar Demo
        </h1>

        <div className="flex flex-col items-center space-y-4">
          {/* VRMビューア */}
          <div className="relative bg-gray-50 rounded-lg overflow-hidden border">
            <div
              ref={mountRef}
              style={{ width: '800px', height: '600px' }}
              className="block"
            />

            {/* ローディング状態 */}
            {!isLoaded && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-700 font-medium">VRM読み込み中...</p>
              </div>
            )}

            {/* エラー状態 */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50/90">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-red-700 font-medium text-center">{error}</p>
              </div>
            )}
          </div>

          {/* 位置調整コントロール */}
          {isLoaded && (
            <div className="w-full max-w-md space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-center text-gray-900">位置調整</h3>

              {/* X軸 (左右) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  左右 (X): {avatarPosition.x.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.05"
                  value={avatarPosition.x}
                  onChange={(e) => updateAvatarPosition('x', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Y軸 (上下) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  上下 (Y): {avatarPosition.y.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-2"
                  max="1"
                  step="0.05"
                  value={avatarPosition.y}
                  onChange={(e) => updateAvatarPosition('y', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Z軸 (前後) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  前後 (Z): {avatarPosition.z.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.05"
                  value={avatarPosition.z}
                  onChange={(e) => updateAvatarPosition('z', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* リセットボタン */}
              <button
                onClick={() => setAvatarPosition({ x: 0, y: -1.2, z: -0.15 })}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                デフォルト位置に戻す
              </button>
            </div>
          )}

          {/* 状態表示 */}
          {isLoaded && (
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                現在の表情: <span className="font-semibold text-blue-600">{currentExpression}</span>
              </p>
              <p className="text-xs text-gray-500">
                表情は5秒ごとに自動的に変更されます
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}