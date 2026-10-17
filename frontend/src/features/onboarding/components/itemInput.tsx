import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import IconButton from "../../../components/ui/iconButton";
import Text from "../../../components/ui/text";
import { colors } from "../../../constants/colors";
import { suggestionService } from "../../../services/suggestionService";
import type { Suggestion } from "../../../types";

const DEBOUNCE_MS = 350;
const MIN_CHARS = 2;
const MAX_LENGTH = 80;

interface Props {
  interest: string;
  placeholder: string;
  label: string;
  existing: string[];
  onAdd: (item: string) => void;
}

const same = (a: string, b: string) =>
  a.localeCompare(b, "es", { sensitivity: "base" }) === 0;

export default function ItemInput({
  interest,
  placeholder,
  label,
  existing,
  onAdd,
}: Props) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const request = useRef(0);

  useEffect(() => {
    const query = text.trim();
    const id = ++request.current;
    if (query.length < MIN_CHARS) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const found = await suggestionService.search(query, interest);
        if (id === request.current) setSuggestions(found);
      } catch {
        if (id === request.current) setSuggestions([]);
      } finally {
        if (id === request.current) setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text, interest]);

  const add = (value: string) => {
    const item = value.trim().slice(0, MAX_LENGTH);
    if (!item) return;
    if (!existing.some((e) => same(e, item))) onAdd(item);
    setText("");
    setSuggestions([]);
  };

  const visible = suggestions.filter((s) => !existing.some((e) => same(e, s.name)));
  const showList = focused && text.trim().length >= MIN_CHARS && (loading || visible.length > 0);

  return (
    <View>
      <View className="flex-row items-center gap-2">
        <View
          className={`min-h-[44px] flex-1 flex-row items-center rounded-field border bg-white px-3 ${
            focused ? "border-primary-dark-hover" : "border-primary-normal"
          }`}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onSubmitEditing={() => add(text)}
            placeholder={placeholder}
            placeholderTextColor={colors.primary["dark-hover"]}
            maxLength={MAX_LENGTH}
            returnKeyType="done"
            accessibilityLabel={label}
            className="flex-1 py-2.5 font-body text-body3 text-primary-dark-active"
            style={{ outlineStyle: "none" } as object}
          />
          {loading && (
            <ActivityIndicator size="small" color={colors.primary["dark-hover"]} />
          )}
        </View>
        <IconButton
          icon="add"
          label={`Agregar a ${label}`}
          variant="outlined"
          size={40}
          disabled={!text.trim()}
          onPress={() => add(text)}
        />
      </View>

      {showList && (
        <View
          accessibilityRole="list"
          className="mt-1.5 overflow-hidden rounded-field border border-primary-light-active bg-white"
        >
          {visible.map((s, i) => (
            <Pressable
              key={`${s.name}-${i}`}
              onPress={() => add(s.name)}
              accessibilityRole="button"
              accessibilityLabel={`Agregar ${s.name}`}
              className={`min-h-[44px] flex-row items-center gap-2.5 px-3 py-2 active:bg-primary-light-active ${
                i > 0 ? "border-t border-primary-light-active" : ""
              }`}
            >
              <Ionicons name="add-circle-outline" size={18} color={colors.secondary["dark-hover"]} />
              <View className="flex-1">
                <Text variant="body3" className="text-primary-dark-active">
                  {s.name}
                </Text>
                {s.description && (
                  <Text variant="caption2" className="text-primary-dark-hover">
                    {s.description}
                  </Text>
                )}
              </View>
            </Pressable>
          ))}
          {visible.length > 0 && (
            <Text variant="caption3" className="px-3 pb-1.5 pt-1 text-right text-primary-dark-hover">
              Sugerencias de Google
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
