import { Text as RNText, TextProps } from "react-native";
import { typography, TypographyVariant } from "../../constants/typography";

interface Props extends TextProps {
  variant?: TypographyVariant;
  className?: string;
}

const HAS_COLOR = /(^|\s)text-(primary|secondary|tertiary|error|white|mood)/;

export default function Text({
  variant = "body2",
  className = "",
  ...rest
}: Props) {
  const color = HAS_COLOR.test(className) ? "" : "text-primary-dark-active";
  return (
    <RNText
      className={`${typography[variant]} ${color} ${className}`}
      {...rest}
    />
  );
}
