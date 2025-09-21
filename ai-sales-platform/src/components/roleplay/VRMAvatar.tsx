"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface EmotionState {
  happiness: number;
  sadness: number;
  anger: number;
  surprise: number;
  fear: number;
  neutral: number;
}

interface VRMAvatarProps {
  currentEmotion: EmotionState;
  isSpeaking: boolean;
  characterName: string;
  characterRole: string;
  vrmUrl?: string;
}

export function VRMAvatar({
  currentEmotion,
  isSpeaking,
  characterName,
  characterRole,
  vrmUrl = "character.vrm"
}: VRMAvatarProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const vrmRef = useRef<VRM>();
  const animationIdRef = useRef<number>();
  const testCubeRef = useRef<THREE.Mesh>();

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // コンソールエラーを捕捉
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('filesystem')) {
        // ファイルシステム関連の警告は無視
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  // BlendShape名のマッピング（標準的なVRMのBlendShape名）
  const blendShapeMap = {
    happiness: ["happy", "joy", "smile"],
    sadness: ["sad", "sorrow"],
    anger: ["angry", "mad"],
    surprise: ["surprised", "shock"],
    fear: ["fearful", "afraid"],
    neutral: ["neutral", "default"]
  };

  // Three.jsシーンの初期化
  useEffect(() => {
    if (!mountRef.current) {
      console.error("Mount ref not available");
      return;
    }

    // 既存のアニメーションがあればクリア
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = undefined;
    }

    console.log("Initializing Three.js scene");

    // シーン作成
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // スカイブルーで見えやすく
    sceneRef.current = scene;

    // カメラ作成
    const camera = new THREE.PerspectiveCamera(
      75, // 視野角を広く
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000 // 遠クリップ面を大きく
    );
    camera.position.set(0, 0, 50); // 非常に遠くに配置
    camera.lookAt(0, 0, 0); // 原点を見る
    cameraRef.current = camera;
    console.log("Initial camera position:", camera.position);
    console.log("Camera target:", 0, 0, 0);

    // レンダラー作成
    try {
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: false,
        powerPreference: "default"
      });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      console.log("WebGL renderer created successfully");
      console.log("Canvas size:", renderer.domElement.width, "x", renderer.domElement.height);
      mountRef.current.appendChild(renderer.domElement);
      console.log("Canvas appended to DOM");
    } catch (error) {
      console.error("Failed to create WebGL renderer:", error);
      setError("WebGLの初期化に失敗しました");
      return;
    }

    // ライティング
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // テスト用のキューブを追加（VRMが見えない場合の確認用）
    const testGeometry = new THREE.BoxGeometry(5, 5, 5); // 非常に大きなキューブ
    const testMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 緑色に変更
    const testCube = new THREE.Mesh(testGeometry, testMaterial);
    testCube.position.set(10, 0, 0); // 右側に配置
    testCubeRef.current = testCube; // refに保存
    scene.add(testCube);
    console.log("Test cube added to scene at position:", testCube.position);

    // 追加のテスト用オブジェクト（異なる位置に）
    const testSphere = new THREE.SphereGeometry(0.5);
    const testSphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const testSphereObj = new THREE.Mesh(testSphere, testSphereMaterial);
    testSphereObj.position.set(2, 0, 0);
    scene.add(testSphereObj);
    console.log("Test sphere added to scene");

    // アニメーションループ（確実に1回だけ開始）
    let frameCount = 0;
    let animationStarted = false;

    const animate = () => {
      if (!animationStarted) {
        console.log("Animation loop started");
        animationStarted = true;
      }

      animationIdRef.current = requestAnimationFrame(animate);
      frameCount++;

      // デバッグ：最初の3フレームでログ出力
      if (frameCount <= 3) {
        console.log("Animation frame:", frameCount);
        console.log("TestCube ref exists:", !!testCubeRef.current);
      }

      // テストキューブを回転させる
      const time = Date.now() * 0.001;
      if (testCubeRef.current) {
        testCubeRef.current.rotation.x = time;
        testCubeRef.current.rotation.y = time;

        if (frameCount === 1) {
          console.log("Test cube rotation started");
        }
      }

      if (vrmRef.current) {
        // 基本的な頭の動き
        vrmRef.current.scene.rotation.y = Math.sin(time * 0.5) * 0.1;

        // まばたきアニメーション
        const blinkValue = Math.sin(time * 3) > 0.8 ? 1 : 0;
        updateBlendShape("blink", blinkValue);

        // VRMの更新
        vrmRef.current.update(0.016); // 60fps想定
      }

      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // アニメーション開始（重複チェック）
    if (!animationIdRef.current) {
      console.log("Starting animation loop");
      animate();
    }

    return () => {
      console.log("Cleaning up Three.js scene");
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && mountRef.current && rendererRef.current.domElement && mountRef.current.contains(rendererRef.current.domElement)) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement);
        } catch (error) {
          console.warn("Error removing renderer element:", error);
        }
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // VRMファイルのロード
  useEffect(() => {
    if (!sceneRef.current) {
      console.error("Scene not available for VRM loading");
      return;
    }

    console.log("Starting VRM load from:", vrmUrl);

    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    // Three.jsのファイルシステム警告を抑制するための設定
    loader.setPath('/models/');

    setError(null);
    setLoadingProgress(0);

    loader.load(
      vrmUrl,
      (gltf) => {
        const vrm = gltf.userData.vrm as VRM;
        if (vrm) {
          // VRMの初期化
          VRMUtils.removeUnnecessaryVertices(gltf.scene);
          VRMUtils.combineSkeletons(gltf.scene);

          // VRMのバウンディングボックスを計算して適切な位置に配置
          const box = new THREE.Box3().setFromObject(vrm.scene);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          console.log("VRM bounding box size:", size);
          console.log("VRM center:", center);

          // VRMを確実に見える位置に配置
          vrm.scene.position.set(0, 0, 0); // 原点に配置

          // スケール調整（画面いっぱいに表示）
          const appliedScale = 5;
          vrm.scene.scale.setScalar(appliedScale); // 非常に大きく

          console.log("Applied scale:", appliedScale);

          // カメラを適切な距離に配置
          if (cameraRef.current) {
            cameraRef.current.position.set(0, 5, 30); // さらに遠くに
            cameraRef.current.lookAt(0, 0, 0);
            cameraRef.current.updateProjectionMatrix();
            console.log("VRM camera position:", cameraRef.current.position);
            console.log("VRM camera looking at: 0, 0, 0");
          }

          // VRMの構造を詳しく調べる
          console.log("=== VRM Structure Analysis ===");
          console.log("VRM scene type:", vrm.scene.type);
          console.log("VRM scene children:", vrm.scene.children.length);

          let meshCount = 0;
          vrm.scene.traverse((child) => {
            console.log("VRM child:", child.type, child.name, "visible:", child.visible);

            // 全ての子要素を可視化
            child.visible = true;
            child.castShadow = false;
            child.receiveShadow = false;

            if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
              meshCount++;
              // 元の材質を目立つ赤色のマテリアルに置き換え
              const originalMaterial = child.material;
              child.material = new THREE.MeshBasicMaterial({
                color: 0xff0000, // 赤色で確実に見えるように
                wireframe: false,
                transparent: false,
                opacity: 1.0
              });
              child.visible = true;
              child.frustumCulled = false; // カリングを無効化
              console.log("VRM mesh found:", child.name, "type:", child.type, "geometry:", child.geometry.type, "material replaced to RED");
              console.log("Original material:", originalMaterial);
              console.log("Mesh vertices:", child.geometry.attributes.position?.count || 0);
              console.log("Mesh position:", child.position);
              console.log("Mesh scale:", child.scale);
            }
          });
          console.log("Total meshes found:", meshCount);
          console.log("=== End VRM Analysis ===");

          // VRM全体の可視性を強制設定
          vrm.scene.visible = true;
          vrm.scene.frustumCulled = false;

          sceneRef.current!.add(vrm.scene);
          vrmRef.current = vrm;
          setIsLoaded(true);

          // VRMが追加された後の最終確認
          console.log("Final VRM scene position:", vrm.scene.position);
          console.log("Final VRM scene scale:", vrm.scene.scale);
          console.log("Final VRM scene visible:", vrm.scene.visible);
          console.log("Scene total children after VRM:", sceneRef.current!.children.length);

          console.log("VRM loaded successfully");
          console.log("VRM model added to scene");
          console.log("VRM position:", vrm.scene.position);
          console.log("VRM scale:", vrm.scene.scale);
          console.log("VRM scene children count:", vrm.scene.children.length);
          console.log("Available blend shapes:", getAvailableBlendShapes(vrm));
        }
      },
      (progress) => {
        const percentage = (progress.loaded / progress.total) * 100;
        setLoadingProgress(percentage);
      },
      (error) => {
        console.error("VRM loading error:", error);
        console.error("Error details:", error.message || error);
        setError(`VRMファイルの読み込みに失敗しました: ${error.message || 'Unknown error'}`);
      }
    );
  }, [vrmUrl]);

  // 利用可能なBlendShapeを取得
  const getAvailableBlendShapes = (vrm: VRM): string[] => {
    const blendShapes: string[] = [];
    if (vrm.expressionManager) {
      Object.keys(vrm.expressionManager.expressionMap).forEach((key) => {
        blendShapes.push(key);
      });
    }
    return blendShapes;
  };

  // BlendShapeの更新
  const updateBlendShape = (shapeName: string, value: number) => {
    if (!vrmRef.current?.expressionManager) return;

    try {
      vrmRef.current.expressionManager.setValue(shapeName, value);
    } catch (error) {
      // BlendShapeが存在しない場合は無視
    }
  };

  // 感情状態の更新
  useEffect(() => {
    if (!vrmRef.current || !isLoaded) return;

    // 主要感情を決定
    const dominantEmotion = Object.entries(currentEmotion).reduce((max, current) =>
      current[1] > max[1] ? current : max
    )[0] as keyof EmotionState;

    const intensity = currentEmotion[dominantEmotion] / 10;

    // 既存のBlendShapeをリセット
    Object.values(blendShapeMap).flat().forEach(shapeName => {
      updateBlendShape(shapeName, 0);
    });

    // 対応するBlendShapeを適用
    const shapeNames = blendShapeMap[dominantEmotion] || [];
    shapeNames.forEach(shapeName => {
      updateBlendShape(shapeName, intensity);
    });

    // リップシンク
    if (isSpeaking) {
      const lipSyncValue = 0.3 + Math.random() * 0.7;
      updateBlendShape("aa", lipSyncValue * 0.5);
      updateBlendShape("ih", lipSyncValue * 0.3);
      updateBlendShape("ou", lipSyncValue * 0.4);
    } else {
      updateBlendShape("aa", 0);
      updateBlendShape("ih", 0);
      updateBlendShape("ou", 0);
    }
  }, [currentEmotion, isSpeaking, isLoaded]);

  // ウィンドウリサイズ対応
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg">
      {/* Character Info */}
      <div className="text-center mb-4">
        <h3 className="font-semibold text-gray-900">{characterName}</h3>
        <p className="text-sm text-gray-600">{characterRole}</p>
        {/* デバッグ情報 */}
        <div className="text-xs text-gray-500 mt-2">
          <div>Mount: {mountRef.current ? '✓' : '✗'}</div>
          <div>Scene: {sceneRef.current ? '✓' : '✗'}</div>
          <div>Renderer: {rendererRef.current ? '✓' : '✗'}</div>
          <div>VRM: {vrmRef.current ? '✓' : '✗'}</div>
          <div>Loaded: {isLoaded ? '✓' : '✗'}</div>
        </div>
        {isSpeaking && (
          <div className="flex items-center justify-center space-x-1 mt-2">
            <div className="w-1 h-3 bg-green-400 rounded animate-pulse"></div>
            <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-1 h-3 bg-green-400 rounded animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <span className="text-xs text-green-600 ml-2">話している</span>
          </div>
        )}
      </div>

      {/* VRM Viewer */}
      <div className="relative bg-white rounded-lg shadow-inner border-2 border-red-500" style={{ height: "400px" }}>
        <div ref={mountRef} className="w-full h-full rounded-lg overflow-hidden bg-gray-100" />
        {/* Canvas確認用 */}
        <div className="absolute top-2 left-2 bg-black text-white text-xs p-1 rounded">
          Canvas: {mountRef.current?.querySelector('canvas') ? '✓' : '✗'}
        </div>

        {/* Loading State */}
        {!isLoaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 bg-opacity-90 rounded-lg">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 font-medium">VRM読み込み中...</p>
            <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{Math.round(loadingProgress)}%</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 bg-opacity-90 rounded-lg">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-700 font-medium text-center">{error}</p>
            <p className="text-sm text-red-500 text-center mt-2">
              VRMファイルが見つからないか、読み込みに失敗しました
            </p>
          </div>
        )}
      </div>

      {/* Status Info */}
      {isLoaded && (
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(currentEmotion).map(([emotion, value]) => (
              <div key={emotion} className="flex justify-between">
                <span className="capitalize">{emotion}:</span>
                <span className="font-mono">{(value * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
            <div>• VRM Model: character.vrm</div>
            <div>• Status: {isSpeaking ? "Speaking" : "Idle"}</div>
            <div>• BlendShapes: Active</div>
          </div>
        </div>
      )}
    </div>
  );
}