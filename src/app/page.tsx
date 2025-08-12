"use client";

import { Button } from "@/components/atomic/Button";
import { PageHeader } from "@/components/atomic/PageHeader";
import { SearchInput } from "@/components/atomic/SearchInput";
import { Header } from "@/components/Header";
import { VirtualMachinesTable } from "@/components/atomic/VirtualMachineTable";
import { Search, Plus, ArrowRight, ChevronRight } from "lucide-react";
import AddIcon from "@mui/icons-material/Add";
import { Sidebar } from "@/components/atomic/Sidebar";
import {
  Project,
  useProjectsStore,
  UserProject,
} from "@/stores/user-project.store";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export interface ProjectComponentProps {
  name: string;
  id: string;
}

const ProjectComponent = (props: ProjectComponentProps) => {
  const { setCurrentProjectId } = useProjectsStore();

  return (
    <div
      className="cursor-pointer px-7 border rounded-lg py-6 flex justify-between border-[#E6E6E6] hover:border-black transition-colors duration-200"
      onClick={() => {
        setCurrentProjectId(props.id);
        redirect("/machines");
      }}
    >
      <h2 className="font-semibold text-xl">{props.name}</h2>
      <ChevronRight size={30} color="#999999" />
    </div>
  );
};

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const { projects, setProjects, setCurrentProjectId } = useProjectsStore();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);

      setCurrentProjectId(null);
      if (session?.access_token) {
        const response = await fetch("/api/projects", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          const toSave: UserProject[] = result.message.projectMembers.map(
            (p: any) => ({
              id: p.id,
              userId: p.userId,
              role: p.role,
              domainId: p.domainId,
              domainName: p.domainName,
              project: {
                id: p.project.id,
                name: p.project.name,
              },
            })
          );
          setProjects(toSave);
        }
      }

      setLoading(false);
    }

    fetchProjects();
  }, [session, setProjects, setCurrentProjectId]);

  return (
    <div className="flex flex-col h-full">
      <Header />

      <div className="flex items-center p-10 px-22  bg-gradient-to-r from-[#EC9C1B] via-[#E2C31C] to-[#3AA3F5] text-white shadow-lg  h-35">
        <h1 className="text-4xl font-bold">Bem-vindo</h1>
      </div>

      <div className="px-21">
        <div className="flex justify-between mb-8 mt-6">
          <SearchInput />
        </div>

        <div className="grid grid-cols-3 px-5 gap-10">
          {projects.map((project) => (
            <ProjectComponent
              key={project.id}
              id={project.project.id}
              name={project.project.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
