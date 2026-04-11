import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppHeader from '../../components/AppHeader';

const ReportsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <AppHeader title="Reports" showSettings showCall onSettingsPress={() => {}} onCallPress={() => {}} />

      {/* Filters */}
      <View style={styles.filters}>
        <View style={styles.filterPill}>
          <Text style={styles.filterText}>Today</Text>
        </View>
        <View style={styles.filterPill}>
          <Text style={styles.filterText}>Payment type: All</Text>
        </View>
        <TouchableOpacity style={styles.filterIcon}>
          <Text style={{ fontSize: 16 }}>🎚️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats cards */}
        <View style={styles.row}>
          <View style={styles.smallCard}>
            <Text style={styles.cardLabel}>New Members</Text>
            <Text style={styles.cardValue}>65</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.cardLabel}>All-time Balance</Text>
            <Text style={styles.cardValue}>₹0</Text>
          </View>
        </View>

        {/* Total Revenue */}
        <View style={styles.largeCard}>
          <View style={styles.spaceBetween}>
            <Text style={styles.cardLabel}>Total Revenue</Text>
            <Text style={styles.greenValue}>₹0</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.spaceBetween}>
            <Text style={styles.subLabel}>Memberships</Text>
            <Text style={styles.subLabel}>₹0</Text>
          </View>

          <View style={styles.spaceBetween}>
            <Text style={styles.subLabel}>Expenses</Text>
            <Text style={styles.subLabel}>₹0</Text>
          </View>
        </View>

        {/* Memberships */}
        <View style={styles.listCard}>
          <View style={styles.spaceBetween}>
            <Text style={styles.cardLabel}>Memberships</Text>
            <Text style={styles.arrow}>›</Text>
          </View>

          <Text style={styles.cardValue}>₹0</Text>

          <Text style={styles.subtleText}>Memberships by Plan</Text>
          <Text style={styles.noData}>No data available</Text>
        </View>

        {/* Expenses */}
        <View style={styles.listCard}>
          <View style={styles.spaceBetween}>
            <Text style={styles.cardLabel}>Expenses</Text>
            <Text style={styles.arrow}>›</Text>
          </View>

          <Text style={styles.cardValue}>₹0</Text>
          <Text style={styles.subtleText}>Memberships by Plan</Text>
          <Text style={styles.noData}>No data available</Text>
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
});
