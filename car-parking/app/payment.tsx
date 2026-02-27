import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  CreditCard,
  Smartphone,
  Wallet,
  Shield,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

type PaymentMethod = 'upi' | 'card' | 'wallet';

const METHODS: { key: PaymentMethod; label: string; sub: string; icon: React.ReactNode }[] = [
  { key: 'upi', label: 'UPI', sub: 'PhonePe, Google Pay, Paytm', icon: <Smartphone size={20} color={Colors.blue} /> },
  { key: 'card', label: 'Credit/Debit Card', sub: 'Visa, Mastercard, RuPay', icon: <CreditCard size={20} color={Colors.green} /> },
  { key: 'wallet', label: 'Wallet', sub: 'Paytm, Mobikwik', icon: <Wallet size={20} color={Colors.orange} /> },
];

export default function PaymentScreen() {
  const { amount } = useLocalSearchParams<{ amount: string }>();
  const router = useRouter();
  const [selected, setSelected] = useState<PaymentMethod>('upi');
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      Alert.alert(
        'Payment Successful! ✅',
        `₹${amount} paid successfully. Your parking is booked!`,
        [{ text: 'Great!', onPress: () => router.dismissAll() }]
      );
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Secure Payment' }} />

      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <Text style={styles.amountValue}>₹{amount}</Text>
        <View style={styles.secureRow}>
          <Shield size={14} color={Colors.green} />
          <Text style={styles.secureText}>256-bit SSL Encrypted</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Payment Method</Text>

      {METHODS.map(m => (
        <TouchableOpacity
          key={m.key}
          style={[styles.methodCard, selected === m.key && styles.methodCardActive]}
          onPress={() => setSelected(m.key)}
          activeOpacity={0.8}
        >
          <View style={styles.methodIcon}>{m.icon}</View>
          <View style={{ flex: 1 }}>
            <Text style={styles.methodLabel}>{m.label}</Text>
            <Text style={styles.methodSub}>{m.sub}</Text>
          </View>
          <View style={[styles.radio, selected === m.key && styles.radioActive]}>
            {selected === m.key && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.insuranceCard}>
        <Shield size={20} color={Colors.blue} />
        <View style={{ flex: 1 }}>
          <Text style={styles.insuranceTitle}>Optional Insurance</Text>
          <Text style={styles.insuranceSub}>Protect your vehicle for ₹20/booking</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={[styles.payBtn, processing && styles.payBtnDisabled]}
        activeOpacity={0.85}
        onPress={handlePay}
        disabled={processing}
        testID="pay-btn"
      >
        <Text style={styles.payBtnText}>
          {processing ? 'Processing...' : `Pay ₹${amount}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite, padding: 20, paddingBottom: 36 },
  amountCard: {
    backgroundColor: Colors.navy,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
  },
  amountLabel: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  amountValue: { fontSize: 36, fontWeight: '800', color: Colors.white, marginVertical: 4 },
  secureRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  secureText: { fontSize: 12, color: Colors.green },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.navy, marginBottom: 12 },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1.5,
    borderColor: Colors.grayLight,
  },
  methodCardActive: { borderColor: Colors.orange, backgroundColor: Colors.orange + '08' },
  methodIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodLabel: { fontSize: 15, fontWeight: '600', color: Colors.navy },
  methodSub: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.orange },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.orange },
  insuranceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.blue + '0D',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginTop: 10,
  },
  insuranceTitle: { fontSize: 14, fontWeight: '600', color: Colors.navy },
  insuranceSub: { fontSize: 12, color: Colors.gray, marginTop: 1 },
  addBtn: {
    borderWidth: 1,
    borderColor: Colors.blue,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addBtnText: { fontSize: 12, fontWeight: '700', color: Colors.blue },
  payBtn: {
    backgroundColor: Colors.orange,
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
  },
  payBtnDisabled: { opacity: 0.6 },
  payBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});