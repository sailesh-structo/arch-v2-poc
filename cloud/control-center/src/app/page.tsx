/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { api } from "~/trpc/server";
import { statusMap } from "~/configs/status";

export default async function Home() {
  const hello = await api.jobs.hello.query({
    text: "from Structo Control center",
  });
  const jobs = await api.jobs.getAllJobs.query().catch((err) => {
    console.log(err);
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>
        </div>
        {jobs?.length ? (
          <div className="flex flex-col gap-5">
            <span className="text-2xl">Total Jobs: {jobs?.length}</span>
          </div>
        ) : null}
        <div className="flex flex-col gap-5">
          {jobs?.map((job) => {
            return (
              <div
                key={`${job.jobId}-${job.status}`}
                className="flex flex-col gap-1 rounded-md border-2 border-white p-2"
              >
                <span>Machine ID: {job.machineId}</span>
                <span>JOB ID: {job.jobId}</span>
                <span>Status: {statusMap[job.status]}</span>
                <span>Timestamp: {`${new Date(job.timestamp)}`}</span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
