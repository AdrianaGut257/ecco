import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Container from "../../../components/layout/container";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import TermsList from "../components/termsList";

export default function TermsScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [accepted, setAccepted] = useState(false);

  return (
    <Container
      footer={
        <Button disabled={!accepted} onPress={onComplete}>
          Continuar
        </Button>
      }
    >
      <View className="mb-4 items-center">
        <Ionicons
          name="shield-checkmark"
          size={56}
          color={colors.secondary["dark-hover"]}
        />
        <Text
          variant="h3"
          className="mt-2 text-center text-primary-dark-active"
        >
          Un lugar seguro
        </Text>
        <Text
          variant="body3"
          className="mt-1 text-center text-primary-dark-hover"
        >
          Estos son nuestros acuerdos. Léelos con calma.
        </Text>
      </View>

      <ScrollView className="mb-4 flex-1 rounded-card border border-primary-light-active bg-white p-4">
        <TermsList />
      </ScrollView>

      <Pressable
        onPress={() => setAccepted((v) => !v)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: accepted }}
        className="min-h-[44px] flex-row items-center"
      >
        <View
          className={`mr-3 h-6 w-6 items-center justify-center rounded-md border-2 ${
            accepted
              ? "border-primary-dark-hover bg-primary-dark-hover"
              : "border-primary-dark-hover bg-white"
          }`}
        >
          {accepted && (
            <Ionicons name="checkmark" size={16} color={colors.white} />
          )}
        </View>
        <Text variant="caption1" className="flex-1 text-primary-dark-active">
          Acepto estos acuerdos, los Términos y la Política de Privacidad.
        </Text>
      </Pressable>
    </Container>
  );
}
