import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Phone, MapPin, Shield, AlertTriangle, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

const CONTACTS = [
  { label: 'Call Local Police', sub: 'Nearest police station', phone: '100', color: Colors.navy },
  { label: 'Emergency Services', sub: 'Ambulance & Fire', phone: '112', color: Colors.red },
  { label: 'Contact App Support', sub: 'Park Connect helpline', phone: '18001234567', color: Colors.blue },
];

export default function EmergencyScreen() {
  const handleCall = (phone: string) => {
    const url = `tel:${phone}`;
    if (Platform.OS === 'web') {
      Alert.alert('Call', `Dial ${phone} for assistance`);
    } else {
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Unable to make call'));
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Emergency Help' }} />

      <View style={styles.sosCircle}>
        <View style={styles.sosInner}>
          <AlertTriangle size={40} color={Colors.white} />
        </View>
        <Text style={styles.sosText}>SOS</Text>
        <Text style={styles.sosSub}>Need immediate help?</Text>
      </View>

      <View style={styles.section}>
        {CONTACTS.map((c, i) => (
          <TouchableOpacity
            key={i}
            style={styles.contactCard}
            onPress={() => handleCall(c.phone)}
            activeOpacity={0.8}
          >
            <View style={[styles.contactIcon, { backgroundColor: c.color + '14' }]}>
              <Phone size={20} color={c.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>{c.label}</Text>
              <Text style={styles.contactSub}>{c.sub}</Text>
            </View>
            <ChevronRight size={18} color={Colors.grayLight} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.locationCard}>
        <MapPin size={20} color={Colors.orange} />
        <View style={{ flex: 1 }}>
          <Text style={styles.locationTitle}>Your Current Location</Text>
          <Text style={styles.locationSub}>Koramangala, Bangalore</Text>
        </View>
      </View>

      <View style={styles.tipCard}>
        <Shield size={18} color={Colors.green} />
        <Text style={styles.tipText}>
          Your location will be automatically shared with emergency services when you call.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite, padding: 20 },
  sosCircle: { alignItems: 'center', marginVertical: 24 },
  sosInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: Colors.red,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  sosText: { fontSize: 22, fontWeight: '800', color: Colors.navy },
  sosSub: { fontSize: 14, color: Colors.gray, marginTop: 4 },
  section: { gap: 10, marginBottom: 20 },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLabel: { fontSize: 15, fontWeight: '600', color: Colors.navy },
  contactSub: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    marginBottom: 12,
  },
  locationTitle: { fontSize: 14, fontWeight: '600', color: Colors.navy },
  locationSub: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.green + '10',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  tipText: { fontSize: 13, color: Colors.grayDark, flex: 1, lineHeight: 19 },
});
