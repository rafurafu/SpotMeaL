import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';

interface PaymentModalProps {
  visible: boolean;
  amount: number;
  restaurantName: string;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({
  visible,
  amount,
  restaurantName,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps): React.JSX.Element {
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handlePayment = async () => {
    try {
      setLoading(true);

      // TODO: Replace with actual payment intent creation
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'SpotMeal',
        paymentIntentClientSecret: 'dummy_client_secret', // Replace with actual client secret
        defaultBillingDetails: {
          name: 'ユーザー名',
        },
      });

      if (error) {
        Alert.alert('エラー', error.message);
        return;
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert('決済エラー', paymentError.message);
      } else {
        Alert.alert('決済完了', '決済が正常に完了しました！');
        onPaymentSuccess();
        onClose();
      }
    } catch (error) {
      Alert.alert('エラー', '決済処理中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>決済確認</Text>
          
          <View style={styles.details}>
            <Text style={styles.restaurantName}>{restaurantName}</Text>
            <Text style={styles.amount}>¥{amount.toLocaleString()}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>キャンセル</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.payButton]}
              onPress={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payButtonText}>決済する</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  details: {
    alignItems: 'center',
    marginBottom: 30,
  },
  restaurantName: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#FF6B35',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});