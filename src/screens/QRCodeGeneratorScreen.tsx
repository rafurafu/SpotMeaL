import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors, spacing } from '../utils/constants';

export const QRCodeGeneratorScreen: React.FC = () => {
  const [reservationId, setReservationId] = useState('12345');
  const [storeName, setStoreName] = useState('サンプル店舗');
  const [qrType, setQrType] = useState<'reservation' | 'store'>('reservation');

  const getQRValue = () => {
    if (qrType === 'reservation') {
      return `spotmeal://reservation/${reservationId}`;
    } else {
      return `spotmeal://store/${reservationId}`;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>QRコード生成（テスト用）</Text>
        <Text style={styles.subtitle}>
          スキャンテスト用のQRコードを生成できます
        </Text>

        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              qrType === 'reservation' && styles.typeButtonActive,
            ]}
            onPress={() => setQrType('reservation')}
          >
            <Text
              style={[
                styles.typeButtonText,
                qrType === 'reservation' && styles.typeButtonTextActive,
              ]}
            >
              予約チェックイン
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              qrType === 'store' && styles.typeButtonActive,
            ]}
            onPress={() => setQrType('store')}
          >
            <Text
              style={[
                styles.typeButtonText,
                qrType === 'store' && styles.typeButtonTextActive,
              ]}
            >
              店舗情報
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {qrType === 'reservation' ? '予約ID' : '店舗ID'}
          </Text>
          <TextInput
            style={styles.input}
            value={reservationId}
            onChangeText={setReservationId}
            placeholder="IDを入力"
          />
        </View>

        {qrType === 'reservation' && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>店舗名（表示用）</Text>
            <TextInput
              style={styles.input}
              value={storeName}
              onChangeText={setStoreName}
              placeholder="店舗名を入力"
            />
          </View>
        )}

        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <QRCode
              value={getQRValue()}
              size={250}
              backgroundColor="white"
              color={colors.primary[500]}
            />
          </View>
          <Text style={styles.qrValue}>{getQRValue()}</Text>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>使い方</Text>
          <Text style={styles.instructionsText}>
            1. 上記のQRコードをスマートフォンで表示
          </Text>
          <Text style={styles.instructionsText}>
            2. 別のデバイスでQRスキャン画面を開く
          </Text>
          <Text style={styles.instructionsText}>
            3. このQRコードをスキャンしてテスト
          </Text>
        </View>

        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>サンプルID</Text>
          <View style={styles.exampleButtons}>
            <TouchableOpacity
              style={styles.exampleButton}
              onPress={() => setReservationId('RES001')}
            >
              <Text style={styles.exampleButtonText}>RES001</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exampleButton}
              onPress={() => setReservationId('RES002')}
            >
              <Text style={styles.exampleButtonText}>RES002</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exampleButton}
              onPress={() => setReservationId('STORE123')}
            >
              <Text style={styles.exampleButtonText}>STORE123</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.primary[500],
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  qrWrapper: {
    padding: spacing.lg,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  qrValue: {
    marginTop: spacing.md,
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  instructionsContainer: {
    backgroundColor: colors.gray[100],
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  instructionsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  examplesContainer: {
    marginBottom: spacing.xl,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  exampleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  exampleButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  exampleButtonText: {
    fontSize: 12,
    color: colors.primary[500],
    fontWeight: '500',
  },
});
