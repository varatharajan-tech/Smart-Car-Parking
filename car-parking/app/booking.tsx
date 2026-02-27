import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { PARKING_SPACES } from '@/mocks/parking';
import { useApp } from '@/context/AppContext';
import { Booking } from '@/types';

const HOURS = Array.from({ length: 16 }, (_, i) => {
  const h = i + 6;
  return `${h.toString().padStart(2, '0')}:00`;
});

const DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
    date: d.toISOString().split('T')[0],
    day: d.getDate(),
    isToday: i === 0,
  };
});

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addBooking } = useApp();
  const space = useMemo(() => PARKING_SPACES.find(s => s.id === id), [id]);

  const [selectedDate, setSelectedDate] = useState(DATES[0].date);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');

  const duration = useMemo(() => {
    const s = parseInt(startTime.split(':')[0], 10);
    const e = parseInt(endTime.split(':')[0], 10);
    return Math.max(e - s, 1);
  }, [startTime, endTime]);

  const totalPrice = (space?.pricePerHour ?? 50) * duration;

  const handleProceed = useCallback(() => {
    if (!space) return;
    const booking: Booking = {
      id: `b${Date.now()}`,
      parkingId: space.id,
      parkingTitle: space.title,
      parkingAddress: space.address,
      userId: 'u1',
      date: selectedDate,
      startTime,
      endTime,
      totalPrice,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    addBooking(booking);
    router.push({ pathname: '/payment', params: { amount: String(totalPrice), bookingId: booking.id } });
  }, [space, selectedDate, startTime, endTime, totalPrice, addBooking, router]);

  if (!space) return null;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Book Parking' }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.spaceInfo}>
          <View style={styles.spaceIcon}>
            <MapPin size={20} color={Colors.orange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.spaceName}>{space.title}</Text>
            <Text style={styles.spaceAddr}>{space.address}</Text>
          </View>
          <Text style={styles.spacePrice}>₹{space.pricePerHour}/hr</Text>
        </View>

        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {DATES.map(d => (
            <TouchableOpacity
              key={d.date}
              style={[styles.dateCard, selectedDate === d.date && styles.dateCardActive]}
              onPress={() => setSelectedDate(d.date)}
            >
              <Text style={[styles.dateLabel, selectedDate === d.date && styles.dateLabelActive]}>{d.label}</Text>
              <Text style={[styles.dateDay, selectedDate === d.date && styles.dateDayActive]}>{d.day}</Text>
              {d.isToday && <View style={[styles.todayDot, selectedDate === d.date && styles.todayDotActive]} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.timeRow}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>From</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.timeChips}>
                {HOURS.filter((_, i) => i < 12).map(h => (
                  <TouchableOpacity
                    key={h}
                    style={[styles.timeChip, startTime === h && styles.timeChipActive]}
                    onPress={() => setStartTime(h)}
                  >
                    <Text style={[styles.timeChipText, startTime === h && styles.timeChipTextActive]}>{h}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>To</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.timeChips}>
                {HOURS.filter(h => parseInt(h, 10) > parseInt(startTime, 10)).map(h => (
                  <TouchableOpacity
                    key={h}
                    style={[styles.timeChip, endTime === h && styles.timeChipActive]}
                    onPress={() => setEndTime(h)}
                  >
                    <Text style={[styles.timeChipText, endTime === h && styles.timeChipTextActive]}>{h}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>{selectedDate}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>{startTime} - {endTime}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>{duration} hour{duration > 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rate</Text>
            <Text style={styles.summaryValue}>₹{space.pricePerHour}/hr</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{totalPrice}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.proceedBtn}
          activeOpacity={0.85}
          onPress={handleProceed}
          testID="proceed-payment-btn"
        >
          <Text style={styles.proceedBtnText}>Proceed to Pay ₹{totalPrice}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  scroll: { padding: 20, paddingBottom: 100 },
  spaceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  spaceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.orange + '14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceName: { fontSize: 15, fontWeight: '700', color: Colors.navy },
  spaceAddr: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  spacePrice: { fontSize: 16, fontWeight: '800', color: Colors.orange },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.navy, marginBottom: 12 },
  dateRow: { gap: 10, marginBottom: 24 },
  dateCard: {
    width: 60,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grayLight,
  },
  dateCardActive: { backgroundColor: Colors.navy, borderColor: Colors.navy },
  dateLabel: { fontSize: 12, color: Colors.gray, fontWeight: '600', marginBottom: 4 },
  dateLabelActive: { color: 'rgba(255,255,255,0.7)' },
  dateDay: { fontSize: 20, fontWeight: '700', color: Colors.navy },
  dateDayActive: { color: Colors.white },
  todayDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.orange, marginTop: 4 },
  todayDotActive: { backgroundColor: Colors.orangeLight },
  timeRow: { gap: 16, marginBottom: 24 },
  timeBlock: { gap: 8 },
  timeLabel: { fontSize: 13, fontWeight: '600', color: Colors.grayDark },
  timeChips: { flexDirection: 'row', gap: 8 },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grayLight,
  },
  timeChipActive: { backgroundColor: Colors.orange, borderColor: Colors.orange },
  timeChipText: { fontSize: 14, fontWeight: '600', color: Colors.navy },
  timeChipTextActive: { color: Colors.white },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: Colors.navy, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: Colors.gray },
  summaryValue: { fontSize: 14, fontWeight: '600', color: Colors.navy },
  summaryDivider: { height: 1, backgroundColor: Colors.grayLight, marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: Colors.navy },
  totalValue: { fontSize: 20, fontWeight: '800', color: Colors.orange },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
  },
  proceedBtn: {
    backgroundColor: Colors.orange,
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
  },
  proceedBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});