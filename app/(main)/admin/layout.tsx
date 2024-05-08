import React from "react";
import { LayoutAdmin } from "../../components/layout-admin";
import { LayoutApp } from "@/app/components/layout-app";

export default function LayoutSetUp({
  children
}: {children: React.ReactNode}) {

  return (
      <LayoutAdmin>
        <LayoutApp>
          {children}
        </LayoutApp>
      </LayoutAdmin>
  )
}