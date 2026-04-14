const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F8FB" },
  detailLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    color: "#0B1F4B",
  },
  card: {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
},

profileRow: {
  flexDirection: 'row',
  marginBottom: 12,
},

avatar: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: '#E5E7EB',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
},

avatarImg: {
  width: 60,
  height: 60,
  borderRadius: 30,
},

phone: {
  color: '#64748B',
},

chipRow: {
  flexDirection: 'row',
  marginTop: 6,
  gap: 6,
},

chip: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  backgroundColor: '#F1F5F9',
  borderRadius: 12,
},

birthdayCard: {
  backgroundColor: '#FFF1F2',
  padding: 14,
  borderRadius: 12,
  marginTop: 10,
},

birthdayText: {
  fontSize: 14,
  marginBottom: 10,
},

wishBtn: {
  backgroundColor: '#F43F5E',
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: 'center',
},

wishText: {
  color: '#fff',
  fontWeight: '600',
},

infoRow: {
  flexDirection: 'row',
  marginTop: 12,
},

infoBox: {
  flex: 1,
  backgroundColor: '#F8FAFC',
  padding: 12,
  borderRadius: 10,
  marginHorizontal: 4,
},

infoLabel: {
  fontSize: 12,
  color: '#64748B',
},

infoValue: {
  fontSize: 16,
  fontWeight: '600',
},

redeemCard: {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 16,
},

redeemTitle: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 16,
  textAlign: 'center',
  color: '#0A1E5E',
},

input: {
  backgroundColor: "#E6EAF0",
  borderRadius: 10,
  padding: 12,
  fontSize: 16,
  marginVertical: 8,
},
  amountInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F6F8FB',
  },
  back: { fontSize: 16, color: "#0B1B3A" },
  title: { fontSize: 18, fontWeight: "600" },
  content: { padding: 16 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 0, color: '#0B1B3A' },
  code: { fontSize: 16, color: "#64748B", marginBottom: 0 },
  detailValue: { fontSize: 16, color: '#0B1B3A', fontWeight: '500', marginBottom: 2 },
  expired: { fontSize: 16, color: "red" },
  redeemButton: {
    backgroundColor: "#0A1E5E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 18,
    alignSelf: "flex-start",
  },
  redeemButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
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

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
// import RNPickerSelect from "react-native-picker-select";

import { supabase } from "../lib/supabaseClient";

type Member = {
  id: string;
  name: string;
  code: string;
  phone: string;
  plan: string;
  expired: boolean;
  avatar: string;
  expiryDate: string;
  balanceamount: string;
  expiry_date: string;
};

