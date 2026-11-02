import { ReactNode, CSSProperties } from "react";

export interface CardSwapProps {
  items?: {
    title?: string;
    image?: string;
    alt?: string;
    icon?: ReactNode;
  }[];

  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  depth?: number;
  skewAmount?: number;
  visibleCards?: number;
  delay?: number;
  autoplay?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  speed?: number;
  bounce?: number;
  parallax?: number;
  hoverSpread?: number;
  dim?: number;
  cardRadius?: number;
  intro?: boolean;
  theme?: "dark" | "light";
  onCardClick?: (index: number) => void;
  onChange?: (index: number) => void;
  className?: string;
  children?: ReactNode;
}

declare const CardSwap: React.ForwardRefExoticComponent<
  CardSwapProps & React.RefAttributes<any>
>;

export declare const Card: React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & {
    customClass?: string;
    children?: ReactNode;
  } & React.RefAttributes<HTMLDivElement>
>;

export default CardSwap;