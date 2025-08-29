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
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { colors, fontSizes, spacing } from '../utils/constants';
import { LoginCredentials, SignUpCredentials } from '../types/auth';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { signIn, signUp, signInWithGoogle, clearError } from '../store/slices/authSlice';

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

    try {
      const credentials: LoginCredentials = {
        email: formData.email,
        password: formData.password,
      };
      dispatch(signIn(credentials));
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      dispatch(signInWithGoogle());
    } catch (error) {
      console.error('Google sign in error:', error);
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