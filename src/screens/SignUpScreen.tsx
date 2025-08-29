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
import { SignUpCredentials } from '../types/auth';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { signUp, signInWithGoogle, clearError } from '../store/slices/authSlice';

interface SignUpScreenProps {
  onAuthSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ 
  onAuthSuccess, 
  onSwitchToLogin 
}) => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = '名前を入力してください';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '名前は2文字以上で入力してください';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'パスワードは英数字を含める必要があります';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワード確認を入力してください';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    if (!acceptTerms) {
      Alert.alert('確認', '利用規約とプライバシーポリシーに同意してください');
      return;
    }

    try {
      const credentials: SignUpCredentials = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };
      dispatch(signUp(credentials));
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      dispatch(signInWithGoogle());
    } catch (error) {
      console.error('Google sign up error:', error);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    let label = '';
    
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    switch (strength) {
      case 0:
      case 1:
        label = '弱い';
        break;
      case 2:
      case 3:
        label = '普通';
        break;
      case 4:
      case 5:
        label = '強い';
        break;
    }
    
    return { strength, label };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
            <TouchableOpacity
              style={styles.backButton}
              onPress={onSwitchToLogin}
            >
              <Ionicons name="arrow-back" size={24} color={colors.gray[600]} />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            
            <Text style={styles.title}>SPOTMEAL</Text>
            <Text style={styles.subtitle}>新規アカウント作成</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="お名前"
              placeholder="山田太郎"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              error={errors.name}
              autoCapitalize="words"
            />

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

            <View style={styles.passwordContainer}>
              <Input
                label="パスワード"
                placeholder="••••••••"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                error={errors.password}
                secureTextEntry
                autoComplete="new-password"
              />
              
              {formData.password.length > 0 && (
                <View style={styles.passwordStrength}>
                  <View style={styles.strengthBar}>
                    <View 
                      style={[
                        styles.strengthIndicator, 
                        { width: `${(passwordStrength.strength / 5) * 100}%` },
                        passwordStrength.strength <= 2 ? styles.strengthWeak :
                        passwordStrength.strength <= 3 ? styles.strengthMedium :
                        styles.strengthStrong
                      ]} 
                    />
                  </View>
                  <Text style={styles.strengthLabel}>
                    パスワード強度: {passwordStrength.label}
                  </Text>
                </View>
              )}
            </View>

            <Input
              label="パスワード確認"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              error={errors.confirmPassword}
              secureTextEntry
              autoComplete="new-password"
            />

            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <View style={[styles.checkboxBox, acceptTerms && styles.checkboxChecked]}>
                  {acceptTerms && (
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  )}
                </View>
                <Text style={styles.termsText}>
                  利用規約とプライバシーポリシーに同意します
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title="新規登録"
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
              title="Googleで登録"
              onPress={handleGoogleSignUp}
              variant="outline"
              loading={loading}
              style={styles.googleButton}
              textStyle={styles.googleButtonText}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              既にアカウントをお持ちの方は
            </Text>
            <TouchableOpacity onPress={onSwitchToLogin}>
              <Text style={styles.footerLink}>ログイン</Text>
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
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: spacing.md,
    padding: spacing.sm,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
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
  passwordContainer: {
    marginBottom: spacing.md,
  },
  passwordStrength: {
    marginTop: spacing.xs,
  },
  strengthBar: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthIndicator: {
    height: '100%',
    borderRadius: 2,
  },
  strengthWeak: {
    backgroundColor: colors.error[500],
  },
  strengthMedium: {
    backgroundColor: colors.warning[500],
  },
  strengthStrong: {
    backgroundColor: colors.success[500],
  },
  strengthLabel: {
    fontSize: fontSizes.xs,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  termsContainer: {
    marginBottom: spacing.lg,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.gray[300],
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  termsText: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colors.gray[600],
    lineHeight: 20,
  },
  submitButton: {
    marginBottom: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
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