import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import RNPickerSelect from "react-native-picker-select";
import { supabase } from "../../lib/supabaseClient";

const DEFAULT_FONT_FAMILY = Platform.select({ ios: 'System', android: 'sans-serif', web: 'system-ui' });

/* ── Defaults ── */
const DEFAULT_STATE = { label: "Tamil Nadu", value: "Tamil Nadu" };
const DEFAULT_CITY  = { label: "Chennai",    value: "Chennai"    };

/* ── Initial form state ── */
const INITIAL_FORM = {
  name:      "",
  lastName:  "",
  phone:     "",
  email:     "",
  dob:       "",
  gender:    "Male",
  address:   "",
  city:      "",
  stateName: "",
  pincode:   "",
  height:    "",
  weight:    "",
  emgName:   "",
  emgPhone:  "",
  avatarUrl: "",
};

/* ── Reusable field component ── */
const Field = ({ style, ...props }: React.ComponentProps<typeof TextInput>) => (
  <TextInput
    style={[styles.input, style]}
    placeholderTextColor="#6c7587"
    {...props}
  />
);

/* ══════════════════════════════════════════ */
export default function AddMemberScreen() {
  // Avatar state and image picker logic
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Please allow access to your photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: false,
    });
    if (
      !result.canceled &&
      result.assets &&
      result.assets.length > 0 &&
      result.assets[0].uri
    ) {
      if (isMounted.current) setAvatar(result.assets[0].uri);
      // Compress and get base64
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      if (isMounted.current) setAvatarBase64(manipResult.base64 || null);
    }
  };
  const router = useRouter();

  const [form, setForm] = useState({ ...INITIAL_FORM });
  const set = useCallback(
    (key: keyof typeof INITIAL_FORM) => (val: string) =>
      setForm(prev => ({ ...prev, [key]: val })),
    []
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [membershipType, setMembershipType] = useState<number | null>(null);
  const [membershipData, setMembershipData] = useState<any[]>([]);
  const [customDays, setCustomDays]         = useState("");
  const [loading, setLoading]               = useState(false);

  const [appUserId, setAppUserId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setForm({ ...INITIAL_FORM });
      setMembershipType(null);
      setCustomDays("");
    }, [])
  );

  useEffect(() => {
    (async () => {
      try {
        const storedId = Platform.OS === "web"
          ? localStorage.getItem("userid")
          : await AsyncStorage.getItem("userid");

        if (!storedId) {
          alert("User is not logged in. Please sign in again.");
          router.replace("/login");
          return;
        }

        setAppUserId(storedId);
      } catch (error) {
        console.warn("Failed to read user id from storage", error);
        alert("Unable to read user credentials. Please re-login.");
        router.replace("/login");
      }
    })();
  }, [router]);

  /* ── State / City dropdown data ── */
  const [stateOptions, setStateOptions] = useState<{ label: string; value: string }[]>([]);
  const [cityOptions, setCityOptions]   = useState<{ label: string; value: string }[]>([]);

  /* ── Fetch all data on mount ── */
  useEffect(() => {
    (async () => {
      const [statesRes, citiesRes, membershipRes] = await Promise.all([
        supabase.rpc("ufn_get_states"),
        supabase.rpc("ufn_get_cities"),
        supabase.rpc("ufn_get_membership_types"),
      ]);

      /* States — fallback to Tamil Nadu on error */
      if (!statesRes.error && statesRes.data?.length) {
        setStateOptions(
          statesRes.data.map((s: any) => ({
            label: s.state_name,
            value: s.state_id,
          }))
        );
      } else {
        setStateOptions([DEFAULT_STATE]);
      }

      /* Cities — fallback to Chennai on error */
      if (!citiesRes.error && citiesRes.data?.length) {
        setCityOptions(
          citiesRes.data.map((c: any) => ({
            label: c.city_name,
            value: c.city_id,
          }))
        );
      } else {
        setCityOptions([DEFAULT_CITY]);
      }

      /* Membership types */
      if (!membershipRes.error && membershipRes.data) {
        setMembershipData(membershipRes.data);
      }
    })();
  }, []);

  /* ── Derived values ── */
  const membershipOptions = useMemo(() =>
    membershipData.map(item => ({
      label: `${item.membership_name} (${item.duration_days} days)`,
      value: item.duration_days,
    })), [membershipData]);

  const selectedPlan = useMemo(() =>
    membershipData.find(item => item.duration_days === membershipType),
    [membershipData, membershipType]);

  const isCustomDuration = selectedPlan?.duration_days === 1;

  /* ── Reset custom days when plan changes ── */
  useEffect(() => { setCustomDays(""); }, [membershipType]);

  /* ── Validation ── */
  const validate = useCallback(() => {
    const { name, lastName, phone, email, address, city,
            stateName, pincode, height, weight, emgName, emgPhone } = form;

    if (!name) { alert("First name is required"); return false; }
    if (!lastName) { alert("Last name is required"); return false; }
    if (!phone) { alert("Mobile number is required"); return false; }
    if (phone.length !== 10) { alert("Mobile number must be exactly 10 digits"); return false; }
    if (!email) { alert("Email is required"); return false; }
    if (!address) { alert("Address is required"); return false; }
    if (!city) { alert("City is required"); return false; }
    if (!stateName) { alert("State is required"); return false; }
    if (!pincode) { alert("Pincode is required"); return false; }
    if (!membershipType) { alert("Membership type is required"); return false; }
    if (!height) { alert("Height is required"); return false; }
    if (!weight) { alert("Weight is required"); return false; }
    if (!emgName) { alert("Emergency contact name is required"); return false; }
    if (!emgPhone) { alert("Emergency phone is required"); return false; }
    if (emgPhone.length < 10) { alert("Emergency phone must be at least 10 digits"); return false; }
    if (isCustomDuration && !customDays) { alert("Enter number of days"); return false; }
    return true;
  }, [form, membershipType, isCustomDuration, customDays]);

  /* ── Save ── */
  const handleSave = useCallback(async () => {
    if (!validate()) return;
    Keyboard.dismiss();
    setLoading(true);

    try {
      if (!appUserId) {
        alert("Unable to save member: no user session found. Please login again.");
        router.replace("/login");
        return;
      }


      // Use base64 string for avatar
      let avatarBase64String = avatarBase64;

      const userIdNumber = Number(appUserId);
      if (Number.isNaN(userIdNumber)) {
        throw new Error("Invalid user id in storage");
      }

      let durationDays = isCustomDuration
        ? Number(customDays)
        : selectedPlan?.duration_days;

      const { error } = await supabase.rpc("ufn_create_member_v2", {
        in_applicationuserid: userIdNumber,
        in_first_name:        form.name,
        in_last_name:         form.lastName,
        in_gender:            form.gender,
        in_dob:               form.dob || null,
        in_phone:             form.phone,
        in_email:             form.email,
        in_address:           form.address,
        in_city:              form.city,
        in_state:             form.stateName,
        in_pincode:           form.pincode,
        in_membership_type:   durationDays,
        in_height:            form.height ? Number(form.height) : null,
        in_weight:            form.weight ? Number(form.weight) : null,
        in_emg_name:          form.emgName,
        in_emg_phone:         form.emgPhone,
        in_profile_image:     avatarBase64String || null,
      });

      if (error) throw error;

      alert("Member Added Successfully");
      setForm({ ...INITIAL_FORM });   // ← reset all text fields
      setAvatar(null);

      setMembershipType(null);        // ← reset membership dropdown
      setCustomDays("");              // ← reset custom days
      setAvatar(null);
      setAvatarBase64(null);
      router.back();

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  }, [appUserId, form, isCustomDuration, customDays, selectedPlan, validate, router, avatar]);

  /* ── Render ── */
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentInset={{ bottom: 120 }}
          contentContainerStyle={[styles.outerContent, styles.scrollContent]}
        >
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => {
                setForm({ ...INITIAL_FORM });
                setMembershipType(null);
                setCustomDays("");
                router.back();
              }}>
                <Text style={styles.close}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Add New Member</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Section: Personal */}
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 16 }} onPress={pickImage}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: '#E6EAF0' }} />
              ) : (
                <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: '#E6EAF0', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#6c7587', fontSize: 32 }}>+</Text>
                </View>
              )}
              <Text style={{ textAlign: 'center', color: '#6c7587', marginTop: 4 }}>Add Photo</Text>
            </TouchableOpacity>
            <Field placeholder="First Name" value={form.name}     onChangeText={set("name")}     maxLength={50} />
            <Field placeholder="Last Name"  value={form.lastName} onChangeText={set("lastName")} maxLength={50} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 0, gap: 0 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6EAF0', borderRadius: 10, height: 44, paddingHorizontal: 12, marginRight: 8 }}>
                <Text style={{ fontSize: 16, color: '#0A1E5E', fontWeight: '600' }}>+91</Text>
              </View>
              <TextInput
                style={{ flex: 1, height: 44, backgroundColor: '#E6EAF0', borderRadius: 10, fontSize: 16, color: '#0A1E5E', paddingHorizontal: 14 }}
                placeholder="Mobile Number"
                placeholderTextColor="#6c7587"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(text) => {
                  let numeric = text.replace(/[^0-9]/g, "");
                  if (numeric.length > 10) numeric = numeric.slice(0, 10);
                  set("phone")(numeric);
                }}
                maxLength={10}
              />
            </View>
            <Field placeholder="Email" value={form.email} onChangeText={set("email")} maxLength={50} />
            {/* Gender Dropdown */}
            <View style={styles.dropdownWrapper}>
              <RNPickerSelect
                onValueChange={val => set("gender")(val ?? "")}
                items={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ]}
                value={form.gender}
                style={{
                  ...pickerStyles,
                  inputIOS: { ...pickerStyles.inputIOS, ...styles.input },
                  inputAndroid: { ...pickerStyles.inputAndroid, ...styles.input },
                  inputWeb: { ...pickerStyles.inputWeb, ...styles.input },
                }}
                placeholder={{ label: "Select Gender", value: null, color: "#0A1E5E" }}
              />
            </View>
            {Platform.OS === "web" ? (
              <input
                type="date"
                value={form.dob}
                onChange={e => set("dob")(e.target.value)}
                style={styles.webDate as any}
              />
            ) : (
              <>
                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                  <Text>{form.dob || "Select Date of Birth"}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={form.dob ? new Date(form.dob) : new Date()}
                    mode="date"
                    maximumDate={new Date()}
                    onChange={(_, d) => {
                      setShowDatePicker(false);
                      if (d) set("dob")(d.toISOString().split("T")[0]);
                    }}
                  />
                )}
              </>
            )}
            <Field
              placeholder="Address"
              value={form.address}
              onChangeText={set("address")}
              style={{ height: 80 }}
              multiline
            />
            <Field placeholder="Pincode" value={form.pincode} onChangeText={set("pincode")} maxLength={6} />
            <View style={styles.divider} />

            {/* Section: Location & Membership */}
            <Text style={styles.sectionTitle}>Location & Membership</Text>
            <View style={styles.dropdownWrapper}>
              <RNPickerSelect
                onValueChange={val => set("stateName")(val ?? "")}
                items={stateOptions}
                value={form.stateName}
                style={{
                  ...pickerStyles,
                  inputIOS: { ...pickerStyles.inputIOS, ...styles.input },
                  inputAndroid: { ...pickerStyles.inputAndroid, ...styles.input },
                  inputWeb: { ...pickerStyles.inputWeb, ...styles.input },
                }}
                placeholder={{ label: "Select State", value: null, color: "#0A1E5E" }}
              />
            </View>
            <View style={styles.dropdownWrapper}>
              <RNPickerSelect
                onValueChange={val => set("city")(val ?? "")}
                items={cityOptions}
                value={form.city}
                style={{
                  ...pickerStyles,
                  inputIOS: { ...pickerStyles.inputIOS, ...styles.input },
                  inputAndroid: { ...pickerStyles.inputAndroid, ...styles.input },
                  inputWeb: { ...pickerStyles.inputWeb, ...styles.input },
                }}
                placeholder={{ label: "Select City", value: null, color: "#0A1E5E" }}
              />
            </View>
            <View style={styles.dropdownWrapper}>
              <RNPickerSelect
                onValueChange={setMembershipType}
                items={membershipOptions}
                value={membershipType}
                style={{
                  ...pickerStyles,
                  inputIOS: { ...pickerStyles.inputIOS, ...styles.input },
                  inputAndroid: { ...pickerStyles.inputAndroid, ...styles.input },
                  inputWeb: { ...pickerStyles.inputWeb, ...styles.input },
                }}
                placeholder={{ label: "Select Membership Type", value: null, color: "#0A1E5E" }}
              />
            </View>
            {isCustomDuration && (
              <Field
                placeholder="Enter number of days"
                keyboardType="numeric"
                value={customDays}
                onChangeText={setCustomDays}
                maxLength={4}
              />
            )}
            <View style={styles.divider} />

            {/* Section: Health */}
            <Text style={styles.sectionTitle}>Health</Text>
            <Field
              placeholder="Height (cm)"
              value={form.height}
              onChangeText={text => {
                const numeric = text.replace(/[^0-9]/g, "");
                set("height")(numeric);
              }}
              keyboardType="numeric"
              maxLength={5}
            />
            <Field
              placeholder="Weight (kg)"
              value={form.weight}
              onChangeText={text => {
                const numeric = text.replace(/[^0-9]/g, "");
                set("weight")(numeric);
              }}
              keyboardType="numeric"
              maxLength={5}
            />
            <View style={styles.divider} />

            {/* Section: Emergency */}
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            <Field placeholder="Emergency Name"  value={form.emgName}  onChangeText={set("emgName")}  maxLength={50} />
            <View style={[styles.row, { alignItems: 'center' }]}> 
              <View style={styles.codeBox}><Text>+91</Text></View>
              <Field
                placeholder="Emergency Phone"
                style={{ flex: 1, marginLeft: 8 }}
                keyboardType="phone-pad"
                value={form.emgPhone}
                onChangeText={(text) => {
                  const numeric = text.replace(/[^0-9]/g, "");
                  set("emgPhone")(numeric);
                }}
                maxLength={10}
              />
            </View>

            {/* Submit */}
            <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? "Saving…" : "Add Member"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ── Styles ── */
