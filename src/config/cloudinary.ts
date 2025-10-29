// Cloudinary設定
// https://cloudinary.com/ でアカウントを作成し、以下の情報を入力してください

export const CLOUDINARY_CONFIG = {
  // Cloud name（Cloudinaryダッシュボードで確認できます）
  cloudName: 'YOUR_CLOUD_NAME',

  // Upload preset（設定 → Upload → Upload presetsで作成）
  // 注意: unsigned（署名なし）プリセットを作成してください
  uploadPreset: 'YOUR_UPLOAD_PRESET',

  // API Base URL
  apiUrl: 'https://api.cloudinary.com/v1_1',
};

/**
 * CloudinaryのアップロードURLを取得
 */
export const getCloudinaryUploadUrl = (): string => {
  return `${CLOUDINARY_CONFIG.apiUrl}/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
};

/**
 * Cloudinaryの画像URLを最適化
 * @param publicId - CloudinaryのpublicID
 * @param transformations - 画像変換オプション（幅、高さ、品質など）
 */
export const getOptimizedImageUrl = (
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
  }
): string => {
  const { cloudName } = CLOUDINARY_CONFIG;
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  if (!transformations) {
    return `${baseUrl}/${publicId}`;
  }

  const { width, height, quality, crop = 'fill' } = transformations;
  const params: string[] = [];

  if (width) params.push(`w_${width}`);
  if (height) params.push(`h_${height}`);
  if (quality) params.push(`q_${quality}`);
  if (crop) params.push(`c_${crop}`);

  const transformStr = params.join(',');
  return `${baseUrl}/${transformStr}/${publicId}`;
};
