import React from 'react';
export function Card({children, className}:{children:any,className?:string}){return <div className={`card ${className||''}`}>{children}</div>}
export function CardHeader({children, className}:{children:any,className?:string}){return <header className={className}>{children}</header>}
export function CardTitle({children, className}:{children:any,className?:string}){return <div className={`title ${className||''}`}>{children}</div>}
export function CardDescription({children, className}:{children:any,className?:string}){return <div className={`desc ${className||''}`}>{children}</div>}
export function CardContent({children, className}:{children:any,className?:string}){return <div className={`content ${className||''}`}>{children}</div>}
