import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const CalculatorIcon = (props: IconProps) => <svg {...base} {...props}><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6.5h8M8 11h1M12 11h1M16 11h.01M8 15h1M12 15h1M16 15h.01M8 18.5h1M12 18.5h4"/></svg>;
export const PiggyIcon = (props: IconProps) => <svg {...base} {...props}><path d="M5 10a7 7 0 0 1 12.6-3.9L21 7.5v5l-2.4.8A7 7 0 0 1 16 16.8V21h-3v-2H9v2H6v-3.2A7 7 0 0 1 5 10Z"/><path d="M8.5 8.5h4M18 9h.01"/></svg>;
export const BankIcon = (props: IconProps) => <svg {...base} {...props}><path d="M3 9h18M5 9v9M9 9v9M15 9v9M19 9v9M3 18h18M2 21h20M12 3 2.5 7h19L12 3Z"/></svg>;
export const FileIcon = (props: IconProps) => <svg {...base} {...props}><path d="M6 2.5h8l4 4V21H6z"/><path d="M14 2.5V7h4M9 11h6M9 15h6M9 18h4"/></svg>;
export const StampIcon = (props: IconProps) => <svg {...base} {...props}><path d="M8 11h8l1.7 4.5H6.3L8 11Z"/><path d="M10 11V8a2 2 0 0 1 4 0v3M5 18h14M4 21h16"/></svg>;
export const FolderIcon = (props: IconProps) => <svg {...base} {...props}><path d="M3 6h6l2 2h10v11H3z"/><path d="m15 14 2 2 4-4"/></svg>;
export const HouseIcon = (props: IconProps) => <svg {...base} {...props}><path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7"/><path d="m17.5 7.5 2-2"/></svg>;
export const ChecklistIcon = (props: IconProps) => <svg {...base} {...props}><rect x="5" y="3" width="14" height="18" rx="2"/><path d="m8 8 1 1 2-2M13 8h3M8 13l1 1 2-2M13 13h3M8 18h8"/></svg>;
export const ShieldIcon = (props: IconProps) => <svg {...base} {...props}><path d="M12 2.5 19 5v6c0 4.5-2.8 8.1-7 10.5C7.8 19.1 5 15.5 5 11V5l7-2.5Z"/><path d="m9 12 2 2 4-5"/></svg>;
export const BoltIcon = (props: IconProps) => <svg {...base} {...props}><path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/></svg>;
export const ArrowIcon = (props: IconProps) => <svg {...base} {...props}><path d="M5 12h14M14 7l5 5-5 5"/></svg>;
