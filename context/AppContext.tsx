import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserRole, Booking } from '@/types';
import { MOCK_BOOKINGS } from '@/mocks/parking';

const ROLE_KEY = 'park_connect_role';

export const [AppProvider, useApp] = createContextHook(() => {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const queryClient = useQueryClient();

  const roleQuery = useQuery({
    queryKey: ['userRole'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(ROLE_KEY);
      return (stored as UserRole) ?? null;
    },
  });

  useEffect(() => {
    if (roleQuery.data !== undefined) {
      setRoleState(roleQuery.data);
    }
  }, [roleQuery.data]);

  const roleMutation = useMutation({
    mutationFn: async (newRole: UserRole | null) => {
      if (newRole) {
        await AsyncStorage.setItem(ROLE_KEY, newRole);
      } else {
        await AsyncStorage.removeItem(ROLE_KEY);
      }
      return newRole;
    },
    onSuccess: (newRole) => {
      setRoleState(newRole);
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
    },
  });

  const { mutate: mutateRole } = roleMutation;
  const setRole = useCallback((r: UserRole | null) => {
    mutateRole(r);
  }, [mutateRole]);

  const addBooking = useCallback((booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  }, []);

  return {
    role,
    setRole,
    isRoleLoading: roleQuery.isLoading,
    bookings,
    addBooking,
  };
});