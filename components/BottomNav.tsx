// components/BottomNav.tsx

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetWithFAB from '../app/(tabs)/BottomSheetPopup';
import NavItem from './NavItem';

import { usePathname } from "expo-router";

const BottomNav: React.FC = () => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  return (
    <View style={[styles.outerShadow, { paddingBottom: insets.bottom }]}> 
      <View style={styles.bottomNav}>
        <NavItem icon="home-outline" label="Dashboard" active={pathname === '/(tabs)'} href="/(tabs)"/>
        <NavItem icon="people-outline" label="Members" active={pathname?.startsWith('/(tabs)/member')} href="/(tabs)/member?userId=0" />
        <View style={styles.fabContainer}><BottomSheetWithFAB /></View>
        <NavItem icon="card-outline" label="Transactions" active={pathname?.startsWith('/(tabs)/transactions')} href="/(tabs)/transactions"/>
        <NavItem icon="stats-chart-outline" label="Reports" active={pathname?.startsWith('/(tabs)/reports')} href="/(tabs)/reports"/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerShadow: {
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 12,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'visible',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    minHeight: 64,
  },
  fabContainer: {
    marginTop: -28,
    zIndex: 2,
    backgroundColor: 'transparent',
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default BottomNav;
