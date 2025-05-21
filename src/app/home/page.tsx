"use client";

import Navbar from "@/components/app-navbar";
import ClientPopup from "@/components/client-popup";
import HorizontalScroller from "@/components/horizontal-scroller";
import ProjectPopup from "@/components/project-popup";
import { Separator } from "@/components/ui/separator";
import { useDomainMemberStore } from "@/stores/domain-member.store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const session = useSession();
  const domainMemberStore = useDomainMemberStore();

  useEffect(() => {
    if (session.status == "authenticated") {
      domainMemberStore.fetchDomainMembers(session.data.access_token!);
    }
  }, [session, domainMemberStore.fetchDomainMembers]);

  console.log(session);
  return (
    <div className="flex flex-col h-screen flex-1">
      <Navbar />
      <div className="flex h-20 flex-1">
        <div className="p-10 flex flex-col w-full gap-30">
          <h1 className="font-bold text-5xl">
            Bem vindo,{" "}
            {session.status == "authenticated"
              ? session.data!.user.name?.split(" ")[0]
              : ""}
          </h1>
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-semibold text-xl">Meus projetos</h2>
              <Separator />
              <HorizontalScroller
                items={domainMemberStore.members.map((member) => (
                  <ProjectPopup
                    key={member.id}
                    projectName={
                      member.domainName == member.project.name
                        ? `${member.project.name} (Root)`
                        : member.project.name
                    }
                    projectDomain={member.domainName}
                    projectId={member.project.id}
                  />
                ))}
              />
            </div>
            <div>
              <h2 className="font-semibold text-xl">Meus domínios</h2>
              <Separator />
              <HorizontalScroller
                items={domainMemberStore.members.map((member) => (
                  <ClientPopup
                    key={member.id}
                    clientName={member.domainName}
                    clientId={member.domainId}
                  />
                ))}
              />
              {/* <ProjectPopup
                projectName="NibloClient"
                projectDomain=""
                projectId="g"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
