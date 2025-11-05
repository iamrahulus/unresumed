import React from 'react'

export type Weights = {
  topicMatch: number;
  commits: number;
  prMergeRate: number;
  githubStars: number;
  blogging: number;
}

type Props = {
  weights: Weights;
  onChange: (w: Weights) => void;
}

const Slider: React.FC<{label: string; value: number; onChange: (v:number)=>void}> = ({label, value, onChange}) => {
  return (
    <div style={{marginBottom: '8px'}}>
      <label style={{display:'block', fontSize: 12}}>{label}: <b>{value}</b></label>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e)=>onChange(parseInt(e.target.value))}
      />
    </div>
  )
}

const WeightControls: React.FC<Props> = ({weights, onChange}) => {
  return (
    <div style={{border:'1px solid #ddd', padding: '12px', borderRadius: 8}}>
      <h3 style={{marginTop:0}}>Weighting (0–10)</h3>
      <Slider label="Topic match" value={weights.topicMatch} onChange={(v)=>onChange({...weights, topicMatch:v})}/>
      <Slider label="Commits (90d)" value={weights.commits} onChange={(v)=>onChange({...weights, commits:v})}/>
      <Slider label="PR merge rate" value={weights.prMergeRate} onChange={(v)=>onChange({...weights, prMergeRate:v})}/>
      <Slider label="GitHub stars" value={weights.githubStars} onChange={(v)=>onChange({...weights, githubStars:v})}/>
      <Slider label="Blogging (180d)" value={weights.blogging} onChange={(v)=>onChange({...weights, blogging:v})}/>
    </div>
  )
}

export default WeightControls
