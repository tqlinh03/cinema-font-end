"use client";

import { Col, Divider, Row } from "antd";
import { useEffect, useState } from "react";
import { Infor } from "./infor";
import { BookedTickets } from "./bookedTickets";
import { useAppSelector } from "@/app/redux/hook";
import { useRouter } from "next/navigation";

export const Account = () => {
  const [selectedBox, setSelectedBox] = useState("infor");
  const handleBoxClick = (box: string) => {
    setSelectedBox(box);
  };
  const router = useRouter(); 
 
  const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);

  return (
    <>
      <ul className="flex space-x-4 mt-10 list-none">
        <li className="mr-4">
          <span
            className={`p-2  ${
              selectedBox === "infor"
                ? "bg-blue-900 text-white font-bold"
                : ""
            }`}
            onClick={() => handleBoxClick("infor")}
          >
            THÔNG TIN TÀI KHOẢN
          </span>
        </li>
        <li className="mr-4">
          <span
            className={`p-2  ${
              selectedBox === "ticket" ? "bg-blue-900 text-white font-bold" : ""
            }`}
            onClick={() => handleBoxClick("ticket")}
          >
            VÉ ĐÃ ĐẶT
          </span>
        </li>
        <li className="mr-4">
          <span
            className={`p-2  ${
              selectedBox === "voucher" ? "bg-blue-900 text-white font-bold" : ""
            }`}
            onClick={() => handleBoxClick("voucher")}
          >
            VOUCHER
          </span>
        </li>
      </ul>
      <Divider className="bg-zinc-300" style={{ margin: 0, marginTop: 14 }} />
      {selectedBox === "infor" && <Infor/>}
      {selectedBox === "ticket" && <BookedTickets/>}
    </>
  );
};
