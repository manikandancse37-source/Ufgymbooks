import { useLocalSearchParams, useRouter } from "expo-router";
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
    const { data, error } = await supabase.rpc(
      "ufn_get_members_by_type",
      { in_type: Number(userId) }
    );
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
      plan: "One month plan",
      expired: new Date(item.expiry_date) < new Date(),
      avatar: item.profile_image || null, // Use user's image if available, else null
      expiryDate: item.expiry_date,
    }));
    setMembers(formattedData);
    setLoading(false);
  }, [userId]);
  useEffect(() => {
    if (!userId) return;
    fetchMembers();
  }, [userId, fetchMembers]);
  const fetchMembersByDate = useCallback(async (start: Date, end: Date) => {
    setLoading(true);
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
    const formattedData: Member[] = (apiResponse.data || []).map((item: any) => ({
      id: String(item.member_id),
      name: `${item.first_name} ${item.last_name}`,
      code: `#${item.member_code}`,
      phone: item.phone_number,
      plan: "One month plan",
      expired: new Date(item.expiry_date) < new Date(),
      avatar: item.profile_image || "https://i.pravatar.cc/150",
      expiryDate: item.expiry_date,
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

  const renderItem = ({ item }: { item: Member }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/memberDetails" as any,
          params: { member: JSON.stringify(item) },
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
          <Text style={{ fontSize: 20, color: '#64748B' }}>👤</Text>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {item.name} <Text style={styles.code}>{item.code}</Text>
          </Text>
          <Text style={styles.phone}>{item.phone}</Text>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.plan}>{item.plan}</Text>
            {item.expired && (
              <View style={styles.expiredBadge}>
                <View style={styles.dot} />
                <Text style={styles.expiredText}>Expired</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    borderRadius: 12,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
    marginRight: 6,
  },

  expiredText: {
    fontSize: 12,
    color: "#B91C1C",
  },
});