# SpotMeal - 飲食店発見アプリ

## 📱 アプリコンセプト

「こんな飲食店があるよ！」を店側からアピールし、ユーザーの新しいお店発見をサポートしながら、来店報酬でユーザーも稼げるプラットフォーム

---

## 🔄 基本的な仕組み

```
【店側】アピール投稿 → 【ユーザー】店発見・来店 → 【報酬40-120円 + レビュー10円】
                  ↑
              【運営】掲載手数料で収益
```

---

## 💰 料金システム

### 時間帯別ユーザー報酬

| 時間帯 | 報酬額 | 店側料金 | 運営利益 |
|-------|--------|---------|---------|
| **アイドルタイム**<br>(14:00-17:00) | **120円** | 200円 | 80円 |
| **平日夜早め**<br>(17:00-19:00) | **100円** | 200円 | 100円 |
| **通常時間** | **80円** | 200円 | 120円 |
| **ピーク時**<br>(12:00-13:30) | **40円** | 200円 | 160円 |

### レビュー報酬

| アクション | 報酬額 |
|----------|--------|
| **レビュー投稿** | **10円** |

- 来店完了後にレビューを投稿すると、来店報酬に加えて10円の追加報酬を獲得

### 掲載回数別料金

| 掲載回数 | 店側料金 |
|---------|---------|
| 1〜3回目 | **無料** |
| 4回目以降 | **200円** |

---

## 📲 来店確認フロー

1. **アプリで店舗予約**
2. **QRコードでチェックイン**
3. **お会計完了&QRコードでチェックアウト**
4. **報酬自動反映**

---

## 📊 収益構造

### 収入源
- 掲載手数料：200円/回（4回目以降）

### 支出
- ユーザー報酬：40円〜120円/来店（時間帯による）
- レビュー報酬：10円/レビュー（オプション）

### 利益
- **80円〜160円/掲載**（時間帯により変動、レビューなしの場合）
- **70円〜150円/掲載**（時間帯により変動、レビューありの場合）

---

## 🎯 各ステークホルダーのメリット

### 🏪 飲食店側
- ✅ 最初3回無料でリスクなし
- ✅ 効果保証型の明確な料金体系
- ✅ アイドルタイムの集客強化
- ✅ 時間帯に応じた集客戦略

### 👥 ユーザー側
- ✅ 新しいお店の発見
- ✅ 時間帯により40円〜120円の来店報酬
- ✅ レビュー投稿でさらに10円の追加報酬
- ✅ アイドルタイム利用で高報酬（最大120円）
- ✅ QRコードでスムーズな体験

### 🏢 運営側
- ✅ シンプルな収益モデル
- ✅ 低い初期投資リスク
- ✅ スケーラブルなビジネス

---

## 💡 必要な初期資金

### 計算例（10店舗でスタート）
- 各店舗の最初3回 × 平均3人来店 × 平均報酬85円（来店）
- レビュー率50%として × 10円
- **約7,650円〜8,100円**の運転資金で開始可能

---

## 🛠 技術スタック

### コアテクノロジー
- **フレームワーク**: React Native 0.81.4
- **開発環境**: Expo ~54.0.0
- **言語**: TypeScript ~5.9.2

### 状態管理
- **Redux Toolkit** 2.8.2
- **React Redux** 9.2.0
- **React Context API** (Store管理、お気に入り管理)

### ナビゲーション
- **React Navigation** 7.1.17
  - Native Stack Navigator 7.3.25
  - Stack Navigator 7.4.7

### バックエンド・認証
- **Firebase** 12.4.0
  - Authentication (メール/パスワード、Google認証)
  - Firestore (データベース)
  - Storage (画像保存)

### デバイス機能
- **expo-camera** ~17.0.7 (カメラ・QRスキャン)
- **expo-barcode-scanner** 13.0.1 (バーコードスキャン)
- **expo-location** ~19.0.7 (位置情報)
- **expo-image-picker** ~17.0.8 (画像選択)
- **expo-file-system** 19.0.17 (ファイルシステム)

