import React from 'react'
import type { JobRequirement } from '../data/sample'

const Pill: React.FC<{text:string}> = ({text}) => (
  <span style={{border:'1px solid #ddd', padding:'2px 8px', borderRadius: 999, marginRight: 6, fontSize: 12}}>{text}</span>
)

const JobDescription: React.FC<{job: JobRequirement}> = ({job}) => {
  return (
    <div style={{border:'1px solid #ddd', padding: 12, borderRadius: 8}}>
      <h3 style={{marginTop:0}}>{job.title}</h3>
      <div style={{marginBottom:8}}>
        <strong>Must have:</strong>&nbsp;
        {job.mustHaveTopics.map(t => <Pill key={t} text={t} />)}
      </div>
      <div style={{marginBottom:8}}>
        <strong>Nice to have:</strong>&nbsp;
        {job.niceToHaveTopics.map(t => <Pill key={t} text={t} />)}
      </div>
      <div>
        <strong>Minimum commits (90d):</strong> {job.minCommitsLast90d}
      </div>
    </div>
  )
}

export default JobDescription
