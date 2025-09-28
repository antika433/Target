// src/mocks/handlercandidate.js
import { rest } from "msw";
import { db, seedCandidatesIfNeeded } from "./mocksDexie";

/**
 * Call this before starting the worker to ensure DB is seeded
 */
export async function initCandidateMocks() {
  await seedCandidatesIfNeeded();
}

// Helper to deep-clone Dexie objects into plain JSON
const toPlain = (obj) => JSON.parse(JSON.stringify(obj));

export const handlerscandidates = [
  // GET /candidates
  rest.get("http://localhost:8085/candidates", async (req, res, ctx) => {
    const { page = "1", pageSize = "50", search = "", stage = "" } = req.url.searchParams;

    let candidates = await db.candidates.toArray();

    // filter by stage if provided
    if (stage) {
      candidates = candidates.filter(c => c.stage === stage);
    }

    // search by name/email
    if (search) {
      const lower = search.toLowerCase();
      candidates = candidates.filter(
        c => c.name.toLowerCase().includes(lower) || c.email.toLowerCase().includes(lower)
      );
    }

    // pagination
    const start = (parseInt(page) - 1) * parseInt(pageSize);
    const end = start + parseInt(pageSize);
    const paged = candidates.slice(start, end);

    const normalizeCandidate = (c) => ({
      ...c,
      timeline: (c.timeline || []).map(item => ({
        ...item,
        when: new Date(item.when).toISOString(),
      })),
    });

    return res(
      ctx.delay(200),
      ctx.status(200),
      ctx.json({
        data: paged.map(normalizeCandidate),
      })
    );


  }),

  // GET /candidates/:id
  rest.get("http://localhost:8085/candidates/:id", async (req, res, ctx) => {
    try {
      const id = parseInt(req.params.id, 10);
      const candidate = await db.candidates.get(id);
      if (!candidate) return res(ctx.status(404), ctx.json({ message: "Not found" }));
      return res(ctx.status(200), ctx.json(toPlain(candidate)));
    } catch (err) {
      console.error("MSW /candidates/:id handler error:", err);
      return res(ctx.status(500), ctx.json({ message: "Internal MSW error" }));
    }
  }),

  // POST /candidates
  rest.post("http://localhost:8085/candidates", async (req, res, ctx) => {
    try {
      const payload = await req.json();

      if (Math.random() < 0.08) {
        return res(ctx.status(500), ctx.json({ message: "Write error" }));
      }

      const lastCandidate = await db.candidates.orderBy("id").last();
      const nextId = lastCandidate ? lastCandidate.id + 1 : 1;

      const newCandidate = {
        id: nextId,
        name: payload.name || `Candidate ${nextId}`,
        email: payload.email || `candidate${nextId}@example.com`,
        stage: payload.stage || "applied",
        skills: payload.skills || [],
        jobId: payload.jobId || null,
        timeline: [
          { when: new Date().toISOString(), from: null, to: payload.stage || "applied" },
        ],
      };

      await db.candidates.add(newCandidate);

      return res(
        ctx.status(201),
        ctx.json(toPlain(newCandidate)),
        ctx.delay(200)
      );
    } catch (err) {
      console.error("MSW POST /candidates handler error:", err);
      return res(ctx.status(500), ctx.json({ message: "Internal MSW error" }));
    }
  }),

  // PATCH /candidates/:id
  rest.patch("http://localhost:8085/candidates/:id", async (req, res, ctx) => {
    try {
      const id = parseInt(req.params.id, 10);
      const payload = await req.json();

      if (Math.random() < 0.08) {
        return res(ctx.status(500), ctx.json({ message: "Write error" }));
      }

      const candidate = await db.candidates.get(id);
      if (!candidate) return res(ctx.status(404), ctx.json({ message: "Not found" }));

      // Update stage & timeline
      if (payload.stage && payload.stage !== candidate.stage) {
        candidate.timeline = candidate.timeline || [];
        candidate.timeline.push({
          when: new Date().toISOString(),
          from: candidate.stage,
          to: payload.stage,
        });
        candidate.stage = payload.stage;
      }

      // Update other fields
      if (payload.name) candidate.name = payload.name;
      if (payload.email) candidate.email = payload.email;
      if (payload.skills) candidate.skills = payload.skills;

      await db.candidates.put(candidate);

      return res(
        ctx.status(200),
        ctx.delay(200),
        ctx.json(toPlain(candidate))
      );
    } catch (err) {
      console.error("MSW PATCH /candidates/:id handler error:", err);
      return res(ctx.status(500), ctx.json({ message: "Internal MSW error" }));
    }
  }),

  // GET /candidates/:id/timeline
  rest.get("http://localhost:8085/candidates/:id/timeline", async (req, res, ctx) => {
    try {
      const id = parseInt(req.params.id, 10);
      const candidate = await db.candidates.get(id);
      if (!candidate) return res(ctx.status(404), ctx.json({ message: "Not found" }));
      return res(ctx.status(200), ctx.json(toPlain(candidate.timeline || [])));
    } catch (err) {
      console.error("MSW /candidates/:id/timeline handler error:", err);
      return res(ctx.status(500), ctx.json({ message: "Internal MSW error" }));
    }
  }),
];
