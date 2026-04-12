import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabaseClient';

const NewPlanScreen: React.FC = () => {
  const router = useRouter();

  const [planGroup, setPlanGroup] =
    useState<'Main' | 'Personal Training' | 'New'>('Main');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');

  const GroupButton = ({ label }: { label: typeof planGroup }) => {
    const active = planGroup === label;

    return (
      <TouchableOpacity
        onPress={() => setPlanGroup(label)}
        style={[
          styles.groupButton,
          active && styles.groupButtonActive,
        ]}
      >
        <Text
          style={[
            styles.groupButtonText,
            active && styles.groupButtonTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSave = async () => {
    if (!name || !amount || !duration) {
      Alert.alert('Validation', 'Please fill all required fields.');
      return;
    }
    
    const { data,error } = await supabase.rpc('ufn_insert_membership_type', {
      in_membership_name: name,
      in_duration_days: parseInt(duration, 10),
      in_amount: parseFloat(amount)
    });
    console.log(data);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      alert('Success');
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerSide}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>New Plan</Text>

        <View style={styles.headerSide} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.label}>Plan Group</Text>
            <View style={styles.groupContainer}>
              <GroupButton label="Main" />
              <GroupButton label="Personal Training" />
              <GroupButton label="New" />
            </View>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Plan Name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Plan Amount"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.label}>Duration (in days)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Plan Duration"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />

            {/* Sessions and Enable Sessions removed for simpler design, like Add Member page */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewPlanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerSide: {
    width: 24,
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 22,
    color: '#111827',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  /* Content */
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  groupContainer: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  groupButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E3A8A',
    marginRight: 12,
  },
  groupButtonActive: {
    backgroundColor: '#1E3A8A',
  },
  groupButtonText: {
    fontSize: 14,
    color: '#1E3A8A',
  },
  groupButtonTextActive: {
    color: '#FFFFFF',
  },
  input: {
    height: 48,
    backgroundColor: '#E5ECF3',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#111827',
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },

  /* Save Button */
  saveButton: {
    height: 56,
    marginHorizontal: 16,
    marginBottom: 32,
    marginTop: 16,
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
