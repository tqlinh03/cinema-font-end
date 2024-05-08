'use client'

import { useAppSelector } from "@/app/redux/hook";
import { Result } from "antd";
import React, { useEffect, useState } from "react";

interface IProps {
  hideChildren?: boolean;
  children: React.ReactNode;
  permission: {
    method: string, 
    apiPath: string,
     module: string
  }
}

export const Access = (props: IProps) => {
  const { permission, hideChildren = false } = props
  const [allow, setAllow ] = useState<boolean>(true)
  const permissions = useAppSelector((state) => state.account.user.role.permissions);
   useEffect(() => {
    if(permissions.length) {
      const check =  permissions.find(item => 
        item.apiPath === permission.apiPath
        && item.method === permission.method
        && item.module === permission.module
      )
      if(check) {
        setAllow(true)
      } else {
        setAllow(false)
      }
    }
  },[permissions])

  return (
    <>
      { allow === true  ?
      <>{props.children}</>
      :
      <>
        { hideChildren === false  ? 
          <Result
            status="403"
            title="Access is denied"
            subTitle="Sory, you do not have permission to access this information"
          />
          :
          <> 
          </>
        }
      </>
    }
    </>
  )
}