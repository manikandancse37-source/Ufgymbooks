import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
// @ts-ignore
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { DateRange } from 'react-date-range';
import {
  Image,
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
  const [quickReports, setQuickReports] = useState<any>(null);
  const [loadingQuickReports, setLoadingQuickReports] = useState(false);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [showWebRange, setShowWebRange] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: fromDate,
      endDate: toDate,
      key: 'selection',
    },
  ]);
  const [membersWithBalance, setMembersWithBalance] = useState<any[]>([]);
  const [loadingMembersBalance, setLoadingMembersBalance] = useState(false);

  const navigate = (path: string, params?: Record<string, string>) => {
    router.push({ pathname: path as any, params });
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
      fetchBirthdays();
      fetchMembersWithBalance();
      fetchQuickReports(fromDate, toDate);
    }, [fromDate, toDate])
  );
  // Keep range state in sync with fromDate/toDate (for web picker)
  React.useEffect(() => {
    setRange([{ startDate: fromDate, endDate: toDate, key: 'selection' }]);
  }, [fromDate, toDate]);
  const fetchQuickReports = async (from?: Date, to?: Date) => {
    setLoadingQuickReports(true);
    let params = {};
    if (from && to) {
      params = {
        in_from_date: from.toISOString().split('T')[0],
        in_to_date: to.toISOString().split('T')[0],
      };
    }
    // Fetch quick reports as before
    const { data, error } = await supabase.rpc("fn_quick_reports_v1", params);
    // Fetch all time balance using the required method
    let allTimeBalance = null;
    try {
      const { data: balanceData, error: balanceError } = await supabase.rpc("fn_member_balance_report", params);
      if (!balanceError && balanceData && Array.isArray(balanceData) && balanceData.length > 0) {
        allTimeBalance = balanceData[0].balance ?? null;
      }
    } catch (e) {
      // ignore
    }
    if (error) {
      console.log("Quick Reports error:", error);
      setQuickReports(null);
      setLoadingQuickReports(false);
      return;
    }
    // Merge All Time Balance into quickReports
    let quick = data || {};
    if (allTimeBalance !== null) {
      quick["All Time Balance"] = `₹${allTimeBalance}`;
    }
    setQuickReports(quick);
    setLoadingQuickReports(false);
  };

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
    console.log(data);
    if (error) {
      console.log("Birthday error:", error);
      setBirthdays([]);
      setLoadingBirthdays(false);
      return;
    }
    setBirthdays(data || []);
    setLoadingBirthdays(false);
  };

  const fetchMembersWithBalance = async () => {
    setLoadingMembersBalance(true);
    const { data, error } = await supabase.rpc("fn_memberswinbalacne");
    console.log(data);
    if (error) {
      console.log("Members with balance error:", error);
      setMembersWithBalance([]);
      setLoadingMembersBalance(false);
      return;
    }
    setMembersWithBalance(data || []);
    setLoadingMembersBalance(false);
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
          <WhiteCard label="Today's Leads" value={dashboard["expired_members"] || 0}
            onPress={() => navigate("/(tabs)/member", { userId: "3" })} />
        </View>

        {/* Today's Birthdays Section - moved below grid */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>Birthdays Today</Text>
            <Ionicons name="gift" size={24} color="#F59E0B" />
          </View>
          {loadingBirthdays ? (
            <Text style={{ color: "#64748B" }}>Loading...</Text>
          ) : birthdays.length === 0 ? (
            <Text style={{ color: "#64748B" }}>No birthdays today.</Text>
          ) : (
            <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {birthdays.map((b: any, idx: number) => (
                  <TouchableOpacity
                    key={b.member_id || idx}
                    onPress={() => router.push({ pathname: "/memberDetails" as any, params: { memberId: String(b.member_id) } } as any)}
                    style={{ alignItems: "center", marginRight: 20 }}
                  >
                    <View style={{ position: "relative" }}>
                      <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "#E6EAF0", alignItems: "center", justifyContent: "center" }}>
                        {b.profile_image ? (
                          <Image 
                            source={{ uri: b.profile_image.startsWith('data:image') ? b.profile_image : `data:image/png;base64,${b.profile_image}` }}
                            style={{ width: 60, height: 60, borderRadius: 30 }}
                          />
                        ) : (
                          <Ionicons name="person-circle" size={60} color="#CBD5E1" />
                        )}
                      </View>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: "600", marginTop: 8, color: "#0B1B3A" }}>{b.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
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
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 16, marginBottom: 8 , fontWeight: "600" }}>Quick Reports</Text>
          {/* Date Range Picker UI */}
          {Platform.OS === 'web' ? (
            <View style={{ marginBottom: 8 }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 8, borderWidth: 1, borderColor: '#E5E7EB' }}
                onPress={() => setShowWebRange(true)}
              >
                <Ionicons name="calendar-outline" size={20} color="#0A1E5C" style={{ marginRight: 8 }} />
                <Text style={{ color: '#0A1E5C', fontWeight: '600', fontSize: 15 }}>
                  {format(fromDate, 'yyyy-MM-dd')} to {format(toDate, 'yyyy-MM-dd')}
                </Text>
              </TouchableOpacity>
              {showWebRange && (
                <View style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <View style={{ position: 'relative', backgroundColor: '#fff', borderRadius: 16, padding: 0, minWidth: 340, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
                    <TouchableOpacity
                      style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
                      onPress={() => setShowWebRange(false)}
                    >
                      <Ionicons name="close" size={24} color="#222" />
                    </TouchableOpacity>
                    {/* Quick Reports Card removed, only calendar below */}
                    {/* Calendar below */}
                    <View style={{ backgroundColor: '#fff', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: 8 }}>
                      <DateRange
                        editableDateInputs={true}
                        onChange={item => {
                          setRange([item.selection]);
                          setFromDate(item.selection.startDate);
                          setToDate(item.selection.endDate);
                        }}
                        moveRangeOnFirstSelection={false}
                        ranges={range}
                        maxDate={new Date()}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <TouchableOpacity onPress={() => setShowFromPicker(true)} style={{ marginRight: 8, backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                <Text style={{ color: '#222', fontSize: 13 }}>From: {fromDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowToPicker(true)} style={{ backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                <Text style={{ color: '#222', fontSize: 13 }}>To: {toDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>
          )}
          {Platform.OS !== 'web' && showFromPicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowFromPicker(false);
                if (selectedDate) setFromDate(selectedDate);
              }}
              maximumDate={toDate}
            />
          )}
          {Platform.OS !== 'web' && showToPicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowToPicker(false);
                if (selectedDate) setToDate(selectedDate);
              }}
              minimumDate={fromDate}
              maximumDate={new Date()}
            />
          )}
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 2, borderWidth: 1, borderColor: '#E5E7EB' }}>
            {loadingQuickReports ? (
              <Text style={{ color: '#64748B', textAlign: 'center', marginVertical: 16 }}>Loading...</Text>
            ) : quickReports ? (
              <>
                <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() =>
                      router.push({
                        pathname: "/memberDetailsRange",
                        params: {
                          fromDate: fromDate.toISOString().slice(0, 10),
                          toDate: toDate.toISOString().slice(0, 10),
                        },
                      })
                    }>
                      <Text style={{ color: '#64748B', fontSize: 13, textDecorationLine: 'underline' }}>New Members</Text>
                      <Text style={{ color: '#222', fontWeight: '700', fontSize: 20, marginTop: 2 }}>{quickReports["New Members"] ?? '--'}</Text>
                    </TouchableOpacity>
                  </View>
                   <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => navigate("/allTimeBalanceReport", { fromDate: fromDate.toISOString().split('T')[0], toDate: toDate.toISOString().split('T')[0] })}>
                      <Text style={{ color: '#64748B', fontSize: 13, textDecorationLine: 'underline' }}>All Time Balance</Text>
                      <Text style={{ color: '#222', fontWeight: '700', fontSize: 20, marginTop: 2 }}>{quickReports["All Time Balance"] ?? '--'}</Text>
                    </TouchableOpacity>
                  </View>                 
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() =>
                      router.push({
                        pathname: "/(tabs)/member",
                        params: { userId: "1" }
                      })
                    }>
                      <Text style={{ color: '#64748B', fontSize: 13, textDecorationLine: 'underline' }}>Total Members</Text>
                      <Text style={{ color: '#222', fontWeight: '700', fontSize: 20, marginTop: 2 }}>{quickReports["Total Members"] ?? '--'}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => navigate("/(tabs)/reports")}> 
                      <Text style={{ color: '#64748B', fontSize: 13, textDecorationLine: 'underline' }}>Total Revenue</Text>
                      <Text style={{ color: '#222', fontWeight: '700', fontSize: 20, marginTop: 2 }}>{quickReports["Total Revenue"] ?? '--'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : (
              <Text style={{ color: '#64748B', textAlign: 'center', marginVertical: 16 }}>No data available.</Text>
            )}
          </View>
        </View>

        {/* Members with balance */}
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>Members with balance</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{membersWithBalance.length}</Text>
            </View>
          </View>
          {loadingMembersBalance ? (
            <Text style={{ color: "#64748B" }}>Loading...</Text>
          ) : membersWithBalance.length === 0 ? (
            <Text style={{ color: "#64748B" }}>No member with balance</Text>
          ) : (
            membersWithBalance.slice(0, 2).map((member: any, idx: number) => (
              <TouchableOpacity
                key={member.member_id || idx}
                onPress={() => router.push({ pathname: "/memberDetails" as any, params: { memberId: String(member.member_id) } } as any)}
              >
                <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 8 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
                      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#E6EAF0", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                        {member.profile_image ? (
                          <Image 
                            source={{ uri: member.profile_image.startsWith('data:image') ? member.profile_image : `data:image/png;base64,${member.profile_image}` }}
                            style={{ width: 48, height: 48, borderRadius: 24 }}
                          />
                        ) : (
                          <Ionicons name="person-circle" size={48} color="#CBD5E1" />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: "600", color: "#0B1B3A" }}>{member.name} {member.last_name}</Text>
                        <Text style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>{member.mobile}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: "600", color: member.balance_amount > 0 ? "#EF4444" : "#EF4444" }}>Balance : ₹{member.balance_amount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
          <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {membersWithBalance.length > 2 && (
              <TouchableOpacity 
                onPress={() => navigate("/(tabs)/member", { userId: "7" })}
              >
                <Text style={{ color: "#64748B", fontSize: 14 }}>and <Text style={{ color: '#0B1B3A', fontWeight: '600' }}>{membersWithBalance.length - 2} more</Text></Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={() => navigate("/(tabs)/member", { userId: "7" })}
            >
              <Text style={{ color: '#2563EB', fontWeight: '600' }}>See All</Text>
            </TouchableOpacity>
          </View>
        </View>
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