
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, View } from "react-native";
import { supabase } from "../lib/supabaseClient";

export default function AllTimeBalanceReportScreen() {
  const router = useRouter();
  const { fromDate, toDate } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      let params = {};
      if (fromDate && toDate) {
        params = {
          in_from_date: fromDate,
          in_to_date: toDate,
        };
      }
      const { data, error } = await supabase.rpc("fn_member_balance_report", params);
      if (error) {
        setError("Failed to fetch balance report");
        setLoading(false);
        return;
      }
      setMembers(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchBalance();
  }, [fromDate, toDate]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F8FB' }}>
      <View style={{ padding: 16 }}>
        {/* Back Button */}
        <Text
          onPress={() => router.back()}
          style={{ color: '#2563EB', fontWeight: '600', fontSize: 16, marginBottom: 12 }}
        >
          ← Back
        </Text>
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16 }}>All Time Balance</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <Text style={{ color: '#B91C1C', fontSize: 16, marginTop: 20, textAlign: 'center' }}>{error}</Text>
        ) : (
          <FlatList
            data={members}
            keyExtractor={(item, idx) => String(item.member_id || idx)}
            ListEmptyComponent={<Text style={{ color: '#64748B', fontSize: 16, textAlign: 'center', marginTop: 32 }}>No records found</Text>}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 14, flexDirection: 'row', alignItems: 'center' }}>
                {/* Profile Image or Default Icon */}
                {item["profile image"] ? (
                  <Image
                    source={{
                      uri: item["profile image"].startsWith('data:image')
                        ? item["profile image"]
                        : `data:image/png;base64,${item["profile image"]}`
                    }}
                    style={{ width: 48, height: 48, borderRadius: 24, marginRight: 14, backgroundColor: '#E6EAF0' }}
                  />
                ) : (
                  <View style={{ width: 48, height: 48, borderRadius: 24, marginRight: 14, backgroundColor: '#E6EAF0', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 28, color: '#64748B' }}>👤</Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 17, color: '#0B1B3A', marginBottom: 2 }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 6 }}>{item.phone}</Text>
                  <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 6 }}>Expiry: <Text style={{ color: '#F59E0B', fontWeight: '700' }}>{item.expiry_date ? item.expiry_date.slice(0, 10) : '--'}</Text></Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: '#64748B', fontSize: 13 }}>Balance</Text>
                  <Text style={{ color: '#0B1B3A', fontWeight: '700', fontSize: 20, marginTop: 2 }}>{item.balance_amount !== undefined && item.balance_amount !== null ? `₹${item.balance_amount}` : '--'}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
