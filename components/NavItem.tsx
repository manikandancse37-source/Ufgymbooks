import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

type Props = {
  icon: string;
  label: string;
  active?: boolean;
  href: string;
};

export default function NavItem({ icon, label, active, href }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(href)}
      style={{ alignItems: "center" }}
    >
      <Ionicons
        name={icon as any}
        size={24}
        color={active ? "#6C5CE7" : "#9CA3AF"}
      />
      <Text
        style={{
          fontSize: 12,
          marginTop: 4,
          color: active ? "#6C5CE7" : "#9CA3AF",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
