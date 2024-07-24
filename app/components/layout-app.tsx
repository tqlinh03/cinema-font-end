"use client"
import React, { useEffect } from "react"
import { useDispatch } from "react-redux";
import { useAppSelector } from "../redux/hook";
import { message } from "antd";
import { fetchAccount, setRefreshTokenAction } from "@/app/redux/slice/accountSlide";
import { useRouter } from "next/navigation";

export const LayoutApp = ({
  children
}: {children: React.ReactNode}) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const isRefreshToken = useAppSelector((state) => state.account.isRefreshToken);
  const errorRefreshToken = useAppSelector((state) => state.account.errorRefreshToken);

  // //handle refresh token error
  useEffect(() => {
    if (isRefreshToken === true) {
      localStorage.removeItem("access_token");
      message.error(errorRefreshToken);
      dispatch(setRefreshTokenAction({ status: false, message: "" }));
      router.push("/login");
    }
  }, [isRefreshToken]);

  useEffect(() => {
    if( window.location.pathname === "/login" 
      || window.location.pathname === "/register")
      return;
    const accessToken = localStorage.getItem("access_token") as string;
    dispatch(fetchAccount({ accessToken }) as any);
  }, [])

  return (
    <>
      {children}
    </>
  )
}