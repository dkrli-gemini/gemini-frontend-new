"use client";

import AclComponent from "@/components/atomic/AclComponent";
import { Button } from "@/components/atomic/Button";
import { PageHeader2 } from "@/components/atomic/PageHeader2";
import { SearchInput } from "@/components/atomic/SearchInput";
import { Header } from "@/components/Header";
import AddIcon from "@mui/icons-material/Add";
import { Modal } from "@/components/atomic/Modal";
import { Input } from "@/components/atomic/Input";

import Head from "next/head";
import { useEffect, useState } from "react";
import { useAclStore } from "@/stores/acl.store";
import { useSession } from "next-auth/react";
import { useProjectsStore } from "@/stores/user-project.store";

export default function AclPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const { acls, setAcl } = useAclStore();
  const { currentProjectId } = useProjectsStore();

  useEffect(() => {
    async function fetchAcls() {
      setLoading(true);
      if (session.data?.access_token) {
        const response = await fetch(`/api/acl`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data.access_token}`,
          },
          body: JSON.stringify({
            domainId: currentProjectId,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result);

          setAcl(result.message.lists);
        }
      }
      setLoading(false);
    }

    fetchAcls();
  }, [session, setAcl]);

  return (
    <div className="flex flex-col h-full">
      <Header />

      <PageHeader2
        title="Firewall"
        el1name="Total de listas"
        el1value={String(acls.length)}
        el2name="Listas em uso"
        el2value={"1"}
      />

      <div className="flex flex-col  -translate-y-10">
        <div className="px-21">
          <div className="flex justify-between mb-8">
            <SearchInput />
            <Button variant="primary" className="w-fit">
              <AddIcon /> Nova ACL
            </Button>
          </div>
          <div className="flex flex-col gap-5">
            {acls.map((acl) => (
              <AclComponent
                name={acl.name}
                description={acl.description}
                key={acl.id}
                rules={acl.rules}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
