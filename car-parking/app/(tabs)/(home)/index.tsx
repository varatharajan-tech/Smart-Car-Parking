import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, MapPin, SlidersHorizontal, Star, Zap, ChevronRight, Car, Navigation } from 'lucide-react-native';
import { Image } from 'expo-image';
import Colors from '@/constants/colors';
import { PARKING_SPACES } from '@/mocks/parking';
import { useApp } from '@/context/AppContext';
import { ParkingSpace } from '@/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 56;

type FilterType = 'all' | 'nearby' | 'cheapest' | 'top_rated';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { role } = useApp();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const scrollX = useRef(new Animated.Value(0)).current;

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: <Car size={14} color={activeFilter === 'all' ? Colors.white : Colors.grayDark} /> },
    { key: 'nearby', label: 'Nearby', icon: <Navigation size={14} color={activeFilter === 'nearby' ? Colors.white : Colors.grayDark} /> },
    { key: 'cheapest', label: 'Cheapest', icon: <Zap size={14} color={activeFilter === 'cheapest' ? Colors.white : Colors.grayDark} /> },
    { key: 'top_rated', label: 'Top Rated', icon: <Star size={14} color={activeFilter === 'top_rated' ? Colors.white : Colors.grayDark} /> },
  ];

  const getFilteredSpaces = useCallback((): ParkingSpace[] => {
    let spaces = [...PARKING_SPACES].filter(s => s.available);
    if (search) {
      const q = search.toLowerCase();
      spaces = spaces.filter(s => s.title.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
    }
    switch (activeFilter) {
      case 'cheapest': return spaces.sort((a, b) => a.pricePerHour - b.pricePerHour);
      case 'top_rated': return spaces.sort((a, b) => b.rating - a.rating);
      case 'nearby': return spaces.sort((a, b) => parseFloat(a.distance ?? '99') - parseFloat(b.distance ?? '99'));
      default: return spaces;
    }
  }, [search, activeFilter]);

  const filteredSpaces = getFilteredSpaces();

  if (role === 'owner') {
    return <OwnerHome />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.greeting}>Good morning! 👋</Text>
          <Text style={styles.headerTitle}>Find Parking Near You</Text>
        </View>
        <TouchableOpacity
          style={styles.sosBtn}
          onPress={() => router.push('/emergency')}
          testID="sos-btn"
        >
          <Text style={styles.sosBtnText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search location, area..."
            placeholderTextColor={Colors.gray}
            value={search}
            onChangeText={setSearch}
            testID="search-input"
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} testID="filter-btn">
          <SlidersHorizontal size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.key)}
          >
            {f.icon}
            <Text style={[styles.filterChipText, activeFilter === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.mapPlaceholder}
        activeOpacity={0.85}
        onPress={() => router.push('/map')}
        testID="map-view-btn"
      >
        <MapPin size={32} color={Colors.orange} />
        <Text style={styles.mapPlaceholderText}>Map View</Text>
        <Text style={styles.mapSubText}>{filteredSpaces.length} spots available nearby</Text>
        <View style={styles.mapTapHint}>
          <Text style={styles.mapTapHintText}>Tap to explore on map</Text>
          <ChevronRight size={14} color="rgba(255,255,255,0.8)" />
        </View>
      </TouchableOpacity>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Nearby Parking</Text>
        <Text style={styles.listCount}>{filteredSpaces.length} found</Text>
      </View>

      <Animated.ScrollView
        horizontal
        pagingEnabled={false}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardScroll}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {filteredSpaces.map((space, idx) => (
          <TouchableOpacity
            key={space.id}
            style={[styles.parkingCard, { width: CARD_WIDTH }]}
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: '/parking-details', params: { id: space.id } })}
            testID={`parking-card-${space.id}`}
          >
            <Image
              source={{ uri: space.photos[0] }}
              style={styles.cardImage}
              contentFit="cover"
            />
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>{space.distance}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={1}>{space.title}</Text>
              <View style={styles.cardRow}>
                <MapPin size={13} color={Colors.gray} />
                <Text style={styles.cardAddress} numberOfLines={1}>{space.address}</Text>
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.ratingRow}>
                  <Star size={14} color={Colors.star} fill={Colors.star} />
                  <Text style={styles.ratingText}>{space.rating}</Text>
                  <Text style={styles.reviewCount}>({space.reviewCount})</Text>
                </View>
                <Text style={styles.cardPrice}>₹{space.pricePerHour}<Text style={styles.cardPriceUnit}>/hr</Text></Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

function OwnerHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <View>
          <Text style={styles.greeting}>Welcome back! 🏠</Text>
          <Text style={styles.headerTitle}>Owner Dashboard</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.ownerStatRow}>
          <View style={[styles.ownerStat, { backgroundColor: '#EBF5FF' }]}>
            <Text style={styles.ownerStatValue}>₹3,200</Text>
            <Text style={styles.ownerStatLabel}>This Week</Text>
          </View>
          <View style={[styles.ownerStat, { backgroundColor: '#FFF3E8' }]}>
            <Text style={styles.ownerStatValue}>1</Text>
            <Text style={styles.ownerStatLabel}>Active Listings</Text>
          </View>
        </View>

        <View style={styles.ownerEarningsCard}>
          <Text style={styles.ownerSectionTitle}>Weekly Earnings</Text>
          <View style={styles.barChart}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
              const heights = [40, 60, 70, 52, 48, 65, 65];
              return (
                <View key={i} style={styles.barCol}>
                  <View style={[styles.bar, { height: heights[i], backgroundColor: i === 2 ? Colors.orange : Colors.navyLight }]} />
                  <Text style={styles.barLabel}>{day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={[styles.ownerSectionTitle, { paddingHorizontal: 20, marginTop: 20 }]}>Pending Requests</Text>
        <View style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <View style={styles.requestAvatar}>
              <Text style={styles.requestAvatarText}>MK</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.requestName}>Mr. Kumar</Text>
              <Text style={styles.requestDate}>Feb 7 | 10:00 - 14:00</Text>
            </View>
            <TouchableOpacity style={styles.acceptBtn}>
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <View style={[styles.requestAvatar, { backgroundColor: '#FFE4D6' }]}>
              <Text style={[styles.requestAvatarText, { color: Colors.orange }]}>SP</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.requestName}>Ms. Priya</Text>
              <Text style={styles.requestDate}>Feb 8 | 09:00 - 17:00</Text>
            </View>
            <TouchableOpacity style={styles.acceptBtn}>
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addSpaceBtn}
          onPress={() => router.push('/owner-dashboard')}
        >
          <Text style={styles.addSpaceBtnText}>Manage Listings</Text>
          <ChevronRight size={18} color={Colors.orange} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.navy,
  },
  sosBtn: {
    backgroundColor: Colors.red,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sosBtnText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 13,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.grayLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.navy,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.grayLight,
  },
  filterChipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.grayDark,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  mapPlaceholder: {
    marginHorizontal: 20,
    height: 160,
    borderRadius: 16,
    backgroundColor: Colors.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mapPlaceholderText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  mapSubText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  mapTapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  mapTapHintText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.navy,
  },
  listCount: {
    fontSize: 13,
    color: Colors.gray,
  },
  cardScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  parkingCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 130,
  },
  cardBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.navy,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cardBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  cardBody: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  cardAddress: {
    fontSize: 13,
    color: Colors.gray,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.navy,
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.gray,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.orange,
  },
  cardPriceUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.gray,
  },
  ownerStatRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 12,
  },
  ownerStat: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
  },
  ownerStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.navy,
  },
  ownerStatLabel: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 4,
  },
  ownerEarningsCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
  },
  ownerSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 16,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 90,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  bar: {
    width: 24,
    borderRadius: 6,
    minHeight: 8,
  },
  barLabel: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '600',
  },
  requestCard: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requestAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#D6E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestAvatarText: {
    fontWeight: '700',
    fontSize: 14,
    color: Colors.blue,
  },
  requestName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.navy,
  },
  requestDate: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  acceptBtn: {
    backgroundColor: Colors.green,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  addSpaceBtn: {
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.orange,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 6,
  },
  addSpaceBtnText: {
    color: Colors.orange,
    fontWeight: '700',
    fontSize: 15,
  },
});
