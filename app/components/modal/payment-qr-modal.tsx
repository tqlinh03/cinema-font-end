"use client";

import React from "react";
import { Image, Modal } from "antd";
import { IMovie } from "@/app/types/backend";

interface Props {
  price: number;
  ticketCode: string;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

interface PaymentRecordPrpos {
  id: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const PaymentQrModal = ({
  price,
  ticketCode,
  isModalOpen,
  setIsModalOpen,
}: Props) => {
  const BANK_ID = "MB";
  const ACCOUNT_NO = "0373642687";
  const TEMPLATE = "print";
  const AMOUNT = `${price}`;
  const DESCRIPTION = `${ticketCode}`;
  const paymentQR = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${AMOUNT}&addInfo=${DESCRIPTION}`;

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={450}
        footer={null}
      >
        <Image preview={false} width={400} height={500} src={paymentQR} />
      </Modal>
    </>
  );
};

export default PaymentQrModal;
