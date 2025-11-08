import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { Slider } from "./components/ui/slider";
import { Checkbox } from "./components/ui/checkbox";
import { Separator } from "./components/ui/separator";
import { toast } from "sonner";
import { BarChart3, Calendar, CheckCircle2, FileDown, Filter, Info, Link as LinkIcon, ListChecks, Loader2, ShieldCheck, Target, UserCheck, Users2, Zap } from "lucide-react";

/**
 * Unresumed Prototype: Minimal UI / Core Functionality
 *
 * What it shows (no backend required):
 *  - Role prompt → vectorized keywords
 *  - Candidate retrieval (semantic-ish via keyword overlap) + rerank with interpretable features
 *  - Evidence cards from artifacts (repo/blog/package)
 *  - Explainability panel with feature attributions
 *  - Consent controls (claimed profile, hide artifact)
 *  - Quick scheduling (mock) + ATS export (CSV download)
 *  - Fairness snapshot (simulated)
 */

// ---------------------------- Mock Data ----------------------------
const MOCK_CANDIDATES = [
  {
    id: "c1",
    name: "Ava Nguyen",
    location: "Melbourne, AU (UTC+11)",
    claimed: true,
    roles: ["Senior Software Engineer", "Platform Engineer"],
    skills: ["go", "kubernetes", "terraform", "gcp", "payments", "observability", "python"],
    availability: "Open to interviews",
    artifacts: [
      { type: "repo", title: "payments-gateway", url: "https://example.com/ava/repo1", recency_days: 14, impact: 310, summary: "Go service, Stripe-like tokens, 85% test coverage" },
      { type: "talk", title: "Tracing at Scale (YOW! 2024)", url: "https://example.com/ava/talk1", recency_days: 320, impact: 1_200, summary: "OpenTelemetry rollout for 200+ services" },
      { type: "pkg", title: "go-otel-utils", url: "https://example.com/ava/pkg1", recency_days: 60, impact: 4800, summary: "Go helpers; 4.8k weekly downloads" },
    ],
    metrics: { velocity: 0.85, quality: 0.8, reliability: 0.9 },
  },
  {
    id: "c2",
    name: "Leo Park",
    location: "Sydney, AU (UTC+11)",
    claimed: false,
    roles: ["ML Engineer", "Data Scientist"],
    skills: ["python", "pytorch", "mlops", "feature-store", "aws", "fraud"],
    availability: "Contact through agent",
    artifacts: [
      { type: "repo", title: "fraud-detection-pipeline", url: "https://example.com/leo/repo1", recency_days: 28, impact: 180, summary: "Pytorch + Kafka streaming features; ROC AUC 0.93" },
      { type: "post", title: "Feature Store Patterns", url: "https://example.com/leo/blog1", recency_days: 120, impact: 2600, summary: "Online/Offline consistency; backfills" },
      { type: "pkg", title: "torch-utils-fs", url: "https://example.com/leo/pkg1", recency_days: 75, impact: 26000, summary: "Transforms; 26k weekly downloads" },
    ],
    metrics: { velocity: 0.78, quality: 0.75, reliability: 0.82 },
  },
  {
    id: "c3",
    name: "Mia Patel",
    location: "Remote, APAC (UTC+5:30)",
    claimed: true,
    roles: ["SRE", "Platform Engineer"],
    skills: ["kubernetes", "istio", "terraform", "aws", "cost-optimization", "finops"],
    availability: "2 weeks notice",
    artifacts: [
      { type: "repo", title: "k8s-cost-controller", url: "https://example.com/mia/repo1", recency_days: 7, impact: 420, summary: "Controller that rightsizes pods; saves 18% cost" },
      { type: "post", title: "Multi-Cluster Istio Pitfalls", url: "https://example.com/mia/blog1", recency_days: 210, impact: 1800, summary: "mTLS, incremental rollout, CA rotation" },
      { type: "pkg", title: "terraform-eks-addon", url: "https://example.com/mia/pkg1", recency_days: 40, impact: 9000, summary: "Terraform module; 9k monthly downloads" },
    ],
    metrics: { velocity: 0.92, quality: 0.7, reliability: 0.88 },
  },
  {
    id: "c4",
    name: "Noah Li",
    location: "Melbourne, AU (UTC+11)",
    claimed: false,
    roles: ["Full‑Stack Engineer"],
    skills: ["typescript", "react", "node", "nextjs", "gcp", "payments"],
    availability: "Interview after hours",
    artifacts: [
      { type: "repo", title: "nextjs-checkout", url: "https://example.com/noah/repo1", recency_days: 18, impact: 150, summary: "PCI-light checkout, webhooks" },
      { type: "post", title: "Edge Rendering Tradeoffs", url: "https://example.com/noah/blog1", recency_days: 95, impact: 650, summary: "SSR/ISR; cache invalidation" },
      { type: "pkg", title: "ts-payment-hooks", url: "https://example.com/noah/pkg1", recency_days: 33, impact: 4800, summary: "React hooks for payments" },
    ],
    metrics: { velocity: 0.7, quality: 0.72, reliability: 0.76 },
  },
  {
    id: "c5",
    name: "Olivia Kim",
    location: "Auckland, NZ (UTC+13)",
    claimed: true,
    roles: ["Data Engineer"],
    skills: ["python", "spark", "kafka", "gcp", "dbt", "observability"],
    availability: "Immediate",
    artifacts: [
      { type: "repo", title: "streaming-ingest", url: "https://example.com/olivia/repo1", recency_days: 4, impact: 220, summary: "Kafka + Spark Structured Streaming" },
      { type: "post", title: "Data Contracts in Practice", url: "https://example.com/olivia/blog1", recency_days: 60, impact: 1400, summary: "Schemas, SLAs, lineage" },
      { type: "pkg", title: "dbt-observability", url: "https://example.com/olivia/pkg1", recency_days: 25, impact: 5200, summary: "DBT tests + metrics export" },
    ],
    metrics: { velocity: 0.88, quality: 0.77, reliability: 0.81 },
  },
];

