import { useLocalSearchParams, useRouter } from "expo-router";
import { User } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";
import { supabase } from "../../lib/supabaseClient";

type Member = {
  id: string;
  name: string;
  code: string;
  phone: string;
  plan: string;
  expired: boolean;
  avatar: string;
  expiryDate: string;
  balanceamount?: string;
};

export default function MemberScreen() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: string; end: string } | null>(null);
  // Date range state
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    let data, error;

    // If userId is 7, fetch members with balance using fn_memberswinbalance
    if (Number(userId) === 7) {
      const response = await supabase.rpc("fn_memberswinbalacne");
      data = response.data;
      error = response.error;

      if (error) {
        console.log("Error:", error);
        setMembers([]);
        setLoading(false);
        return;
      }

      // Format the balance data to match Member type
      const formattedData: Member[] = (data || []).map((item: any) => ({
        id: String(item.member_id),
        name: `${item.name}`,
        code: `#${item.member_code}`,
        phone: item.mobile,
        plan: item.membership_name || "N/A",
        expired: new Date(item.expiry_date) < new Date(),
        avatar: item.profile_image || null,
        expiryDate: item.expiry_date,
        balanceamount: item.balance_amount || "0",
        expiry_date: item.expiry_date,
      }));
      setMembers(formattedData);
    } else {
      // Original logic for other user types
      const response = await supabase.rpc(
        "ufn_get_members_by_type",
        { in_type: Number(userId) }
      );
      data = response.data;
      error = response.error;

      if (error) {
        console.log("Error:", error);
        setLoading(false);
        return;
      }
      const apiResponse = data;
      if (apiResponse?.status !== 1) {
        setMembers([]);
        setLoading(false);
        return;
      }
      console.log(data);
      const formattedData: Member[] = (apiResponse.data || []).map((item: any) => ({
        id: String(item.member_id),
        name: `${item.first_name} ${item.last_name}`,
        code: `#${item.member_code}`,
        phone: item.phone_number,
        plan: item.membership_name,
        expired: new Date(item.expiry_date) < new Date(),
        avatar: item.profile_image || null, // Use user's image if available, else null
        expiryDate: item.expiry_date,
        balanceamount: item.balanceamount,
        expiry_date: item.expiry_date,
      }));
      setMembers(formattedData);
    }
    setLoading(false);
  }, [userId]);
  useEffect(() => {
    if (!userId) return;
    fetchMembers();
  }, [userId, fetchMembers]);
  const fetchMembersByDate = useCallback(async (start: Date, end: Date) => {
    setLoading(true);
    
    // For userId 7 (members with balance), fetch all balance members
    if (Number(userId) === 7) {
      const { data, error } = await supabase.rpc("fn_memberswinbalacne");
      if (error) {
        console.log("Error:", error);
        setMembers([]);
        setLoading(false);
        return;
      }
      const formattedData: Member[] = (data || []).map((item: any) => ({
        id: String(item.member_id),
        name: `${item.name}`,
        code: `#${item.member_code}`,
        phone: item.mobile,
        plan: item.membership_name || "N/A",
        expired: new Date(item.expiry_date) < new Date(),
        avatar: item.profile_image || null,
        expiryDate: item.expiry_date,
        balanceamount: item.balance_amount || "0",
        expiry_date: item.expiry_date,
      }));
      setMembers(formattedData);
      setLoading(false);
      return;
    }

    // Original logic for other user types
    const { data, error } = await supabase.rpc(
      "ufn_get_members_by_date",
      {
        in_from_date: start.toISOString().slice(0, 10),
        in_to_date: end.toISOString().slice(0, 10),
        in_type: Number(userId)
      }
    );
    if (error) {
      console.log("Error:", error);
      setMembers([]);
      setLoading(false);
      return;
    }
    const apiResponse = data;
    if (apiResponse?.status !== 1) {
      setMembers([]);
      setLoading(false);
      return;
    }
    console.log(apiResponse);
    const formattedData: Member[] = (apiResponse.data || []).map((item: any) => ({
      id: String(item.member_id),
      name: `${item.first_name} ${item.last_name}`,
      code: `#${item.member_code}`,
      phone: item.phone_number,
      plan: "One month plan",
      expired: new Date(item.expiry_date) < new Date(),
      avatar: item.profile_image || "https://i.pravatar.cc/150",
      expiryDate: item.expiry_date,
      balanceamount: item.balanceamount,
      expiry_date: item.expiry_date,
    }));
    setMembers(formattedData);
    setLoading(false);
  }, [userId]);
  const filteredMembers = members
    .filter(member =>
      member.name.toLowerCase().includes(searchText.toLowerCase()) ||
      member.phone.includes(searchText)
    )
    .sort((a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime());

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const renderItem = ({ item }: { item: Member }) => {
    const daysLeft = getDaysUntilExpiry(item.expiryDate);
    
    // If userId is 7, render balance format
    if (Number(userId) === 7) {
      return (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/memberDetails" as any,
              params: { memberId: item.id },
            } as any)
          }
        >
          <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, marginVertical: 6, marginHorizontal: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#E6EAF0", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  {item.avatar ? (
                    <Image 
                      source={{ uri: item.avatar.startsWith('data:image') ? item.avatar : item.avatar.match(/^[A-Za-z0-9+/=]+$/) ? `data:image/png;base64,${item.avatar}` : item.avatar }}
                      style={{ width: 48, height: 48, borderRadius: 24 }}
                    />
                  ) : (
                    <User size={48} color="#94A3B8" />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: "#0B1B3A" }}>{item.name}</Text>
                  <Text style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>{item.phone}</Text>
                
                </View>
              </View>
              <TouchableOpacity 
                style={{ padding: 4 }}
                onPress={() => router.push({ pathname: "/memberDetails" as any, params: { memberId: item.id } } as any)}
              >
              </TouchableOpacity>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: "#E5E7EB", paddingTop: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: Number(item.balanceamount) > 0 ? "#EF4444" : "#EF4444" }}>Balance : ₹{item.balanceamount}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // Original format for other member types
    return (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/memberDetails" as any,
            params: { memberId: item.id },
          } as any)
        }
      >
        <View style={styles.card}>
          {item.avatar ? (
            <Image
              source={{
                uri: item.avatar.startsWith('data:image')
                  ? item.avatar
                  : item.avatar.match(/^[A-Za-z0-9+/=]+$/)
                    ? `data:image/png;base64,${item.avatar}`
                    : item.avatar
              }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={24} color="#94A3B8" />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {item.name} <Text style={styles.code}>{item.code}</Text>
            </Text>
            <Text style={styles.phone}>{item.phone}</Text>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.plan}>{item.plan}</Text>
              {daysLeft <= 0 ? (
                <View style={styles.expiredBadge}>
                  <View style={[styles.statusDot, { backgroundColor: "#EF4444" }]} />
                  <Text style={styles.expiredText}>Expired</Text>
                </View>
              ) : daysLeft <= 10 ? (
                <View style={styles.expiringBadge}>
                  <View style={[styles.statusDot, { backgroundColor: "#F59E0B" }]} />
                  <Text style={styles.expiringText}>Expiring in {daysLeft} Days</Text>
                </View>
              ) : (
                <View style={styles.activeBadge}>
                  <View style={[styles.statusDot, { backgroundColor: "#22C55E" }]} />
                  <Text style={styles.activeText}>Active</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleDateChange = (date: { start: string; end: string } | null) => {
    setSelectedDateRange(date);
  };

  // Handle date range change
  useEffect(() => {
    if (Platform.OS === 'web') {
      const { startDate, endDate } = range[0];
      if (startDate && endDate) {
        fetchMembersByDate(startDate, endDate);
      }
    } else {
      if (fromDate && toDate) {
        fetchMembersByDate(fromDate, toDate);
      }
    }
    // eslint-disable-next-line
  }, [range, fromDate, toDate]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F8FB' }}>
      {/* Fixed Header */}
      <AppHeader title="Members" showSettings onSettingsPress={() => router.push('/(tabs)/profile')} showCall onCallPress={() => {}} />
      {/* Scrollable Content */}
      <View style={{ flex: 1 }}>
        {filteredMembers.length === 0 && !loading ? (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Text style={{ color: '#6c7587', fontSize: 18, fontWeight: '500' }}>No records found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredMembers}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={
              <>
                {/* Search bar and + button removed as requested */}
                {/* Removed filter chips as requested */}
                <Text style={styles.showing}>
                  {loading ? "Loading..." : `Showing ${filteredMembers.length} Members`}
                </Text>
                {loading && <ActivityIndicator size="large" style={{ marginTop: 40 }} />}
              </>
            }
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      {/* Fixed Footer */}
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0B1B3A",
  },

  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
  },

  searchInput: {
    flex: 1,
    // height, borderRadius, etc. overridden inline for pill look
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
  },

  squareBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#0B1B3A",
    alignItems: "center",
    justifyContent: "center",
  },

  squareBtnText: {
    color: "#FFFFFF",
    fontSize: 20,
  },


  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },

  filterText: {
    fontSize: 12,
    color: "#0B1B3A",
  },

  showing: {
    paddingHorizontal: 16,
    marginVertical: 10,
    color: "#64748B",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 14,
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    overflow: 'hidden',
  },

  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E6EAF0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0B1B3A",
  },

  code: {
    fontSize: 12,
    color: "#64748B",
  },

  phone: {
    fontSize: 13,
    color: "#0B1B3A",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  plan: {
    fontSize: 13,
    fontWeight: "600",
  },

  expiredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  expiringBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },

  expiredText: {
    fontSize: 12,
    color: "#B91C1C",
  },

  expiringText: {
    fontSize: 12,
    color: "#B45309",
  },

  activeText: {
    fontSize: 12,
    color: "#15803D",
  },
});