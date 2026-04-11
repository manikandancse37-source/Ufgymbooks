import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PAYMENT_TYPES = [
  "Cash",
  "UPI",
  "Debit Card",
  "Credit Card",
  "Net Banking",
];

export default function CreateExpenseScreen() {
  const router = useRouter();
  const [payment, setPayment] = useState("Cash");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
       <TouchableOpacity onPress={() => router.back()} style={styles.headerSide}>
                 <Text style={styles.closeIcon}>✕</Text>
               </TouchableOpacity>
        <Text style={styles.title}>Create Expense</Text>
        <View style={{ width: 28 }} />
      </View>
      <Text style={styles.label}>Expense Type</Text>
      <TouchableOpacity style={styles.dropdown}>
        <Text style={styles.dropdownText}>Electricity</Text>
        <Ionicons name="chevron-down" size={20} />
      </TouchableOpacity>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />
      <Text style={styles.label}>Payment Type</Text>
      <View style={styles.paymentWrap}>
        {PAYMENT_TYPES.map((item) => {
          const active = payment === item;

          return (
            <TouchableOpacity
              key={item}
              onPress={() => setPayment(item)}
              style={[styles.chip, active && styles.activeChip]}
            >
              <Text style={[styles.chipText, active && styles.activeChipText]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.label}>description</Text>
      <TextInput
        placeholder="Enter a short description"
        multiline
        value={description}
        onChangeText={setDescription}
        style={styles.textarea}
      />
      <Text style={styles.label}>Documents & invoice</Text>
      <TouchableOpacity style={styles.uploadBox}>
        <Ionicons name="add" size={30} />
      </TouchableOpacity>

      <View style={{ height: 40 }} />
       <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Submit</Text>
            </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F9",
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 50,
    marginBottom: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
  },

  label: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },

  dropdown: {
    backgroundColor: "#E4E7EC",
    padding: 18,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownText: {
    fontSize: 16,
  },

  input: {
    backgroundColor: "#E4E7EC",
    padding: 18,
    borderRadius: 14,
    fontSize: 16,
  },

  paymentWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  chip: {
    backgroundColor: "#E4E7EC",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
  },

  chipText: {
    fontSize: 15,
  },

  activeChip: {
    backgroundColor: "#0B1F55",
  },

  activeChipText: {
    color: "#fff",
    fontWeight: "600",
  },

  textarea: {
    backgroundColor: "#E4E7EC",
    borderRadius: 14,
    padding: 18,
    minHeight: 120,
    textAlignVertical: "top",
  },

  uploadBox: {
    width: 120,
    height: 120,
    backgroundColor: "#E4E7EC",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },headerSide: {
    width: 24,
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 22,
    color: '#111827',
  },
  /* Save Button */
  saveButton: {
    height: 56,
    margin: 16,
    borderRadius: 10,
    backgroundColor: '#0B1D4D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
