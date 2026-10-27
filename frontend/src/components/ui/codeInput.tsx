import { useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import Text from "./text";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean;
  length?: number;
}

// Un solo campo invisible con casillas encima: permite pegar el código y autocompletarlo desde el SMS/correo.
export default function CodeInput({
  value,
  onChange,
  onComplete,
  error = false,
  length = 6,
}: Props) {
  const ref = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      onPress={() => ref.current?.focus()}
      accessible={false}
      className="w-full"
    >
      <View className="flex-row justify-between gap-2">
        {Array.from({ length }, (_, i) => {
          const char = value[i] ?? "";
          const active = focused && i === Math.min(value.length, length - 1);
          return (
            <View
              key={i}
              className={`h-14 flex-1 items-center justify-center rounded-field border-2 bg-white ${
                error
                  ? "border-error-normal"
                  : active
                    ? "border-primary-normal-active"
                    : char
                      ? "border-primary-normal"
                      : "border-primary-light-active"
              }`}
            >
              <Text variant="h4" className="text-primary-darker">
                {char}
              </Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(text) => {
          const digits = text.replace(/\D/g, "").slice(0, length);
          onChange(digits);
          if (digits.length === length) onComplete?.(digits);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        autoFocus
        accessibilityLabel={`Código de ${length} números`}
        caretHidden
        className="absolute inset-0 opacity-0"
        style={{ outlineStyle: "none" } as object}
      />
    </Pressable>
  );
}
