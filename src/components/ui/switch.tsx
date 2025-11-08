import * as React from "react";
export function Switch({ checked=false, onCheckedChange, id }:{checked?:boolean; onCheckedChange?:(v:boolean)=>void; id?:string}) {
  return (
    <button id={id} type="button"
      onClick={()=>onCheckedChange?.(!checked)}
      className={"relative inline-flex h-6 w-11 items-center rounded-full "+(checked?"bg-slate-900":"bg-slate-300")}>
      <span className={"inline-block h-4 w-4 transform rounded-full bg-white transition "+(checked?"translate-x-6":"translate-x-1")} />
    </button>
  );
}

