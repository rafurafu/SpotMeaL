import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../utils/constants';
import { QRScanConfirm } from '../components/common/QRScanConfirm';

export const QRScanScreen: React.FC = () => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

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
    
    // QRコードのデータを処理
    if (data.startsWith('spotmeal://')) {
      // SpotMeal専用QRコード
      const params = data.replace('spotmeal://', '');
      if (params.startsWith('reservation/')) {
        const reservationId = params.replace('reservation/', '');
        Alert.alert(
          '予約確認',
          `予約ID: ${reservationId}\n来店確認を行いますか？`,
          [
            {
              text: 'キャンセル',
              onPress: () => setScanned(false),
              style: 'cancel',
            },
            {
              text: '確認',
              onPress: () => {
                // 予約確認処理を実装
                Alert.alert('来店確認完了', '来店が確認されました！');
                navigation.goBack();
              },
            },
          ]
        );
      } else if (params.startsWith('store/')) {
        const storeId = params.replace('store/', '');
        Alert.alert(
          '店舗情報',
          `店舗ID: ${storeId}\n店舗詳細を表示しますか？`,
          [
            {
              text: 'キャンセル',
              onPress: () => setScanned(false),
              style: 'cancel',
            },
            {
              text: '詳細表示',
              onPress: () => {
                // 店舗詳細画面に遷移
                navigation.goBack();
              },
            },
          ]
        );
      }
    } else {
      // 一般的なQRコード
      Alert.alert(
        'QRコードをスキャンしました',
        data,
        [
          {
            text: 'もう一度スキャン',
            onPress: () => setScanned(false),
          },
          {
            text: 'OK',
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
        title="QRコードをスキャン"
        description="店舗の来店確認やサービス利用のためにQRコードを読み取ります。"
        onConfirm={handleStartScan}
        onCancel={handleCancelScan}
        confirmText="カメラを起動"
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
            <Text style={styles.headerTitle}>QRスキャン</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.scannerContainer}>
            <View style={styles.scanArea} />
            <Text style={styles.scanText}>
              QRコードを枠内に合わせてください
            </Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              SpotMealの来店確認や店舗情報のQRコードをスキャンできます
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

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
  footerText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});