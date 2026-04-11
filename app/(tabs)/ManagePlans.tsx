import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import AppHeader from '../../components/AppHeader';

interface Plan {
  id: string;
  title: string;
  duration: string;
  price: number;
  group: string;
}

const plansData: Plan[] = [
  { id: "1", title: "One Month Plan", duration: "30 Days", price: 700, group: "Main" },
  { id: "2", title: "One Month Plan", duration: "30 Days", price: 1000, group: "Main" },
  { id: "3", title: "Three Month Plan", duration: "120 Days", price: 3000, group: "Main" },
  { id: "4", title: "Three Plus One", duration: "120 Days", price: 2100, group: "Main" },
];

const ManagePlans: React.FC = () => {
  // const router = useRouter();
  const [showDisabled, setShowDisabled] = useState(false);

  const renderItem = ({ item }: { item: Plan }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.planTitle}>{item.title}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.leftSection}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.group}</Text>
          </View>
          <Text style={styles.duration}>{item.duration}</Text>
        </View>

        <Text style={styles.price}>INR {item.price}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <AppHeader title="Manage Plans" showSettings showCall onSettingsPress={() => {}} onCallPress={() => {}} />

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>All Plans Group</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.inactiveTab}>
          <Text style={styles.inactiveTabText}>Main</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle + New */}
      <View style={styles.toggleCard}>
        <Text style={styles.toggleText}>Show Disabled Plans</Text>

        <View style={styles.toggleRight}>
          <Switch
            value={showDisabled}
            onValueChange={setShowDisabled}
            trackColor={{ false: "#ccc", true: "#0A1E5C" }}
            thumbColor="#fff"
          />

          <TouchableOpacity style={styles.newButton}>
            <Text style={styles.newButtonText}>+ New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Plan List */}
      <FlatList
        data={plansData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ManagePlans;

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 18,
  },

  activeTab: {
    backgroundColor: "#0A1E5C",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    marginRight: 12,
  },

  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },

  inactiveTab: {
    borderWidth: 1,
    borderColor: "#0A1E5C",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },

  inactiveTabText: {
    color: "#0A1E5C",
    fontWeight: "500",
  },

  toggleCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  toggleText: {
    fontSize: 15,
    fontWeight: "500",
  },

  toggleRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  newButton: {
    backgroundColor: "#0A1E5C",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  newButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  planTitle: {
    fontSize: 17,
    fontWeight: "600",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  badge: {
    borderWidth: 1,
    borderColor: "#0A1E5C",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 10,
  },

  badgeText: {
    fontSize: 13,
    color: "#0A1E5C",
    fontWeight: "500",
  },

  duration: {
    fontSize: 14,
    color: "#6B7280",
  },

  price: {
    fontSize: 18,
    fontWeight: "600",
  },
});