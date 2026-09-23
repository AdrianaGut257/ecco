import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Button from "../../../components/ui/Button";

export default function TermsScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [accepted, setAccepted] = useState(false);

  return (
    <View className="flex-1 bg-primaryClear px-8 pt-16 pb-8">
      <View className="items-center mb-4">
        <View className="w-20 h-20 rounded-full bg-secondaryClear items-center justify-center mb-4">
          <Ionicons name="shield-checkmark" size={44} color="#9CAF88" />
        </View>
        <Text className="font-heading-bold text-h2 text-primaryNormalActive text-center">
          Antes de empezar
        </Text>
        <Text className="font-body text-sm text-primaryNormalHover text-center mt-1">
          Lee y acepta nuestros términos para continuar.
        </Text>
      </View>

      <ScrollView className="flex-1 bg-white rounded-card border border-primaryLight p-5 mb-6">
        <Text className="font-body text-sm text-primaryNormalActive leading-6">
          ECCO conecta a dos personas para una conversación de 7 días.{"\n\n"}
          Debes tener 18 años o más, dar información veraz y respetar las normas
          de convivencia: no acoso, no contenido ofensivo, no suplantación de
          identidad.{"\n\n"}
          Tu voto de reencuentro y tu calificación de confianza son siempre
          privados. No verificamos antecedentes de las personas usuarias, así
          que cuida tu seguridad si decides encontrarte fuera de la app.{"\n\n"}
          Puedes reportar o bloquear a cualquier persona en cualquier momento.
        </Text>
      </ScrollView>

      <Pressable
        onPress={() => setAccepted((v) => !v)}
        className="flex-row items-center mb-6"
      >
        <View
          className={`w-5 h-5 rounded mr-3 items-center justify-center border ${
            accepted
              ? "bg-primaryNormal border-primaryNormal"
              : "border-primaryLightActive bg-white"
          }`}
        >
          {accepted && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </View>
        <Text className="font-body text-sm text-primaryNormalActive flex-1">
          Acepto los Términos y Condiciones y la Política de Privacidad.
        </Text>
      </Pressable>

      <Button variant="primary" onPress={onComplete} disabled={!accepted}>
        Continuar
      </Button>
    </View>
  );
}
