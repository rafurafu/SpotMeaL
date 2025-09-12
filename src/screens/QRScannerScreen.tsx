import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, spacing } from '../utils/constants';
import { QRScanConfirm } from '../components/common/QRScanConfirm';

type Props = NativeStackScreenProps<RootStackParamList, 'QRScan'>;

export default function QRScannerScreen({ navigation, route }: Props): React.JSX.Element {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const { reservationId } = route.params;

  const handleStartScan = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (result.granted) {
        setShowCamera(true);
      }
    } else {
      setShowCamera(true);
    }
  };

  const handleCancelScan = () => {
    navigation.goBack();
  };

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    // 予約IDに関連するQRコードの場合
    if (data.includes(reservationId)) {
      Alert.alert(
        '来店確認',
        '予約に対応するQRコードを検出しました。来店を確認しますか？',
        [
          {
            text: 'キャンセル',
            onPress: () => setScanned(false),
            style: 'cancel',
          },
          {
            text: '確認',
            onPress: () => {
              Alert.alert(
                '来店確認完了',
                '来店が正常に確認されました！ポイントを獲得できます。',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.navigate('Home'),
                  },
                ]
              );
            },
          },
        ]
      );
    } else if (data.startsWith('spotmeal://')) {
      // SpotMeal専用QRコード
      const params = data.replace('spotmeal://', '');
      if (params.startsWith('store/')) {
        const storeId = params.replace('store/', '');
        Alert.alert(
          '店舗QRコード',
          `店舗ID: ${storeId}\nこの店舗の詳細を確認しますか？`,
          [
            {
              text: 'キャンセル',
              onPress: () => setScanned(false),
              style: 'cancel',
            },
            {
              text: '詳細表示',
              onPress: () => {
                navigation.navigate('Home');
              },
            },
          ]
        );
      }
    } else {
      Alert.alert(
        '無効なQRコード',
        'この予約に対応していないQRコードです。正しいQRコードをスキャンしてください。',
        [
          {
            text: 'もう一度スキャン',
            onPress: () => setScanned(false),
          },
          {
            text: '戻る',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  // 確認画面を表示
  if (!showCamera) {
    return (
      <QRScanConfirm
        title="来店確認"
        description={`予約ID: ${reservationId}\n\n店舗設置のQRコードをスキャンして来店を確認します。スキャン完了後、ポイントを獲得できます。`}
        onConfirm={handleStartScan}
        onCancel={handleCancelScan}
        confirmText="スキャン開始"
        cancelText="戻る"
      />
    );
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>カメラの権限を確認中...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          QRコードをスキャンするにはカメラの権限が必要です
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={handleStartScan}>
          <Text style={styles.permissionButtonText}>権限を許可</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setShowCamera(false)}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>来店確認</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.scannerContainer}>
            <View style={styles.scanArea} />
            <Text style={styles.scanText}>
              店舗のQRコードを枠内に合わせてください
            </Text>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.infoContainer}>
              <Ionicons name="information-circle-outline" size={20} color="#fff" />
              <Text style={styles.infoText}>
                予約ID: {reservationId}
              </Text>
            </View>
            <Text style={styles.footerText}>
              来店確認のため、店舗に設置されているQRコードをスキャンしてください
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  message: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
    fontSize: 18,
    paddingHorizontal: spacing.lg,
  },
  permissionButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.primary[500],
    backgroundColor: 'transparent',
    borderRadius: 12,
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
});