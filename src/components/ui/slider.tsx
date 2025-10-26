import React from 'react';
export function Slider({value,onValueChange,step=5,min=0,max=100}:{value:number[],onValueChange:(v:number[])=>void,step?:number,min?:number,max?:number}){
  const v = value[0]||0;
  return <input className='range' type='range' min={min} max={max} step={step} value={v} onChange={e=>onValueChange([Number(e.target.value)])}/>;
}
