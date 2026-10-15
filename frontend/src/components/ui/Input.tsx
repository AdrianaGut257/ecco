import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";
import { colors } from "../../constants/colors";
import type { IconName } from "./button";
import Text from "./text";

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  secure?: boolean;
  rightIcon?: IconName;
  className?: string;
}

const Input = forwardRef<TextInput, Props>(function Input(
  {
    label,
    error,
    hint,
    secure,
    rightIcon,
    className = "",
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);

  const border = error
    ? "border-error-normal"
    : focused
      ? "border-primary-normal-active"
      : "border-primary-light-active";

  return (
    <View className={className}>
      {label && (
        <Text
          variant="caption1"
          className="text-primary-dark-hover mb-1.5 ml-1"
        >
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center rounded-field border bg-white px-4 ${border}`}
      >
        <TextInput
          ref={ref}
          secureTextEntry={secure && hidden}
          placeholderTextColor={colors.primary["normal-hover"]}
          accessibilityLabel={label}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className="flex-1 py-3 font-body text-body2 text-primary-dark-active"
          style={{ outlineStyle: "none" } as object}
          {...rest}
        />
        {secure ? (
          <Pressable
            onPress={() => setHidden((v) => !v)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              hidden ? "Mostrar contraseña" : "Ocultar contraseña"
            }
          >
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.primary["normal-hover"]}
            />
          </Pressable>
        ) : (
          rightIcon && (
            <Ionicons
              name={rightIcon}
              size={20}
              color={colors.primary["normal-hover"]}
            />
          )
        )}
      </View>
      {error ? (
        <Text
          variant="caption1"
          className="text-error-normal-active mt-1.5 ml-1"
        >
          {error}
        </Text>
      ) : (
        hint && (
          <Text
            variant="caption1"
            className="text-primary-dark-hover mt-1.5 ml-1"
          >
            {hint}
          </Text>
        )
      )}
    </View>
  );
});

export default Input;
