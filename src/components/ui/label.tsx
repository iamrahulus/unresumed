import React from 'react';
export function Label({children, htmlFor, className}:{children:any,htmlFor?:string,className?:string}){ return <label htmlFor={htmlFor} className={className}>{children}</label> }
