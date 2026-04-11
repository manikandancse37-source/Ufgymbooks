import React from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import AppHeader from '../../components/AppHeader';

const transactions = [
  {
    id: '#QEFU0013',
    name: 'Silambarasan',
    phone: '.34',
    time: '10:01 AM, 07 Feb 2026',
  },
  {
    id: '#QEFU0093',
    name: 'Jainanasivam',
    phone: '.94',
    time: '07:42 PM, 06 Feb 2026',
  },
];

export default function TransactionsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>

        {/* Header */}
        <AppHeader title="Transactions" showSettings showCall onSettingsPress={() => {}} onCallPress={() => {}} />

        {/* Filters */}
        <View style={styles.filterRow}>
          <Filter label="Last 30 days" />
          <Filter label="Payment type: All" />
          <Filter label="Plan: All" />
          <View style={styles.sliderIcon} />
        </View>

        {/* List */}
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 220 }}
          renderItem={({ item }) => (
            <View style={styles.card}>

              {/* Top */}
              <View style={styles.cardTop}>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/150' }}
                  style={styles.avatar}
                />

                <View style={styles.nameBlock}>
                  <Text style={styles.name}>
                    {item.name}
                    <Text style={styles.phone}> {item.phone}</Text>
                  </Text>
                  <Text style={styles.id}>{item.id}</Text>
                </View>

                <Text style={styles.time}>{item.time}</Text>
              </View>

              {/* Middle */}
              <View style={styles.middle}>
                <View>
                  <Text style={styles.plan}>One Month Plan</Text>
                  <Text style={styles.sub}>
                    Membership - One Month Plan
                  </Text>
                </View>

                <View style={styles.amountBox}>
                  <View style={styles.cashPill}>
                    <Text style={styles.cashText}>Cash</Text>
                  </View>
                  <Text style={styles.amount}>INR 1,000</Text>
                </View>
              </View>

              {/* Bottom */}
              <View style={styles.bottom}>
                <View style={styles.smiley} />
                <Text style={styles.created}>
                  Created By <Text style={styles.bold}>Saravanan M</Text>
                </Text>
              </View>

            </View>
          )}
        />

      

      </View>
    </SafeAreaView>
  );
}

const Filter = ({ label }: { label: string }) => (
  <View style={styles.filter}>
    <Text style={styles.filterText}>{label}</Text>
  </View>
);

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

  bottom: {
    backgroundColor: '#EEF2FF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  smiley: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#94A3B8',
    marginRight: 8,
  },
  created: { fontSize: 13 },
  bold: { fontWeight: '700' },

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
