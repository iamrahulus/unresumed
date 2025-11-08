import * as React from "react";
const cx = (...c:(string|false|undefined)[])=>c.filter(Boolean).join(" ");
export function Badge({ variant="outline", className, ...props }:{variant?: "outline"|"filled"} & React.HTMLAttributes<HTMLSpanElement>) {
  const v = variant==="filled"
    ? "bg-slate-900 text-white"
    : "border border-slate-300 text-slate-700";
  return <span {...props} className={cx("inline-flex items-center rounded-full text-xs px-2 py-0.5", v, className)} />;
}

