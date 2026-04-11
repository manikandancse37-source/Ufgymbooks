import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const NewLeadScreen: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  // const [referral, setReferral] = useState('Walk-in');
  // const [chance, setChance] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [followUpDate] = useState('24 Feb 2026');

  const handleSave = () => {
    console.log({
      fullName,
      phone,
      address,
      referral,
      chance,
      notes,
      followUpDate,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} />
          <Text style={styles.headerTitle}>New Lead</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imageCircle}>
            <Ionicons name="image-outline" size={40} color="#000" />
          </View>
          <Text style={styles.changeText}>Change</Text>
        </View>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          placeholderTextColor="#7B8794"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Phone Section */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>+91</Text>
            </View>
          </View>

          <View style={{ flex: 3, marginLeft: 12 }}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Phone Number"
              placeholderTextColor="#7B8794"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
        </View>

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter address"
          placeholderTextColor="#7B8794"
          multiline
          value={address}
          onChangeText={setAddress}
        />

        {/* Referral */}
        <Text style={styles.label}>Referral</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>{referral}</Text>
          <Ionicons name="chevron-down" size={20} />
        </TouchableOpacity>

        {/* Chance of Joining */}
        <Text style={styles.label}>Chance of Joining</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>{chance}</Text>
          <Ionicons name="chevron-down" size={20} />
        </TouchableOpacity>

        {/* Notes */}
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add some quick notes here"
          placeholderTextColor="#7B8794"
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        {/* Follow Up Date */}
        <Text style={styles.label}>Follow Up Date</Text>
        <View style={styles.dateBox}>
          <Text style={styles.dateText}>{followUpDate}</Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default NewLeadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E4E9F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeText: {
    marginTop: 8,
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 18,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#E4E9F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  codeBox: {
    backgroundColor: '#E4E9F0',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#E4E9F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
  },
  dateBox: {
    backgroundColor: '#E4E9F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  dateText: {
    fontSize: 16,
  },
  saveBtn: {
    marginTop: 30,
    backgroundColor: '#0B1E5B',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});