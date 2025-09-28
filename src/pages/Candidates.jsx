import { useEffect, useState } from "react";
import { api } from "../Api/api";
import "./CandidateList.css";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = () => {
    setLoading(true);
    api.getCandidates()
      .then(res => setCandidates(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  if (loading) return <p>Loading candidates...</p>;

  return (
    <div className="candidates-page">
      <h1>Candidates</h1>
      <div className="candidates-container">
        {candidates.map((c) => {
          const lastStage = c.timeline?.length
            ? c.timeline[c.timeline.length - 1].stage
            : "N/A";
          const skills = c.notes?.length ? c.notes[0].text : "No notes yet";

          return (
            <div key={c.id} className="candidate-card">
              <div className="candidate-photo">
                <img
                  src={`https://i.pravatar.cc/150?u=${c.id}`} // placeholder avatar
                  alt={c.name}
                />
              </div>
              <h2 className="candidate-name">{c.name}</h2>
              <p className="candidate-skills">{skills}</p>
              <p className="candidate-stage">
                <strong>Stage:</strong> {lastStage}
              </p>
              <a
                href={c.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-link"
              >
                View Resume
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
