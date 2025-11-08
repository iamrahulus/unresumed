import * as React from "react";
export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={["text-sm font-medium text-slate-700", props.className].filter(Boolean).join(" ")} />;
}

