import React from 'react';
export function Switch({checked,onCheckedChange,id}:{checked:boolean,onCheckedChange:(v:boolean)=>void,id?:string}){
  return <input id={id} type='checkbox' className='checkbox' checked={checked} onChange={e=>onCheckedChange(e.target.checked)} />;
}
