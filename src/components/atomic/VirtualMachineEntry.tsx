"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "./StatusBadge";
import Switch from "./Switch";
import { Button } from "./Button";
import Link from "next/link";
import { useMachineJobStore } from "@/stores/machine-job.store";
import { useSession } from "next-auth/react";
import { useVMStore } from "@/stores/vm-store";

export interface VirtualMachineEntryProps {
  name: string;
  ip: string;
  status: string;
  id: string;
}

export const VirtualMachineEntry = (props: VirtualMachineEntryProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { data: session } = useSession();
  const { jobs, setJobState } = useMachineJobStore();
  const { setMachineStatus } = useVMStore();

  const isStarting = jobs[props.id]?.isStarting || false;
  const isStopping = jobs[props.id]?.isStopping || false;
  const jobId = jobs[props.id]?.jobId || null;

  const handleMachineState = async (
    machineId: string,
    currentState: string
  ) => {
    if (!session?.access_token) return;

    let endpoint = "";
    let action = "";

    if (currentState === "RUNNING") {
      endpoint = "/api/machines/stop";
      action = "stopping";
      setJobState(machineId, { isStopping: true, jobId: null });
    } else {
      endpoint = "/api/machines/start";
      action = "starting";
      setJobState(machineId, { isStarting: true, jobId: null });
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ machineId }),
      });

      if (response.ok) {
        const result = await response.json();
        setJobState(machineId, { jobId: result.jobId });
      } else {
        console.error(`Failed to ${action} machine:`, response.statusText);
        setJobState(machineId, { isStarting: false, isStopping: false, jobId: null });
      }
    } catch (error) {
      console.error(`Error ${action} machine:`, error);
      setJobState(machineId, { isStarting: false, isStopping: false, jobId: null });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const pollJobStatus = async () => {
      if (!jobId) return;

      try {
        const response = await fetch(
          `http://localhost:3003/jobs/status/${jobId}`
        );
        if (response.ok) {
          const result = await response.json();
          if (result.status === "DONE") {
            setMachineStatus(props.id, isStarting ? "RUNNING" : "STOPPED");
            setJobState(props.id, { isStarting: false, isStopping: false, jobId: null });
            clearInterval(interval);
          }
        } else {
          console.error("Failed to fetch job status:", response.statusText);
          setJobState(props.id, { isStarting: false, isStopping: false, jobId: null });
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error polling job status:", error);
        setJobState(props.id, { isStarting: false, isStopping: false, jobId: null });
        clearInterval(interval);
      }
    };

    if (jobId) {
      interval = setInterval(pollJobStatus, 2000); // Poll every 2 seconds
    }

    return () => clearInterval(interval);
  }, [jobId, props.id, isStarting, setJobState, setMachineStatus]);

  return (
    <tr
      className="border-b border-gray-100 last:border-b-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="p-4 font-medium text-gray-800 ">{props.name}</td>
      <td className="p-4 text-gray-600">{props.ip}</td>
      <td className="p-4 whitespace-nowrap">
        <StatusBadge status={props.status} pclassName="w-fit" />
      </td>
      <td className="p-4 py-4 w-50">
        <Switch
          checked={props.status === "RUNNING"}
          disabled={isStarting || isStopping}
          onCheckedChange={() => handleMachineState(props.id, props.status)}
        />
      </td>
      <td className=" w-100">
        {isHovered && (
          <div className="flex justify-center gap-5 items-center">
            <span className="cursor-pointer">
              <Link href={`/machines/${props.id}`}>Detalhes</Link>
            </span>
            <Button variant="primary" className="w-30">
              Console
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
};
