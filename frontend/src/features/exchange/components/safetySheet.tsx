import { useState } from "react";
import { TextInput, View } from "react-native";
import Banner from "../../../components/ui/banner";
import Button from "../../../components/ui/button";
import Chip from "../../../components/ui/chip";
import Sheet from "../../../components/ui/sheet";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { friendlyError } from "../../../services/api";
import { matchService } from "../../../services/matchService";
import type { ReportReason } from "../../../types";

const REASONS: { id: ReportReason; label: string }[] = [
  { id: "incomodo", label: "Me hizo sentir incómodo/a" },
  { id: "ofensivo", label: "Contenido ofensivo" },
  { id: "acoso", label: "Acoso o presión" },
  { id: "spam", label: "Spam o publicidad" },
  { id: "otro", label: "Otro motivo" },
];

interface Props {
  visible: boolean;
  matchId: string;
  partnerName: string;
  onClose: () => void;
  onEnded: () => void;
}

export default function SafetySheet({
  visible,
  matchId,
  partnerName,
  onClose,
  onEnded,
}: Props) {
  const [mode, setMode] = useState<"menu" | "report" | "leave">("menu");
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    setMode("menu");
    setReason(null);
    setNote("");
    setError(null);
    onClose();
  };

  const end = async (withReason?: ReportReason) => {
    setLoading(true);
    setError(null);
    try {
      await matchService.end(matchId, withReason, note.trim() || undefined);
      close();
      onEnded();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  if (mode === "report") {
    return (
      <Sheet
        visible={visible}
        title="Reportar la conversación"
        message="Gracias por avisarnos. La conversación se cerrará y no volverán a coincidir."
        onClose={close}
      >
        <View className="mb-4 flex-row flex-wrap gap-2">
          {REASONS.map((r) => (
            <Chip
              key={r.id}
              label={r.label}
              selected={reason === r.id}
              onPress={() => setReason(r.id)}
            />
          ))}
        </View>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Si quieres, cuéntanos qué pasó (opcional)"
          placeholderTextColor={colors.primary["dark-hover"]}
          maxLength={500}
          multiline
          accessibilityLabel="Comentario opcional"
          className="mb-4 min-h-[72px] rounded-field border border-primary-light-active bg-white px-4 py-3 font-body text-body3 text-primary-dark-active"
          style={{ outlineStyle: "none", textAlignVertical: "top" } as object}
        />
        {error && <Banner tone="error" message={error} className="mb-3" />}
        <View className="gap-3">
          <Button
            color="error"
            disabled={!reason}
            loading={loading}
            onPress={() => reason && end(reason)}
          >
            Reportar y salir
          </Button>
          <Button variant="outlined" onPress={() => setMode("menu")}>
            Volver
          </Button>
        </View>
      </Sheet>
    );
  }

  if (mode === "leave") {
    return (
      <Sheet
        visible={visible}
        title={`¿Salir de la conversación con ${partnerName}?`}
        message="La conversación se cerrará para ambos y no volverán a coincidir. No le diremos por qué."
        onClose={close}
      >
        {error && <Banner tone="error" message={error} className="mb-3" />}
        <View className="gap-3">
          <Button color="error" loading={loading} onPress={() => end()}>
            Sí, salir
          </Button>
          <Button variant="outlined" onPress={() => setMode("menu")}>
            Quedarme
          </Button>
        </View>
      </Sheet>
    );
  }

  return (
    <Sheet
      visible={visible}
      title="Tu bienestar es primero"
      message="Si algo no se siente bien, puedes cerrar esta conversación cuando quieras."
      onClose={close}
    >
      <View className="gap-3">
        <Button variant="outlined" icon="exit-outline" iconPosition="left" onPress={() => setMode("leave")}>
          Salir de la conversación
        </Button>
        <Button
          variant="outlined"
          color="error"
          icon="flag-outline"
          iconPosition="left"
          onPress={() => setMode("report")}
        >
          Reportar algo que pasó
        </Button>
        <Text variant="caption1" className="mt-1 text-center text-primary-dark-hover">
          ECCO no reemplaza la ayuda profesional. Si lo necesitas, busca a
          alguien de confianza.
        </Text>
      </View>
    </Sheet>
  );
}
