import React from 'react'

const Row: React.FC<{label:string}> = ({label, children}) => (
  <div style={{display:'flex', gap:12, marginBottom:12}}>
    <div style={{width:180, color:'#555'}}>{label}</div>
    <div style={{flex:1}}>{children}</div>
  </div>
)

const CandidatePage: React.FC = () => {
  return (
    <div style={{maxWidth:900}}>
      <h2>My Presence & Visibility</h2>
      <Row label="LinkedIn">
        <input placeholder="https://www.linkedin.com/in/..." style={{width:'100%'}} />
      </Row>
      <Row label="GitHub">
        <input placeholder="https://github.com/your-handle" style={{width:'100%'}} />
      </Row>
      <Row label="Blog / Portfolio">
        <input placeholder="https://yourblog.example.com" style={{width:'100%'}} />
      </Row>
      <Row label="Topics">
        <input placeholder="java, spring, kubernetes, aws" style={{width:'100%'}} />
      </Row>
      <Row label="Visibility">
        <label><input type="checkbox" defaultChecked /> Show GitHub</label>{' '}
        <label><input type="checkbox" defaultChecked /> Show Blog</label>{' '}
        <label><input type="checkbox" defaultChecked /> Show Talks</label>
      </Row>
      <h3>How to improve my ranking</h3>
      <ul>
        <li>Increase commits over the next 90 days (consistent activity matters).</li>
        <li>Write a post summarizing a recent project (helps blogging signal).</li>
        <li>Contribute PRs to Spring ecosystem; target higher merge rate.</li>
        <li>Ensure topics align with job requirements (e.g., java, spring, kubernetes).</li>
      </ul>
      <p style={{fontSize:12, color:'#666'}}>
        In production, this page would fetch your current signals and simulate changes to show expected score impact.
      </p>
    </div>
  )
}

export default CandidatePage
