import React from 'react'
import type { Candidate, JobRequirement } from '../data/sample'
import type { Weights } from './WeightControls'

export type Scored = Candidate & { score: number; explanation: string[] }

function calcScore(c: Candidate, job: JobRequirement, w: Weights): Scored {
  const topicHits = job.mustHaveTopics.filter(t => c.topics.includes(t)).length
  const niceHits = job.niceToHaveTopics.filter(t => c.topics.includes(t)).length
  const topicMatch = (topicHits * 2 + niceHits) / (job.mustHaveTopics.length * 2 + Math.max(1, job.niceToHaveTopics.length))

  const commitsNorm = Math.min(1, c.commitsLast90d / Math.max(1, job.minCommitsLast90d * 2))
  const prMerge = c.prMergeRate // already 0..1
  const starsNorm = Math.min(1, c.githubStars / 500)
  const blogNorm = Math.min(1, c.blogPostsLast180d / 4)

  const contributions = [
    {label: 'Topic match', value: topicMatch, weight: w.topicMatch},
    {label: 'Commits (90d)', value: commitsNorm, weight: w.commits},
    {label: 'PR merge rate', value: prMerge, weight: w.prMergeRate},
    {label: 'GitHub stars', value: starsNorm, weight: w.githubStars},
    {label: 'Blogging', value: blogNorm, weight: w.blogging},
  ]

  const weighted = contributions.reduce((sum, x) => sum + x.value * x.weight, 0)
  const maxPossible = [w.topicMatch, w.commits, w.prMergeRate, w.githubStars, w.blogging].reduce((a,b)=>a+b,0)
  const score = maxPossible > 0 ? (weighted / maxPossible) : 0

  const explanation = contributions.map(cn => `${cn.label}: ${(cn.value*100).toFixed(0)}% × weight ${cn.weight}`)

  return { ...c, score, explanation }
}

const CandidateCard: React.FC<{s: Scored}> = ({s}) => {
  return (
    <div style={{border:'1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 10}}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <div>
          <strong>{s.name}</strong> <span style={{color:'#666'}}>— {s.title}</span>
        </div>
        <div><strong>Score:</strong> {(s.score*100).toFixed(0)}%</div>
      </div>
      <div style={{fontSize:13, marginTop:6}}>
        <em>Why shortlisted:</em>
        <ul style={{marginTop:6}}>
          {s.explanation.map((e,i)=>(<li key={i}>{e}</li>))}
        </ul>
      </div>
      <div style={{fontSize:12, color:'#444'}}>
        <em>Evidence:</em>
        <ul>
        {s.evidence.map((ev, i)=>(
          <li key={i}>
            <strong>{ev.type}:</strong> {ev.detail}{ev.url ? ` (${ev.url})` : ""}
          </li>
        ))}
        </ul>
      </div>
    </div>
  )
}

const CandidateList: React.FC<{candidates: Candidate[]; job: JobRequirement; weights: Weights;}> = ({candidates, job, weights}) => {
  const scored = candidates.map(c => calcScore(c, job, weights)).sort((a,b)=>b.score - a.score)
  return (
    <div>
      {scored.map(s => <CandidateCard key={s.id} s={s} />)}
    </div>
  )
}

export default CandidateList
