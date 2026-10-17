import { Redirect } from "expo-router";
import IntroScreen from "../features/auth/screens/introScreen";
import { sessionStore } from "../store/session";

export default function Index() {
  const { user } = sessionStore.use();

  if (user) {
    return <Redirect href={user.onboarded ? "/(tabs)/home" : "/onboarding"} />;
  }
  return <IntroScreen />;
}
