import { useEffect, useState } from "react";
import { statusMap } from "./status";

function Dashboard() {
  const [fileList, setFileList] = useState<File[]>([]);
  const [events, setStatus] = useState<any>([]);
  const [lastState, setLastState] = useState<any>(null);
  const [totalJobs, setTotalJobs] = useState<number>(0);

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const selectedFiles = Array.from(e.target?.files as FileList);
    setFileList(selectedFiles);
  };

  const onUpload: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (fileList.length === 0) {
      console.error("Please select files to upload.");
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file);
    });

    await fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Files uploaded successfully.");
        } else {
          console.log("File upload failed.");
        }
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
        console.error("An error occurred while uploading files.");
      });
    return;
  };

  useEffect(() => {
    const eventSource = new EventSource(`/sse`);
    // Handle SSE messages
    eventSource.onmessage = (event) => {
      setStatus((prevStatus: any) => {
        const parsedData = JSON.parse(event.data);
        return [...prevStatus, parsedData];
      });
    };
    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    fetch(`/job_history`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          return null;
        }
        const lastState = data[0];
        setLastState(lastState);
        setTotalJobs(data.length);
        return;
      });
  }, []);

  const currentState = events[events.length - 1]?.payload;

  return (
    <div>
      <input type="file" id="fileInput" multiple onChange={onFileChange} />
      <button onClick={onUpload}>Start</button>
      <ul>
        {fileList.map((file) => {
          return <li key={file.name}>{file.name}</li>;
        })}
      </ul>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingBottom: "2rem",
        }}
      >
        <div>
          <b>Total Jobs completed: {totalJobs}</b>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>
              <b>Last Job Details: </b>
            </div>
            {lastState ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>Machine ID: {lastState.machineId}</span>
                <span>JOB ID: {lastState.jobId}</span>
                <span>Status: {statusMap[lastState.status]}</span>
                <span>Timestamp: {`${new Date(lastState.timestamp)}`}</span>
              </div>
            ) : (
              <span>Not Available</span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>
              <b>Current state of the machine: </b>
            </div>
            {currentState ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>Machine ID: {currentState.machineId}</span>
                <span>JOB ID: {currentState.jobId}</span>
                <span>Status: {statusMap[currentState.status]}</span>
                <span>Timestamp: {`${new Date(currentState.timestamp)}`}</span>
              </div>
            ) : (
              <div>IDLE</div>
            )}
          </div>
        </div>
      </div>
      {events.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <b>Real time Events: </b>
          </div>
          {events?.map((status: any) => {
            const { payload } = status;
            return (
              <div
                key={`${payload.jobId}-${payload.status}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span>Machine ID: {payload.machineId}</span>
                <span>JOB ID: {payload.jobId}</span>
                <span>Status: {statusMap[payload.status]}</span>
                <span>Timestamp: {`${new Date(payload.timestamp)}`}</span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
