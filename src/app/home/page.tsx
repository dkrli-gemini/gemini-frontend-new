"use client";

import { SearchInput } from "@/components/atomic/SearchInput";
import { ChevronRight } from "lucide-react";
import { useProjectsStore, UserProject } from "@/stores/user-project.store";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/atomic/Header";
import {
  ChildrenProject,
  useChildrenProjectsStore,
} from "@/stores/children-project.store";
import { TabElement } from "@/components/atomic/TabElement";
import { Modal } from "@/components/atomic/Modal";

interface ClientCardProps {
  name: string;
  id: string;
}

const ClientCard = ({ id, name }: ClientCardProps) => {
  const { setCurrentProjectId, setCurrentDomainId } = useProjectsStore();
  const router = useRouter();

  return (
    <div
      className="cursor-pointer px-7 border rounded-lg py-6 flex justify-between border-[#E6E6E6] hover:border-black transition-colors duration-200"
      onClick={() => {
        setCurrentProjectId(id);
        setCurrentDomainId(id);
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

interface ParentDomainOption {
  domainId: string;
  domainName: string;
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
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [parentDomainId, setParentDomainId] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [childKind, setChildKind] = useState<"CLIENT" | "DISTRIBUTOR">(
    "CLIENT"
  );
  const [billingType, setBillingType] = useState<"POOL" | "PAYG">("POOL");
  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [createOwnerUser, setCreateOwnerUser] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerUsername, setOwnerUsername] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const { projects, setProjects, setCurrentProjectId, currentDomainId } =
    useProjectsStore();
  const { childrenProjects, setChildrenProjects, clearChildrenProjects } =
    useChildrenProjectsStore();
  const { data: session } = useSession();

  const parentDomainOptions = useMemo<ParentDomainOption[]>(() => {
    const unique = new Map<string, ParentDomainOption>();
    childrenProjects.forEach((child) => {
      if (!child.isDistributor) {
        return;
      }
      if (!unique.has(child.domainId)) {
        unique.set(child.domainId, {
          domainId: child.domainId,
          domainName: child.domainName,
        });
      }
    });
    projects.forEach((project) => {
      if (!project.isDistributor) {
        return;
      }
      if (!unique.has(project.domainId)) {
        unique.set(project.domainId, {
          domainId: project.domainId,
          domainName: project.domainName,
        });
      }
    });
    return Array.from(unique.values());
  }, [childrenProjects, projects]);

  const fetchProjects = useCallback(async () => {
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
          isDistributor: Boolean(p.isDistributor),
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
                isDistributor: Boolean(domain.isDistributor),
              }))
            : [];

          return domains;
        })
      );

      const flattenedChildren = childrenResults.flat();
      const userDomainIds = new Set(toSave.map((project) => project.domainId));

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
  }, [
    clearChildrenProjects,
    session?.access_token,
    setChildrenProjects,
    setCurrentProjectId,
    setProjects,
  ]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (!parentDomainId && parentDomainOptions.length > 0) {
      setParentDomainId(parentDomainOptions[0].domainId);
    }
  }, [parentDomainId, parentDomainOptions]);

  const openCreateModal = () => {
    if (parentDomainOptions.length === 0) {
      setCreateError(
        "Você não possui domínio distribuidor para criar organizações filhas."
      );
      return;
    }
    setCreateError(null);
    setCreateSuccess(null);
    if (
      currentDomainId &&
      parentDomainOptions.some((option) => option.domainId === currentDomainId)
    ) {
      setParentDomainId(currentDomainId);
    } else if (parentDomainOptions.length > 0) {
      setParentDomainId(parentDomainOptions[0].domainId);
    }
    setCreateModalOpen(true);
  };

  const handleCreateOrganization = async () => {
    setCreateError(null);
    setCreateSuccess(null);

    if (!session?.access_token) {
      setCreateError("Sessão inválida. Faça login novamente.");
      return;
    }

    if (!parentDomainId || !organizationName || !accountEmail || !accountPassword) {
      setCreateError("Preencha domínio pai, nome, email da conta e senha da conta.");
      return;
    }

    if (createOwnerUser && (!ownerName || !ownerEmail || !ownerPassword)) {
      setCreateError(
        "Preencha nome, email e senha do usuário dono para criar o responsável."
      );
      return;
    }

    setCreateLoading(true);

    try {
      const payload: Record<string, unknown> = {
        parentDomainId,
        name: organizationName,
        accountEmail,
        accountPassword,
        childKind,
        billingType,
      };

      if (createOwnerUser) {
        payload.ownerUser = {
          name: ownerName,
          email: ownerEmail,
          username: ownerUsername || ownerEmail.split("@")[0],
          password: ownerPassword,
        };
      } else {
        payload.ownerId = session.user?.id;
      }

      const response = await fetch("/api/domain/create-child", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          result?.message ??
          result?.error ??
          "Não foi possível criar a organização.";
        setCreateError(String(message));
        setCreateLoading(false);
        return;
      }

      setCreateSuccess("Organização criada com sucesso.");
      setOrganizationName("");
      setAccountEmail("");
      setAccountPassword("");
      setOwnerName("");
      setOwnerEmail("");
      setOwnerUsername("");
      setOwnerPassword("");

      await fetchProjects();
    } catch (error) {
      console.error(error);
      setCreateError("Erro inesperado ao criar organização.");
    } finally {
      setCreateLoading(false);
    }
  };

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
            {selectedTab === "clients" && (
              <div className="flex flex-col items-end gap-1">
                <button
                  className="bg-[#0f3759] text-white rounded-md px-4 py-2 text-sm font-semibold disabled:bg-[#a8b3be]"
                  onClick={openCreateModal}
                  disabled={parentDomainOptions.length === 0}
                >
                  Nova organização
                </button>
                {parentDomainOptions.length === 0 && (
                  <span className="text-xs text-gray-500">
                    Sem domínio distribuidor disponível
                  </span>
                )}
              </div>
            )}
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

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        header={<h2 className="text-lg font-semibold">Criar organização</h2>}
        footer={
          <>
            <button
              className="col-span-2 bg-[#d7d7d7] text-[#333] rounded-md px-4 py-2 text-sm font-semibold"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="col-span-2 bg-[#0f3759] text-white rounded-md px-4 py-2 text-sm font-semibold"
              onClick={handleCreateOrganization}
              disabled={createLoading}
            >
              {createLoading ? "Criando..." : "Criar"}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm font-medium text-gray-700">
            Domínio pai
            <select
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={parentDomainId}
              onChange={(event) => setParentDomainId(event.target.value)}
            >
              <option value="">Selecione</option>
              {parentDomainOptions.map((option) => (
                <option key={option.domainId} value={option.domainId}>
                  {option.domainName}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Tipo
            <select
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={childKind}
              onChange={(event) =>
                setChildKind(event.target.value as "CLIENT" | "DISTRIBUTOR")
              }
            >
              <option value="CLIENT">Cliente</option>
              <option value="DISTRIBUTOR">Distribuidor</option>
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Nome da organização
            <input
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={organizationName}
              onChange={(event) => setOrganizationName(event.target.value)}
              placeholder="Ex.: Cliente XPTO"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Política de cobrança
            <select
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={billingType}
              onChange={(event) =>
                setBillingType(event.target.value as "POOL" | "PAYG")
              }
            >
              <option value="POOL">POOL (limitado por recurso)</option>
              <option value="PAYG">PAYG (paga por recurso)</option>
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Email da conta Cloud
            <input
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={accountEmail}
              onChange={(event) => setAccountEmail(event.target.value)}
              placeholder="conta@empresa.com"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Senha da conta Cloud
            <input
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              value={accountPassword}
              onChange={(event) => setAccountPassword(event.target.value)}
              type="password"
              placeholder="Senha da conta"
            />
          </label>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={createOwnerUser}
            onChange={(event) => setCreateOwnerUser(event.target.checked)}
          />
          Criar usuário dono para esta organização
        </label>

        {createOwnerUser && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <label className="text-sm font-medium text-gray-700">
              Nome do usuário dono
              <input
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                value={ownerName}
                onChange={(event) => setOwnerName(event.target.value)}
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Email do usuário dono
              <input
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                value={ownerEmail}
                onChange={(event) => setOwnerEmail(event.target.value)}
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Username (opcional)
              <input
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                value={ownerUsername}
                onChange={(event) => setOwnerUsername(event.target.value)}
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Senha do usuário dono
              <input
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                type="password"
                value={ownerPassword}
                onChange={(event) => setOwnerPassword(event.target.value)}
              />
            </label>
          </div>
        )}

        {createError && (
          <p className="mt-4 text-sm text-red-600">{createError}</p>
        )}
        {createSuccess && (
          <p className="mt-4 text-sm text-green-600">{createSuccess}</p>
        )}
      </Modal>
    </div>
  );
}
