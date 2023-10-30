import { useEffect, useState } from "react";

type Job = {
  machineId: string;
  jobId: string;
  status: number;
  timestamp: number;
};

const History = () => {
  const [history, setHistory] = useState<Job[]>([]);
  useEffect(() => {
    fetch(`/job_history`)
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);
  return (
    <div>
      <div style={{ paddingBottom: "1rem" }}>
        <b>Total Jobs completed: {history.length}</b>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {history?.map((job) => (
          <div
            key={job.jobId}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div>Machine ID: {job.machineId}</div>
            <div>Job ID: {job.jobId}</div>
            <div>Job Status: {job.status}</div>
            <div>Timestamp: {new Date(job.timestamp).toString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
