import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from "../../lib/supabaseClient";
export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [dashboard, setDashboard] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [birthdays, setBirthdays] = useState<any[]>([]);
  const [loadingBirthdays, setLoadingBirthdays] = useState(false);

  const navigate = (path: string, params?: Record<string, string>) => {
    router.push({ pathname: path as any, params });
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
      fetchBirthdays();
    }, [])
  );

  const fetchDashboard = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("ufn_member_dashboard");

    if (error) {
      console.log("Dashboard error:", error);
      setLoading(false);
      return;
    }
    setDashboard(data || {});
    setLoading(false);
  };

  const fetchBirthdays = async () => {
    setLoadingBirthdays(true);
    const { data, error } = await supabase.rpc("ufn_get_today_birthdays");
    if (error) {
      console.log("Birthday error:", error);
      setBirthdays([]);
      setLoadingBirthdays(false);
      return;
    }
    setBirthdays(data || []);
    setLoadingBirthdays(false);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}> 
      <StatusBar barStyle="dark-content" backgroundColor="#F5F6FA" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>UFGymBook</Text>
        <View style={styles.headerIcons}>
          <Ionicons name="call-outline" size={22} style={styles.icon} />
          <Ionicons
            name="settings-outline"
            size={22}
            style={styles.icon}
            onPress={() => navigate("/(tabs)/profile")}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Top Cards */}
        <View style={styles.row}>
          <StatCard
            label="Active Members"
            value={dashboard["active_members"] || 0}
            colors={["#3B82F6", "#2563EB"]}
            onPress={() => navigate("/(tabs)/member", { userId: "2" })}
          />
          <StatCard
            label="Expired in 30 days"
            value={dashboard["expiring_in_30_days"] || 0}
            colors={["#EF4444", "#DC2626"]}
            onPress={() => navigate("/(tabs)/member", { userId: "4" })}
          />
        </View>


        <View style={styles.row}>
          <WhiteCard
            label="Expiring in 10 days"
            value={dashboard["expiring_in_10_days"] || 0}
            highlight
            onPress={() => navigate("/(tabs)/member", { userId: "5" })}
          />
          <WhiteCard
            label="Total Members"
            value={dashboard["total_members"] || 0}
            onPress={() => navigate("/(tabs)/member", { userId: "1" })}
          />
        </View>

        <View style={styles.singleRow}>
          <WhiteCard label="Expirie" value={dashboard["expired_members"] || 0}
            onPress={() => navigate("/(tabs)/member", { userId: "3" })} />
        </View>

        {/* Today's Birthdays Section - moved below grid */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>Today&apos;s Birthdays</Text>
          {loadingBirthdays ? (
            <Text style={{ color: "#64748B" }}>Loading...</Text>
          ) : birthdays.length === 0 ? (
            <Text style={{ color: "#64748B" }}>No birthdays today.</Text>
          ) : (
            birthdays.map((b: any, idx: number) => (
              <View key={b.member_id || idx} style={{ backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 8, flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#E6EAF0", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  <Ionicons name="person-circle" size={40} color="#CBD5E1" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600" }}>{b.name}</Text>
                  <Text style={{ color: "#64748B", fontSize: 13 }}>DOB: {b.date_of_birth}</Text>
                </View>
                <Ionicons name="cake-outline" size={28} color="#F59E0B" style={{ marginLeft: 8 }} />
              </View>
            ))
          )}
        </View>

        {/* Quick Reports */}
        {/* <Text style={styles.section}>Quick Reports</Text>

        <View style={styles.reportCard}
          <View style={styles.reportHeader}>
            <Text style={styles.reportDate}>
              28 Jan 2026 - 28 Jan 2026
            </Text>
            <View style={styles.dropdown}>
              <Text style={styles.dropdownText}>Yesterday</Text>
              <Ionicons name="chevron-down" size={14} />
            </View>
          </View>

          <View style={styles.reportRow}>
            <ReportItem label="New Member" value="65" />
            <ReportItem label="All-time Balance" value="₹0" />
          </View>

          <View style={styles.reportRow}>
            <ReportItem label="Memberships" value="1" />
            <ReportItem label="Total Revenue" value="₹1,000" />
          </View>
        </View> */}

        {/* Members with balance */}
        {/* <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.section}>Members with balance</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>0</Text>
            </View>
          </View>
          <Text style={styles.muted}>No member with balance</Text>
        </View> */}
      </ScrollView>
    </View>
  );
}

const StatCard = ({ label, value, colors, onPress }: any) => (
  <TouchableOpacity
    style={[styles.statCard, { backgroundColor: colors[0] }]}
    onPress={onPress}
  >
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>

    <Ionicons name="chevron-forward" size={16} color="#fff" />
  </TouchableOpacity>
);

const WhiteCard = ({ label, value, highlight, onPress }: any) => (
  <View style={styles.whiteCard}>
    <View>
      <Text style={styles.whiteLabel}>{label}</Text>
      <Text
        style={[
          styles.whiteValue,
          highlight && { color: "#F59E0B" },
        ]}
        onPress={onPress}
      >
        {value}
      </Text>
    </View>

    <View style={styles.arrowBox} >
      <Ionicons name="chevron-forward" size={16} color="#6B7280" 
        onPress={onPress}/>
    </View>
  </View>
);

// const ReportItem = ({ label, value }: any) => (
//   <View style={{ flex: 1 }}>
//     <Text style={styles.whiteLabel}>{label}</Text>
//     <Text style={styles.whiteValue}>{value}</Text>
//   </View>
// );

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 44, // approx safe area top for iOS
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  headerIcons: { flexDirection: "row" },
  icon: { marginLeft: 16 },

  row: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 12 },
  singleRow: { paddingHorizontal: 16, marginBottom: 12 },
  scrollContent: { paddingBottom: 120 },

  statCard: {
    flex: 1,
    height: 90,
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: { color: "#E5E7EB", fontSize: 13 },
  statValue: { fontSize: 28, fontWeight: "700", color: "#fff" },

  whiteCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  whiteLabel: { color: "#6B7280", fontSize: 13 },
  whiteValue: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 6,
    color: "#111827",
  },

  arrowBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  section: {
    fontSize: 16,
    fontWeight: "600",
    margin: 16,
  },

  reportCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
  },

  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  reportDate: { fontSize: 13, color: "#6B7280" },

  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  dropdownText: { fontSize: 13, marginRight: 4 },

  reportRow: { flexDirection: "row", marginTop: 16 },

  balanceCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },

  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  badge: {
    backgroundColor: "#0B1F4B",
    borderRadius: 12,
    paddingHorizontal: 8,
  },

  badgeText: { color: "#fff", fontSize: 12 },

  muted: { color: "#9CA3AF", marginTop: 8 },
});