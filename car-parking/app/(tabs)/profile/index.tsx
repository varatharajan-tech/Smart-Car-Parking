import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  Car,
  Shield,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  ParkingSquare,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  onPress?: () => void;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { role, setRole } = useApp();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          setRole(null);
          router.replace('/welcome');
        },
      },
    ]);
  };

  const handleSwitchRole = () => {
    const newRole = role === 'driver' ? 'owner' : 'driver';
    Alert.alert(
      'Switch Role',
      `Switch to ${newRole === 'driver' ? 'Driver' : 'Parking Owner'} mode?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch', onPress: () => setRole(newRole) },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    { icon: <Car size={20} color={Colors.blue} />, label: 'My Vehicles', subtitle: 'Manage your vehicles' },
    { icon: <CreditCard size={20} color={Colors.green} />, label: 'Payment Methods', subtitle: 'UPI, Cards, Wallets' },
    { icon: <Bell size={20} color={Colors.orange} />, label: 'Notifications', subtitle: 'Alerts & reminders' },
    { icon: <Shield size={20} color={Colors.navy} />, label: 'Privacy & Security', subtitle: 'Account protection' },
    { icon: <Star size={20} color={Colors.star} />, label: 'My Reviews', subtitle: 'Ratings you gave' },
    { icon: <HelpCircle size={20} color={Colors.gray} />, label: 'Help & Support', subtitle: 'FAQs and contact' },
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={32} color={Colors.white} />
          </View>
          <View style={styles.verifiedBadge}>
            <Shield size={12} color={Colors.white} />
          </View>
        </View>
        <Text style={styles.name}>Arjun Mehta</Text>
        <Text style={styles.phone}>+91 98765 43210</Text>
        <View style={styles.roleBadge}>
          <ParkingSquare size={14} color={Colors.orange} />
          <Text style={styles.roleText}>
            {role === 'owner' ? 'Parking Owner' : 'Driver'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.switchCard} onPress={handleSwitchRole} activeOpacity={0.8}>
        <View style={styles.switchIcon}>
          {role === 'driver' ? (
            <ParkingSquare size={20} color={Colors.orange} />
          ) : (
            <Car size={20} color={Colors.blue} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchTitle}>
            Switch to {role === 'driver' ? 'Owner' : 'Driver'} Mode
          </Text>
          <Text style={styles.switchSub}>
            {role === 'driver' ? 'List your parking space & earn' : 'Find & book parking nearby'}
          </Text>
        </View>
        <ChevronRight size={18} color={Colors.gray} />
      </TouchableOpacity>

      <View style={styles.menuSection}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem} activeOpacity={0.7} onPress={item.onPress}>
            <View style={styles.menuIconWrap}>{item.icon}</View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.subtitle}</Text>
            </View>
            <ChevronRight size={16} color={Colors.grayLight} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} testID="logout-btn">
        <LogOut size={18} color={Colors.red} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Park Connect v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  name: { fontSize: 20, fontWeight: '700', color: Colors.navy },
  phone: { fontSize: 14, color: Colors.gray, marginTop: 2 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: Colors.orange + '12',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: { fontSize: 13, fontWeight: '600', color: Colors.orange },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.grayLight,
  },
  switchIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTitle: { fontSize: 15, fontWeight: '600', color: Colors.navy },
  switchSub: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  menuSection: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.offWhite,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { fontSize: 15, fontWeight: '600', color: Colors.navy },
  menuSub: { fontSize: 12, color: Colors.gray, marginTop: 1 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.red + '0D',
    gap: 8,
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: Colors.red },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.grayLight,
    marginTop: 20,
    marginBottom: 40,
  },
});
