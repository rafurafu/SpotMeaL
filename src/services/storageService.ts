import {
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * プロフィールアイコンをFirebase Storageにアップロード
 * @param userId ユーザーID
 * @param imageUri ローカル画像のURI
 * @returns アップロードされた画像のダウンロードURL
 */
export const uploadProfileIcon = async (
  userId: string,
  imageUri: string
): Promise<string> => {
  try {
    // ローカル画像をBlobに変換
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // 画像の拡張子を取得
    const extension = imageUri.split('.').pop()?.toLowerCase() || 'jpg';

    // ファイル名を生成（タイムスタンプを含める）
    const timestamp = Date.now();
    const fileName = `profile_${userId}_${timestamp}.${extension}`;

    // Storageの参照を作成
    const storageRef = ref(storage, `users/${userId}/profile/${fileName}`);

    // MIMEタイプを決定
    let mimeType = 'image/jpeg';
    if (extension === 'png') {
      mimeType = 'image/png';
    } else if (extension === 'gif') {
      mimeType = 'image/gif';
    } else if (extension === 'webp') {
      mimeType = 'image/webp';
    }

    // メタデータを設定
    const metadata = {
      contentType: mimeType,
    };

    // Blobデータをアップロード
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

    // アップロード完了を待つ
    await uploadTask;

    // ダウンロードURLを取得
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Profile icon upload error:', error);
    throw new Error('プロフィール画像のアップロードに失敗しました');
  }
};

/**
 * 古いプロフィールアイコンを削除
 * @param imageUrl 削除する画像のURL
 */
export const deleteProfileIcon = async (imageUrl: string): Promise<void> => {
  try {
    // Firebase StorageのURLかどうかを確認
    if (!imageUrl.includes('firebasestorage.googleapis.com')) {
      console.log('Firebase Storage以外の画像のため削除をスキップします');
      return;
    }

    // URLからStorageパスを取得
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);

    if (!pathMatch || !pathMatch[1]) {
      console.error('Invalid storage URL:', imageUrl);
      return;
    }

    const path = decodeURIComponent(pathMatch[1]);
    const storageRef = ref(storage, path);

    // 画像を削除
    await deleteObject(storageRef);
    console.log('Old profile icon deleted:', path);
  } catch (error: any) {
    // ファイルが存在しない場合のエラーは無視
    if (error.code === 'storage/object-not-found') {
      console.log('File not found, skipping deletion');
      return;
    }
    console.error('Profile icon deletion error:', error);
    throw new Error('プロフィール画像の削除に失敗しました');
  }
};

/**
 * 画像URLからファイル名を取得
 * @param imageUrl 画像URL
 * @returns ファイル名
 */
export const getFileNameFromUrl = (imageUrl: string): string | null => {
  try {
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);

    if (!pathMatch || !pathMatch[1]) {
      return null;
    }

    const path = decodeURIComponent(pathMatch[1]);
    const parts = path.split('/');
    return parts[parts.length - 1];
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
};
