import React, { useState } from 'react'
import EmployerPage from './pages/Employer'
import CandidatePage from './pages/Candidate'

type Role = 'employer' | 'candidate'

const TabButton: React.FC<{active:boolean; onClick: ()=>void; label:string}> = ({active, onClick, label}) => (
  <button onClick={onClick} style={{
    padding:'8px 12px', borderRadius:8, border: active ? '2px solid #333' : '1px solid #ccc',
    background: active ? '#f5f5f5' : '#fff', cursor:'pointer'
  }}>{label}</button>
)

const App: React.FC = () => {
  const [role, setRole] = useState<Role>('employer')

  return (
    <div style={{maxWidth:1200, margin:'0 auto', padding:16}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
        <h1 style={{margin:0}}>Unresumed Delivery – Prototype</h1>
        <div style={{display:'flex', gap:8}}>
          <TabButton active={role==='employer'} onClick={()=>setRole('employer')} label="Employer View" />
          <TabButton active={role==='candidate'} onClick={()=>setRole('candidate')} label="Candidate View" />
        </div>
      </header>
      {role === 'employer' ? <EmployerPage/> : <CandidatePage/>}
      <footer style={{marginTop:24, fontSize:12, color:'#666'}}>
        Demo only – mocked data, no backend. Role-based rendering is done locally.
      </footer>
    </div>
  )
}

export default App
