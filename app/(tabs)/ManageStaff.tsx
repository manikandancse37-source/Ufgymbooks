import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppHeader from '../../components/AppHeader';

const ManageStaff: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <AppHeader title="Manage Staff" showSettings showCall onSettingsPress={() => {}} onCallPress={() => {}} />

      {/* Staff Card */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Ionicons name="happy-outline" size={28} color="#fff" />
          </View>

          {/* Details */}
          <View style={styles.details}>
            <Text style={styles.name}>M.Saravanan</Text>
            <Text style={styles.staffId}>#QEFUSTF0001</Text>
            <Text style={styles.phone}>+919787976783</Text>
          </View>

          {/* Admin Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Admin</Text>
          </View>
        </View>
      </View>

      {/* Add New Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ManageStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
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
    color: "#000",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 10,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f28c3c",
    justifyContent: "center",
    alignItems: "center",
  },

  details: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  staffId: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },

  phone: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },

  badge: {
    borderWidth: 1,
    borderColor: "#cfd5e2",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },

  badgeText: {
    fontSize: 13,
    color: "#3b4a6b",
    fontWeight: "500",
  },

  addButton: {
    backgroundColor: "#0c1f5c",
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});