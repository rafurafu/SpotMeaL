import { CLOUDINARY_CONFIG, getCloudinaryUploadUrl } from '../config/cloudinary';

export interface ImageUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

/**
 * 画像をCloudinaryにアップロード
 * @param imageUri - ローカル画像のURI（expo-image-pickerで取得したもの）
 * @param folder - Cloudinary内のフォルダ名（オプション）
 * @returns アップロードされた画像の情報
 */
export const uploadImageToCloudinary = async (
  imageUri: string,
  folder?: string
): Promise<ImageUploadResult> => {
  try {
    // FormDataを作成
    const formData = new FormData();

    // 画像ファイルを追加
    const filename = imageUri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('file', {
      uri: imageUri,
      type,
      name: filename,
    } as any);

    // Upload presetを追加
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    // フォルダを指定（オプション）
    if (folder) {
      formData.append('folder', folder);
    }

    // Cloudinary APIにアップロード
    const uploadUrl = getCloudinaryUploadUrl();
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || '画像のアップロードに失敗しました');
    }

    const data = await response.json();

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  } catch (error: any) {
    console.error('Image upload error:', error);
    throw new Error(error.message || '画像のアップロードに失敗しました');
  }
};

/**
 * 複数の画像をCloudinaryにアップロード
 * @param imageUris - 画像URIの配列
 * @param folder - Cloudinary内のフォルダ名（オプション）
 * @returns アップロードされた画像情報の配列
 */
export const uploadMultipleImages = async (
  imageUris: string[],
  folder?: string
): Promise<ImageUploadResult[]> => {
  try {
    const uploadPromises = imageUris.map((uri) =>
      uploadImageToCloudinary(uri, folder)
    );
    return await Promise.all(uploadPromises);
  } catch (error: any) {
    console.error('Multiple images upload error:', error);
    throw new Error(error.message || '画像のアップロードに失敗しました');
  }
};

/**
 * Cloudinaryから画像を削除
 * 注意: この機能を使用するには、サーバーサイドでの実装が必要です
 * （署名付きリクエストが必要なため）
 */
export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<void> => {
  // TODO: バックエンドAPIを実装して、そこから削除リクエストを送る
  console.warn('画像削除機能は未実装です。バックエンドAPIが必要です。');
  throw new Error('画像削除機能は未実装です');
};
