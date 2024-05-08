
import { Role } from "@/app/components/admin/role/role"
import { useAppDispatch } from "@/app/redux/hook"
import { fetchRole } from "@/app/redux/slice/roleSlide";
import { useEffect } from "react";

export default function RolePage() {
  return (
    <>
      <Role/>
    </>
  )
}