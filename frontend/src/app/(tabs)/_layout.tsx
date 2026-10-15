import { Redirect, Tabs } from "expo-router";
import TabBar from "../../components/navigation/tabBar";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Redirect href="/login" />;

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" options={{ title: "Inicio" }} />
      <Tabs.Screen name="garden" options={{ title: "Jardín" }} />
      <Tabs.Screen name="exchange" options={{ title: "Conversar" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
      <Tabs.Screen name="settings" options={{ title: "Ajustes" }} />
    </Tabs>
  );
}
