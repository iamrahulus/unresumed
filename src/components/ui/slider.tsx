import * as React from "react";
export function Slider({ value=[0], onValueChange, step=1, min=0, max=100 }:{
  value:number[]; onValueChange:(v:number[])=>void; step?:number; min?:number; max?:number;
}) {
  const v = value[0] ?? 0;
  return (
    <input type="range" value={v} min={min} max={max} step={step}
      onChange={(e)=>onValueChange([Number(e.target.value)])}
      className="w-full accent-slate-900" />
  );
}

