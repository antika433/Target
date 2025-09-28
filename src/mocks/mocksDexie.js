// src/mocks/mocksDexie.js
import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");
db.version(1).stores({
  jobs: "++id, title, slug, status, order",
  candidates: "++id, name, email, stage, jobId, skills, timeline",
  assessments: "++id, jobId",
});

const SKILL_POOL = [
  "React", "Node", "TypeScript", "Python", "Django",
  "GraphQL", "SQL", "NoSQL", "Docker", "Kubernetes",
  "AWS", "GCP", "CSS", "HTML", "Redux"
];

function randomSkills() {
  const count = 2 + Math.floor(Math.random() * 4); // 2-5 skills
  const picked = new Set();
  while (picked.size < count) {
    picked.add(SKILL_POOL[Math.floor(Math.random() * SKILL_POOL.length)]);
  }
  return [...picked];
}

export async function seedCandidatesIfNeeded() {
  const count = await db.candidates.count();
  if (count > 0) return; // already seeded

  // Create 25 jobs
  const jobs = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    title: `Job ${i + 1}`,
    slug: `job-${i + 1}`,
    status: Math.random() < 0.8 ? "active" : "archived",
    order: i + 1,
  }));
  await db.jobs.bulkAdd(jobs);

  // Create 1000 candidates
  const stageOptions = ["applied", "screen", "tech", "offer", "hired", "rejected"];
  const now = Date.now();

  const candidates = Array.from({ length: 1000 }, (_, i) => {
    const id = i + 1;
    const jobId = Math.floor(Math.random() * 25) + 1;
    const stage = stageOptions[Math.floor(Math.random() * stageOptions.length)];

    // random timeline: a candidate may have progressed through multiple stages
    const timelineLength = Math.floor(Math.random() * stageOptions.indexOf(stage) + 1);
    const timeline = [];
    for (let j = 0; j < timelineLength; j++) {
      timeline.push({
        when: new Date(now - 1000 * 60 * 60 * 24 * Math.random() * 30).toISOString(),
        from: j === 0 ? null : stageOptions[j - 1],
        to: stageOptions[j],
      });
    }

    return {
      id,
      name: `Candidate ${id}`,
      email: `candidate${id}@example.com`,
      stage,
      skills: randomSkills(),
      jobId,
      timeline,
    };
  });

  await db.candidates.bulkAdd(candidates);
}
