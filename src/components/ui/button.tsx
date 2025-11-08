import * as React from "react";
const cx = (...c:(string|false|undefined)[])=>c.filter(Boolean).join(" ");

type Variant = "default" | "secondary" | "outline" | "ghost";
type Size = "sm"|"md";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant; size?: Size;
}
export function Button({ variant="default", size="md", className, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-400/40 disabled:opacity-60";
  const sizes = size==="sm" ? "h-8 px-3" : "h-10 px-4";
  const variants = {
    default:  "bg-slate-900 text-white border-slate-900 hover:bg-slate-800",
    secondary:"bg-slate-100 text-slate-900 border-slate-200 hover:bg-slate-200",
    outline:  "bg-white text-slate-900 border-slate-300 hover:bg-slate-50",
    ghost:    "bg-transparent text-slate-900 border-transparent hover:bg-slate-100"
  }[variant];
  return <button {...props} className={cx(base, sizes, variants, className)} />;
}

