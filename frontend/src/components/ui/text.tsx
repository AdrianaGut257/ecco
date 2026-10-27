import { Text as RNText, TextProps } from "react-native";
import { typography, TypographyVariant } from "../../constants/typography";

interface Props extends TextProps {
  variant?: TypographyVariant;
  className?: string;
}

const HAS_COLOR = /(^|\s)text-(primary|secondary|tertiary|error|white|mood)/;
// Los títulos usan el café más oscuro: con más contraste, el bold se percibe con más peso.
const HEADING = /^(h\d|subtitle\d)$/;

export default function Text({
  variant = "body2",
  className = "",
  ...rest
}: Props) {
  const color = HAS_COLOR.test(className)
    ? ""
    : HEADING.test(variant)
      ? "text-primary-darker"
      : "text-primary-dark-active";
  return (
    <RNText
      className={`${typography[variant]} ${color} ${className}`}
      {...rest}
    />
  );
}
