import { Tabs } from "expo-router";
import { Text } from "react-native";

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  return (
    <Text style={{ fontSize: 20, opacity: color === "#2DC5A2" ? 1 : 0.4 }}>
      {emoji}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <Text
            style={{
              fontSize: 18,
              fontWeight: "900",
              letterSpacing: 2,
              color: "#2DC5A2",
            }}
          >
            ECCO
          </Text>
        ),
        headerLeft: () => (
          <Text style={{ fontSize: 20, marginLeft: 16 }}>☰</Text>
        ),
        tabBarActiveTintColor: "#2DC5A2",
        tabBarInactiveTintColor: "#AAA",
        tabBarStyle: { borderTopColor: "#F0F0F0" },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="intercambio"
        options={{
          title: "Intercambio",
          tabBarIcon: ({ color }) => <TabIcon emoji="🔄" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mundo"
        options={{
          title: "Mundo",
          tabBarIcon: ({ color }) => <TabIcon emoji="🌍" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabIcon emoji="⚙️" color={color} />,
        }}
      />
    </Tabs>
  );
}
