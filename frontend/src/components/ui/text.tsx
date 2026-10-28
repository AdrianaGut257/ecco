import { Text as RNText, TextProps } from "react-native";
import { typography, TypographyVariant } from "../../constants/typography";

interface Props extends TextProps {
  variant?: TypographyVariant;
  className?: string;
}

const HAS_COLOR = /(^|\s)text-(primary|secondary|tertiary|error|white|mood)/;
// Títulos y subtítulos en el café cálido del logo. Todos cuentan como texto grande para WCAG
// (≥ 24 px, o ≥ 18,7 px en negrita), que pide 3:1: este café da 4,1:1 o más en todos los fondos de la app.
const HEADING = /^(h\d|subtitle\d)$/;

export default function Text({
  variant = "body2",
  className = "",
  ...rest
}: Props) {
  const color = HAS_COLOR.test(className)
    ? ""
    : HEADING.test(variant)
      ? "text-primary-dark-hover"
      : "text-primary-dark-active";
  return (
    <RNText
      className={`${typography[variant]} ${color} ${className}`}
      {...rest}
    />
  );
}
