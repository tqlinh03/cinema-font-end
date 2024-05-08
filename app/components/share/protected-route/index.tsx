'use client'

import { useAppSelector } from "@/app/redux/hook"
import { useSelector } from "react-redux"
import NotPermitted from "./not-permitted"
import Loading from "../loading"
import { useRouter } from "next/navigation"

const RoleBaseRoute = (props: any) => {
  const user = useAppSelector((state) => state.account.user)
  const userRole = user.name;

  if(userRole !== "NORMAL_USER") {
    return(<>{props.children}</>)
  } else {
    return <><NotPermitted/></>
  }
}

const PromittedRole = (props: any) => {
  const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated)
  const isloading = useAppSelector((state) => state.account.isLoading)
  const route = useRouter()
  return(
    <>
      { isloading === true } ?
        <Loading/>
        : 
        { isAuthenticated === true } ?
          <>
            <RoleBaseRoute>
              {props.children}
            </RoleBaseRoute>
          </>
          :
          {route.push("/login")}
    </> 
  )
}