import React, { useState } from 'react'
import JobDescription from '../components/JobDescription'
import WeightControls, { Weights } from '../components/WeightControls'
import CandidateList from '../components/CandidateList'
import { candidates, sampleJob } from '../data/sample'

const defaultWeights: Weights = {
  topicMatch: 6,
  commits: 5,
  prMergeRate: 4,
  githubStars: 3,
  blogging: 2
}

const EmployerPage: React.FC = () => {
  const [weights, setWeights] = useState<Weights>(defaultWeights)

  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 340px', gap: 16}}>
      <div>
        <section style={{marginBottom:16}}>
          <h2>Job Description</h2>
          <JobDescription job={sampleJob} />
        </section>
        <section>
          <h2>Shortlist & Explainability</h2>
          <p style={{color:'#555', marginTop:-8, fontSize:13}}>Scores are normalized and explained below each candidate.</p>
          <CandidateList candidates={candidates} job={sampleJob} weights={weights} />
        </section>
      </div>
      <aside>
        <h2>Controls</h2>
        <WeightControls weights={weights} onChange={setWeights} />
        <div style={{marginTop:12, fontSize:12, color:'#666'}}>
          <p><strong>Tip:</strong> Save different weighting presets per role/seniority in a real deployment.</p>
        </div>
      </aside>
    </div>
  )
}

export default EmployerPage
