import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { Booking } from '@/types';

type TabKey = 'all' | 'confirmed' | 'completed' | 'cancelled';

const STATUS_CONFIG: Record<Booking['status'], { color: string; icon: React.ReactNode; label: string }> = {
  pending: { color: Colors.star, icon: <AlertCircle size={16} color={Colors.star} />, label: 'Pending' },
  confirmed: { color: Colors.blue, icon: <Clock size={16} color={Colors.blue} />, label: 'Confirmed' },
  completed: { color: Colors.green, icon: <CheckCircle size={16} color={Colors.green} />, label: 'Completed' },
  cancelled: { color: Colors.red, icon: <XCircle size={16} color={Colors.red} />, label: 'Cancelled' },
};

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const { bookings } = useApp();
  const [tab, setTab] = useState<TabKey>('all');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'confirmed', label: 'Active' },
    { key: 'completed', label: 'Past' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const filtered = useMemo(() => {
    if (tab === 'all') return bookings;
    return bookings.filter(b => b.status === tab);
  }, [bookings, tab]);

  const renderBooking = ({ item }: { item: Booking }) => {
    const config = STATUS_CONFIG[item.status];
    return (
      <View style={styles.card} testID={`booking-${item.id}`}>
        <View style={[styles.statusStrip, { backgroundColor: config.color }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.parkingTitle}</Text>
            <View style={[styles.statusBadge, { backgroundColor: config.color + '18' }]}>
              {config.icon}
              <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <MapPin size={13} color={Colors.gray} />
            <Text style={styles.cardSub}>{item.parkingAddress}</Text>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.footerLabel}>Date</Text>
              <Text style={styles.footerValue}>{item.date}</Text>
            </View>
            <View>
              <Text style={styles.footerLabel}>Time</Text>
              <Text style={styles.footerValue}>{item.startTime} - {item.endTime}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' as const }}>
              <Text style={styles.footerLabel}>Total</Text>
              <Text style={styles.priceText}>₹{item.totalPrice}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.screenTitle}>My Bookings</Text>

      <View style={styles.tabRow}>
        {tabs.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderBooking}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Clock size={48} color={Colors.grayLight} />
            <Text style={styles.emptyText}>No bookings yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.navy,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginVertical: 14,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grayLight,
  },
  tabActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.grayDark,
  },
  tabTextActive: {
    color: Colors.white,
  },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusStrip: { width: 4 },
  cardContent: { flex: 1, padding: 16 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.navy,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  cardSub: { fontSize: 12, color: Colors.gray },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.grayLight,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLabel: { fontSize: 11, color: Colors.gray, marginBottom: 2 },
  footerValue: { fontSize: 13, fontWeight: '600', color: Colors.navy },
  priceText: { fontSize: 16, fontWeight: '800', color: Colors.orange },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: { fontSize: 16, color: Colors.gray },
});
