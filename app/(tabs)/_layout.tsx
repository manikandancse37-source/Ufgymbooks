import BottomNav from "@/components/BottomNav";
import { Tabs, usePathname } from "expo-router";
import React from "react";
import { SafeAreaView, View } from "react-native";

export default function TabLayout() {
  const pathname = usePathname();

  // routes where footer should be hidden
  const hideFooterRoutes = [
    "/(tabs)/AddStaffScreen",
    "/(tabs)/NewPlan",
    "/(tabs)/CreateExpenseScreen",
    "/(tabs)/addMember",
  ];

  const shouldHideFooter = hideFooterRoutes.includes(pathname);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Tabs Screens */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" }, // hide default tab bar
        }}
      />

      {!shouldHideFooter && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            zIndex: 1,  
            elevation: 1, 
          }}
        >
          <BottomNav />
        </View>
      )}
    </SafeAreaView>
  );
}