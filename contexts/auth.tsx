import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  membershipType: 'basic' | 'premium' | 'vip';
  joinDate: string;
  profileImage?: string;
}

const STORAGE_KEY = '@gym_user';

export const [AuthContext, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    }
  });

  useEffect(() => {
    if (userQuery.data !== undefined) {
      setUser(userQuery.data);
    }
  }, [userQuery.data]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        phoneNumber: '+1234567890',
        membershipType: 'premium',
        joinDate: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      return mockUser;
    },
    onSuccess: (data) => {
      setUser(data);
    }
  });

  const signupMutation = useMutation({
    mutationFn: async ({ email, password, name, phoneNumber }: { 
      email: string; 
      password: string;
      name: string;
      phoneNumber: string;
    }) => {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        phoneNumber,
        membershipType: 'basic',
        joinDate: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      return mockUser;
    },
    onSuccess: (data) => {
      setUser(data);
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem(STORAGE_KEY);
    },
    onSuccess: () => {
      setUser(null);
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      if (!user) throw new Error('No user logged in');
      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    },
    onSuccess: (data) => {
      setUser(data);
    }
  });

  return {
    user,
    isLoading: userQuery.isLoading,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    isSignupLoading: signupMutation.isPending,
  };
});
