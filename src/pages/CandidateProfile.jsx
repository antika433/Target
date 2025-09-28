// src/pages/CandidateProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function CandidateProfile() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [cRes, tRes] = await Promise.all([
          axios.get(`/candidates/${id}`),
          axios.get(`/candidates/${id}/timeline`),
        ]);
        if (!mounted) return;
        setCandidate(cRes.data);
        setTimeline(tRes.data);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (!candidate) return <div>Loading candidate…</div>;

  return (
    <div className="candidate-profile">
      <Link to="/candidates">← Back to candidates</Link>
      <h2>{candidate.name}</h2>
      <div>Email: {candidate.email}</div>
      <div>Stage: {candidate.stage}</div>
      <div>Skills: {(candidate.skills || []).join(", ")}</div>

      <h3>Timeline</h3>
      <ul>
        {timeline.slice().reverse().map((t, i) => (
          <li key={i}>
            <strong>{new Date(t.when).toLocaleString()}</strong> — {t.from ?? "none"} → {t.to}
          </li>
        ))}
      </ul>
    </div>
  );
}
