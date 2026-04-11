import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

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

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [membershipData, setMembershipData] = useState<any[]>([]);
  const [selectedMembership, setSelectedMembership] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMemberships, setLoadingMemberships] = useState(false);
  const [customDays, setCustomDays] = useState("");

  useEffect(() => {
    if (showModal) {
      fetchMemberships();
    }
  }, [showModal]);

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
    setLoading(true);
    const { error } = await supabase.rpc("ufn_redeem_member", {
      in_member_id: Number(memberData.id),
      in_membership_type: isCustomDuration ? Number(customDays) : selectedMembership,
    });
    setLoading(false);
    if (error) {
      Alert.alert("Redeem failed", error.message);
    } else {
      Alert.alert("Success", "Membership redeemed successfully!");
      setShowModal(false);
      setCustomDays("");
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
        <View style={{ width: '100%', alignItems: 'center', marginBottom: 18 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#E6EAF0', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            {/* Optionally show avatar if available */}
            <Text style={{ fontSize: 36, color: '#64748B' }}>{memberData.name.charAt(0)}</Text>
          </View>
          <Text style={[styles.name, { textAlign: 'center', marginBottom: 2 }]}>{memberData.name}</Text>
          <Text style={[styles.code, { textAlign: 'center', marginBottom: 8 }]}>{memberData.code}</Text>
        </View>
        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 14, padding: 18, marginBottom: 18, elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6 }}>
          <Text style={styles.detailLabel}>Phone</Text>
          <Text style={styles.detailValue}>{memberData.phone}</Text>
          <Text style={styles.detailLabel}>Plan</Text>
          <Text style={styles.detailValue}>{memberData.plan}</Text>
          <Text style={styles.detailLabel}>Expiry</Text>
          <Text style={styles.detailValue}>{new Date(memberData.expiryDate).toLocaleDateString()}</Text>
          {memberData.expired && <Text style={[styles.expired, { marginTop: 8 }]}>Expired</Text>}
        </View>
        {/* Redeem Button */}
        <TouchableOpacity style={styles.redeemButton} onPress={() => setShowModal(true)}>
          <Text style={styles.redeemButtonText}>Redeem</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Popup */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>Redeem Membership</Text>
            {loadingMemberships ? (
              <ActivityIndicator size="large" />
            ) : (
              <>
                <RNPickerSelect
                  onValueChange={val => {
                    setSelectedMembership(val);
                    if (val !== 1) setCustomDays("");
                  }}
                  items={membershipData.map((item: any) => ({
                    label: `${item.membership_name} (${item.duration_days} days)` ,
                    value: item.duration_days,
                  }))}
                  value={selectedMembership}
                  placeholder={{ label: "Select Membership Type", value: null }}
                  style={{
                    inputIOS: {
                      padding: 12,
                      backgroundColor: "#F8FAFC",
                      borderRadius: 12,
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: "#CBD5E1",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.08,
                      shadowRadius: 6,
                      marginBottom: 8,
                    },
                    inputAndroid: {
                      padding: 10,
                      backgroundColor: "#F8FAFC",
                      borderRadius: 12,
                      fontSize: 16,
                      borderWidth: 1,
                      borderColor: "#CBD5E1",
                      elevation: 4,
                      marginBottom: 8,
                    },
                  }}
                />
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
                      marginTop: 14,
                    }}
                  />
                )}
              </>
            )}
            <View style={{ flexDirection: "row", marginTop: 24, justifyContent: "space-between" }}>
              <TouchableOpacity style={[styles.redeemButton, { backgroundColor: '#64748B' }]} onPress={() => setShowModal(false)}>
                <Text style={styles.redeemButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem} disabled={loading}>
                <Text style={styles.redeemButtonText}>{loading ? "Processing..." : "Redeem"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

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
  phone: { fontSize: 16, marginBottom: 8 },
  plan: { fontSize: 16, marginBottom: 8 },
  expiry: { fontSize: 16, marginBottom: 8 },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});