import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, SafeAreaView, Text, View } from "react-native";
import { supabase } from "../lib/supabaseClient";

export default function MemberDetailsRangeScreen() {
  const router = useRouter();
  const { fromDate, toDate } = useLocalSearchParams();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fromDate && toDate) {
      fetchMembers(fromDate as string, toDate as string);
    }
  }, [fromDate, toDate]);

  const fetchMembers = async (from: string, to: string) => {
    setLoading(true);
    const { data, error } = await supabase.rpc("fn_member_details", {
      in_from_date: from,
      in_to_date: to,
    });
    console.log(data);
    if (error) {
      setMembers([]);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

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
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16 }}>New Members</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={members}
            keyExtractor={(item) => String(item.member_id)}
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
                    {item.name || `${item.first_name || ''} ${item.last_name || ''}`}
                  </Text>
                  <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 6 }}>#{item.member_code}</Text>
                  <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 6 }}>Expiry: <Text style={{ color: '#F59E0B', fontWeight: '700' }}>{item.expiry_date ? item.expiry_date.slice(0, 10) : '--'}</Text></Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ color: '#64748B', fontSize: 13 }}>Amount</Text>
                  <Text style={{ color: '#0B1B3A', fontWeight: '700', fontSize: 20, marginTop: 2 }}>{item.amount ?? '--'}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