### マップ
- **react-native-maps** 1.20.1
- **Google Maps API** (iOS/Android統合済み)

### ローカルストレージ
- **AsyncStorage** 1.24.0

### ファイル構成
```
SpotMeal/
├── assets/
│   └── images/                      # アプリアイコン、スプラッシュ画像
├── src/
│   ├── assets/
│   │   └── spotmeal-logo.tsx        # ロゴコンポーネント
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthGuard.tsx        # 認証ガード
│   │   ├── common/
│   │   │   └── QRScanConfirm.tsx    # QRスキャン確認モーダル
│   │   ├── store/
│   │   │   └── StoreCard.tsx        # 店舗カードコンポーネント
│   │   └── ui/
│   │       ├── Button.tsx           # 汎用ボタン
│   │       ├── Card.tsx             # 汎用カード
│   │       └── Input.tsx            # 汎用入力フィールド
│   ├── config/
│   │   └── firebase.ts              # Firebase設定
│   ├── contexts/
│   │   ├── FavoritesContext.tsx     # お気に入り管理
│   │   └── StoreContext.tsx         # 店舗データ管理
│   ├── hooks/
│   │   └── redux.ts                 # Redux用カスタムフック
│   ├── navigation/
│   │   ├── AppNavigator.tsx         # メインナビゲーター
│   │   └── AuthNavigator.tsx        # 認証ナビゲーター
│   ├── screens/
│   │   ├── CreatePostScreen.tsx     # 投稿作成画面
│   │   ├── EarningsScreen.tsx       # 収益確認画面
│   │   ├── FavoritesScreen.tsx      # お気に入り一覧画面
│   │   ├── HomeScreen.tsx           # ホーム画面
│   │   ├── LoginScreen.tsx          # ログイン画面
│   │   ├── MapScreen.tsx            # マップ画面
│   │   ├── ProfileEditScreen.tsx    # プロフィール編集画面
│   │   ├── ProfileScreen.tsx        # プロフィール画面
│   │   ├── QRScanScreen.tsx         # QRコードスキャン画面
│   │   ├── ReservationScreen.tsx    # 予約画面
│   │   ├── SignUpScreen.tsx         # 新規登録画面
│   │   ├── StoreDetailScreen.tsx    # 店舗詳細画面
│   │   └── StoreRegistrationScreen.tsx  # 店舗登録画面
│   ├── scripts/
│   │   └── migrateStores.ts         # 店舗データ移行スクリプト
│   ├── services/
│   │   ├── authService.ts           # 認証サービス
│   │   ├── imageService.ts          # 画像処理サービス
│   │   ├── postService.ts           # 投稿サービス
│   │   ├── reservationService.ts    # 予約サービス
│   │   ├── restaurantService.ts     # 店舗情報サービス
│   │   ├── storageService.ts        # Firebase Storageサービス
│   │   └── userService.ts           # ユーザー情報サービス
│   ├── store/
│   │   ├── index.ts                 # Redux Store設定
│   │   └── slices/
│   │       ├── authSlice.ts         # 認証状態管理
│   │       └── userSlice.ts         # ユーザー状態管理
│   ├── types/
│   │   ├── api.ts                   # API型定義
│   │   └── auth.ts                  # 認証型定義
│   └── utils/
│       └── constants.ts             # 定数（カラー、フォント、スペーシング）
├── App.tsx                          # アプリエントリーポイント
├── app.json                         # Expo設定
├── package.json                     # 依存関係
├── tsconfig.json                    # TypeScript設定
├── .env                             # 環境変数（Firebase設定）
├── README.md                        # プロジェクトドキュメント
├── FIREBASE_SETUP.md                # Firebase設定ガイド
└── SECURITY_STEPS.md                # セキュリティガイド
```

---

## 📸 スクリーンショット

*現在開発中...*

---

## 🚦 開発状況

### ✅ 実装済み機能

#### 認証機能
- [x] メールアドレス/パスワードでのログイン・新規登録
- [x] Googleアカウント連携
- [x] ログアウト機能
- [x] 認証状態の永続化
- [x] AuthGuardによる認証保護

