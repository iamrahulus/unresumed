import React from 'react';
export function Badge({children, variant, className}:{children:any,variant?:'outline'|'secondary',className?:string}){
  const cls = ['badge', variant==='outline'?'':'filled', className||''].join(' ');
  return <span className={cls}>{children}</span>;
}
