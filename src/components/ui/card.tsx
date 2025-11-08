import * as React from "react";

const cx = (...c: (string|false|undefined)[]) => c.filter(Boolean).join(" ");

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx("bg-white rounded-2xl shadow-soft border border-slate-200", className)} />;
}
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx("px-5 py-4", className)} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} className={cx("text-lg font-semibold tracking-tight", className)} />;
}
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx("text-sm text-slate-600", className)} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx("px-5 pb-5 space-y-3", className)} />;
}
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx("px-5 pt-0 pb-5", className)} />;
}

