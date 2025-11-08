import * as React from "react";
const cx = (...c:(string|false|undefined)[])=>c.filter(Boolean).join(" ");

type Ctx = { value:string; setValue:(v:string)=>void };
const TabsCtx = React.createContext<Ctx|null>(null);

export function Tabs({ defaultValue, children, className }:{ defaultValue:string; children:React.ReactNode; className?:string }) {
  const [value, setValue] = React.useState(defaultValue);
  return <div className={className}><TabsCtx.Provider value={{value,setValue}}>{children}</TabsCtx.Provider></div>;
}
export function TabsList({ children, className }:{children:React.ReactNode; className?:string}) {
  return <div className={cx("inline-flex rounded-xl bg-slate-100 p-1", className)}>{children}</div>;
}
export function TabsTrigger({ value, children }:{value:string; children:React.ReactNode}) {
  const ctx = React.useContext(TabsCtx)!; const active = ctx.value === value;
  return (
    <button type="button"
      onClick={()=>ctx.setValue(value)}
      className={cx("px-3 py-1.5 text-sm rounded-lg", active ? "bg-white shadow-soft" : "text-slate-600 hover:text-slate-900")}>
      {children}
    </button>
  );
}
export function TabsContent({ value, children, className }:{value:string; children:React.ReactNode; className?:string}) {
  const ctx = React.useContext(TabsCtx)!;
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}

