import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppHeader from '../../components/AppHeader';

const PotentialLeads: React.FC = () => {
  // const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <AppHeader title="Potential Leads" showSettings showCall onSettingsPress={() => {}} onCallPress={() => {}} />

      {/* ================= SEARCH + ACTIONS ================= */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search for name or phone"
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        <TouchableOpacity style={styles.plusButton}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#0A1E5C" />
        </TouchableOpacity>
      </View>

      {/* ================= FILTER CHIPS ================= */}
      <View style={styles.filterContainer}>
        <Chip label="Sort by: Created at - Desc" />
        <Chip label="Follow Up: Today" />
        <Chip label="Status: Active" />
      </View>

      {/* ================= INFO TEXT ================= */}
      <Text style={styles.memberCount}>Showing 0 Members</Text>

      {/* ================= EMPTY STATE ================= */}
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Lead Found</Text>
        <Text style={styles.emptySubtitle}>
          No leads match the selected filter
        </Text>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>See All Leads</Text>
        </TouchableOpacity>

        <Text style={styles.tryAgain}>Try again.</Text>
      </View>
    </SafeAreaView>
  );
};

export default PotentialLeads;

/* ================= CHIP COMPONENT ================= */

const Chip = ({ label }: { label: string }) => (
  <View style={styles.chip}>
    <Text style={styles.chipText}>{label}</Text>
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  searchInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 10,
    fontSize: 15,
  },

  plusButton: {
    width: 50,
    height: 50,
    backgroundColor: "#0A1E5C",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },

  chip: {
    borderWidth: 1,
    borderColor: "#0A1E5C",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },

  chipText: {
    color: "#0A1E5C",
    fontSize: 14,
    fontWeight: "500",
  },

  memberCount: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 40,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 30,
    textAlign: "center",
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#0A1E5C",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  tryAgain: {
    fontSize: 15,
    color: "#475569",
  },
});