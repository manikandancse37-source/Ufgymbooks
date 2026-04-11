import {
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import {
    FileText,
    Plus,
    Receipt,
    UserPlus,
    Users,
} from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function BottomSheetWithFAB() {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["70%"], []);
  const [webVisible, setWebVisible] = useState(false);
  const router = useRouter();

  const openSheet = useCallback(() => {
    if (Platform.OS === "web") {
      setWebVisible(true);
    } else {
      sheetRef.current?.present();
    }
  }, []);

  const closeSheet = () => {
    if (Platform.OS === "web") {
      setWebVisible(false);
    } else {
      sheetRef.current?.dismiss();
    }   
  };

  const navigate = (path: string) => {
    closeSheet();
    router.push(path);
  };

  return (
    <>
      {/* FAB */}
      <View style={styles.fabWrapper}> 
        <TouchableOpacity style={styles.fab} onPress={openSheet}>
          <Plus size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* MOBILE */}
      {Platform.OS !== "web" && (
        <BottomSheetModal
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose
        >
          <BottomSheetView style={{ flex: 1, borderTopLeftRadius: 32, borderTopRightRadius: 32, backgroundColor: '#fff', overflow: 'hidden' }}>
            <View style={styles.dragIndicatorWrapper}>
              <View style={styles.dragIndicator} />
            </View>
            <View style={styles.container}>
              <Text style={styles.title}>+ Add New</Text>
              {/* 2x2 Grid */}
              <View style={styles.grid2x2}>
                <MenuItem icon={<Users size={28} />} label="Member" onPress={() => navigate("/(tabs)/addMember")} />
                <MenuItem icon={<UserPlus size={28} />} label="Staff" onPress={() => navigate("/(tabs)/AddStaffScreen")} />
                <MenuItem icon={<FileText size={28} />} label="Plan" onPress={() => navigate("/(tabs)/NewPlan")} />
                <MenuItem icon={<Receipt size={28} />} label="Leads" onPress={() => navigate("/(tabs)/Leeds")} />
              </View>
              <Text style={styles.section}>Other Actions</Text>
              <View style={styles.actionCard}>
                <ActionItem label="Manage Staff" onPress={() => navigate("/(tabs)/ManageStaff")} />
                <ActionItem label="Manage Plans" onPress={() => navigate("/(tabs)/ManagePlans")} />
                <ActionItem label="View All Leads" onPress={() => navigate("/(tabs)/PotentialLeads")} />
                <ActionItem label="Manage Expenses" onPress={() => navigate("/(tabs)/ExpensesScreen")} />
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      )}

      {/* WEB */}
      {Platform.OS === "web" && (
        <Modal visible={webVisible} transparent animationType="slide">
          <View style={styles.overlay} />
          <View style={styles.webSheet}>
            <View style={styles.container}>
                 <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.grid}
                >
                  <MenuItem icon={<Users size={22} />} label="Member" onPress={() => navigate("/(tabs)/addMember")} />
                  <MenuItem icon={<UserPlus size={22} />} label="Staff" onPress={() => navigate("/(tabs)/AddStaffScreen")} />
                  <MenuItem icon={<FileText size={22} />} label="Plan" onPress={() => navigate("/(tabs)/NewPlan")} />
                  <MenuItem icon={<Receipt size={22} />} label="Leads" onPress={() => navigate("/(tabs)/Leeds")} />
                  <MenuItem icon={<Receipt size={22} />} label="Expense" onPress={() => navigate("/(tabs)/CreateExpenseScreen")} />
                </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

/* ================= MENU ITEMS ================= */

const MenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    {icon}
    <Text style={styles.menuText}>{label}</Text>
  </TouchableOpacity>
);

const ActionItem = ({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <Text style={styles.actionText}>{label}</Text>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  fabWrapper: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    zIndex: 9999,
    elevation: 30,
  },

  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0A1E5C",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 16,
  },

  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 0,
  },
  menuItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 22,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  dragIndicatorWrapper: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  dragIndicator: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },

  menuText: {
    marginTop: 8,
    fontSize: 13,
  },

  section: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },

  actionCard: {
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    paddingHorizontal: 16,
  },

  actionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  actionText: {
    fontSize: 15,
  },

  arrow: {
    fontSize: 20,
    color: "#9CA3AF",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  webSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
});