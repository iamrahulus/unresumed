import React, { useState } from 'react';
export function Tabs({defaultValue, children, className}:{defaultValue:string,children:any,className?:string}){
  const [value,setValue] = useState(defaultValue);
  return <div className={className}>
    {React.Children.map(children,(child:any)=>React.cloneElement(child,{value,setValue,current:value}))}
  </div>;
}
export function TabsList({children, className}:{children:any,className?:string}){ return <div className={`tabs ${className||''}`}>{children}</div> }
export function TabsTrigger({value, children, current, setValue}:{value:string,children:any,current?:string,setValue?:(v:string)=>void}){
  const active = current===value; return <button className={`tab ${active?'active':''}`} onClick={()=>setValue&&setValue(value)}>{children}</button>;
}
export function TabsContent({value, current, children, className}:{value:string,current?:string,children:any,className?:string}){
  if(current!==value) return null; return <div className={className}>{children}</div>;
}
