import * as FileSystem from 'expo-file-system';

export interface ImageUploadResult {
  url: string;
  localPath: string;
  width?: number;
  height?: number;
  format?: string;
}

/**
 * ローカルファイルシステムに画像を保存
 * @param imageUri - ローカル画像のURI（expo-image-pickerで取得したもの）
 * @param folder - アプリ内のフォルダ名（'posts'、'avatars'など）
 * @returns 保存された画像の情報
 */
export const saveImageToLocal = async (
  imageUri: string,
  folder: 'posts' | 'avatars' = 'posts'
): Promise<ImageUploadResult> => {
  try {
    // ファイル名を生成（タイムスタンプ + ランダム文字列）
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = imageUri.split('/').pop() || 'image.jpg';
    const extension = filename.split('.').pop() || 'jpg';
    const newFilename = `${timestamp}_${randomString}.${extension}`;

    // アプリのドキュメントディレクトリに保存
    const directoryUri = `${FileSystem.documentDirectory}${folder}/`;

    // ディレクトリが存在しない場合は作成
    const dirInfo = await FileSystem.getInfoAsync(directoryUri);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
    }

    const newImageUri = `${directoryUri}${newFilename}`;

    // 画像をコピー
    await FileSystem.copyAsync({
      from: imageUri,
      to: newImageUri,
    });

    console.log('Image saved to:', newImageUri);

    return {
      url: newImageUri,
      localPath: newImageUri,
      format: extension,
    };
  } catch (error: any) {
    console.error('Image save error:', error);
    throw new Error(error.message || '画像の保存に失敗しました');
  }
};

/**
 * 複数の画像をローカルに保存
 * @param imageUris - 画像URIの配列
 * @param folder - アプリ内のフォルダ名
 * @returns 保存された画像情報の配列
 */
export const saveMultipleImages = async (
  imageUris: string[],
  folder: 'posts' | 'avatars' = 'posts'
): Promise<ImageUploadResult[]> => {
  try {
    const savePromises = imageUris.map((uri) => saveImageToLocal(uri, folder));
    return await Promise.all(savePromises);
  } catch (error: any) {
    console.error('Multiple images save error:', error);
    throw new Error(error.message || '画像の保存に失敗しました');
  }
};

/**
 * ローカルから画像を削除
 * @param imageUri - 削除する画像のURI
 */
export const deleteImageFromLocal = async (imageUri: string): Promise<void> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(imageUri);
      console.log('Image deleted:', imageUri);
    } else {
      console.log('Image does not exist:', imageUri);
    }
  } catch (error: any) {
    console.error('Image delete error:', error);
    throw new Error(error.message || '画像の削除に失敗しました');
  }
};

/**
 * 画像が存在するか確認
 * @param imageUri - 確認する画像のURI
 * @returns 画像が存在する場合true
 */
export const checkImageExists = async (imageUri: string): Promise<boolean> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    return fileInfo.exists;
  } catch (error) {
    console.error('Error checking image:', error);
    return false;
  }
};
