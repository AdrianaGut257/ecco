import { View } from "react-native";
import Text from "../../../components/ui/text";
import { TERMS_SECTIONS } from "../terms";

export default function TermsList() {
  return (
    <>
      {TERMS_SECTIONS.map((section) => (
        <View key={section.title} className="mb-4">
          <Text variant="body3" className="mb-1.5 text-primary-dark-active">
            {section.title}
          </Text>
          {section.points.map((point) => (
            <Text
              key={point}
              variant="caption1"
              className="mb-1.5 text-primary-dark-hover"
            >
              {`•  ${point}`}
            </Text>
          ))}
        </View>
      ))}
    </>
  );
}
