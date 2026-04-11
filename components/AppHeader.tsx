import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showSettings?: boolean;
  onSettingsPress?: () => void;
  showCall?: boolean;
  onCallPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBackPress,
  showSettings = true,
  onSettingsPress,
  showCall = true,
  onCallPress,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : insets.top || 24 }]}> 
      {showBack ? (
        <TouchableOpacity onPress={onBackPress || (() => router.back())}>
          <Ionicons name="arrow-back" size={24} style={styles.icon} />
        </TouchableOpacity>
      ) : (
        showCall ? (
          <Ionicons name="call-outline" size={22} style={styles.icon} onPress={onCallPress} />
        ) : <View style={{ width: 24 }} />
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      {showSettings ? (
        <Ionicons name="settings-outline" size={22} style={styles.icon} onPress={onSettingsPress} />
      ) : <View style={{ width: 24 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#0B1B3A' },
  icon: { marginLeft: 16, color: '#0B1B3A' },
});

export default AppHeader;
