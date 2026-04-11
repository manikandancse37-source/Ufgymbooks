import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';

const ExpensesScreen: React.FC = () => {
  const handleNewExpense = () => {
    console.log('New Expense');
  };

  const handleFilter = () => {
    console.log('Open Filter');
  };

  const handleCardPress = () => {
    console.log('Open Expenses Details');
  };

  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom }]}> 
      {/* Header */}
      <AppHeader title="Expenses" showSettings showCall onSettingsPress={() => {}} onCallPress={() => {}} />

      {/* Top Buttons */}
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.filterBtn} onPress={handleFilter}>
          <Ionicons name="options-outline" size={22} color="#0B1E5B" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.newBtn} onPress={handleNewExpense}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.newBtnText}> New</Text>
        </TouchableOpacity>
      </View>

      {/* Today Filter */}
      <TouchableOpacity style={styles.todayChip}>
        <Text style={styles.todayText}>Today</Text>
      </TouchableOpacity>

      {/* Expense Card */}
      <TouchableOpacity style={styles.card} onPress={handleCardPress}>
        <View>
          <Text style={styles.cardTitle}>Expenses</Text>
          <Text style={styles.amount}>₹0</Text>
        </View>
        <Ionicons name="arrow-forward" size={20} />
      </TouchableOpacity>

      {/* Recent Transactions */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    </SafeAreaView>
  );
};

export default ExpensesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  topButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9DDE3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1E5B',
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 12,
  },
  newBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  todayChip: {
    marginTop: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#0B1E5B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  todayText: {
    color: '#0B1E5B',
    fontWeight: '500',
  },
  card: {
    marginTop: 25,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
  sectionTitle: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8A94A6',
  },
});