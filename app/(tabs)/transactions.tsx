import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Modal, Platform } from 'react-native';
// @ts-ignore
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppHeader from '../../components/AppHeader';


import { supabase } from '../../lib/supabaseClient';



type Transaction = {
  id: string;
  name: string;
  phone: string;
  time: string;
  avatar?: string;
  plan: string;
  membership_type: string;
  payment_type: string;
  amount: number;
  created_by: string;
};


export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("Today");
  const [selectedPayment, setSelectedPayment] = useState<string>("All");
  const [selectedPlan, setSelectedPlan] = useState<string>("All");
  const [fromDate, setFromDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)));
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

  useEffect(() => {
    fetchTransactions();
  }, [fromDate, toDate, selectedPayment, selectedPlan]);

  // Keep range state in sync with fromDate/toDate (for web picker)
  useEffect(() => {
    setRange([{ startDate: fromDate, endDate: toDate, key: 'selection' }]);
  }, [fromDate, toDate]);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("fn_get_transactions_datewise", {
      in_from_date: fromDate.toISOString().slice(0, 10),
      in_to_date: toDate.toISOString().slice(0, 10),
    });
    console.log(data);
    let filtered: Transaction[] = (data as Transaction[]) || [];
    if (selectedPayment !== "All") {
      filtered = filtered.filter((t: Transaction) => t.payment_type === selectedPayment);
    }
    if (selectedPlan !== "All") {
      filtered = filtered.filter((t: Transaction) => t.plan === selectedPlan);
    }
    setTransactions(filtered);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <AppHeader title="Transactions" showSettings showCall onSettingsPress={() => {}} onCallPress={() => {}} />
        {/* Date Range Picker UI */}
        {Platform.OS === 'web' ? (
          <View style={{ margin: 16, marginBottom: 8 }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 8, borderWidth: 1, borderColor: '#E5E7EB' }}
              onPress={() => setShowWebRange(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#0A1E5C" style={{ marginRight: 8 }} />
              <Text style={{ color: '#0A1E5C', fontWeight: '600', fontSize: 15 }}>
                {format(fromDate, 'yyyy-MM-dd')} to {format(toDate, 'yyyy-MM-dd')}
              </Text>
            </TouchableOpacity>
            <Modal visible={showWebRange} transparent animationType="fade">
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.15)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 4 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableOpacity onPress={() => setShowWebRange(false)}>
                      <Ionicons name="close" size={24} color="#222" />
                    </TouchableOpacity>
                  </View>
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
            </Modal>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', margin: 16, marginBottom: 8, backgroundColor: '#fff', borderRadius: 12, padding: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
            <Ionicons name="calendar-outline" size={20} color="#0A1E5C" style={{ marginRight: 8 }} />
            <TouchableOpacity onPress={() => setShowFromPicker(true)}>
              <Text style={{ color: '#0A1E5C', fontWeight: '600', fontSize: 15 }}>{fromDate.toISOString().slice(0, 10)}</Text>
            </TouchableOpacity>
            <Text style={{ color: '#0A1E5C', fontWeight: '600', fontSize: 15, marginHorizontal: 4 }}>to</Text>
            <TouchableOpacity onPress={() => setShowToPicker(true)}>
              <Text style={{ color: '#0A1E5C', fontWeight: '600', fontSize: 15 }}>{toDate.toISOString().slice(0, 10)}</Text>
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
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  {item.avatar ? (
                    <View style={[styles.avatar, { backgroundColor: '#E6EAF0', alignItems: 'center', justifyContent: 'center' }]}> 
                      <Ionicons name="person-circle-outline" size={38} color="#64748B" />
                    </View>
                  ) : (
                    <View style={[styles.avatar, { backgroundColor: '#E6EAF0', alignItems: 'center', justifyContent: 'center' }]}> 
                      <Ionicons name="person-circle-outline" size={38} color="#B0B8C1" />
                    </View>
                  )}
                  <View style={styles.nameBlock}>
                    <Text style={styles.name}>{item.name || item.member_id}</Text>
                    <Text style={styles.id}>{item.id}</Text>
                  </View>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <View style={styles.middle}>
                  <View>
                    <Text style={styles.plan}>{item.title || 'New Joining'}</Text>
                    <Text style={styles.sub}>{item.subtitle || `Membership - ${item.membership || ''}`}</Text>
                  </View>
                  <View style={styles.amountBox}>
                    <View style={styles.cashPill}>
                      <Text style={styles.cashText}>{item.payment_mode}</Text>
                    </View>
                    <Text style={styles.amount}>INR {item.amount}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );

}
function Filter({ label }: { label: string }) {
  return (
    <View style={styles.filter}>
      <Text style={styles.filterText}>{label}</Text>
    </View>
  );
}

// const Tab = ({ label, active }: { label: string; active?: boolean }) => (
//   <View style={styles.tab}>
//     <Text style={[styles.tabText, active && styles.tabActive]}>
//       {label}
//     </Text>
//   </View>
// );

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F6F8FC' },
  container: { flex: 1 },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0A1E5C',
  },
  headerRight: { flexDirection: 'row', gap: 14 },
  iconPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#CBD5E1',
  },

  filterRow: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
  },
  filter: {
    borderWidth: 1,
    borderColor: '#0A1E5C',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filterText: {
    fontSize: 13,
    color: '#0A1E5C',
  },
  sliderIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0A1E5C',
    marginLeft: 'auto',
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },

  cardTop: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  nameBlock: { flex: 1, marginLeft: 10 },
  name: { fontSize: 15, fontWeight: '700' },
  phone: { fontWeight: '400' },
  id: { fontSize: 12, color: '#6B7280' },
  time: { fontSize: 12, color: '#6B7280' },

  middle: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  plan: { fontSize: 16, fontWeight: '700' },
  sub: { fontSize: 12, color: '#6B7280' },

  amountBox: { alignItems: 'flex-end' },
  cashPill: {
    backgroundColor: '#0A1E5C',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  cashText: { color: '#FFF', fontSize: 12 },
  amount: { fontWeight: '700' },

  // ...existing styles...

  fab: {
    position: 'absolute',
    bottom: 96,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0A1E5C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabPlus: { color: '#FFF', fontSize: 34 },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  tab: { alignItems: 'center' },
  tabText: { fontSize: 12, color: '#6B7280' },
  tabActive: { color: '#0A1E5C', fontWeight: '700' },

  banner: {
    backgroundColor: '#FCA5A5',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerText: {
    color: '#7F1D1D',
    fontWeight: '600',
  },
  bannerBtn: {
    borderWidth: 1,
    borderColor: '#7F1D1D',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bannerBtnText: {
    color: '#7F1D1D',
    fontWeight: '600',
  },
});