#### ホーム画面機能
- [x] 店舗一覧表示（カード形式）
- [x] カテゴリフィルター（全て、和食、ラーメン、寿司、カフェ、イタリアン）
- [x] 店舗検索機能（店舗名・カテゴリ）
- [x] 時間帯別報酬表示（アイドルタイム120円、ピーク時40円など）
- [x] リアルタイム報酬更新
- [x] 引っ張って更新（Pull to Refresh）
- [x] スクロールアニメーション

#### 店舗管理機能
- [x] 店舗詳細表示
- [x] 店舗登録（画像アップロード対応）
- [x] 店舗情報編集
- [x] 店舗削除
- [x] Firestore連携（CRUD操作）
- [x] Firebase Storage連携（画像保存）
- [x] 無料掲載残数管理

#### お気に入り機能
- [x] お気に入り追加/削除
- [x] お気に入り一覧表示
- [x] AsyncStorageによる永続化

#### マップ機能
- [x] Google Maps統合
- [x] 店舗位置の表示
- [x] 位置情報パーミッション設定
- [x] iOS/Android両対応

#### QRコード機能
- [x] QRコードスキャン画面
- [x] カメラ機能統合
- [x] バーコードスキャナー
- [x] QRスキャン確認モーダル

#### 予約機能
- [x] 店舗予約画面
- [x] 予約情報のFirestore保存
- [x] 時間帯別報酬計算（40円〜120円）

#### レビュー機能
- [x] レビュー投稿機能
- [x] レビュー報酬付与（10円）
- [x] 評価（1-5段階）とコメント投稿
- [x] レビュー情報のFirestore保存

#### プロフィール機能
- [x] プロフィール表示・編集
- [x] 統計情報表示（総来店回数、総獲得報酬、今月の来店回数）
- [x] プロフィール画像アップロード対応

#### デザインシステム
- [x] タイミー風UI/UX
- [x] 再利用可能なUIコンポーネント（Button, Card, Input）
- [x] カラーシステム
- [x] フォントサイズシステム
- [x] スペーシングシステム

### 📋 今後の実装予定
- [ ] 決済システム連携（Stripe）
- [ ] プッシュ通知（expo-notifications）
- [ ] 報酬管理システムの最適化
- [ ] レビュー一覧・詳細表示画面
- [ ] 管理者ダッシュボード

---

## 🚀 セットアップ方法

### 前提条件
- Node.js 18.x以上
- npm または yarn
- Expo CLI
- Expo Go アプリ（テスト用）
- Firebase プロジェクト（認証・データベース用）

### インストール手順

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/rafurafu/spotmeal.git
   cd spotmeal
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   # または
   yarn install
   ```

3. **環境変数の設定**

   プロジェクトルートに `.env` ファイルを作成し、Firebase設定を追加：
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   詳細は [FIREBASE_SETUP.md](FIREBASE_SETUP.md) を参照してください。

4. **Expo開発サーバーの起動**
   ```bash
   npx expo start
   ```

5. **デバイスでテスト**
   - iOS: カメラアプリでQRコードをスキャン
   - Android: Expo Goアプリでスキャン

### 主要な依存関係
```json
{
  "expo": "~54.0.0",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "typescript": "~5.9.2",
  "@reduxjs/toolkit": "^2.8.2",
  "react-redux": "^9.2.0",
  "@react-navigation/native": "^7.1.17",
  "@react-navigation/native-stack": "^7.3.25",
  "firebase": "^12.4.0",
  "expo-camera": "~17.0.7",
  "expo-barcode-scanner": "^13.0.1",
  "expo-location": "~19.0.7",
  "expo-image-picker": "~17.0.8",
  "react-native-maps": "1.20.1",
  "@react-native-async-storage/async-storage": "^1.24.0"
}
```

---

## 📄 ライセンス

このプロジェクトは個人開発プロジェクトです。

---

## 👨‍💻 開発者

**プロジェクトオーナー**: [daisuke]
**連絡先**: [bukbjrafu@gmail.com]

---

*最終更新: 2025年10月31日*
