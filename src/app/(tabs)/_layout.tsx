import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#FDF6F2" },
        headerShadowVisible: false,
        headerTitle: () => (
          <Text className="font-heading-bold text-primaryNormalActive text-base tracking-[2px]">
            ECCO
          </Text>
        ),
        headerLeft: () => (
          <Pressable hitSlop={8} className="ml-4">
            <Ionicons name="menu-outline" size={24} color="#8E664B" />
          </Pressable>
        ),
        tabBarActiveTintColor: "#E8A77B",
        tabBarInactiveTintColor: "#ECB691",
        tabBarStyle: {
          borderTopColor: "#F6DBC9",
          backgroundColor: "#FDF6F2",
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter-Medium",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exchange"
        options={{
          title: "Intercambio",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "swap-horizontal" : "swap-horizontal-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
