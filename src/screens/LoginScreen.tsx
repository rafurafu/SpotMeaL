import React, { useState, useEffect } from 'react';
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
} from 'react-native';

import { Button } from '../components/ui/Button';import { Ionicons } from '@expo/vector-icons';
import { Input } from '../components/ui/Input';
import { colors, fontSizes, spacing } from '../utils/constants';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearError, setUser, setLoading, setError } from '../store/slices/authSlice';
import { loginWithEmail, loginWithGoogle } from '../services/authService';
import { getUserDocument } from '../services/userService';

interface LoginScreenProps {
  onAuthSuccess: () => void;
  onSwitchToSignUp: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onAuthSuccess, 
  onSwitchToSignUp 
}) => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (error) {
      Alert.alert('エラー', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      onAuthSuccess();
    }
  }, [isAuthenticated, onAuthSuccess]);

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      password: '',
    };

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 6) {
      newErrors.password = 'パスワードは6文字以上で入力してください';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    dispatch(setLoading(true));
    try {
      // Firebase Authenticationでログイン
      const userCredential = await loginWithEmail(
        formData.email.trim(),
        formData.password
      );

      const firebaseUser = userCredential.user;

      // Firestoreからユーザー情報を取得
      const userDoc = await getUserDocument(firebaseUser.uid);

      // Reduxストアにユーザー情報を保存
      const provider = userDoc?.provider || 'email';
      const user = {
        id: firebaseUser.uid,
        email: firebaseUser.email || formData.email,
        name: userDoc?.displayName || firebaseUser.displayName || formData.email.split('@')[0],
        provider: provider as 'email' | 'google',
        favorites: userDoc?.favorites || [],
      };
      dispatch(setUser(user));
      Alert.alert('ログイン成功', 'ようこそ！');
    } catch (error: any) {
      dispatch(setError(error.message || 'ログインに失敗しました'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleSignIn = async () => {
    dispatch(setLoading(true));
    try {
      // Googleログイン（React NativeではsignInWithPopupは使えないため、代替実装が必要）
      // TODO: React Native用のGoogle認証（expo-auth-sessionなど）を実装
      const userCredential = await loginWithGoogle();
      const firebaseUser = userCredential.user;

      // Firestoreからユーザー情報を取得
      const userDoc = await getUserDocument(firebaseUser.uid);

      // Reduxストアにユーザー情報を保存
      const user = {
        id: firebaseUser.uid,
        email: firebaseUser.email || 'google.user@gmail.com',
        name: userDoc?.displayName || firebaseUser.displayName || 'Google User',
        provider: 'google' as const,
        favorites: userDoc?.favorites || [],
      };
      dispatch(setUser(user));
      Alert.alert('ログイン成功', 'Googleアカウントでログインしました！');
    } catch (error: any) {
      dispatch(setError(error.message || 'Googleログインに失敗しました'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>SPOTMEAL</Text>
            <Text style={styles.subtitle}>アカウントにログイン</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="メールアドレス"
              placeholder="example@email.com"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="パスワード"
              placeholder="••••••••"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              error={errors.password}
              secureTextEntry
              autoComplete="password"
            />

            <Button
              title="ログイン"
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>または</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              title="Googleでログイン"
              onPress={handleGoogleSignIn}
              variant="outline"
              loading={loading}
              style={styles.googleButton}
              textStyle={styles.googleButtonText}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              アカウントをお持ちでない方は
            </Text>
            <TouchableOpacity onPress={onSwitchToSignUp}>
              <Text style={styles.footerLink}>新規登録</Text>
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
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
    marginBottom: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: fontSizes['3xl'],
    fontWeight: 'bold',
    color: '#1B4A4A',
    marginBottom: spacing.xs,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    color: colors.gray[600],
    textAlign: 'center',
  },
  form: {
    flex: 1,
    marginBottom: spacing.xl,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[300],
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: fontSizes.sm,
    color: colors.gray[500],
  },
  googleButton: {
    borderColor: colors.gray[300],
  },
  googleButtonText: {
    color: colors.gray[700],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    fontSize: fontSizes.base,
    color: colors.gray[600],
  },
  footerLink: {
    fontSize: fontSizes.base,
    color: colors.primary[500],
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
});