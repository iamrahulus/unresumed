import * as React from "react";
export function Checkbox({ checked=false, onCheckedChange }:{checked?:boolean; onCheckedChange?:(v:boolean)=>void}) {
  return <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400/40" checked={!!checked} onChange={e=>onCheckedChange?.(e.target.checked)} />;
}

