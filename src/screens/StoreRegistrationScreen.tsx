// src/screens/StoreRegistrationScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
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
  Home: undefined;
  StoreRegistration: undefined;
  Profile: undefined;
};

type StoreRegistrationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StoreRegistration'>;

interface StoreRegistrationForm {
  name: string;
  category: string;
  description: string;
  address: string;
  image: string;
  contactEmail: string;
  contactPhone: string;
}

const categories = ['和食', 'ラーメン', '寿司', 'カフェ', 'イタリアン', '中華', '焼肉', 'その他'];

export const StoreRegistrationScreen: React.FC = () => {
  const navigation = useNavigation<StoreRegistrationScreenNavigationProp>();
  const [form, setForm] = useState<StoreRegistrationForm>({
    name: '',
    category: categories[0],
    description: '',
    address: '',
    image: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigation.navigate('Home');
  };

  const handleInputChange = (field: keyof StoreRegistrationForm, value: string) => {
    setForm(prev => ({
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
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleInputChange('image', result.assets[0].uri);
    }
  };

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      Alert.alert('エラー', '店舗名を入力してください');
      return false;
    }
    if (!form.description.trim()) {
      Alert.alert('エラー', '店舗の説明を入力してください');
      return false;
    }
    if (!form.address.trim()) {
      Alert.alert('エラー', '住所を入力してください');
      return false;
    }
    if (!form.contactEmail.trim()) {
      Alert.alert('エラー', '連絡先メールアドレスを入力してください');
      return false;
    }
    if (!form.image) {
      Alert.alert('エラー', '店舗の写真を選択してください');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // TODO: APIに送信する処理
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        '掲載申請完了',
        '店舗の掲載申請が完了しました。審査後、掲載開始のご連絡をいたします。',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('エラー', '申請の送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>店舗掲載申請</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          {/* 申請について */}
          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={24} color={colors.primary[500]} />
              <Text style={styles.infoTitle}>店舗掲載について</Text>
            </View>
            <Text style={styles.infoText}>
              申請いただいた内容を審査の上、掲載させていただきます。審査結果は1〜3営業日以内にご連絡いたします。
            </Text>
          </Card>

          {/* 店舗情報フォーム */}
          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>基本情報</Text>
            
            {/* 店舗名 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                店舗名 <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="店舗名を入力してください"
                value={form.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            {/* カテゴリ */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                カテゴリ <Text style={styles.required}>*</Text>
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryList}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        form.category === category && styles.categoryChipSelected,
                      ]}
                      onPress={() => handleInputChange('category', category)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          form.category === category && styles.categoryChipTextSelected,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* 説明 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                店舗の説明 <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="店舗の特徴やおすすめポイントを入力してください"
                value={form.description}
                onChangeText={(value) => handleInputChange('description', value)}
                placeholderTextColor={colors.gray[400]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* 住所 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                住所 <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="店舗の住所を入力してください"
                value={form.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            {/* 店舗写真 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                店舗写真 <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity 
                style={styles.imageUpload} 
                onPress={pickImage}
                activeOpacity={0.7}
              >
                {form.image ? (
                  <Image source={{ uri: form.image }} style={styles.uploadedImage} />
                ) : (
                  <View style={styles.imageUploadPlaceholder}>
                    <Ionicons name="camera" size={32} color={colors.primary[500]} />
                    <Text style={styles.imageUploadText}>写真を選択</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </Card>

          {/* 連絡先情報 */}
          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>連絡先情報</Text>
            
            {/* メールアドレス */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                メールアドレス <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="contact@example.com"
                value={form.contactEmail}
                onChangeText={(value) => handleInputChange('contactEmail', value)}
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
                placeholder="03-1234-5678"
                value={form.contactPhone}
                onChangeText={(value) => handleInputChange('contactPhone', value)}
                placeholderTextColor={colors.gray[400]}
                keyboardType="phone-pad"
              />
            </View>
          </Card>

          {/* 注意事項 */}
          <Card style={styles.noticeCard}>
            <View style={styles.noticeHeader}>
              <Ionicons name="warning" size={20} color={colors.warning[500]} />
              <Text style={styles.noticeTitle}>注意事項</Text>
            </View>
            <View style={styles.noticeList}>
              <Text style={styles.noticeItem}>• 審査には1〜3営業日お時間をいただきます</Text>
              <Text style={styles.noticeItem}>• 掲載基準を満たさない場合、お断りする場合があります</Text>
              <Text style={styles.noticeItem}>• 虚偽の情報での申請は禁止されています</Text>
              <Text style={styles.noticeItem}>• 掲載後は定期的な情報更新をお願いします</Text>
            </View>
          </Card>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* 申請ボタン */}
      <View style={styles.submitButtonContainer}>
        <Button
          title={isSubmitting ? '申請中...' : '掲載申請を送信'}
          onPress={handleSubmit}
          variant="primary"
          size="large"
          disabled={isSubmitting}
          style={styles.submitButton}
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
  infoCard: {
    marginBottom: 16,
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[100],
    borderWidth: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.primary[700],
    marginLeft: 8,
  },
  infoText: {
    fontSize: fontSizes.sm,
    color: colors.primary[600],
    lineHeight: 20,
  },
  formCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[900],
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
  categoryList: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  categoryChipText: {
    fontSize: fontSizes.sm,
    color: colors.gray[700],
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: colors.white,
  },
  imageUpload: {
    height: 120,
    backgroundColor: colors.gray[50],
    borderWidth: 2,
    borderColor: colors.primary[300],
    borderStyle: 'dashed',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageUploadPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageUploadText: {
    fontSize: fontSizes.sm,
    color: colors.primary[600],
    marginTop: 8,
    fontWeight: '500',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noticeCard: {
    backgroundColor: colors.warning[50],
    borderColor: colors.warning[100],
    borderWidth: 1,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  noticeTitle: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.warning[700],
    marginLeft: 8,
  },
  noticeList: {
    gap: 4,
  },
  noticeItem: {
    fontSize: fontSizes.sm,
    color: colors.warning[600],
    lineHeight: 18,
  },
  bottomSpace: {
    height: 80,
  },
  submitButtonContainer: {
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
  submitButton: {
    width: '100%',
  },
});