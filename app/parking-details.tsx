import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import {
  MapPin,
  Star,
  Clock,
  Shield,
  Cctv,
  Zap,
  Sun,
  ChevronRight,
  Navigation,
  Info,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { PARKING_SPACES, MOCK_REVIEWS } from '@/mocks/parking';

const { width } = Dimensions.get('window');

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'CCTV': <Cctv size={16} color={Colors.navy} />,
  'Covered': <Shield size={16} color={Colors.navy} />,
  'EV Charging': <Zap size={16} color={Colors.navy} />,
  'Security Guard': <Shield size={16} color={Colors.navy} />,
  'Open Air': <Sun size={16} color={Colors.navy} />,
  'Well Lit': <Sun size={16} color={Colors.navy} />,
  'Fire Safety': <Shield size={16} color={Colors.navy} />,
};

export default function ParkingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const space = useMemo(() => PARKING_SPACES.find(s => s.id === id), [id]);

  if (!space) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ headerTransparent: false, title: 'Not Found' }} />
        <Text style={styles.errorText}>Parking space not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTintColor: Colors.white,
          headerTitle: '',
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: space.photos[0] }} style={styles.heroImage} contentFit="cover" />
          <View style={styles.imageOverlay} />
          <View style={styles.distanceBadge}>
            <Navigation size={14} color={Colors.white} />
            <Text style={styles.distanceText}>{space.distance}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{space.title}</Text>
              <View style={styles.addressRow}>
                <MapPin size={14} color={Colors.gray} />
                <Text style={styles.address}>{space.address}</Text>
              </View>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.price}>₹{space.pricePerHour}</Text>
              <Text style={styles.priceUnit}>/hr</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Star size={16} color={Colors.star} fill={Colors.star} />
              <Text style={styles.statValue}>{space.rating}</Text>
              <Text style={styles.statLabel}>({space.reviewCount})</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Clock size={16} color={Colors.blue} />
              <Text style={styles.statValue}>{space.availableFrom} - {space.availableTo}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Info size={16} color={Colors.green} />
              <Text style={[styles.statValue, { color: Colors.green }]}>Available</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenityGrid}>
              {space.amenities.map((a, i) => (
                <View key={i} style={styles.amenityChip}>
                  {AMENITY_ICONS[a] ?? <Shield size={16} color={Colors.navy} />}
                  <Text style={styles.amenityText}>{a}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rules</Text>
            {space.rules.map((r, i) => (
              <View key={i} style={styles.ruleRow}>
                <View style={styles.ruleDot} />
                <Text style={styles.ruleText}>{r}</Text>
              </View>
            ))}
          </View>

          {space.photos.length > 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
                {space.photos.map((p, i) => (
                  <Image key={i} source={{ uri: p }} style={styles.photoThumb} contentFit="cover" />
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.reviewHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All <ChevronRight size={12} color={Colors.orange} /></Text>
              </TouchableOpacity>
            </View>
            {MOCK_REVIEWS.slice(0, 2).map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>
                      {review.userName.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewName}>{review.userName}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Star size={12} color={Colors.star} fill={Colors.star} />
                    <Text style={styles.ratingBadgeText}>{review.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPrice}>₹{space.pricePerHour}<Text style={styles.bottomPriceUnit}> /hour</Text></Text>
          <Text style={styles.bottomDay}>₹{space.pricePerDay} /day</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: '/booking', params: { id: space.id } })}
          testID="book-now-btn"
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, color: Colors.gray },
  imageContainer: { position: 'relative' },
  heroImage: { width, height: 260 },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.navy,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  distanceText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  content: { padding: 20, marginTop: -20, backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.navy, marginBottom: 6 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  address: { fontSize: 13, color: Colors.gray },
  priceBox: { alignItems: 'flex-end' },
  price: { fontSize: 24, fontWeight: '800', color: Colors.orange },
  priceUnit: { fontSize: 13, color: Colors.gray },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' },
  statValue: { fontSize: 13, fontWeight: '600', color: Colors.navy },
  statLabel: { fontSize: 12, color: Colors.gray },
  statDivider: { width: 1, height: 20, backgroundColor: Colors.grayLight },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.navy, marginBottom: 12 },
  amenityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  amenityText: { fontSize: 13, fontWeight: '500', color: Colors.navy },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  ruleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.orange },
  ruleText: { fontSize: 14, color: Colors.grayDark },
  photoScroll: { marginHorizontal: -4 },
  photoThumb: { width: 120, height: 80, borderRadius: 10, marginHorizontal: 4 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAll: { fontSize: 13, color: Colors.orange, fontWeight: '600' },
  reviewCard: {
    backgroundColor: Colors.offWhite,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarText: { color: Colors.white, fontWeight: '700', fontSize: 13 },
  reviewName: { fontSize: 14, fontWeight: '600', color: Colors.navy },
  reviewDate: { fontSize: 11, color: Colors.gray },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.star + '18',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.star },
  reviewComment: { fontSize: 13, color: Colors.grayDark, lineHeight: 20 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  bottomPrice: { fontSize: 22, fontWeight: '800', color: Colors.navy },
  bottomPriceUnit: { fontSize: 14, fontWeight: '400', color: Colors.gray },
  bottomDay: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  bookBtn: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 36,
    paddingVertical: 15,
    borderRadius: 14,
  },
  bookBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
