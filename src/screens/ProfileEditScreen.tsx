// src/screens/ProfileEditScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, fontSizes, DIMENSIONS } from '../utils/constants';
import * as ImagePicker from 'expo-image-picker';

type RootStackParamList = {
  Profile: undefined;
  ProfileEdit: undefined;
};

type ProfileEditScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileEdit'>;

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  avatar: string;
  bio: string;
}

export const ProfileEditScreen: React.FC = () => {
  const navigation = useNavigation<ProfileEditScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '田中 太郎',
    email: 'tanaka@example.com',
    phone: '090-1234-5678',
    birthday: '1990-01-01',
    avatar: 'https://via.placeholder.com/120x120/FF6B35/FFFFFF?text=ユ',
    bio: 'SpotMealで美味しいお店を探すのが趣味です。',
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('エラー', 'カメラロールへのアクセス許可が必要です');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleInputChange('avatar', result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: APIに送信する処理
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        '保存完了',
        'プロフィールが更新されました',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('エラー', 'プロフィールの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'アカウント削除',
      'この操作は取り消せません。本当にアカウントを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            Alert.alert('削除確認', 'アカウント削除機能は開発中です');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>プロフィール編集</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          {/* アバターセクション */}
          <Card style={styles.avatarCard}>
            <Text style={styles.sectionTitle}>プロフィール写真</Text>
            <View style={styles.avatarSection}>
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
              <TouchableOpacity
                style={styles.changeAvatarButton}
                onPress={pickImage}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={20} color={colors.primary[500]} />
                <Text style={styles.changeAvatarText}>写真を変更</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* 基本情報セクション */}
          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>基本情報</Text>
            
            {/* 名前 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                名前 <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="名前を入力してください"
                value={profile.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            {/* メールアドレス */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                メールアドレス <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="email@example.com"
                value={profile.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholderTextColor={colors.gray[400]}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* 電話番号 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>電話番号</Text>
              <TextInput
                style={styles.textInput}
                placeholder="090-1234-5678"
                value={profile.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholderTextColor={colors.gray[400]}
                keyboardType="phone-pad"
              />
            </View>

            {/* 生年月日 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>生年月日</Text>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-MM-DD"
                value={profile.birthday}
                onChangeText={(value) => handleInputChange('birthday', value)}
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            {/* 自己紹介 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>自己紹介</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="自己紹介を入力してください"
                value={profile.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
                placeholderTextColor={colors.gray[400]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </Card>

          {/* 通知設定セクション */}
          <Card style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>通知設定</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={20} color={colors.primary[500]} />
                <Text style={styles.settingText}>プッシュ通知</Text>
              </View>
              <TouchableOpacity style={styles.switchButton}>
                <View style={[styles.switchTrack, styles.switchTrackActive]}>
                  <View style={[styles.switchThumb, styles.switchThumbActive]} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="mail" size={20} color={colors.primary[500]} />
                <Text style={styles.settingText}>メール通知</Text>
              </View>
              <TouchableOpacity style={styles.switchButton}>
                <View style={styles.switchTrack}>
                  <View style={styles.switchThumb} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="star" size={20} color={colors.warning[500]} />
                <Text style={styles.settingText}>おすすめ情報</Text>
              </View>
              <TouchableOpacity style={styles.switchButton}>
                <View style={[styles.switchTrack, styles.switchTrackActive]}>
                  <View style={[styles.switchThumb, styles.switchThumbActive]} />
                </View>
              </TouchableOpacity>
            </View>
          </Card>

          {/* 危険なアクション */}
          <Card style={styles.dangerCard}>
            <Text style={styles.sectionTitle}>アカウント</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={20} color={colors.error[500]} />
              <Text style={styles.deleteButtonText}>アカウントを削除</Text>
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* 保存ボタン */}
      <View style={styles.saveButtonContainer}>
        <Button
          title={isLoading ? '保存中...' : '変更を保存'}
          onPress={handleSave}
          variant="primary"
          size="large"
          disabled={isLoading}
          style={styles.saveButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DIMENSIONS.screenPadding,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[900],
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: DIMENSIONS.screenPadding,
  },
  avatarCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray[200],
    marginBottom: 16,
  },
  changeAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeAvatarText: {
    fontSize: fontSizes.sm,
    color: colors.primary[500],
    fontWeight: '500',
    marginLeft: 6,
  },
  formCard: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 8,
  },
  required: {
    color: colors.error[500],
  },
  textInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: fontSizes.base,
    color: colors.gray[900],
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  settingsCard: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: fontSizes.base,
    color: colors.gray[700],
    marginLeft: 12,
  },
  switchButton: {
    padding: 4,
  },
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray[300],
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchTrackActive: {
    backgroundColor: colors.primary[500],
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  dangerCard: {
    backgroundColor: colors.error[50],
    borderColor: colors.error[100],
    borderWidth: 1,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  deleteButtonText: {
    fontSize: fontSizes.base,
    color: colors.error[500],
    fontWeight: '500',
    marginLeft: 8,
  },
  bottomSpace: {
    height: 80,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: DIMENSIONS.screenPadding,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  saveButton: {
    width: '100%',
  },
});