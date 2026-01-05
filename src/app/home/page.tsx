"use client";

import { SearchInput } from "@/components/atomic/SearchInput";
import { ChevronRight } from "lucide-react";
import { useProjectsStore, UserProject } from "@/stores/user-project.store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/atomic/Header";
import {
  ChildrenProject,
  useChildrenProjectsStore,
} from "@/stores/children-project.store";
import { TabElement } from "@/components/atomic/TabElement";

interface ClientCardProps {
  name: string;
  id: string;
}

const ClientCard = ({ id, name }: ClientCardProps) => {
  const { setCurrentProjectId } = useProjectsStore();
  const router = useRouter();

  return (
    <div
      className="cursor-pointer px-7 border rounded-lg py-6 flex justify-between border-[#E6E6E6] hover:border-black transition-colors duration-200"
      onClick={() => {
        setCurrentProjectId(id);
        router.push(`/clients/${id}/info`);
      }}
    >
      <h2 className="font-semibold text-xl">{name}</h2>
      <ChevronRight size={30} color="#999999" />
    </div>
  );
};

interface ProjectCardProps {
  name: string;
  id: string;
}

const ProjectCard = ({ id, name }: ProjectCardProps) => {
  const { setCurrentProjectId } = useProjectsStore();
  const router = useRouter();

  return (
    <div
      className="cursor-pointer px-7 border rounded-lg py-6 flex justify-between border-[#E6E6E6] hover:border-black transition-colors duration-200"
      onClick={() => {
        setCurrentProjectId(id);
        router.push("/machines");
      }}
    >
      <h2 className="font-semibold text-xl">{name}</h2>
      <ChevronRight size={30} color="#999999" />
    </div>
  );
};

export default function HomePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<"projects" | "clients">(
    "projects"
  );
  const { projects, setProjects, setCurrentProjectId } = useProjectsStore();
  const { childrenProjects, setChildrenProjects, clearChildrenProjects } =
    useChildrenProjectsStore();
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);

      if (!session?.access_token) {
        clearChildrenProjects();
        setLoading(false);
        return;
      }

      setCurrentProjectId(null);
      clearChildrenProjects();

      try {
        const response = await fetch("/api/projects", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user projects");
        }

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

        const childrenResults = await Promise.all(
          toSave.map(async (proj): Promise<ChildrenProject[]> => {
            const response2 = await fetch("/api/projects/children", {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              method: "POST",
              body: JSON.stringify({
                domainId: proj.domainId,
              }),
            });

            if (!response2.ok) {
              return [];
            }

            const resultChildren = await response2.json();
            const domains: ChildrenProject[] = Array.isArray(
              resultChildren?.message?.domains
            )
              ? resultChildren.message.domains.map((domain: any) => ({
                  domainId: domain.domainId ?? domain.id,
                  domainName: domain.domainName ?? domain.name ?? "",
                }))
              : [];

            return domains;
          })
        );

        const flattenedChildren = childrenResults.flat();
        const userDomainIds = new Set(
          toSave.map((project) => project.domainId)
        );

        if (flattenedChildren.length) {
          const childOnly = flattenedChildren.filter(
            (child) => !userDomainIds.has(child.domainId)
          );

          const deduped: ChildrenProject[] = [];

          childOnly.forEach((child) => {
            const exists = deduped.some(
              (project) => project.domainId === child.domainId
            );
            if (!exists) {
              deduped.push(child);
            }
          });

          setChildrenProjects(deduped);
        } else {
          setChildrenProjects([]);
        }
      } catch (error) {
        console.error(error);
        clearChildrenProjects();
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [
    session,
    setCurrentProjectId,
    setProjects,
    clearChildrenProjects,
    setChildrenProjects,
  ]);

  return (
    <div className="flex flex-col h-full">
      <Header />

      <div className="flex items-center p-10 px-22  bg-gradient-to-r from-[#EC9C1B] via-[#E2C31C] to-[#3AA3F5] text-white shadow-lg  h-35">
        <h1 className="text-4xl font-bold">Bem-vindo</h1>
      </div>

      <div className="px-21 flex-1">
        <div className="flex flex-col">
          <div className="mt-6">
            <ul
              role="tablist"
              className="flex gap-9 border-b flex flex-row justify-center font-medium"
            >
              <TabElement
                name="Projetos"
                selected={selectedTab === "projects"}
                setSelected={() => setSelectedTab("projects")}
              />
              <TabElement
                name="Clientes"
                selected={selectedTab === "clients"}
                setSelected={() => setSelectedTab("clients")}
              />
            </ul>
          </div>

          <div className="flex justify-between mb-8 mt-6">
            <SearchInput />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10 text-gray-500">
              Carregando projetos...
            </div>
          ) : selectedTab === "projects" ? (
            <div className="grid grid-cols-3 px-5 gap-10">
              {projects.length === 0 ? (
                <p className="text-gray-500 col-span-3">
                  Nenhum projeto disponível.
                </p>
              ) : (
                projects.map((project) => (
                  <ProjectCard
                    key={project.project.id}
                    id={project.project.id}
                    name={project.project.name}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 px-5 gap-10">
              {childrenProjects.length === 0 ? (
                <p className="text-gray-500 col-span-3">
                  Nenhum cliente disponível.
                </p>
              ) : (
                childrenProjects.map((p) => (
                  <ClientCard
                    key={p.domainId}
                    id={p.domainId}
                    name={p.domainName}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
