import React from 'react';
export function Checkbox({checked,onCheckedChange}:{checked:boolean,onCheckedChange:(v:boolean)=>void}){
  return <input type='checkbox' className='checkbox' checked={checked} onChange={e=>onCheckedChange(e.target.checked)} />;
}
