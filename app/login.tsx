import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabaseClient";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter mobile number and password");
      return;
    }
    if (email.length !== 10) {
      alert("Mobile number must be 10 digits");
      return;
    }
    if (password.length < 6 || password.length > 20) {
      alert("Password must be between 6 and 20 digits");
      return;
    }
    const { data, error } = await supabase.rpc("app_login_v2", {
      in_mobileno: email.trim(),
      in_password: password.trim(),
      in_ipaddress: "127.0.0.1",
    });
    console.log()
    if (error) {
      alert(error);
    } else {
      console.log(data.applicationuserid);
      if (data.status == "0") {
        await AsyncStorage.setItem("userid", data.applicationuserid);
        router.replace("/(tabs)");
      }
      else {
        alert(data.message);
        // router.replace("/(tabs)");
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>UFGymBook</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>

        <TextInput
          style={styles.input}
          placeholder="Mobile No"
          value={email}
          onChangeText={(text) => setEmail(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          maxLength={10}
        />

        <View style={styles.passwordBox}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password (6-20 digits)"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => setPassword(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={20}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A1F44" },
  header: { height: 160, justifyContent: "center", alignItems: "center" },
  logo: { color: "#fff", fontSize: 28, fontWeight: "700" },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  input: {
    height: 50,
    backgroundColor: "#E9EEF4",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    color: "#000",
    placeholderTextColor: "#000",
  },
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9EEF4",
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
  },
  passwordInput: { flex: 1, color: "#000", placeholderTextColor: "#000" },
  loginBtn: {
    backgroundColor: "#0A1F44",
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
