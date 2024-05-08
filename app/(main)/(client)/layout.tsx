import React from "react";
import { LayoutClient } from "@/app/components/layout-client";
import { LayoutApp } from "@/app/components/layout-app";


export default function LayoutClientPage({
  children
}: {children: React.ReactNode}) {

  return (
      <LayoutClient>
        <LayoutApp>
        {children}
        </LayoutApp>
      </LayoutClient>
  )
}