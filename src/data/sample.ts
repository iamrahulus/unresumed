export type Candidate = {
  id: string;
  name: string;
  title: string;
  githubStars: number;
  commitsLast90d: number;
  prMergeRate: number; // 0..1
  blogPostsLast180d: number;
  topics: string[];
  evidence: { type: string; url?: string; detail: string }[];
};

export type JobRequirement = {
  id: string;
  title: string;
  mustHaveTopics: string[];
  niceToHaveTopics: string[];
  minCommitsLast90d: number;
};

export const candidates: Candidate[] = [
  {
    id: "c1",
    name: "Alex Chen",
    title: "Senior Java Engineer",
    githubStars: 420,
    commitsLast90d: 190,
    prMergeRate: 0.82,
    blogPostsLast180d: 3,
    topics: ["java", "spring", "kubernetes", "microservices", "testing"],
    evidence: [
      { type: "GitHub", url: "https://github.com/example/alex", detail: "Active commits, PRs merged in spring-boot libs" },
      { type: "Blog", url: "https://blog.example.com/alex", detail: "3 posts on Spring Boot testing and K8s probes" }
    ]
  },
  {
    id: "c2",
    name: "Priya Nair",
    title: "Java Engineer (Cloud)",
    githubStars: 180,
    commitsLast90d: 120,
    prMergeRate: 0.76,
    blogPostsLast180d: 1,
    topics: ["java", "spring", "aws", "lambda", "eventbridge"],
    evidence: [
      { type: "GitHub", url: "https://github.com/example/priya", detail: "Serverless Java templates; event-driven samples" },
      { type: "Talk", detail: "Meetup talk on Spring Cloud Function and AWS Lambda" }
    ]
  },
  {
    id: "c3",
    name: "Marco Rossi",
    title: "Backend Developer (Java)",
    githubStars: 95,
    commitsLast90d: 80,
    prMergeRate: 0.68,
    blogPostsLast180d: 0,
    topics: ["java", "quarkus", "postgres", "docker"],
    evidence: [
      { type: "GitHub", url: "https://github.com/example/marco", detail: "Quarkus API template; CI pipelines" }
    ]
  }
];

export const sampleJob: JobRequirement = {
  id: "j1",
  title: "Java Backend Engineer (Payments)",
  mustHaveTopics: ["java", "spring"],
  niceToHaveTopics: ["kubernetes", "aws"],
  minCommitsLast90d: 60
}
