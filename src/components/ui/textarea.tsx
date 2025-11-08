import * as React from "react";
const base = "w-full min-h-[100px] p-3 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400/40";
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} {...props} className={[base, className].filter(Boolean).join(" ")} />;
  }
);

