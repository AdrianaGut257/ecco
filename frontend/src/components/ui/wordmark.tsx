import { TypographyVariant } from "../../constants/typography";
import Text from "./text";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const VARIANTS: Record<NonNullable<Props["size"]>, TypographyVariant> = {
  sm: "subtitle2",
  md: "h4",
  lg: "h2",
};

export default function Wordmark({ className = "", size = "md" }: Props) {
  return (
    <Text
      accessibilityRole="header"
      variant={VARIANTS[size]}
      className={`tracking-[3px] ${className || "text-primary-dark-hover"}`}
    >
      ECHOOM
    </Text>
  );
}
