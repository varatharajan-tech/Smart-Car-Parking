import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Navigation, Star, MapPin, AlertTriangle, RefreshCw, Car } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { PARKING_SPACES } from '@/mocks/parking';
import { ParkingSpace } from '@/types';

const INDIA_REGION = {
  latitude: 11.5,
  longitude: 78.0,
  latitudeDelta: 5,
  longitudeDelta: 5,
};

export default function MapScreen() {
  const router = useRouter();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpace | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [showAllSpots, setShowAllSpots] = useState(true);
  const displayedSpaces = showAllSpots ? PARKING_SPACES : PARKING_SPACES.filter(s => s.available);
  const availableCount = PARKING_SPACES.filter(s => s.available).length;
  const totalCount = PARKING_SPACES.length;

  const handleMapReady = useCallback(() => {
    console.log('Map is ready');
    setMapReady(true);
    setMapError(null);
  }, []);

  

  const handleRetry = useCallback(() => {
    console.log('Retrying map load...');
    setMapError(null);
    setMapReady(false);
  }, []);

  const handleMarkerPress = useCallback((space: ParkingSpace) => {
    console.log('Marker pressed:', space.id);
    setSelectedSpot(space);
  }, []);

  const handleViewDetails = useCallback((id: string) => {
    console.log('Navigating to parking details:', id);
    router.push({ pathname: '/parking-details', params: { id } });
  }, [router]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Nearby Parking',
          headerTintColor: Colors.navy,
          headerStyle: { backgroundColor: Colors.white },
        }}
      />

      {mapError ? (
        <View style={styles.errorContainer}>
          <AlertTriangle size={48} color={Colors.orange} />
          <Text style={styles.errorTitle}>Map Loading Error</Text>
          <Text style={styles.errorMessage}>{mapError}</Text>
          <Text style={styles.errorHint}>
            {Platform.OS === 'web'
              ? 'Please ensure Google Maps API key is configured correctly in Rork AI settings.'
              : 'Please check your internet connection and try again.'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <RefreshCw size={18} color={Colors.white} />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {!mapReady && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Colors.orange} />
              <Text style={styles.loadingText}>Loading map...</Text>
            </View>
          )}
          <MapView
            style={styles.map}
            initialRegion={INDIA_REGION}
            showsUserLocation
            showsMyLocationButton
            onMapReady={handleMapReady}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          >
            {displayedSpaces.map(space => (
              <Marker
                key={space.id}
                coordinate={{ latitude: space.latitude, longitude: space.longitude }}
                onPress={() => handleMarkerPress(space)}
              >
                <View style={styles.markerContainer}>
                  <View style={[
                    styles.markerBubble,
                    !space.available && styles.markerBubbleUnavailable
                  ]}>
                    <Text style={[
                      styles.markerPrice,
                      !space.available && styles.markerPriceUnavailable
                    ]}>₹{space.pricePerHour}</Text>
                    {!space.available && (
                      <Text style={styles.markerUnavailableLabel}>Full</Text>
                    )}
                  </View>
                  <View style={[
                    styles.markerArrow,
                    !space.available && styles.markerArrowUnavailable
                  ]} />
                </View>
                {Platform.OS !== 'web' && (
                  <Callout tooltip onPress={() => handleViewDetails(space.id)}>
                    <View style={styles.callout}>
                      <View style={styles.calloutHeader}>
                        <Text style={styles.calloutTitle} numberOfLines={1}>{space.title}</Text>
                        <View style={[
                          styles.availabilityBadge,
                          space.available ? styles.availableBadge : styles.unavailableBadge
                        ]}>
                          <Text style={[
                            styles.availabilityText,
                            space.available ? styles.availableText : styles.unavailableText
                          ]}>{space.available ? 'Open' : 'Full'}</Text>
                        </View>
                      </View>
                      <Text style={styles.calloutAddress} numberOfLines={1}>{space.address}</Text>
                      <View style={styles.calloutRow}>
                        <Star size={12} color={Colors.star} fill={Colors.star} />
                        <Text style={styles.calloutRating}>{space.rating}</Text>
                        <Text style={styles.calloutReviews}>({space.reviewCount})</Text>
                        <View style={styles.calloutDot} />
                        <Text style={styles.calloutDistance}>{space.distance}</Text>
                      </View>
                      {space.availableSpots !== undefined && (
                        <View style={styles.calloutSpotsRow}>
                          <Car size={12} color={space.available ? Colors.teal : Colors.gray} />
                          <Text style={[
                            styles.calloutSpots,
                            { color: space.available ? Colors.teal : Colors.gray }
                          ]}>{space.availableSpots}/{space.totalSpots} spots</Text>
                        </View>
                      )}
                      <View style={styles.calloutAmenities}>
                        {space.amenities.slice(0, 3).map((amenity, idx) => (
                          <View key={idx} style={styles.calloutAmenityTag}>
                            <Text style={styles.calloutAmenityText}>{amenity}</Text>
                          </View>
                        ))}
                      </View>
                      <Text style={styles.calloutAction}>Tap to view details →</Text>
                    </View>
                  </Callout>
                )}
              </Marker>
            ))}
          </MapView>

          <View style={styles.filterBar}>
            <View style={styles.spotCountContainer}>
              <MapPin size={16} color={Colors.navy} />
              <Text style={styles.spotCountText}>
                {showAllSpots ? `${totalCount} spots` : `${availableCount} available`}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.filterButton,
                !showAllSpots && styles.filterButtonActive
              ]}
              onPress={() => setShowAllSpots(!showAllSpots)}
            >
              <Text style={[
                styles.filterButtonText,
                !showAllSpots && styles.filterButtonTextActive
              ]}>
                {showAllSpots ? 'Show Available Only' : 'Show All'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.navy }]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.gray }]} />
              <Text style={styles.legendText}>Full</Text>
            </View>
          </View>
        </>
      )}

      {selectedSpot && !mapError && (
        <View style={styles.bottomCard}>
          <TouchableOpacity
            style={styles.spotCard}
            activeOpacity={0.9}
            onPress={() => handleViewDetails(selectedSpot.id)}
          >
            <View style={styles.spotInfo}>
              <Text style={styles.spotTitle} numberOfLines={1}>{selectedSpot.title}</Text>
              <View style={styles.spotRow}>
                <MapPin size={13} color={Colors.gray} />
                <Text style={styles.spotAddress} numberOfLines={1}>{selectedSpot.address}</Text>
              </View>
              <View style={styles.spotRow}>
                <Star size={13} color={Colors.star} fill={Colors.star} />
                <Text style={styles.spotRating}>{selectedSpot.rating}</Text>
                <Text style={styles.spotReviews}>({selectedSpot.reviewCount})</Text>
                <View style={styles.dotSep} />
                <Navigation size={13} color={Colors.gray} />
                <Text style={styles.spotDistance}>{selectedSpot.distance}</Text>
              </View>
            </View>
            <View style={styles.spotRightSection}>
              {selectedSpot.availableSpots !== undefined && (
                <View style={styles.spotsAvailableBox}>
                  <Car size={14} color={Colors.teal} />
                  <Text style={styles.spotsAvailableText}>{selectedSpot.availableSpots} spots</Text>
                </View>
              )}
              <View style={styles.spotPriceBox}>
                <Text style={styles.spotPrice}>₹{selectedSpot.pricePerHour}</Text>
                <Text style={styles.spotPriceUnit}>/hr</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.gray,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.navy,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: Colors.red,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 13,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.orange,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: '700' as const,
    fontSize: 15,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: Colors.navy,
    fontWeight: '600' as const,
    fontSize: 14,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    backgroundColor: Colors.navy,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  markerPrice: {
    color: Colors.white,
    fontWeight: '800' as const,
    fontSize: 13,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.navy,
  },
  callout: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.navy,
    marginBottom: 4,
  },
  calloutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  calloutRating: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.navy,
  },
  calloutDistance: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: 6,
  },
  calloutAction: {
    fontSize: 12,
    color: Colors.orange,
    fontWeight: '600' as const,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
  },
  spotCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  spotInfo: {
    flex: 1,
    gap: 4,
  },
  spotTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.navy,
  },
  spotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spotAddress: {
    fontSize: 13,
    color: Colors.gray,
    flex: 1,
  },
  spotRating: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.navy,
  },
  spotReviews: {
    fontSize: 12,
    color: Colors.gray,
  },
  dotSep: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.gray,
    marginHorizontal: 4,
  },
  spotDistance: {
    fontSize: 13,
    color: Colors.gray,
  },
  spotRightSection: {
    alignItems: 'flex-end',
    marginLeft: 12,
    gap: 6,
  },
  spotsAvailableBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  spotsAvailableText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.teal,
  },
  spotPriceBox: {
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  spotPrice: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.orange,
  },
  spotPriceUnit: {
    fontSize: 12,
    color: Colors.gray,
  },
  markerBubbleUnavailable: {
    backgroundColor: Colors.gray,
  },
  markerPriceUnavailable: {
    color: '#f0f0f0',
  },
  markerUnavailableLabel: {
    fontSize: 8,
    color: '#f0f0f0',
    marginTop: 2,
  },
  markerArrowUnavailable: {
    borderTopColor: Colors.gray,
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 11,
    color: Colors.gray,
    marginBottom: 6,
  },
  calloutReviews: {
    fontSize: 11,
    color: Colors.gray,
  },
  calloutDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.gray,
    marginHorizontal: 6,
  },
  calloutSpotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    marginBottom: 6,
  },
  calloutSpots: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  calloutAmenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  calloutAmenityTag: {
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  calloutAmenityText: {
    fontSize: 9,
    color: Colors.navy,
  },
  availabilityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  availableBadge: {
    backgroundColor: '#e8f5e9',
  },
  unavailableBadge: {
    backgroundColor: '#ffebee',
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  availableText: {
    color: '#2e7d32',
  },
  unavailableText: {
    color: '#c62828',
  },
  filterBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  spotCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spotCountText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.navy,
  },
  filterButton: {
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.orange,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.navy,
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  legendContainer: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: Colors.navy,
  },
});