import { Redirect } from "expo-router";
import { homeFor } from "../features/auth/homeFor";
import IntroScreen from "../features/auth/screens/introScreen";
import { sessionStore } from "../store/session";

export default function Index() {
  const { user } = sessionStore.use();

  if (user) {
    return <Redirect href={homeFor(user)} />;
  }
  return <IntroScreen />;
}
