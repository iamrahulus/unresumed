import React from 'react';
export function Button({children, onClick, variant, size, className}:{children:any,onClick?:()=>void,variant?:'secondary'|'outline'|'ghost',size?:'sm'|'xs',className?:string}){
  const cls = ['btn', variant==='secondary'?'secondary':'', className||''].join(' ');
  return <button className={cls} onClick={onClick}>{children}</button>;
}
