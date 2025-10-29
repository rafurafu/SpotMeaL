# セキュリティ対応手順

## 緊急対応が必要です！

Firebase APIキーが公開リポジトリに漏洩しています。以下の手順で対応してください。

## 1. 即座に実行すべきこと

### A. Firebase APIキーの制限を設定
1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクト「SpotMeaL」を選択
3. 設定 → プロジェクトの設定 → 全般タブ
4. 「ウェブAPIキー」セクションで「キーを制限」をクリック
5. 以下の制限を追加：
   - **アプリケーションの制限**: HTTPリファラー
   - **許可するリファラー**:
     - `localhost/*` (開発用)
     - `*.expo.dev/*` (Expo Go用)
     - あなたのドメイン（本番環境がある場合）
   - **APIの制限**: 以下のAPIのみ許可
     - Firebase Authentication API
     - Cloud Firestore API
     - Cloud Storage for Firebase API

### B. APIキーを再生成（推奨）
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクト「spotmeal-fe4a2」を選択
3. 左メニュー → APIとサービス → 認証情報
4. 漏洩したAPIキーを見つける
5. 「キーを再生成」ボタンをクリック
6. 新しいキーを`.env`ファイルに更新

## 2. Gitの履歴から削除

### A. git-filter-repoを使用（推奨）
```bash
# git-filter-repoをインストール
pip install git-filter-repo

# firebase.tsをGit履歴から削除
git filter-repo --path src/config/firebase.ts --invert-paths

# リモートに強制プッシュ
git remote add origin https://github.com/rafurafu/SpotMeaL.git
git push origin --force --all
```

### B. BFG Repo-Cleanerを使用（代替案）
```bash
# BFGをダウンロード
# https://rtyley.github.io/bfg-repo-cleaner/

# APIキーを含むファイルを削除
bfg --delete-files firebase.ts

# クリーンアップ
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 強制プッシュ
git push origin --force --all
```

## 3. 不正使用の確認

### A. Firebase使用状況の確認
1. [Firebase Console](https://console.firebase.google.com/)
2. 使用状況タブ
3. 異常なトラフィックがないか確認

### B. Google Cloud請求の確認
1. [Google Cloud Console](https://console.cloud.google.com/)
2. 請求 → レポート
3. 予期しない使用がないか確認

## 4. チームに通知
- 他の開発者に新しい`.env`ファイルの設定を依頼
- `.env`ファイルは絶対にコミットしないよう周知

## 5. 今後の予防策

### セキュリティのベストプラクティス
1. ✅ `.env`ファイルを`.gitignore`に追加（実装済み）
2. ✅ 環境変数を使用（実装済み）
3. ✅ `.env.example`を提供（実装済み）
4. 🔄 pre-commitフックの導入（推奨）
5. 🔄 GitGuardianなどのシークレットスキャンツールの導入（推奨）

### pre-commitフックの設定例
```bash
# husky + lint-stagedをインストール
npm install --save-dev husky lint-staged

# pre-commitフックを追加
npx husky add .husky/pre-commit "npx lint-staged"
```

`.lintstagedrc.json`:
```json
{
  "*.{ts,tsx,js,jsx}": [
    "git secrets --scan"
  ]
}
```

## 参考リンク
- [Firebase セキュリティのベストプラクティス](https://firebase.google.com/docs/projects/api-keys)
- [Google Cloud 認証情報のベストプラクティス](https://cloud.google.com/docs/authentication/best-practices-applications)
- [Expo 環境変数の使用](https://docs.expo.dev/guides/environment-variables/)
