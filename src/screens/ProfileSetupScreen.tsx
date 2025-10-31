import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { colors, fontSizes, spacing } from '../utils/constants';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { updateUserProfile, setNewUser } from '../store/slices/authSlice';
import { updateUserDocument } from '../services/userService';
import { uploadProfileIcon } from '../services/storageService';

interface ProfileSetupScreenProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  onComplete,
  onSkip,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [profileImage, setProfileImage] = useState<string | undefined>(user?.profileImage);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    phone: '',
    birthday: '',
  });

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          '権限が必要です',
          'プロフィール画像を選択するには、カメラロールへのアクセス権限が必要です。'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('エラー', '画像の選択に失敗しました');
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      phone: '',
      birthday: '',
    };

    if (phone && !/^[0-9]{10,11}$/.test(phone.replace(/-/g, ''))) {
      newErrors.phone = '正しい電話番号を入力してください（10-11桁）';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!user) {
      Alert.alert('エラー', 'ユーザー情報が見つかりません');
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl = profileImage;

      // 画像が選択されていたらアップロード
      if (imageUri) {
        uploadedImageUrl = await uploadProfileIcon(user.id, imageUri);
      }

      // Firestoreのユーザー情報を更新
      const updates: Partial<any> = {};
      if (phone) updates.phone = phone;
      if (birthday) updates.birthday = birthday.toISOString();
      if (bio) updates.bio = bio;
      if (uploadedImageUrl) updates.photoURL = uploadedImageUrl;

      await updateUserDocument(user.id, updates);

      // Reduxストアを更新
      const profileUpdates: Partial<any> = {};
      if (phone) profileUpdates.phone = phone;
      if (birthday) profileUpdates.birthday = birthday.toISOString();
      if (bio) profileUpdates.bio = bio;
      if (uploadedImageUrl) profileUpdates.profileImage = uploadedImageUrl;

      dispatch(updateUserProfile(profileUpdates));

      // 新規ユーザーフラグをリセット
      dispatch(setNewUser(false));

      Alert.alert('完了', 'プロフィールを設定しました！', [
        { text: 'OK', onPress: onComplete }
      ]);
    } catch (error: any) {
      console.error('Profile setup error:', error);
      Alert.alert('エラー', 'プロフィールの設定に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // 新規ユーザーフラグをリセット
    dispatch(setNewUser(false));

    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
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
            <Text style={styles.title}>プロフィール設定</Text>
            <Text style={styles.subtitle}>
              あなたのプロフィール情報を入力してください{'\n'}
              後からでも変更できます
            </Text>
          </View>

          <View style={styles.form}>
            {/* プロフィール画像 */}
            <View style={styles.imageSection}>
              <Text style={styles.label}>プロフィール画像</Text>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickImage}
                activeOpacity={0.7}
              >
                {imageUri || profileImage ? (
                  <Image
                    source={{ uri: imageUri || profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera" size={40} color={colors.gray[400]} />
                  </View>
                )}
                <View style={styles.cameraIconBadge}>
                  <Ionicons name="camera" size={20} color={colors.white} />
                </View>
              </TouchableOpacity>
              <Text style={styles.imageHint}>タップして画像を選択</Text>
            </View>

            {/* 電話番号 */}
            <Input
              label="電話番号（任意）"
              placeholder="09012345678"
              value={phone}
              onChangeText={setPhone}
              error={errors.phone}
              keyboardType="phone-pad"
              autoComplete="tel"
            />

            {/* 誕生日 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>誕生日（任意）</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={birthday ? styles.dateText : styles.datePlaceholder}>
                  {birthday ? formatDate(birthday) : '誕生日を選択'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={colors.gray[500]} />
              </TouchableOpacity>
              {errors.birthday && (
                <Text style={styles.errorText}>{errors.birthday}</Text>
              )}
            </View>

            {showDatePicker && (
              <Modal
                transparent={true}
                visible={showDatePicker}
                animationType="fade"
                onRequestClose={() => setShowDatePicker(false)}
              >
                <Pressable
                  style={styles.modalOverlay}
                  onPress={() => setShowDatePicker(false)}
                >
                  <View style={styles.datePickerWrapper}>
                    <Pressable onPress={(e) => e.stopPropagation()}>
                      <DateTimePicker
                        value={birthday || new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        locale="ja-JP"
                        onChange={(event, selectedDate) => {
                          if (Platform.OS !== 'ios') {
                            setShowDatePicker(false);
                          }
                          if (selectedDate) {
                            setBirthday(selectedDate);
                          }
                        }}
                        maximumDate={new Date()}
                        minimumDate={new Date(1900, 0, 1)}
                      />
                    </Pressable>
                  </View>
                </Pressable>
              </Modal>
            )}

            {/* 自己紹介 */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>自己紹介（任意）</Text>
              <Input
                placeholder="自己紹介を入力してください"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                style={styles.bioInput}
              />
            </View>

            <Button
              title="プロフィールを設定"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />

            <TouchableOpacity
              onPress={handleSkip}
              style={styles.skipButton}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>スキップ</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSizes['2xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  imagePickerButton: {
    position: 'relative',
    marginVertical: spacing.md,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray[200],
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary[500],
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  imageHint: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  dateText: {
    fontSize: fontSizes.base,
    color: colors.gray[900],
  },
  datePlaceholder: {
    fontSize: fontSizes.base,
    color: colors.gray[400],
  },
  errorText: {
    fontSize: fontSizes.sm,
    color: colors.error[500],
    marginTop: spacing.xs,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  skipText: {
    fontSize: fontSizes.base,
    color: colors.gray[600],
    fontWeight: '600',
  },
  // モーダルとDatePicker用のスタイル
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerWrapper: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
