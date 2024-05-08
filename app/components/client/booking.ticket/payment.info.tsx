"use client";

import { useAppSelector } from "@/app/redux/hook";
import { CreditCardOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Radio, RadioChangeEvent, Row } from "antd";
import React, { useState } from "react";

export const PaymentInfo = () => {
  const user = useAppSelector((state) => state.account.user);
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  return (
    <div>
      <Row gutter={16}>
        <Col span={24} md={24}>
          <UserOutlined style={{ fontSize: 30 }} />
          <span className="text-xl pl-3">THÔNG TIN THANH TOÁN</span>
        </Col>

        <Col span={24} md={24}>
          <Row style={{ paddingTop: 10 }}>
            <span className=" pb-2">Họ tên: </span>
            <span className="pl-12 font-bold">{user.name}</span>
          </Row>
          <Row>
            <span className="pb-2">Email: </span>
            <span className="pl-12 font-bold">{user.email}</span>
          </Row>
        </Col >
        <Col span={24} md={24} style={{ marginTop: 20 }}>
          <CreditCardOutlined style={{ fontSize: 30 }} />
          <span className="text-xl pl-3">PHƯƠNG THỨC THANH TOÁN</span>
          <Row style={{ paddingTop: 10 }}>
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>QR Pay</Radio>
              <Radio value={2} disabled>
                MoMo
              </Radio>
              <Radio value={3} disabled>
                ZaloPay
              </Radio>
            </Radio.Group>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
