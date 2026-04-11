import { useRouter } from "expo-router";

import React from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AddStaffScreen: React.FC = () => {
  const router = useRouter();

  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[styles.safe, { paddingBottom: insets.bottom }]}> 
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Add Staff</Text>

            {/* spacer for center alignment */}
            <View style={{ width: 24 }} />
          </View>

          {/* Profile Image */}
          <View style={styles.imageWrapper}>
            <View style={styles.imageCircle}>
              <Text style={styles.imageIcon}>🖼️</Text>
            </View>
            <Text style={styles.changeText}>Change</Text>
          </View>

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="Enter name"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter email"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            keyboardType="email-address"
          />

          {/* Phone */}
          <View style={styles.row}>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>+91</Text>
            </View>
            <TextInput
              placeholder="Enter Phone Number"
              placeholderTextColor="#9CA3AF"
              style={[styles.input, styles.phoneInput]}
              keyboardType="phone-pad"
            />
          </View>

          {/* Role */}
          <Text style={styles.label}>Role</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Please Select</Text>
            <Text style={styles.dropdownIcon}>⌄</Text>
          </TouchableOpacity>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddStaffScreen;

/* ===================================================== */
/* STYLES */
/* ===================================================== */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },

  close: {
    fontSize: 20,
    color: "#000",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  imageWrapper: {
    alignItems: "center",
    marginVertical: 20,
  },

  imageCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E9EEF5",
    alignItems: "center",
    justifyContent: "center",
  },

  imageIcon: {
    fontSize: 28,
  },

  changeText: {
    marginTop: 8,
    color: "#000",
    fontSize: 14,
  },

  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    backgroundColor: "#E9EEF5",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 14,
    color: "#000",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  codeBox: {
    width: 64,
    height: 50,
    backgroundColor: "#E9EEF5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  codeText: {
    fontSize: 14,
    color: "#000",
  },

  phoneInput: {
    flex: 1,
  },

  dropdown: {
    height: 50,
    backgroundColor: "#E9EEF5",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },

  dropdownText: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  dropdownIcon: {
    fontSize: 16,
    color: "#000",
  },

  saveButton: {
    backgroundColor: "#0A1E5E",
    height: 54,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },

  saveText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
