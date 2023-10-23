import { useEffect, useState } from "react";

type Job = {
  machineId: string;
  jobId: string;
  status: string;
};

const BACKEND_URL = `http://${import.meta.env.VITE_BACKEND_URL}`;

const History = () => {
  const [history, setHistory] = useState<Job[]>([]);
  useEffect(() => {
    fetch(`${BACKEND_URL}/job_history`)
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);
  return (
    <div>
      <h1>Job History</h1>

      <table>
        <thead>
          <tr>
            <th>Machine ID</th>
            <th>Job ID</th>
            <th>Job Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((job) => (
            <tr key={job.jobId}>
              <td>{job.machineId}</td>
              <td>{job.jobId}</td>
              <td style={{ textAlign: "right" }}>{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
