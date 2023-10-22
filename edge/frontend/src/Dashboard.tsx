import { useEffect, useState } from "react";
import { statusMap } from "./status";

const BACKEND_URL = `http://${import.meta.env.VITE_BACKEND_URL}`;

function Dashboard() {
  const [fileList, setFileList] = useState<File[]>([]);
  const [events, setStatus] = useState<any>([]);

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

    await fetch("http://localhost:4000/upload", {
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
    const eventSource = new EventSource(`${BACKEND_URL}/sse`);
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
          paddingBottom: "1rem",
        }}
      >
        <div>
          <b>Current state of the machine: </b>
        </div>
        {currentState ? (
          <div style={{ display: "flex", gap: "1rem" }}>
            <span>JOB ID: {currentState.jobId}</span>
            <span>Status: {statusMap[currentState.status]}</span>
          </div>
        ) : (
          <div>IDLE</div>
        )}
      </div>
      {events.length > 0 ? (
        <div>
          <div>
            <b>Real time Events: </b>
          </div>
          {events?.map((status: any) => {
            const { payload } = status;
            return (
              <div
                key={`${payload.jobId}-${payload.status}`}
                style={{ display: "flex", gap: "1rem" }}
              >
                <span>JOB ID: {payload.jobId}</span>
                <span>Status: {payload.status}</span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
