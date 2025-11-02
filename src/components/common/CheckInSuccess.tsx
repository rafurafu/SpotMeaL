import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../utils/constants';

interface CheckInSuccessProps {
  storeName?: string;
  reservationId?: string;
  onClose: () => void;
}

export const CheckInSuccess: React.FC<CheckInSuccessProps> = ({
  storeName,
  reservationId,
  onClose,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={100} color={colors.success} />
        </Animated.View>

        <Text style={styles.title}>チェックインしました</Text>

        {storeName && (
          <Text style={styles.storeName}>{storeName}</Text>
        )}

        <Text style={styles.message}>
          ご来店ありがとうございます！{'\n'}
          スタッフの案内をお待ちください。
        </Text>

        {reservationId && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>予約ID</Text>
            <Text style={styles.infoValue}>{reservationId}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>閉じる</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  storeName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary[500],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  infoContainer: {
    backgroundColor: colors.gray[100],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    backgroundColor: colors.primary[500],
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
