# Firebase セットアップガイド

## 概要

このプロジェクトでは、以下のFirebaseサービスを使用しています：

- **Firebase Authentication**: ユーザー認証（メール/パスワード、Google）
- **Cloud Firestore**: ユーザーデータの保存

## セットアップ手順

### 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: spotmeal）
4. Google Analyticsの設定（任意）
5. プロジェクトを作成

### 2. Firebaseアプリの設定

1. Firebaseプロジェクトのダッシュボードで、Web アプリを追加（`</>`アイコン）
2. アプリ名を入力（例: SpotMeal Web）
3. Firebase SDK設定情報をコピー

### 3. 設定ファイルの更新

`src/config/firebase.ts` ファイルを開き、Firebase Console で取得した設定値に置き換えてください：

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // ← ここを置き換え
  authDomain: "YOUR_AUTH_DOMAIN",      // ← ここを置き換え
  projectId: "YOUR_PROJECT_ID",        // ← ここを置き換え
  storageBucket: "YOUR_STORAGE_BUCKET", // ← ここを置き換え
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // ← ここを置き換え
  appId: "YOUR_APP_ID"                 // ← ここを置き換え
};
```

### 4. Firebase Authenticationの有効化

1. Firebase Console で「Authentication」に移動
2. 「始める」をクリック
3. Sign-in method タブを開く
4. 以下の認証プロバイダを有効にする：
   - **メール/パスワード**: 有効にする
   - **Google**: 有効にする（プロジェクトのサポートメールを設定）

### 5. Cloud Firestoreの設定

1. Firebase Console で「Firestore Database」に移動
2. 「データベースの作成」をクリック
3. **テストモードで開始**を選択（後で本番モード用のルールを設定）
4. ロケーションを選択（例: asia-northeast1（東京））

#### Firestoreセキュリティルール（推奨）

Firestoreの「ルール」タブで、以下のルールに更新してください：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のドキュメントのみ読み書き可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 投稿データは認証済みユーザーのみ読み取り可能
    // 自分の投稿のみ書き込み可能
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                              request.auth.uid == resource.data.userId;
    }
  }
}
```

## データベース構造

### users コレクション

各ユーザーは `users/{userId}` に保存されます：

```typescript
{
  uid: string;              // ユーザーID（AuthenticationのUID）
  email: string;            // メールアドレス
  displayName: string;      // 表示名
  photoURL?: string;        // プロフィール画像URL
  provider: 'email' | 'google'; // 認証プロバイダ
  createdAt: Timestamp;     // 作成日時
  updatedAt: Timestamp;     // 更新日時
  favorites: string[];      // お気に入りの店舗ID配列
}
```

## 実装済み機能

### 認証機能

- ✅ メール/パスワードでの新規登録
- ✅ メール/パスワードでのログイン
- ✅ Googleアカウントでの登録/ログイン（Web版のみ、React Native版は要実装）
- ✅ ログアウト

### データ管理

- ✅ ユーザー情報の作成（Firestore）
- ✅ ユーザー情報の取得（Firestore）
- ✅ ユーザー情報の更新（Firestore）
- ✅ お気に入り機能（追加/削除）

## ファイル構成

```
src/
├── config/
│   └── firebase.ts              # Firebase設定
├── services/
│   ├── authService.ts           # 認証サービス
│   └── userService.ts           # ユーザーデータサービス
├── screens/
│   ├── SignUpScreen.tsx         # 新規登録画面
│   └── LoginScreen.tsx          # ログイン画面
└── store/
    └── slices/
        └── authSlice.ts         # 認証状態管理
```

## 注意事項

### React NativeでのGoogle認証

現在のコードでは `signInWithPopup` を使用していますが、これはWebブラウザ専用です。
React Nativeでは動作しないため、以下のいずれかの方法で実装する必要があります：

1. **expo-auth-session** を使用
2. **@react-native-google-signin/google-signin** を使用
3. Firebase の `signInWithRedirect` と組み合わせる

### セキュリティ

- 本番環境では、Firestoreのセキュリティルールを必ず設定してください
- `firebase.ts` の設定ファイルは Git にコミットしても問題ありませんが、`.env` ファイルを使った管理も推奨されます

## 次のステップ

1. ✅ Firebase Authentication と Firestore の設定
2. 🔲 画像アップロード機能（Cloudinary連携）
3. 🔲 投稿機能の実装
4. 🔲 React Native用のGoogle認証実装
5. 🔲 プロフィール編集機能の実装

## トラブルシューティング

### エラー: "Firebase: Error (auth/configuration-not-found)"

→ Firebase Console でプロジェクトが正しく設定されているか確認してください

### エラー: "Missing or insufficient permissions"

→ Firestoreのセキュリティルールを確認してください

### Googleログインが動作しない

→ React Native環境では別途実装が必要です（上記「React NativeでのGoogle認証」を参照）