export default function MemberDetailsScreen() {
  const { memberId } = useLocalSearchParams();
  const router = useRouter();
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [memberLoading, setMemberLoading] = useState(true);

  // Redeem state
  // Always show membership options
  const [membershipData, setMembershipData] = useState<any[]>([]);
  const [selectedMembership, setSelectedMembership] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMemberships, setLoadingMemberships] = useState(false);
  const [customDays, setCustomDays] = useState("");
  const [amount, setAmount] = useState("");
  const [birthdayData, setBirthdayData] = useState<any>(null);
  const [loadingBirthday, setLoadingBirthday] = useState(false);

  useEffect(() => {
    if (!memberId) return;
    fetchMemberData();
    fetchMemberships();
  }, [memberId]);

  useEffect(() => {
    if (memberData) {
      fetchBirthdayData();
    }
  }, [memberData]);

  const fetchMemberships = async () => {
    setLoadingMemberships(true);
    const { data, error } = await supabase.rpc("ufn_get_membership_types");
    if (!error && data) setMembershipData(data);
    setLoadingMemberships(false);
  };

  const fetchMemberData = async () => {
    setMemberLoading(true);
    try {
      const { data, error } = await supabase.rpc("fn_member_Birthday_view", {
        in_member_id: Number(memberId),
      });
      if (error) {
        console.log("Member data error:", error);
        setMemberLoading(false);
        return;
      }
      if (data && data.length > 0) {
        const memberInfo = data[0];
        const formattedMember: Member = {
          id: String(memberInfo.member_id),
          name: `${memberInfo.name}`,
          code: `${memberInfo.member_code}`,
          phone: memberInfo.mobile,
          plan: memberInfo.membership_name || "N/A",
          expired:memberInfo.expiry_date,
          avatar: memberInfo.profile_image || null,
          expiryDate: memberInfo.expiry_date,
          balanceamount: memberInfo.balance_amount || "0",
          expiry_date: memberInfo.expiry_date,
        };
        setMemberData(formattedMember);
      }
    } catch (e) {
      console.log("Error fetching member data:", e);
    }
    setMemberLoading(false);
  };

  const fetchBirthdayData = async () => {
    setLoadingBirthday(true);
    const { data, error } = await supabase.rpc("fn_member_Birthday_view", {
      in_member_id: Number(memberData?.id),
    });
    if (error) {
      console.log("Birthday data error:", error);
    } else {
      setBirthdayData(data ? data[0] : null);
    }
    setLoadingBirthday(false);
  };

  const selectedItem = membershipData.find(item => item.membership_type_id === selectedMembership);
  const isCustomDuration = selectedItem?.duration_days === 1;
  const handleRedeem = async () => {
    if (!memberData) return;
    if (!selectedMembership) {
      Alert.alert("Select a membership type");
      return;
    }
    if (isCustomDuration && !customDays) {
      Alert.alert("Enter number of days");
      return;
    }
    if (!amount) {
      Alert.alert("Enter amount");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.rpc("ufn_redeem_member", {
      in_member_id: Number(memberData.id),
      in_membership_type: selectedMembership,
      in_status: isCustomDuration ? Number(customDays) : 0,
      in_amount: Number(amount),
    });
    setLoading(false);
    if (error) {
      alert("Redeem failed");
    } else {
      alert(data.message);
      setCustomDays("");
      setAmount("");
      router.push({ pathname: "/(tabs)", params: { refresh: "1" } });
    }
  };
const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);

  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals: any = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value > 0) {
      return `${value} ${key}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

const getDaysUntilExpiry = (expiryDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

  if (!memberData) {
    return (
      <SafeAreaView style={styles.container}>
        {memberLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0A1E5E" />
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <Text style={{ fontSize: 16, color: '#0B1B3A', fontWeight: '600' }}>Member not found</Text>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ marginTop: 16, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#0A1E5E', borderRadius: 8 }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{ minWidth: 50 }} onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>Member Details</Text>
        </View>
        <View style={{ minWidth: 50 }} />
      </View>

      <ScrollView
  style={styles.content}
  contentContainerStyle={{ paddingBottom: 32 }}
>
  {/* 🔷 PROFILE CARD */}
  <View style={styles.card}>
    <View style={styles.profileRow}>
      <View style={styles.avatar}>
        {memberData.avatar ? (
          <Image
            source={{
              uri: memberData.avatar.startsWith('data:image')
                ? memberData.avatar
                : memberData.avatar.match(/^[A-Za-z0-9+/=]+$/)
                  ? `data:image/png;base64,${memberData.avatar}`
                  : memberData.avatar
            }}
            style={styles.avatarImg}
          />
        ) : (
          <Text style={{ fontSize: 28 }}>👤</Text>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{memberData.name}</Text>
        <Text style={styles.phone}>{memberData.phone}</Text>
<Text style={styles.phone}>{memberData.plan}</Text>
        {/* Status Badge */}
        <View style={styles.chipRow}>
          {(() => {
            const daysLeft = getDaysUntilExpiry(memberData.expiryDate);
            if (daysLeft <= 0) {
              return (
                <View style={styles.expiredBadge}>
                  <View style={[styles.statusDot, { backgroundColor: "#EF4444" }]} />
                  <Text style={styles.expiredText}>Expired</Text>
                </View>
              );
            } else if (daysLeft <= 10) {
              return (
                <View style={styles.expiringBadge}>
                  <View style={[styles.statusDot, { backgroundColor: "#F59E0B" }]} />
                  <Text style={styles.expiringText}>Expiring in {daysLeft} Days</Text>
                </View>
              );
            } else {
              return (
                <View style={styles.activeBadge}>
                  <View style={[styles.statusDot, { backgroundColor: "#22C55E" }]} />
                  <Text style={styles.activeText}>Active</Text>
                </View>
              );
            }
          })()}
        </View>
      </View>
    </View>

    {/* Info Boxes */}
    <View style={styles.infoRow}>
      <View style={[styles.infoBox, { backgroundColor: '#FEF3C7', borderLeftWidth: 4, borderLeftColor: '#FBBF24' }]}>
        <Text style={styles.infoLabel}>Balance</Text>
        <Text style={[styles.infoValue, { color: Number(memberData.balanceamount) > 0 ? '#D97706' : '#6B21A8' }]}>₹{memberData.balanceamount}</Text>
      </View>

      <View style={[styles.infoBox, { backgroundColor: '#DDD6FE', borderLeftWidth: 4, borderLeftColor: '#818CF8' }]}>
        <Text style={styles.infoLabel}>Joined</Text>
        <Text style={styles.infoValue}>{getTimeAgo(memberData.expiry_date)}</Text>
      </View>
    </View>

    
  </View>

  <View style={styles.redeemCard}>
    <Text style={styles.redeemTitle}>Redeem Membership</Text>

    {loadingMemberships ? (
      <ActivityIndicator size="large" />
    ) : (
      <>
        <View style={{ gap: 10, marginBottom: 18 }}>
          {membershipData.map((item: any) => (
            <TouchableOpacity
              key={item.membership_type_id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: selectedMembership === item.membership_type_id ? 2 : 1,
                borderColor: selectedMembership === item.membership_type_id ? '#0A1E5E' : '#E6EAF0',
                backgroundColor: selectedMembership === item.membership_type_id ? '#F0F4FF' : '#F8FAFC',
              }}
              onPress={() => {
                setSelectedMembership(item.membership_type_id);
                if (item.duration_days !== 1) setCustomDays("");
                if (item.entry_fee) {
                  setAmount(String(item.entry_fee));
                } else {
                  setAmount("");
                }
              }}
            >
              <View style={{
                height: 22,
                width: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: selectedMembership === item.membership_type_id ? '#0A1E5E' : '#CBD5E1',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                backgroundColor: '#fff',
              }}>
                {selectedMembership === item.membership_type_id && (
                  <View style={{
                    height: 12,
                    width: 12,
                    borderRadius: 6,
                    backgroundColor: '#0A1E5E',
                  }} />
                )}
              </View>

              <Text style={{
                fontSize: 16,
                color: '#0B1B3A',
                fontWeight: selectedMembership === item.membership_type_id ? '700' : '500'
              }}>
                {item.membership_name} ({item.duration_days} days)
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isCustomDuration && (
          <TextInput
            placeholder="Enter number of days"
            keyboardType="numeric"
            value={customDays}
            onChangeText={setCustomDays}
            style={styles.input}
          />
        )}

        <Text style={styles.detailLabel}>Received Amount</Text>

        <TextInput
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.redeemButton}
          onPress={handleRedeem}
          disabled={loading}
        >
          <Text style={styles.redeemButtonText}>
            {loading ? "Processing..." : "Redeem"}
          </Text>
        </TouchableOpacity>
      </>
    )}
  </View>
</ScrollView>
    </SafeAreaView>
  );
}
