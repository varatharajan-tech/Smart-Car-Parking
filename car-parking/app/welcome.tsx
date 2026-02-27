import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Car, ParkingSquare, LogIn } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { setRole, role, isRoleLoading } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const btnAnim1 = useRef(new Animated.Value(0)).current;
  const btnAnim2 = useRef(new Animated.Value(0)).current;
  const btnAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isRoleLoading && role) {
      router.replace('/(tabs)/(home)' as any);
      return;
    }

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.stagger(120, [
        Animated.spring(btnAnim1, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.spring(btnAnim2, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
        Animated.spring(btnAnim3, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      ]),
    ]).start();
  }, [isRoleLoading, role]);

  const handleRole = (r: 'driver' | 'owner') => {
    setRole(r);
    router.replace('/(tabs)/(home)' as any);
  };

  if (isRoleLoading || role) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={[Colors.navyDark, Colors.navy, Colors.navyLight]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
      />

      <View style={styles.bgPattern}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.bgDot,
              {
                top: 80 + i * 110,
                left: (i % 2 === 0 ? 20 : width - 60) + Math.random() * 40,
                opacity: 0.04 + i * 0.01,
                width: 40 + i * 10,
                height: 40 + i * 10,
              },
            ]}
          />
        ))}
      </View>

      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <ParkingSquare size={28} color={Colors.white} />
          </View>
          <Text style={styles.logoText}>Park Connect</Text>
        </View>
        <Text style={styles.tagline}>
          Find & share parking spaces{'\n'}in your neighborhood
        </Text>
      </Animated.View>

      <View style={styles.heroImageContainer}>
        <Animated.View style={[styles.heroCard, { opacity: fadeAnim }]}>
          <View style={styles.heroIconWrap}>
            <View style={styles.heroRing}>
              <ParkingSquare size={48} color={Colors.orange} />
            </View>
          </View>
          <Text style={styles.heroStat}>500+</Text>
          <Text style={styles.heroLabel}>Parking spaces near you</Text>
        </Animated.View>
      </View>

      <View style={styles.buttonsContainer}>
        <Animated.View
          style={{
            opacity: btnAnim1,
            transform: [{ scale: btnAnim1.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
          }}
        >
          <TouchableOpacity
            style={styles.driverBtn}
            activeOpacity={0.85}
            onPress={() => handleRole('driver')}
            testID="join-driver-btn"
          >
            <Car size={22} color={Colors.white} />
            <Text style={styles.driverBtnText}>Join as Driver</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            opacity: btnAnim2,
            transform: [{ scale: btnAnim2.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
          }}
        >
          <TouchableOpacity
            style={styles.ownerBtn}
            activeOpacity={0.85}
            onPress={() => handleRole('owner')}
            testID="offer-parking-btn"
          >
            <ParkingSquare size={22} color={Colors.orange} />
            <Text style={styles.ownerBtnText}>Offer My Parking</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            opacity: btnAnim3,
            transform: [{ scale: btnAnim3.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
          }}
        >
          <TouchableOpacity style={styles.loginBtn} activeOpacity={0.7} testID="login-btn">
            <LogIn size={16} color={Colors.gray} />
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 60,
  },
  bgPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  bgDot: {
    position: 'absolute' as const,
    borderRadius: 100,
    backgroundColor: Colors.white,
  },
  header: {
    paddingTop: height * 0.12,
    paddingHorizontal: 28,
  },
  logoRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.orange,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 17,
    color: Colors.gray,
    lineHeight: 26,
    marginTop: 4,
  },
  heroImageContainer: {
    alignItems: 'center' as const,
    paddingHorizontal: 28,
  },
  heroCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 32,
    alignItems: 'center' as const,
  },
  heroIconWrap: {
    marginBottom: 16,
  },
  heroRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: 'rgba(242,122,26,0.3)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: 'rgba(242,122,26,0.08)',
  },
  heroStat: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  heroLabel: {
    fontSize: 15,
    color: Colors.gray,
  },
  buttonsContainer: {
    paddingHorizontal: 28,
    gap: 14,
  },
  driverBtn: {
    backgroundColor: Colors.orange,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 17,
    borderRadius: 14,
    gap: 10,
  },
  driverBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700' as const,
  },
  ownerBtn: {
    backgroundColor: 'transparent',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 17,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.orange,
    gap: 10,
  },
  ownerBtnText: {
    color: Colors.orange,
    fontSize: 17,
    fontWeight: '700' as const,
  },
  loginBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 12,
    gap: 6,
  },
  loginBtnText: {
    color: Colors.gray,
    fontSize: 15,
    fontWeight: '500' as const,
  },
});