// DateRangePickerNative.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

export default function DateRangePickerNative({ fromDate, toDate, setFromDate, setToDate, showFrom, setShowFrom, showTo, setShowTo }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginBottom: 8 }}>
      <TouchableOpacity style={{ flex: 1, borderWidth: 1, borderColor: '#DDD', borderRadius: 20, padding: 10, alignItems: 'center', backgroundColor: '#FFF' }} onPress={() => setShowFrom(true)}>
        <Text>{fromDate ? fromDate.toISOString().slice(0, 10) : 'From Date'}</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 18 }}>-</Text>
      <TouchableOpacity style={{ flex: 1, borderWidth: 1, borderColor: '#DDD', borderRadius: 20, padding: 10, alignItems: 'center', backgroundColor: '#FFF' }} onPress={() => setShowTo(true)}>
        <Text>{toDate ? toDate.toISOString().slice(0, 10) : 'To Date'}</Text>
      </TouchableOpacity>
      {showFrom && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowFrom(false);
            if (selectedDate) setFromDate(selectedDate);
          }}
          maximumDate={toDate || undefined}
        />
      )}
      {showTo && (
        <DateTimePicker
          value={toDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowTo(false);
            if (selectedDate) setToDate(selectedDate);
          }}
          minimumDate={fromDate || undefined}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}
