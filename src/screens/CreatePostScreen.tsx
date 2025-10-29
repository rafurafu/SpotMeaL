import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { colors, fontSizes, spacing } from '../utils/constants';
import { useAppSelector } from '../hooks/redux';
import { uploadImageToCloudinary } from '../services/imageService';
import { createPost } from '../services/postService';

export const CreatePostScreen: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);

  // 画像選択
  const pickImage = async () => {
    try {
      // カメラロールの権限をリクエスト
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('権限エラー', '写真ライブラリへのアクセス権限が必要です');
        return;
      }

      // 画像選択
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('エラー', '画像の選択に失敗しました');
    }
  };

  // カメラで撮影
  const takePhoto = async () => {
    try {
      // カメラの権限をリクエスト
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('権限エラー', 'カメラへのアクセス権限が必要です');
        return;
      }

      // カメラ起動
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('エラー', '写真の撮影に失敗しました');
    }
  };

  // 投稿作成
  const handleCreatePost = async () => {
    if (!user) {
      Alert.alert('エラー', 'ログインしてください');
      return;
    }

    if (!imageUri) {
      Alert.alert('エラー', '画像を選択してください');
      return;
    }

    if (!title.trim()) {
      Alert.alert('エラー', 'タイトルを入力してください');
      return;
    }

    setLoading(true);

    try {
      // 1. Cloudinaryに画像をアップロード
      const imageResult = await uploadImageToCloudinary(imageUri, 'spotmeal-posts');

      // 2. Firestoreに投稿データを保存
      const postId = await createPost({
        userId: user.id,
        userName: user.name,
        userPhotoURL: undefined,
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageResult.url,
        imagePublicId: imageResult.publicId,
        location: locationName.trim()
          ? {
              name: locationName.trim(),
              address: '',
            }
          : undefined,
        tags: [],
      });

      Alert.alert('成功', '投稿が作成されました！', [
        {
          text: 'OK',
          onPress: () => {
            // フォームをリセット
            setImageUri(null);
            setTitle('');
            setDescription('');
            setLocationName('');
          },
        },
      ]);

      console.log('Post created with ID:', postId);
    } catch (error: any) {
      console.error('Create post error:', error);
      Alert.alert('エラー', error.message || '投稿の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>新規投稿</Text>
          </View>

          {/* 画像選択エリア */}
          <View style={styles.imageSection}>
            {imageUri ? (
              <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageOverlayText}>画像を変更</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>画像を選択してください</Text>
              </View>
            )}

            <View style={styles.imageButtons}>
              <Button
                title="ライブラリから選択"
                onPress={pickImage}
                variant="outline"
                style={styles.imageButton}
              />
              <Button
                title="カメラで撮影"
                onPress={takePhoto}
                variant="outline"
                style={styles.imageButton}
              />
            </View>
          </View>

          {/* フォーム */}
          <View style={styles.form}>
            <Input
              label="タイトル *"
              placeholder="美味しいランチ"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />

            <Input
              label="説明"
              placeholder="この料理について教えてください"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />

            <Input
              label="場所"
              placeholder="レストラン名や住所"
              value={locationName}
              onChangeText={setLocationName}
              maxLength={200}
            />

            <Button
              title="投稿する"
              onPress={handleCreatePost}
              loading={loading}
              disabled={!imageUri || !title.trim()}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              ⚠️ この機能を使用する前に、Cloudinaryの設定を完了してください
            </Text>
            <Text style={styles.infoText}>
              設定方法: src/config/cloudinary.ts を編集
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    marginVertical: spacing.lg,
  },
  title: {
    fontSize: fontSizes['2xl'],
    fontWeight: 'bold',
    color: colors.gray[800],
  },
  imageSection: {
    marginBottom: spacing.xl,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: spacing.sm,
    alignItems: 'center',
  },
  imageOverlayText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[300],
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  placeholderText: {
    fontSize: fontSizes.base,
    color: colors.gray[500],
  },
  imageButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  imageButton: {
    flex: 1,
  },
  form: {
    marginBottom: spacing.xl,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  infoBox: {
    backgroundColor: colors.warning[50],
    borderLeftWidth: 4,
    borderLeftColor: colors.warning[500],
    padding: spacing.md,
    borderRadius: 8,
  },
  infoText: {
    fontSize: fontSizes.sm,
    color: colors.warning[800],
    marginBottom: spacing.xs,
  },
});
