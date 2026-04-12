
import React, { useEffect, useState } from "react";
import { Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import AppHeader from '../../components/AppHeader';
import DateRangePickerNative from '../../components/DateRangePickerNative';
import DateRangePickerWeb from '../../components/DateRangePickerWeb';
import { supabase } from '../../lib/supabaseClient';


const ReportsScreen: React.FC = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(false);
  // For web
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  // For native
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  // Picker visibility (for inline web picker)
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const { startDate, endDate } = range[0];
      if (startDate && endDate) {
        fetchTotalRevenueWeb(startDate, endDate);
      }
    } else {
      if (fromDate && toDate) {
        fetchTotalRevenueNative(fromDate, toDate);
      }
    }
    // eslint-disable-next-line
  }, [range, fromDate, toDate]);

  const fetchTotalRevenueWeb = async (fromDate: Date, toDate: Date) => {
    setLoading(true);
    const from = fromDate.toISOString().slice(0, 10);
    const to = toDate.toISOString().slice(0, 10);
    const { data, error } = await supabase.rpc('fn_total_revenue_datewise', {
      in_from_date: from,
      in_to_date: to,
    });
    if (!error && data && data.length > 0) {
      setTotalRevenue(data.total_revenue || 0);
      setTotalTransactions(data.total_transactions || 0);
    } else {
      setTotalRevenue(data?.total_revenue || 0);
      setTotalTransactions(data?.total_transactions || 0);
    }
    setLoading(false);
  };

  const fetchTotalRevenueNative = async (fromDate: Date, toDate: Date) => {
    setLoading(true);
    const from = fromDate.toISOString().slice(0, 10);
    const to = toDate.toISOString().slice(0, 10);
    const { data, error } = await supabase.rpc('fn_total_revenue_datewise', {
      in_from_date: from,
      in_to_date: to,
    });
    if (!error && data && data.length > 0) {
      setTotalRevenue(data.total_revenue || 0);
      setTotalTransactions(data.total_transactions || 0);
    } else {
      setTotalRevenue(data?.total_revenue || 0);
      setTotalTransactions(data?.total_transactions || 0);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <AppHeader title="Reports" showSettings showCall onSettingsPress={() => {}} onCallPress={() => {}} />


      {/* Filter row: Date range textbox left, filter icon right */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 8 }}>
        {Platform.OS === 'web' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ position: 'relative', flex: 1 }}>
              <TextInput
                style={[
                  styles.filterPill,
                  styles.dateInput,
                  {
                    paddingLeft: 38,
                    height: 44,
                    borderRadius: 32,
                    borderColor: '#C7D0E0',
                    borderWidth: 1.5,
                    fontSize: 16,
                    fontWeight: '500',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    width: '100%',
                    paddingRight: 18,
                  },
                ]}
                placeholder="YYYY-MM-DD to YYYY-MM-DD"
                value={
                  range[0].startDate && range[0].endDate
                    ? `${range[0].startDate.toISOString().slice(0, 10)} to ${range[0].endDate.toISOString().slice(0, 10)}`
                    : ''
                }
                onFocus={() => setShowPicker(true)}
                onChangeText={val => {
                  const match = val.match(/(\d{4}-\d{2}-\d{2})\s*to\s*(\d{4}-\d{2}-\d{2})/);
                  if (match) {
                    setRange([{ ...range[0], startDate: new Date(match[1]), endDate: new Date(match[2]) }]);
                  }
                }}
              />
              <View style={{ position: 'absolute', left: 12, top: 10 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C7A96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="4"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </View>
            </View>
            <TouchableOpacity style={styles.filterIcon}>
              <Text style={{ fontSize: 20 }}>🎚️</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.filterIcon} onPress={() => setShowPicker(true)}>
            <Text style={{ fontSize: 20 }}>🎚️</Text>
          </TouchableOpacity>
        )}
      </View>


      {/* Inline Date Range Picker for web */}
      {Platform.OS === 'web' && showPicker && (
        <View
          style={{
            position: 'absolute',
            left: 32,
            top: 110,
            width: 340,
            backgroundColor: '#fff',
            borderRadius: 14,
            boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
            borderWidth: 0,
            zIndex: 100,
            padding: 12,
          }}
        >
          <View style={{ alignItems: 'flex-end', marginBottom: 2 }}>
            <TouchableOpacity onPress={() => setShowPicker(false)} style={{ padding: 2, borderRadius: 12, backgroundColor: '#f2f2f2', width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18, color: '#888' }}>✕</Text>
            </TouchableOpacity>
          </View>
          <DateRangePickerWeb range={range} setRange={setRange} />
        </View>
      )}

      {/* Native Date Picker logic unchanged, still modal if needed */}
      {Platform.OS !== 'web' && showPicker && (
        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPicker(false)}
        >
          <View style={styles.overlayBg}>
            <View style={styles.overlayContent}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowPicker(false)}>
                <Text style={{ fontSize: 22 }}>✕</Text>
              </TouchableOpacity>
              <DateRangePickerNative
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                showFrom={showFrom}
                setShowFrom={setShowFrom}
                showTo={showTo}
                setShowTo={setShowTo}
              />
            </View>
          </View>
        </Modal>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats cards */}
        <View style={styles.row}>
          <View style={styles.smallCard}>
            <Text style={styles.cardLabel}>Total Transactions</Text>
            <Text style={styles.cardValue}>{loading ? 'Loading...' : totalTransactions}</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.cardLabel}>Total Revenue</Text>
            <Text style={styles.cardValue}>{loading ? 'Loading...' : `₹${totalRevenue}`}</Text>
          </View>
        </View>

        {/* Total Revenue (detailed) */}
        <View style={styles.largeCard}>
          <View style={styles.spaceBetween}>
            <Text style={styles.cardLabel}>Total Revenue</Text>
            <Text style={styles.greenValue}>{loading ? 'Loading...' : `₹${totalRevenue}`}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.spaceBetween}>
            <Text style={styles.subLabel}>Total Transactions</Text>
            <Text style={styles.subLabel}>{loading ? 'Loading...' : totalTransactions}</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 14,
  },

  filters: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  filterPill: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFF",
  },
  filterText: {
    fontSize: 13,
  },
  filterIcon: {
    marginLeft: "auto",
    padding: 6,
  },
  dateInput: {
    flex: 1,
    textAlign: 'center',
    minWidth: 120,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    marginHorizontal: 2,
  },


  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  smallCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
  },

  largeCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    margin: 16,
    padding: 14,
  },

  listCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
  },

  cardLabel: {
    fontSize: 14,
    color: "#666",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 6,
  },
  greenValue: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1BAA5D",
  },

  subLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },

  subtleText: {
    fontSize: 13,
    color: "#777",
    marginTop: 10,
  },
  noData: {
    fontSize: 13,
    color: "#AAA",
    textAlign: "center",
    marginTop: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 10,
  },

  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  arrow: {
    fontSize: 22,
    color: "#999",
  },

  icon: { marginLeft: 16 },
  fab: {
    position: "absolute",
    bottom: 56,
    alignSelf: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0B2A5B",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  fabText: {
    color: "#FFF",
    fontSize: 28,
    marginBottom: 2,
  },

  bottomTabs: {
    height: 56,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#EEE",
  },
  tab: {
    fontSize: 18,
    color: "#999",
  },
  activeTab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0B2A5B",
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabText: {
    color: "#FFF",
    fontSize: 22,
  },
  activeText: {
    color: "#0B2A5B",
  },
  overlayBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 8,
  },
});
