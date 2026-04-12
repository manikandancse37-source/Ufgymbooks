const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F8FB" },
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
  detailLabel: { fontSize: 13, color: '#64748B', marginTop: 8, marginBottom: 2 },
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
};

export default function MemberDetailsScreen() {
  const { member } = useLocalSearchParams();
  const router = useRouter();
  const memberData: Member = member ? JSON.parse(member as string) : null;

  // Redeem state
  // Always show membership options
  const [membershipData, setMembershipData] = useState<any[]>([]);
  const [selectedMembership, setSelectedMembership] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMemberships, setLoadingMemberships] = useState(false);
  const [customDays, setCustomDays] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    setLoadingMemberships(true);
    const { data, error } = await supabase.rpc("ufn_get_membership_types");
    if (!error && data) setMembershipData(data);
    setLoadingMemberships(false);
  };

  const isCustomDuration = selectedMembership === 1; // assuming 1 means custom days, like Add Member
  const handleRedeem = async () => {
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
    const { data, error } = await supabase.rpc("ufn_redeem_member_v2", {
      in_member_id: Number(memberData.id),
      in_membership_type: isCustomDuration ? Number(customDays) : selectedMembership,
      in_amount: Number(amount),
    });
    setLoading(false);
    if (error) {
      alert("Redeem failed");
    } else {
      alert(data.message);
      setCustomDays("");
      setAmount("");
      // Instead, use router.push to avoid param scoping issues
      router.push({ pathname: "/(tabs)", params: { refresh: "1" } });
    }
  };

  if (!memberData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Member not found</Text>
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

      <ScrollView style={styles.content} contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 18, padding: 24, marginTop: 8, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10 }}>
          {/* Player image/avatar at the top, centered */}
          <View style={{ alignItems: 'center', marginBottom: 18 }}>
            <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: '#E6EAF0', alignItems: 'center', justifyContent: 'center', marginBottom: 10, overflow: 'hidden' }}>
              {/* If avatar is a URL or base64, use Image, else fallback to initial */}
              {memberData.avatar && memberData.avatar.startsWith('data:image') ? (
                <Image
                  source={{ uri: memberData.avatar }}
                  style={{ width: 90, height: 90, borderRadius: 45 }}
                  resizeMode="cover"
                />
              ) : (
                <Text style={{ fontSize: 40, color: '#64748B' }}>👤</Text>
              )}
            </View>
            <Text style={[styles.name, { textAlign: 'center', marginBottom: 2 }]}>{memberData.name}</Text>
            <Text style={[styles.code, { textAlign: 'center', marginBottom: 8 }]}>{memberData.code}</Text>
          </View>
          {/* All details and redeem in one section */}
          <View style={{ marginBottom: 18 }}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{memberData.phone}</Text>
            <Text style={styles.detailLabel}>Plan</Text>
            <Text style={styles.detailValue}>{memberData.plan}</Text>
            <Text style={styles.detailLabel}>Expiry</Text>
            <Text style={styles.detailValue}>{new Date(memberData.expiryDate).toLocaleDateString()}</Text>
            {memberData.expired && <Text style={[styles.expired, { marginTop: 8 }]}>Expired</Text>}
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: '#E6EAF0', marginVertical: 10 }} />
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20, color: '#0A1E5E', textAlign: 'center', letterSpacing: 0.5 }}>Redeem Membership</Text>
          {loadingMemberships ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <View style={{ gap: 10, marginBottom: 18 }}>
                {membershipData.map((item: any) => (
                  <TouchableOpacity
                    key={item.duration_days}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      borderWidth: selectedMembership === item.duration_days ? 2 : 1,
                      borderColor: selectedMembership === item.duration_days ? '#0A1E5E' : '#E6EAF0',
                      backgroundColor: selectedMembership === item.duration_days ? '#F0F4FF' : '#F8FAFC',
                      marginBottom: 2,
                    }}
                    onPress={() => {
                      setSelectedMembership(item.duration_days);
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
                      borderColor: selectedMembership === item.duration_days ? '#0A1E5E' : '#CBD5E1',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                      backgroundColor: '#fff',
                    }}>
                      {selectedMembership === item.duration_days && (
                        <View style={{
                          height: 12,
                          width: 12,
                          borderRadius: 6,
                          backgroundColor: '#0A1E5E',
                        }} />
                      )}
                    </View>
                    <Text style={{ fontSize: 16, color: '#0B1B3A', fontWeight: selectedMembership === item.duration_days ? '700' : '500' }}>{item.membership_name} ({item.duration_days} days)</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {isCustomDuration && (
                <TextInput
                  placeholder="Enter number of days"
                  keyboardType="numeric"
                  value={customDays}
                  onChangeText={setCustomDays}
                  maxLength={4}
                  style={{
                    backgroundColor: "#E6EAF0",
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 16,
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                />
              )}
              <TextInput
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                maxLength={8}
                style={{
                  backgroundColor: "#E6EAF0",
                  borderRadius: 10,
                  padding: 12,
                  fontSize: 16,
                  marginTop: 8,
                  marginBottom: 8,
                }}
              />
              <View style={{ alignItems: 'center', marginTop: 18 }}>
                <TouchableOpacity style={[styles.redeemButton, { alignSelf: 'center', minWidth: 140 }]} onPress={handleRedeem} disabled={loading}>
                  <Text style={styles.redeemButtonText}>{loading ? "Processing..." : "Redeem"}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}