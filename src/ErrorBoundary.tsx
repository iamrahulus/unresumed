import React from 'react';

export class ErrorBoundary extends React.Component<{children: React.ReactNode}, {error: any}> {
  constructor(props:any){ super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error:any){ return { error }; }
  componentDidCatch(error:any, info:any){ console.error('Render error:', error, info); }
  render(){
    if(this.state.error){
      return (
        <div style={{padding:24, color:'#fff', background:'#111'}}>
          <h1>🚨 Render error</h1>
          <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.error?.stack || this.state.error)}</pre>
          <p>Open DevTools → Console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

