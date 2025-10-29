# Cloudinary セットアップガイド

## 概要

このプロジェクトでは、画像の保存とホスティングにCloudinaryを使用します。

**アーキテクチャ:**
```
React Native App
    ↓
  画像を選択
    ↓
Cloudinary API (直接アップロード)
    ↓
  画像URL取得
    ↓
Firestore (URLを保存)
```

## セットアップ手順

### 1. Cloudinaryアカウントの作成

1. [Cloudinary](https://cloudinary.com/) にアクセス
2. 「Sign Up for Free」をクリック
3. メールアドレス、パスワードを入力してアカウント作成
4. メール認証を完了

### 2. Cloud Nameの確認

1. ダッシュボードにログイン
2. 左上に表示されている **Cloud name** をメモ
   - 例: `your-cloud-name`

### 3. Upload Presetの作成

Upload Presetは、署名なしで画像をアップロードするための設定です。

1. ダッシュボードで **Settings**（⚙️アイコン）をクリック
2. 左メニューから **Upload** を選択
3. **Upload presets** セクションまでスクロール
4. **Add upload preset** をクリック
5. 以下の設定を行う：
   - **Preset name**: `spotmeal-unsigned`（任意の名前）
   - **Signing mode**: **Unsigned** に変更（重要！）
   - **Folder**: `spotmeal-posts`（任意）
   - **Access mode**: **Public**
   - その他はデフォルトのまま
6. **Save** をクリック

### 4. 設定ファイルの更新

`src/config/cloudinary.ts` を開いて、以下の情報を入力：

```typescript
export const CLOUDINARY_CONFIG = {
  cloudName: 'your-cloud-name',        // ← ステップ2で確認したCloud name
  uploadPreset: 'spotmeal-unsigned',   // ← ステップ3で作成したPreset name
  apiUrl: 'https://api.cloudinary.com/v1_1',
};
```

## データフロー

### 投稿作成時の流れ

1. **ユーザーが画像を選択/撮影**
   - `expo-image-picker` を使用

2. **Cloudinaryに画像をアップロード**
   - `uploadImageToCloudinary()` を呼び出し
   - Cloudinary APIに直接POSTリクエスト
   - Upload Preset（署名なし）を使用

3. **画像URLを取得**
   - Cloudinaryから返却される `secure_url` と `public_id` を取得

4. **Firestoreに投稿データを保存**
   - `createPost()` を呼び出し
   - 画像URLとその他の投稿情報を保存

```typescript
// 例: 投稿作成の流れ
const imageResult = await uploadImageToCloudinary(imageUri, 'spotmeal-posts');
// → { url: "https://res.cloudinary.com/...", publicId: "..." }

await createPost({
  userId: user.id,
  userName: user.name,
  title: "美味しいランチ",
  description: "今日のランチ",
  imageUrl: imageResult.url,      // ← CloudinaryのURL
  imagePublicId: imageResult.publicId,
  // ...
});
```

## Firestoreデータ構造

### posts コレクション

```typescript
{
  id: string;                    // 投稿ID（自動生成）
  userId: string;                // 投稿者のユーザーID
  userName: string;              // 投稿者名
  userPhotoURL?: string;         // 投稿者のプロフィール画像
  title: string;                 // タイトル
  description: string;           // 説明
  imageUrl: string;              // Cloudinary画像URL
  imagePublicId: string;         // Cloudinaryのpublic_id
  location?: {
    name: string;                // 場所の名前
    address: string;             // 住所
    latitude?: number;
    longitude?: number;
  };
  tags?: string[];               // タグ
  likes: number;                 // いいね数
  likedBy: string[];             // いいねしたユーザーID配列
  comments: number;              // コメント数
  createdAt: Timestamp;          // 作成日時
  updatedAt: Timestamp;          // 更新日時
}
```

## Firestoreセキュリティルール（更新版）

Firebase Console → Firestore → ルール で以下を設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のドキュメントのみ読み書き可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 投稿は認証済みユーザーのみ読み取り可能
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
                      request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null &&
                              request.auth.uid == resource.data.userId;
    }
  }
}
```

## 実装済み機能

### 画像関連

- ✅ Cloudinaryへの画像アップロード（単一画像）
- ✅ 複数画像の一括アップロード
- ✅ 画像URLの最適化（リサイズ、品質調整など）
- ⚠️ 画像削除（バックエンドAPIが必要）

### 投稿関連

- ✅ 新規投稿の作成
- ✅ 投稿の取得（単一/全件/ユーザー別）
- ✅ 投稿の更新
- ✅ 投稿の削除
- ✅ いいね機能（追加/解除）

### テスト画面

- ✅ CreatePostScreen - 投稿作成のテスト画面

## ファイル構成

```
src/
├── config/
│   ├── firebase.ts              # Firebase設定
│   └── cloudinary.ts            # Cloudinary設定
├── services/
│   ├── authService.ts           # 認証サービス
│   ├── userService.ts           # ユーザーデータサービス
│   ├── imageService.ts          # 画像アップロードサービス
│   └── postService.ts           # 投稿データサービス
└── screens/
    └── CreatePostScreen.tsx     # 投稿作成画面（テスト用）
```

## 使い方

### 投稿作成画面の使用

```typescript
import { CreatePostScreen } from './src/screens/CreatePostScreen';

// ナビゲーションに追加
<Stack.Screen name="CreatePost" component={CreatePostScreen} />
```

### サービスの直接使用

```typescript
import { uploadImageToCloudinary } from './src/services/imageService';
import { createPost } from './src/services/postService';

// 画像アップロード
const result = await uploadImageToCloudinary(imageUri, 'my-folder');
console.log(result.url); // Cloudinary URL

// 投稿作成
const postId = await createPost({
  userId: 'user123',
  userName: 'John Doe',
  title: 'Test Post',
  description: 'This is a test',
  imageUrl: result.url,
  imagePublicId: result.publicId,
});
```

## トラブルシューティング

### エラー: "Upload preset not found"

→ Upload Presetが正しく作成されているか確認してください。`cloudinary.ts`のuploadPreset名が正しいか確認してください。

### エラー: "Upload preset must be unsigned"

→ Upload PresetのSigning modeが**Unsigned**になっているか確認してください。

### 画像がアップロードされない

1. Cloud nameが正しいか確認
2. Upload Presetが**Unsigned**になっているか確認
3. ネットワーク接続を確認
4. Cloudinaryダッシュボードの「Media Library」で画像が表示されるか確認

### Firestore権限エラー

→ Firestoreのセキュリティルールが正しく設定されているか確認してください。

## 次のステップ

1. ✅ Cloudinary設定の完了
2. ✅ Firebase + Cloudinary連携
3. 🔲 投稿一覧画面の実装
4. 🔲 投稿詳細画面の実装
5. 🔲 いいね・コメント機能のUI実装
6. 🔲 画像削除機能（バックエンドAPI必要）

## 費用について

### Cloudinary無料プラン

- ストレージ: 25 GB
- 帯域幅: 25 GB/月
- 変換: 25,000回/月

個人開発や小規模プロジェクトには十分です！