// ---------------------------- Helpers ----------------------------

const ALL_SKILLS = Array.from(new Set(MOCK_CANDIDATES.flatMap(c => c.skills))).sort();

function tokenizeRole(roleText: string): string[] {
  return roleText
    .toLowerCase()
    .replace(/[^a-z0-9+\-# ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter(w => w.length > 2);
}

function featureVector(cand: any, roleTokens: string[]) {
  const skills = cand.skills.map((s: string) => s.toLowerCase());
  const overlap = roleTokens.filter(t => skills.includes(t)).length;
  const overlapNorm = overlap / Math.max(1, roleTokens.length);

  // Recency: lower is fresher; take best 3 artifacts
  const recent = cand.artifacts
    .sort((a: any, b: any) => a.recency_days - b.recency_days)
    .slice(0,3)
    .reduce((acc: number, a: any) => acc + (1 / (1 + a.recency_days/30)), 0) / 3; // ~0..1

  // Impact: normalized log-ish scale using artifacts
  const impact = cand.artifacts.reduce((acc: number, a: any) => acc + Math.log10(1 + a.impact), 0) / (3 * Math.log10(1 + 30000));

  const quality = cand.metrics.quality; // 0..1
  const velocity = cand.metrics.velocity; // 0..1
  const reliability = cand.metrics.reliability; // 0..1

  return { overlap: overlapNorm, recency: recent, impact, quality, velocity, reliability };
}

function compositeScore(f: any, weights: any) {
  return (
    weights.skill * f.overlap +
    weights.recency * f.recency +
    weights.impact * f.impact +
    weights.quality * f.quality +
    weights.velocity * f.velocity +
    weights.reliability * f.reliability
  );
}

const DEFAULT_WEIGHTS = {
  skill: 0.35,
  recency: 0.2,
  impact: 0.15,
  quality: 0.1,
  velocity: 0.1,
  reliability: 0.1,
};

// ---------------------------- UI Components ----------------------------
const Pill = ({ children }: { children: React.ReactNode }) => (
  <Badge variant="secondary" className="rounded-2xl px-3 py-1 text-xs">{children}</Badge>
);

function EvidenceCard({ a, onToggleHide }: { a: any; onToggleHide?: () => void }) {
  return (
    <Card className="border-muted/60">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">{a.type}</Badge>
            <a href={a.url} target="_blank" rel="noreferrer" className="hover:underline text-sm flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />{a.title}
            </a>
          </div>
          {onToggleHide && (
            <Button size="xs" variant="ghost" onClick={onToggleHide}>Hide</Button>
          )}
        </div>
        <CardDescription className="text-xs mt-1">{a.summary}</CardDescription>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground flex flex-wrap gap-4">
        <div><b>Recency</b>: {a.recency_days} days</div>
        <div><b>Impact</b>: {a.impact.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

function CandidateRow({ cand, roleTokens, weights, hardFilters, onSchedule }: any) {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const filteredArtifacts = cand.artifacts.filter((a: any) => !hidden[a.title]);
  const f = featureVector({ ...cand, artifacts: filteredArtifacts }, roleTokens);
  const score = compositeScore(f, weights);

  // Hard filters
  if (hardFilters.onlyClaimed && !cand.claimed) return null;
  if (hardFilters.mustHaveSkills.length) {
    const lower = cand.skills.map((s: string) => s.toLowerCase());
    const ok = hardFilters.mustHaveSkills.every((s: string) => lower.includes(s.toLowerCase()));
    if (!ok) return null;
  }

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {cand.name}
              {cand.claimed ? <Badge className="bg-emerald-600">Claimed</Badge> : <Badge variant="outline">Unverified</Badge>}
            </CardTitle>
            <CardDescription className="text-xs">{cand.location} • {cand.roles.join(" • ")}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{(score * 100).toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Match score</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          {filteredArtifacts.map((a: any, i: number) => (
            <EvidenceCard key={i} a={a} onToggleHide={cand.claimed ? () => setHidden(h => ({ ...h, [a.title]: !h[a.title] })) : undefined} />
          ))}
        </div>
        <div className="space-y-3">
          <Card className="border-dashed">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Why ranked here</CardTitle>
              <CardDescription className="text-xs">Interpretable features</CardDescription>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div>Skill overlap: <b>{(f.overlap*100).toFixed(0)}%</b></div>
              <div>Recency: <b>{(f.recency*100).toFixed(0)}%</b></div>
              <div>Impact: <b>{(f.impact*100).toFixed(0)}%</b></div>
              <div>Quality: <b>{(f.quality*100).toFixed(0)}%</b></div>
              <div>Velocity: <b>{(f.velocity*100).toFixed(0)}%</b></div>
              <div>Reliability: <b>{(f.reliability*100).toFixed(0)}%</b></div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Consent & Controls</CardTitle>
              <CardDescription className="text-xs">Candidate settings</CardDescription>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div>Visibility: {cand.claimed ? "Full" : "Limited until claimed"}</div>
              <div>Availability: {cand.availability}</div>
            </CardContent>
          </Card>

          </div>
      </CardContent>
    </Card>
  );
}

function FairnessPanel({ visibleCount, totalCount }: { visibleCount: number; totalCount: number }) {
  return (
    <Card>
      <CardHeader className="py-3">
        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/><CardTitle className="text-sm">Fairness Snapshot</CardTitle></div>
        <CardDescription className="text-xs">Simulated parity indicators</CardDescription>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>Profiles considered: <b>{visibleCount}</b> of {totalCount}</div>
        <div className="text-muted-foreground">Protected attributes excluded from features; explainability enabled.</div>
        <div className="text-muted-foreground">Runbook: investigate deltas & perform counterfactual tests before changes.</div>
      </CardContent>
    </Card>
  );
}

function CandidateView({ initial }: { initial: any }) {
  const [profile, setProfile] = useState<any>({ ...initial });
  const [links, setLinks] = useState<any>({ github: "", website: "", blog: "" });
  const [consent, setConsent] = useState<Record<string, boolean>>({ public_profile: true, repo_meta: true, package_stats: true });
  const [newArtifact, setNewArtifact] = useState<any>({ type: "repo", title: "", url: "", recency_days: 30, impact: 0, summary: "" });

  function saveProfile() {
    toast.success("Profile saved (prototype)");
  }
  function addArtifact() {
    if (!newArtifact.title || !newArtifact.url) { toast.error("Title & URL required"); return; }
    setProfile((p: any) => ({ ...p, artifacts: [{ ...newArtifact }, ...p.artifacts] }));
    setNewArtifact({ type: "repo", title: "", url: "", recency_days: 30, impact: 0, summary: "" });
    toast.success("Artifact added");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Claimed profile with availability & links</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label>Name</Label>
            <Input value={profile.name} onChange={e=>setProfile((p:any)=>({ ...p, name: e.target.value }))} />
            <Label className="mt-3">Location</Label>
            <Input value={profile.location} onChange={e=>setProfile((p:any)=>({ ...p, location: e.target.value }))} />
            <Label className="mt-3">Availability</Label>
            <Input value={profile.availability} onChange={e=>setProfile((p:any)=>({ ...p, availability: e.target.value }))} />
            <Button size="sm" className="mt-3" onClick={saveProfile}><CheckCircle2 className="h-4 w-4 mr-2"/>Save</Button>
          </div>
          <div className="space-y-3">
            <Label>GitHub</Label>
            <Input placeholder="https://github.com/you" value={links.github} onChange={e=>setLinks((l:any)=>({ ...l, github: e.target.value }))} />
            <Label className="mt-3">Website</Label>
            <Input placeholder="https://your.site" value={links.website} onChange={e=>setLinks((l:any)=>({ ...l, website: e.target.value }))} />
            <Label className="mt-3">Blog</Label>
            <Input placeholder="https://blog.example" value={links.blog} onChange={e=>setLinks((l:any)=>({ ...l, blog: e.target.value }))} />
            <p className="text-xs text-muted-foreground">Links are illustrative in this prototype.</p>
          </div>
          <div className="space-y-3">
            <div className="font-medium">Consent Center</div>
            <label className="flex items-center gap-2 text-sm"><Checkbox checked={consent.public_profile} onCheckedChange={(c)=>setConsent(s=>({ ...s, public_profile: !!c }))}/> Public profile (required)</label>
            <label className="flex items-center gap-2 text-sm"><Checkbox checked={consent.repo_meta} onCheckedChange={(c)=>setConsent(s=>({ ...s, repo_meta: !!c }))}/> Repository metadata</label>
            <label className="flex items-center gap-2 text-sm"><Checkbox checked={consent.package_stats} onCheckedChange={(c)=>setConsent(s=>({ ...s, package_stats: !!c }))}/> Package download stats</label>
            <p className="text-xs text-muted-foreground">You can revoke at any time. In MVP, revocation triggers takedown jobs.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Artifacts</CardTitle>
          <CardDescription>Publish / hide work you want employers to see</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-4 gap-3">
            <div>
              <Label>Type</Label>
              <select className="input w-full" value={newArtifact.type} onChange={e=>setNewArtifact(a=>({ ...a, type: e.target.value }))}>
                <option value="repo">repo</option>
                <option value="post">post</option>
                <option value="pkg">pkg</option>
                <option value="talk">talk</option>
              </select>
            </div>
            <div>
              <Label>Title</Label>
              <Input value={newArtifact.title} onChange={e=>setNewArtifact(a=>({ ...a, title: e.target.value }))} />
            </div>
            <div>
              <Label>URL</Label>
              <Input value={newArtifact.url} onChange={e=>setNewArtifact(a=>({ ...a, url: e.target.value }))} />
            </div>
            <div>
              <Label>Summary</Label>
              <Input value={newArtifact.summary} onChange={e=>setNewArtifact(a=>({ ...a, summary: e.target.value }))} />
            </div>
            <div>
              <Label>Recency (days)</Label>
              <Input type="number" value={newArtifact.recency_days} onChange={e=>setNewArtifact(a=>({ ...a, recency_days: Number(e.target.value||0) }))} />
            </div>
            <div>
              <Label>Impact</Label>
              <Input type="number" value={newArtifact.impact} onChange={e=>setNewArtifact(a=>({ ...a, impact: Number(e.target.value||0) }))} />
            </div>
            <div className="md:col-span-1 flex items-end"><Button size="sm" onClick={addArtifact}>Add Artifact</Button></div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {profile.artifacts.map((a:any, idx:number)=> (
              <Card key={idx}>
                <CardHeader className="py-3 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2"><Badge variant="outline" className="capitalize">{a.type}</Badge><a className="text-sm hover:underline" href={a.url} target="_blank" rel="noreferrer">{a.title}</a></div>
                  <div className="flex items-center gap-2 text-xs"><Label>Visible</Label><Switch checked={!a.hidden} onCheckedChange={(v)=>{
                    setProfile((p:any)=>{
                      const copy = { ...p };
                      copy.artifacts = copy.artifacts.map((x:any,i:number)=> i===idx ? ({ ...x, hidden: !v }) : x);
                      return copy;
                    });
                  }}/></div>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-1">
                  <div>{a.summary || ""}</div>
                  <div>Recency: {a.recency_days} days • Impact: {a.impact?.toLocaleString?.() || 0}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview for Employers</CardTitle>
          <CardDescription>What your evidence cards would look like</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          {profile.artifacts.filter((a:any)=>!a.hidden).slice(0,3).map((a:any, i:number)=>(
            <EvidenceCard key={i} a={a} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
export default function UnresumedPrototype() {
  const [roleText, setRoleText] = useState("Senior Platform Engineer with Go, Kubernetes, Terraform, Observability in payments domain");
  const roleTokens = useMemo(() => tokenizeRole(roleText), [roleText]);

  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [onlyClaimed, setOnlyClaimed] = useState(false);
  const [mustHaveSkills, setMustHaveSkills] = useState<string[]>([]);
  const [selectedForMeeting, setSelectedForMeeting] = useState<any | null>(null);

  const [role, setRole] = useState<'employer'|'candidate'>("employer");

  // --- Smoke tests to catch regressions without a test runner ---
  useEffect(() => {
    try {
      const tokens = tokenizeRole("Senior Java Developer with Spring + Kubernetes #microservices");
      console.assert(tokens.includes("java"), "tokenizeRole should include 'java'");
      const fPython = featureVector(MOCK_CANDIDATES[0], ["python"]);
      const fGo = featureVector(MOCK_CANDIDATES[0], ["go"]);
      const sPy = compositeScore(fPython, DEFAULT_WEIGHTS);
      const sGo = compositeScore(fGo, DEFAULT_WEIGHTS);
      console.assert(sGo >= sPy, "For Ava (has go), 'go' score should be >= 'python'");
    } catch (e) { console.warn("Smoke tests warning:", e); }
  }, []);

  const shortlist = useMemo(() => {
    const scored = MOCK_CANDIDATES.map(c => {
      const f = featureVector(c, roleTokens);
      const score = compositeScore(f, weights);
      return { cand: c, score };
    })
    .sort((a,b) => b.score - a.score);
    return scored;
  }, [roleTokens, weights]);

  const hardFilters = { onlyClaimed, mustHaveSkills };
  const visibleCount = shortlist.filter(({cand}) => {
    if (onlyClaimed && !cand.claimed) return false;
    if (mustHaveSkills.length) {
      const lower = cand.skills.map((s: string) => s.toLowerCase());
      const ok = mustHaveSkills.every(s => lower.includes(s.toLowerCase()));
      if (!ok) return false;
    }
    return true;
  }).length;

  function handleSchedule(cand: any) {
    setSelectedForMeeting(cand);
    toast.success(`Proposed three interview slots to ${cand.name}`);
  }

  function downloadCSV() {
    const header = ["name","location","claimed","roles","skills"]; 
    const rows = shortlist.map(({cand}) => [cand.name, cand.location, cand.claimed, cand.roles.join(";"), cand.skills.join(";")]);
    const csv = [header.join(","), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shortlist.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen w-full p-6 md:p-10 bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Unresumed — Prototype</h1>
            <p className="text-muted-foreground mt-1">Minimal UI to demonstrate core flows: discovery → ranked shortlist → evidence → schedule → export.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill>Evidence‑first</Pill>
              <Pill>Explainable</Pill>
              <Pill>Consent‑aware</Pill>
              <Pill>ATS‑friendly</Pill>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="text-xs text-muted-foreground">Signed in as:</div>
            <Badge variant="outline" className="capitalize">{role}</Badge>
            <div className="flex rounded-xl border px-1 py-1 bg-white">
              <Button size="sm" variant={role==='employer' ? 'secondary' : 'ghost'} onClick={()=>setRole('employer')}>Sign in as Employer</Button>
              <Button size="sm" variant={role==='candidate' ? 'secondary' : 'ghost'} onClick={()=>setRole('candidate')}>Sign in as Candidate</Button>
            </div>
            {role==='employer' && (
              <Button size="sm" variant="secondary" onClick={downloadCSV}><FileDown className="h-4 w-4 mr-2"/> Export Shortlist (CSV)</Button>
            )}
          </div>
        </div>

        {role === 'employer' ? (
          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="shortlist">Shortlist</TabsTrigger>
              <TabsTrigger value="fairness">Fairness</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Discover */}
            <TabsContent value="discover" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Describe the role</CardTitle>
                <CardDescription>Paste a JD or write what you need; we’ll construct a role vector and retrieve candidates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea value={roleText} onChange={e => setRoleText(e.target.value)} rows={4} />
                <div className="text-xs text-muted-foreground">Extracted tokens: {tokenizeRole(roleText).slice(0,12).join(", ")} …</div>
                <Separator />
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-dashed">
                    <CardHeader className="py-3"><CardTitle className="text-sm">Feature Weights</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(weights).map(([k,v]) => (
                        <div key={k} className="space-y-1">
                          <Label className="capitalize">{k}</Label>
                          <Slider value={[Math.round(v*100)]} onValueChange={(arr)=>{
                            const val = (arr[0]||0)/100; setWeights(w=>({ ...w, [k]: val }));
                          }} step={5} min={0} max={100} />
                          <div className="text-xs text-muted-foreground">{(v*100).toFixed(0)}%</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="border-dashed">
                    <CardHeader className="py-3"><CardTitle className="text-sm">Hard Filters</CardTitle></CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="claimed">Only claimed profiles</Label>
                        <Switch id="claimed" checked={onlyClaimed} onCheckedChange={setOnlyClaimed} />
                      </div>
                      <div>
                        <Label>Must-have skills</Label>
                        <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-auto pr-1">
                          {ALL_SKILLS.map((s) => (
                            <label key={s} className="flex items-center gap-2 text-xs">
                              <Checkbox checked={mustHaveSkills.includes(s)} onCheckedChange={(c) => {
                                setMustHaveSkills(prev => c ? [...prev, s] : prev.filter(x => x!==s));
                              }} /> {s}
                            </label>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed">
                    <CardHeader className="py-3"><CardTitle className="text-sm">What this prototype does</CardTitle></CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                      <div className="flex items-center gap-2"><Zap className="h-4 w-4"/> Keyword overlap retrieval + interpretable rerank</div>
                      <div className="flex items-center gap-2"><ListChecks className="h-4 w-4"/> Evidence cards from mock artifacts</div>
                      <div className="flex items-center gap-2"><UserCheck className="h-4 w-4"/> Consent controls (hide items when claimed)</div>
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4"/> Mock scheduling + CSV ATS export</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

            {/* Shortlist */}
            <TabsContent value="shortlist" className="mt-4 space-y-4">
            {shortlist.map(({cand, score}) => (
              <CandidateRow key={cand.id} cand={cand} roleTokens={roleTokens} weights={weights} hardFilters={hardFilters} onSchedule={handleSchedule} />
            ))}
            {visibleCount === 0 && (
              <Card className="border-dashed"><CardHeader><CardTitle className="text-sm">No candidates match the hard filters.</CardTitle></CardHeader></Card>
            )}
          </TabsContent>

            {/* Fairness */}
            <TabsContent value="fairness" className="mt-4">
            <div className="grid md:grid-cols-3 gap-6">
              <FairnessPanel visibleCount={visibleCount} totalCount={MOCK_CANDIDATES.length} />
              <Card>
                <CardHeader className="py-3">
                  <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4"/><CardTitle className="text-sm">Feature Attributions</CardTitle></div>
                  <CardDescription className="text-xs">Global importance (simulated)</CardDescription>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div>Skill overlap (35%) • Recency (20%) • Impact (15%) • Quality (10%) • Velocity (10%) • Reliability (10%)</div>
                  <div className="text-muted-foreground">Tune weights in the Discover tab and observe rank changes.</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-3">
                  <div className="flex items-center gap-2"><Info className="h-4 w-4"/><CardTitle className="text-sm">Guardrails</CardTitle></div>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-1">
                  <div>Protected attributes and likely proxies are excluded from features.</div>
                  <div>All decisions are explainable via evidence cards.</div>
                  <div>Run counterfactual checks before model version rollouts.</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Integration Stubs</CardTitle>
                <CardDescription>What would be wired up in a full build</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="font-medium">Connectors</div>
                  <div className="text-muted-foreground">GitHub, LinkedIn (public), npm/PyPI, Medium/Substack, personal sites.</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Stores</div>
                  <div className="text-muted-foreground">Object storage (raw/curated), Postgres (entities), Graph DB (relations), Vector DB (embeddings).</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">ATS & Calendar</div>
                  <div className="text-muted-foreground">Greenhouse/Workday export; Microsoft/Google calendar for scheduling.</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        ) : (
          <CandidateView initial={{ ...MOCK_CANDIDATES[0], claimed: true }} />
        )}

        {selectedForMeeting && (
          <Card className="border-emerald-700/30">
            <CardHeader className="py-3">
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4"/><CardTitle className="text-sm">Schedule with {selectedForMeeting.name}</CardTitle></div>
              <CardDescription className="text-xs">Pick a slot to propose (mock)</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {[
                "Tue 28 Oct, 10:00–10:30",
                "Tue 28 Oct, 16:00–16:30",
                "Wed 29 Oct, 11:30–12:00",
              ].map((slot) => (
                <Button key={slot} size="sm" variant="outline" onClick={() => { toast.success(`Proposed ${slot}`); }}>
                  {slot}
                </Button>
              ))}
              <div className="grow" />
              <Button size="sm" onClick={() => setSelectedForMeeting(null)} variant="secondary">Close</Button>
            </CardContent>
          </Card>
        )}

        <div className="text-xs text-muted-foreground">Prototype only — simulated data and signals. No external calls.</div>
      </div>
    </div>
  );
}

