// src/mocks/handlers.js
import { rest } from "msw";

let jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    slug: "frontend-developer",
    status: "active",
    tags: ["React"],
    order: 1,
    company: "TechCorp",
    location: "Remote",
    type: "Full-time"
  },
  {
    id: 2,
    title: "Backend Developer",
    slug: "backend-developer",
    status: "archived",
    tags: ["Node"],
    order: 2,
    company: "CodeBase",
    location: "Bangalore",
    type: "Part-time"
  },
];

export const handlersjobs = [
  // GET /jobs
  rest.get("http://localhost:8085/jobs", (req, res, ctx) => {
    const search = req.url.searchParams.get("search") || "";
    const status = req.url.searchParams.get("status") || "";

    let filtered = jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) &&
        (status ? j.status === status : true)
    );

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json(filtered)
    );
  }),

  // POST /jobs
  rest.post("http://localhost:8085/jobs", async (req, res, ctx) => {
    const job = await req.json();
    job.id = jobs.length + 1;
    jobs.push(job);

    if (Math.random() < 0.1) {
      return res(ctx.status(500), ctx.json({ message: "Server error" }));
    }

    return res(ctx.status(201), ctx.json(job));
  }),

  // PATCH /jobs/:id
  rest.patch("http://localhost:8085/jobs/:id", async (req, res, ctx) => {
    const updates = await req.json();
    const jobId = parseInt(req.params.id, 10);
    const index = jobs.findIndex((j) => j.id === jobId);

    if (index === -1) {
      return res(ctx.status(404), ctx.json({ message: "Not found" }));
    }

    jobs[index] = { ...jobs[index], ...updates };

    return res(ctx.status(200), ctx.json(jobs[index]));
  }),
];
