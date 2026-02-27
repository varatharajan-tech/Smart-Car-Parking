import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { Image } from 'expo-image';
import {
  TrendingUp,
  MapPin,
  Star,
  Plus,
  Eye,
  Edit3,
  Clock,
  DollarSign,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { MOCK_EARNINGS, PARKING_SPACES } from '@/mocks/parking';

export default function OwnerDashboardScreen() {
  const listing = PARKING_SPACES[0];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Owner Dashboard' }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.earningsGrid}>
          <View style={[styles.earningCard, { backgroundColor: '#EBF5FF' }]}>
            <DollarSign size={18} color={Colors.blue} />
            <Text style={styles.earningValue}>₹{MOCK_EARNINGS.today}</Text>
            <Text style={styles.earningLabel}>Today</Text>
          </View>
          <View style={[styles.earningCard, { backgroundColor: '#FFF3E8' }]}>
            <TrendingUp size={18} color={Colors.orange} />
            <Text style={styles.earningValue}>₹{MOCK_EARNINGS.thisWeek.toLocaleString()}</Text>
            <Text style={styles.earningLabel}>This Week</Text>
          </View>
          <View style={[styles.earningCard, { backgroundColor: '#E8FFF0' }]}>
            <TrendingUp size={18} color={Colors.green} />
            <Text style={styles.earningValue}>₹{MOCK_EARNINGS.thisMonth.toLocaleString()}</Text>
            <Text style={styles.earningLabel}>This Month</Text>
          </View>
          <View style={[styles.earningCard, { backgroundColor: '#F3E8FF' }]}>
            <Star size={18} color="#8B5CF6" />
            <Text style={styles.earningValue}>₹{MOCK_EARNINGS.total.toLocaleString()}</Text>
            <Text style={styles.earningLabel}>Total</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Listings</Text>
        <View style={styles.listingCard}>
          <Image source={{ uri: listing.photos[0] }} style={styles.listingImage} contentFit="cover" />
          <View style={styles.listingBody}>
            <Text style={styles.listingTitle}>{listing.title}</Text>
            <View style={styles.listingRow}>
              <MapPin size={13} color={Colors.gray} />
              <Text style={styles.listingAddr}>{listing.address}</Text>
            </View>
            <View style={styles.listingFooter}>
              <View style={styles.listingRating}>
                <Star size={13} color={Colors.star} fill={Colors.star} />
                <Text style={styles.listingRatingText}>{listing.rating}</Text>
              </View>
              <Text style={styles.listingPrice}>₹{listing.pricePerHour}/hr</Text>
            </View>
            <View style={styles.listingActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Eye size={14} color={Colors.blue} />
                <Text style={[styles.actionText, { color: Colors.blue }]}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Edit3 size={14} color={Colors.orange} />
                <Text style={[styles.actionText, { color: Colors.orange }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Clock size={14} color={Colors.green} />
                <Text style={[styles.actionText, { color: Colors.green }]}>Slots</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.addListingBtn}>
          <Plus size={20} color={Colors.orange} />
          <Text style={styles.addListingText}>Add New Parking Space</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Recent Bookings</Text>
        {[
          { name: 'Mr. Kumar', time: 'Feb 7 | 10:00 - 14:00', amount: '₹200', status: 'Confirmed' },
          { name: 'Ms. Priya', time: 'Feb 6 | 09:00 - 17:00', amount: '₹400', status: 'Completed' },
          { name: 'Mr. Arun', time: 'Feb 5 | 14:00 - 18:00', amount: '₹200', status: 'Completed' },
        ].map((b, i) => (
          <View key={i} style={styles.bookingRow}>
            <View style={styles.bookingAvatar}>
              <Text style={styles.bookingAvatarText}>
                {b.name.split(' ').slice(-1)[0][0]}{b.name.split(' ').slice(-1)[0][1]?.toUpperCase() ?? ''}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bookingName}>{b.name}</Text>
              <Text style={styles.bookingTime}>{b.time}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' as const }}>
              <Text style={styles.bookingAmount}>{b.amount}</Text>
              <Text style={[
                styles.bookingStatus,
                { color: b.status === 'Confirmed' ? Colors.blue : Colors.green },
              ]}>{b.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  scroll: { padding: 20, paddingBottom: 40 },
  earningsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  earningCard: {
    width: '48%',
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  earningValue: { fontSize: 20, fontWeight: '800', color: Colors.navy },
  earningLabel: { fontSize: 12, color: Colors.gray },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.navy, marginBottom: 12 },
  listingCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  listingImage: { width: '100%', height: 140 },
  listingBody: { padding: 16 },
  listingTitle: { fontSize: 16, fontWeight: '700', color: Colors.navy, marginBottom: 4 },
  listingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  listingAddr: { fontSize: 13, color: Colors.gray },
  listingFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  listingRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  listingRatingText: { fontSize: 14, fontWeight: '700', color: Colors.navy },
  listingPrice: { fontSize: 16, fontWeight: '800', color: Colors.orange },
  listingActions: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.offWhite,
  },
  actionText: { fontSize: 13, fontWeight: '600' },
  addListingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.orange,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 18,
    gap: 8,
    marginBottom: 24,
  },
  addListingText: { fontSize: 15, fontWeight: '600', color: Colors.orange },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginBottom: 8,
  },
  bookingAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  bookingName: { fontSize: 14, fontWeight: '600', color: Colors.navy },
  bookingTime: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  bookingAmount: { fontSize: 15, fontWeight: '700', color: Colors.navy },
  bookingStatus: { fontSize: 11, fontWeight: '600', marginTop: 2 },
});