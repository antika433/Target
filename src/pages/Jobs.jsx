
import { useEffect, useState } from "react";
import { api } from "../Api/api";
import "./Jobs.css";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [editingJobId, setEditingJobId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

 
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    setLoading(true);
    api.getJobs()
      .then(res => setJobs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCreate = () => {
    if (!newJobTitle.trim()) return;
    const slug = newJobTitle.toLowerCase().replace(/\s+/g, "-");
    const order = jobs.length + 1;

    api.createJob({ title: newJobTitle, slug, status: "active", tags: [], order })
      .then(res => setJobs([...jobs, res.data]))
      .catch(err => console.error(err));

    setNewJobTitle("");
  };

  const handleDelete = (id) => {
    api.deleteJob(id)
      .then(() => setJobs(jobs.filter(job => job.id !== id)))
      .catch(err => console.error(err));
  };

  const startEditing = (job) => {
    setEditingJobId(job.id);
    setEditingTitle(job.title);
  };

  const handleUpdate = (id) => {
    const slug = editingTitle.toLowerCase().replace(/\s+/g, "-");
    api.updateJob(id, { title: editingTitle, slug })
      .then(res => {
        setJobs(jobs.map(job => job.id === id ? res.data : job));
        setEditingJobId(null);
      })
      .catch(err => console.error(err));
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h1>Jobs Board</h1>
        <div className="create-job">
          <input
            type="text"
            placeholder="New job title..."
            value={newJobTitle}
            onChange={(e) => setNewJobTitle(e.target.value)}
          />
          <button onClick={handleCreate}>+</button>
        </div>
      </div>

      <div className="jobs-container">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            {/* Menu top-right */}
            <div className="job-card-menu">
              <button>⋮</button>
              <div className="job-card-options">
                <button onClick={() => startEditing(job)}>Edit</button>
                <button onClick={() => handleDelete(job.id)}>Delete</button>
              </div>
            </div>

            {editingJobId === job.id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <button onClick={() => handleUpdate(job.id)}>Save</button>
                <button onClick={() => setEditingJobId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h2 className="job-title">{job.title}</h2>

                <div className="job-details">
                  <p><strong>Salary:</strong> {job.salary}</p>
                  <p><strong>Type:</strong> {job.type}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Status:</strong> {job.status}</p>
                </div>

                <div className="job-footer">
                  <div className="job-tags">
                    {Array.isArray(job.tags) &&
                      job.tags.map((tag, idx) => (
                        <span key={idx} className="job-tag">{`${tag} , `}</span>
                      ))}
                  </div>
                  <div className="job-description">
                    {`Description->  ${job.description}`}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
