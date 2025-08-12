"use client";

import AclComponent from "@/components/atomic/AclComponent";
import { Button } from "@/components/atomic/Button";
import { PageHeader2 } from "@/components/atomic/PageHeader2";
import { SearchInput } from "@/components/atomic/SearchInput";
import { Header } from "@/components/Header";
import AddIcon from "@mui/icons-material/Add";

import Head from "next/head";
import { useState } from "react";

export default function AclPage() {
  const [modalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <Header />

      <PageHeader2
        title="ACL's"
        el1name="Total de listas"
        el1value={"0"}
        el2name="Listas em uso"
        el2value={"0"}
      />

      <div className="flex flex-col  -translate-y-10">
        <div className="px-21">
          <div className="flex justify-between mb-8">
            <SearchInput />
            <Button
              variant="primary"
              className="w-fit"
              onClick={() => setIsModalOpen(true)}
            >
              <AddIcon /> Nova ACL
            </Button>
          </div>

          <AclComponent />
        </div>
      </div>
    </div>
  );
}
