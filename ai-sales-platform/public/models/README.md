# VRM Characters

このフォルダには商談ロールプレイで使用するVRMキャラクターファイルを配置します。

## ファイル命名規則

### 業界別キャラクター
- `it_manager.vrm` - IT業界のマネージャー
- `pharma_director.vrm` - 製薬会社のディレクター
- `finance_manager.vrm` - 金融機関のマネージャー
- `retail_buyer.vrm` - 小売業のバイヤー

### 難易度別
- `beginner_customer.vrm` - 初級レベルの顧客
- `intermediate_customer.vrm` - 中級レベルの顧客
- `advanced_customer.vrm` - 上級レベルの顧客

### 性格タイプ別
- `analytical_type.vrm` - 分析型の顧客
- `relationship_type.vrm` - 関係重視型の顧客
- `decisive_type.vrm` - 決断型の顧客
- `cautious_type.vrm` - 慎重型の顧客

## 使用方法

VRMファイルをこのフォルダに配置すると、以下のURLでアクセスできます：

```javascript
// 例: character.vrmファイルの場合
const vrmUrl = '/models/character.vrm'

// 複数キャラクターを切り替える場合
const characters = {
  'it_manager': '/models/it_manager.vrm',
  'pharma_director': '/models/pharma_director.vrm',
  'finance_manager': '/models/finance_manager.vrm'
}
```

## ファイルサイズの注意

- VRMファイルは通常5-50MBです
- 大きすぎる場合は読み込みが遅くなる可能性があります
- 商用利用の場合は、ライセンスを確認してください

## VRMファイルの入手先

1. **VRoidHub**: https://hub.vroid.com/
   - 無料でダウンロード可能
   - 商用利用可能なものもあり

2. **VRoidStudio**: https://vroid.com/studio
   - 自分でキャラクターを作成
   - 完全にカスタマイズ可能

3. **BOOTH**: https://booth.pm/
   - 有料の高品質VRMモデル
   - 商用ライセンス有り