import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Container from "../../../components/layout/container";
import BackButton from "../../../components/ui/backButton";
import Button from "../../../components/ui/button";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";

const SECTIONS = [
  {
    title: "Cómo funciona ECCO",
    points: [
      "Te presentamos a una persona cada semana, según lo que les gusta a las dos.",
      "Tienen 7 días para conversar y conocerse con calma.",
      "Al final, cada quien decide en privado si quiere seguir en contacto.",
    ],
  },
  {
    title: "Para cuidarnos entre todas las personas",
    points: [
      "Debes tener 18 años o más y ser tú.",
      "Tratamos a los demás con respeto: sin acoso ni contenido ofensivo.",
      "Puedes reportar o bloquear a quien quieras, cuando quieras.",
    ],
  },
  {
    title: "Tu privacidad",
    points: [
      "Tu decisión final y tus valoraciones son siempre privadas.",
      "No verificamos antecedentes, así que cuida tu seguridad si deciden encontrarse fuera de la app.",
    ],
  },
];

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
      <BackButton className="mb-4" fallbackRoute="/register" />
      <View className="mb-4 items-center">
        <Ionicons
          name="shield-checkmark"
          size={56}
          color={colors.secondary.normal}
        />
        <Text
          variant="h3"
          className="mt-2 text-center text-primary-dark-active"
        >
          Antes de empezar
        </Text>
        <Text
          variant="body3"
          className="mt-1 text-center text-primary-dark-hover"
        >
          Lee con calma y acepta para continuar.
        </Text>
      </View>

      <ScrollView className="mb-4 flex-1 rounded-card border border-primary-light-active bg-white p-4">
        {SECTIONS.map((section) => (
          <View key={section.title} className="mb-4">
            <Text variant="body3" className="mb-1.5 text-primary-normal-active">
              {section.title}
            </Text>
            {section.points.map((point) => (
              <Text
                key={point}
                variant="caption1"
                className="mb-1 text-primary-dark-hover"
              >
                {`•  ${point}`}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>

      <Pressable
        onPress={() => setAccepted((v) => !v)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: accepted }}
        className="flex-row items-center"
      >
        <View
          className={`mr-3 h-5 w-5 items-center justify-center rounded border ${
            accepted
              ? "border-primary-normal bg-primary-normal"
              : "border-primary-normal bg-white"
          }`}
        >
          {accepted && (
            <Ionicons name="checkmark" size={14} color={colors.white} />
          )}
        </View>
        <Text variant="caption1" className="flex-1 text-primary-dark-hover">
          Acepto los Términos y Condiciones y la Política de Privacidad.
        </Text>
      </Pressable>
    </Container>
  );
}
