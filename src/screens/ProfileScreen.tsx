// src/screens/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/ui/Card';
import { colors, fontSizes, DIMENSIONS } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { signOut } from '../store/slices/authSlice';

type RootStackParamList = {
  ProfileEdit: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, never>;

interface UserStats {
  totalVisits: number;
  totalRewards: number;
  favoriteStores: number;
  thisMonthVisits: number;
}

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

export default function ProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const userStats: UserStats = {
    totalVisits: 24,
    totalRewards: 3200,
    favoriteStores: 8,
    thisMonthVisits: 6,
  };

  const handleEditProfile = () => {
    navigation.navigate('ProfileEdit');
  };

  const handleNotificationSettings = () => {
    Alert.alert('通知設定', '通知設定機能は開発中です');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('プライバシーポリシー', 'プライバシーポリシーを表示します');
  };

  const handleTermsOfService = () => {
    Alert.alert('利用規約', '利用規約を表示します');
  };

  const handleSupport = () => {
    Alert.alert('サポート', 'サポート機能は開発中です');
  };

  const handleLogout = () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: 'ログアウト', 
          style: 'destructive', 
          onPress: () => {
            dispatch(signOut());
          }
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'notifications',
      title: '通知設定',
      icon: 'notifications-outline',
      color: colors.primary[500],
      onPress: handleNotificationSettings,
    },
    {
      id: 'privacy',
      title: 'プライバシーポリシー',
      icon: 'shield-checkmark-outline',
      color: colors.success[500],
      onPress: handlePrivacyPolicy,
    },
    {
      id: 'terms',
      title: '利用規約',
      icon: 'document-text-outline',
      color: colors.gray[600],
      onPress: handleTermsOfService,
    },
    {
      id: 'support',
      title: 'サポート',
      icon: 'help-circle-outline',
      color: colors.primary[500],
      onPress: handleSupport,
    },
    {
      id: 'logout',
      title: 'ログアウト',
      icon: 'log-out-outline',
      color: colors.error[500],
      onPress: handleLogout,
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
          <Ionicons name={item.icon} size={20} color={item.color} />
        </View>
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>マイページ</Text>
        </View>

        {/* プロフィールセクション */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://via.placeholder.com/80x80/FF6B35/FFFFFF?text=ユ' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'ユーザー名'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'メールアドレス'}</Text>
              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={handleEditProfile}
              >
                <Ionicons name="create-outline" size={16} color={colors.primary[500]} />
                <Text style={styles.editProfileText}>編集</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* 統計情報 */}
        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>今月の利用状況</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="restaurant" size={24} color={colors.primary[500]} />
              </View>
              <Text style={styles.statNumber}>{userStats.thisMonthVisits}</Text>
              <Text style={styles.statLabel}>来店回数</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="diamond" size={24} color={colors.warning[500]} />
              </View>
              <Text style={styles.statNumber}>¥{userStats.totalRewards.toLocaleString()}</Text>
              <Text style={styles.statLabel}>獲得報酬</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="heart" size={24} color={colors.error[500]} />
              </View>
              <Text style={styles.statNumber}>{userStats.favoriteStores}</Text>
              <Text style={styles.statLabel}>お気に入り</Text>
            </View>
          </View>
        </Card>

        {/* 全体統計 */}
        <Card style={styles.totalStatsCard}>
          <Text style={styles.sectionTitle}>累計利用状況</Text>
          <View style={styles.totalStatsRow}>
            <View style={styles.totalStatItem}>
              <Text style={styles.totalStatNumber}>{userStats.totalVisits}</Text>
              <Text style={styles.totalStatLabel}>総来店回数</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalStatItem}>
              <Text style={styles.totalStatNumber}>¥{userStats.totalRewards.toLocaleString()}</Text>
              <Text style={styles.totalStatLabel}>総獲得報酬</Text>
            </View>
          </View>
        </Card>

        {/* メニュー */}
        <Card style={styles.menuCard}>
          <Text style={styles.sectionTitle}>設定</Text>
          {menuItems.map(renderMenuItem)}
        </Card>

        {/* アプリ情報 */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>SpotMeal v1.0.0</Text>
          <Text style={styles.copyright}>© 2024 SpotMeal. All rights reserved.</Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingHorizontal: DIMENSIONS.screenPadding,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
  },
  profileCard: {
    marginHorizontal: DIMENSIONS.screenPadding,
    marginTop: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray[200],
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 4,
  },
  userEmail: {
    fontSize: fontSizes.sm,
    color: colors.gray[600],
    marginBottom: 12,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    fontSize: fontSizes.sm,
    color: colors.primary[500],
    fontWeight: '500',
    marginLeft: 4,
  },
  statsCard: {
    marginHorizontal: DIMENSIONS.screenPadding,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: colors.gray[600],
    textAlign: 'center',
  },
  totalStatsCard: {
    marginHorizontal: DIMENSIONS.screenPadding,
    marginTop: 16,
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[100],
    borderWidth: 1,
  },
  totalStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  totalStatNumber: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    color: colors.primary[600],
    marginBottom: 4,
  },
  totalStatLabel: {
    fontSize: fontSizes.sm,
    color: colors.primary[500],
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.primary[200],
  },
  menuCard: {
    marginHorizontal: DIMENSIONS.screenPadding,
    marginTop: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: fontSizes.base,
    color: colors.gray[700],
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appVersion: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
    marginBottom: 4,
  },
  copyright: {
    fontSize: fontSizes.xs,
    color: colors.gray[400],
  },
  bottomSpace: {
    height: 32,
  },
});