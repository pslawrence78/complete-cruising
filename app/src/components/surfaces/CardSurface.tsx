import type { ElementType, HTMLAttributes, ReactNode } from "react";

interface CardSurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children: ReactNode;
  variant?: "glass" | "paper";
}

export function CardSurface({
  as: Component = "div",
  children,
  className = "",
  variant = "glass",
  ...rest
}: CardSurfaceProps) {
  return (
    <Component
      className={`card-surface card-surface--${variant} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Component>
  );
}
