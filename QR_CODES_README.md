# QRコード生成ガイド

このドキュメントでは、SpotMealアプリで使用するQRコードの生成方法を説明します。

## 概要

SpotMealでは以下の形式のQRコードを使用します：
- **予約チェックイン**: `spotmeal://reservation/{予約ID}`
- **店舗情報**: `spotmeal://store/{店舗ID}`

## 方法1: ターミナルでQRコード表示（最も簡単）

### 基本的な使い方

```bash
# デフォルト（TEST123）のQRコードを表示
npm run qr

# 特定の予約IDでQRコードを表示
npm run qr RES001
```

このコマンドは簡易的なQRパターンと、実際のQRコード生成方法の案内を表示します。

## 方法2: PNG画像としてQRコードを生成（推奨）

### 画像生成

```bash
# 特定の予約IDでQRコード画像を生成
npm run qr:image RES001

# 複数のQRコードを生成
npm run qr:image RES001
npm run qr:image RES002
npm run qr:image STORE123
```

生成されたQRコード画像は `qr-codes/` ディレクトリに保存されます：
- `qr-codes/reservation-RES001.png`
- `qr-codes/reservation-RES002.png`
- など

### ターミナルでのQRコード表示

画像生成時、ターミナル上でもQRコードが表示されます（Unicodeブロック文字使用）。

## 方法3: アプリ内のQRコード生成画面を使用

アプリを起動し、QRコード生成画面に遷移して使用します。

### 遷移方法

```typescript
// コード内から遷移
navigation.navigate('QRCodeGenerator');
```

### 画面の機能
- QRタイプの切り替え（予約/店舗）
- リアルタイムでQRコード生成
- サンプルIDのクイック選択
- 生成されたQRデータの表示

## 方法4: オンラインQRコードジェネレーター

任意のオンラインQRコードジェネレーターを使用できます：

1. https://www.qr-code-generator.com/ にアクセス
2. テキストとして以下を入力:
   ```
   spotmeal://reservation/RES001
   ```
3. QRコードを生成してダウンロード

## QRコードのテスト手順

### 1. QRコードを生成

```bash
npm run qr:image RES001
```

### 2. 生成されたQRコードを開く

```bash
open qr-codes/reservation-RES001.png
```

### 3. アプリでスキャン

1. SpotMealアプリを起動
2. QRスキャン画面を開く
3. 生成したQRコード画像（画面に表示またはプリント）をスキャン
4. 「チェックインしました」画面が表示される

## ディレクトリ構成

```
SpotMeal/
├── scripts/
│   ├── generate-qr.js          # 簡易QR表示スクリプト
│   └── generate-qr-image.js    # PNG画像生成スクリプト
├── qr-codes/                   # 生成されたQRコード画像
│   ├── reservation-RES001.png
│   ├── reservation-RES002.png
│   └── ...
└── src/
    └── screens/
        └── QRCodeGeneratorScreen.tsx  # アプリ内QR生成画面
```

## トラブルシューティング

### QRコードが認識されない

1. QRコードのデータが `spotmeal://reservation/` または `spotmeal://store/` で始まっているか確認
2. QRコード画像が十分な大きさと解像度か確認
3. カメラの権限が許可されているか確認

### スクリプトが動作しない

```bash
# パッケージの再インストール
npm install

# qrcodeパッケージが必要（自動インストール済み）
npm install qrcode --save-dev
```

## サンプルQRコード

テスト用にいくつかのサンプルIDを用意しています：

```bash
# 予約チェックイン用
npm run qr:image RES001
npm run qr:image RES002
npm run qr:image RES003

# 店舗情報用（店舗IDとして使用）
npm run qr:image STORE123
```

## その他の情報

- QRコードの色: SpotMealのプライマリカラー（#FF6B6B）
- QRコードのサイズ: 500x500px
- マージン: 2 (標準)
- 形式: PNG