const pickerStyles = {
  inputIOS: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: "#0A1E5E",
    backgroundColor: "#E6EAF0",
    borderRadius: 10,
    fontSize: 13,
    minHeight: 28, // Reduced height
  },
  inputAndroid: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    color: "#0A1E5E",
    backgroundColor: "#E6EAF0",
    borderRadius: 10,
    fontSize: 13,
    minHeight: 28, // Reduced height
  },
  inputWeb: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 0,
    outlineWidth: 0,
    color: "#0A1E5E",
    backgroundColor: "#E6EAF0",
    borderRadius: 10,
    fontSize: 13,
    minHeight: 28, // Reduced height
  },
};

const styles = StyleSheet.create({
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#0A1E5E',
      marginTop: 18,
      marginBottom: 2,
      letterSpacing: 0.1,
    },
    divider: {
      height: 1,
      backgroundColor: '#E6EAF0',
      marginVertical: 18,
      borderRadius: 2,
    },
  safe:            { flex: 1, backgroundColor: "#F5F6F8" },
  flex:            { flex: 1 },
  outerContent:    { padding: 18, paddingTop: 32, paddingBottom: 32 },
  scrollContent:   { paddingBottom: 160 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#E6EAF0",
    borderRadius: 10,
    padding: 14,
    marginTop: 14,
    color: "#0A1E5E",
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 16,
  },
  webDate: {
    height: 50, borderRadius: 10, padding: 10,
    marginTop: 14, backgroundColor: "#E6EAF0",
  },
    codeBox: {
      width: 54,
      height: 44,
      backgroundColor: "#E6EAF0",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
  row:             { flexDirection: "row", gap: 10, marginTop: 14 },
  phoneRow:        { flexDirection: "row", alignItems: "center", marginTop: 14, marginBottom: 0 },
  codeBoxCompact:  { width: 54, height: 44, backgroundColor: "#E6EAF0", borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 8 },
  codeText:        { fontSize: 16, color: "#0A1E5E", fontWeight: "600" },
  phoneInput:      { flex: 1, marginLeft: 0, height: 44, marginTop: 0, fontSize: 16 },
  dropdownWrapper: {
    backgroundColor: "#E6EAF0",
    borderRadius: 10,
    marginTop: 14, // Added to give space above dropdown
    justifyContent: "center",
    minHeight: 54,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#0A1E5E",
    padding: 18,
    borderRadius: 12,
    marginTop: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText:      { color: "#fff", fontWeight: "700", fontSize: 17, letterSpacing: 0.5 },
  headerRow:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  close:           { fontSize: 22, color: "#0A1E5E" },
  headerTitle:     { fontSize: 22, fontWeight: "700", color: "#0A1E5E" },
});