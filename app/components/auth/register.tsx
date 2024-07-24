"use client";
import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { callRegister } from "@/app/config/api";
import Link from "next/link";
import { ActiveAccount } from "./active-account";

export const Register = () => { 
  const [hidden, setHiden] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");

  const onFinish = async (values: any) => {
    const { email, password, firstName, lastName } = values;
    const user = { email, password, firstName, lastName };
    try {
      const res = await callRegister(user);
      if (res.data) {
        setEmail(email);
        setHiden(false);
      } else {
        message.warning("Tài khoản đã tồn tại!");
      }
    } catch (error) {
      message.error("Đăng ký tài khoản thất bại!");
    }
  };

  return (  
    <div>
      {hidden === false ? (
        <ActiveAccount email={email} hidden={hidden} />
      ) : (
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ marginRight: 15, marginLeft: 15}}
          layout="vertical"
        >
          <div className="text-2xl mt-2 mb-7 flex justify-center">
            <span className="font-medium text-xl text-gray-700">
              ĐĂNG KÝ TÀI KHOẢN
            </span>
          </div>

          <Form.Item
            style={{ marginBottom: 10 }}
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                message: "Email không hợp lệ!",
              },
              {
                required: true,
                message: "Hãy nhập email!",
              },
            ]}
          >
            <Input placeholder="vd: exemple@gmail.com" />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 10 }}
            name="firstName"
            label="Họ và tên đệm"
            rules={[
              {
                required: true,
                message: "Hãy nhập họ và tên đệm!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            style={{ marginBottom: 10 }}
            name="lastName"
            label="Tên"
            rules={[
              {
                required: true,
                message: "Hãy nhập tên của bạn!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 10 }}
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: "Hãy nhập mật khẩu!",
              },
              {
                min: 8,
                message: "Mật khẩu phải có ít nhất 8 ký tự!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 30 }}
            name="confirm"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Hãy nhập mật khẩu!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu mới bạn nhập không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              // loading={isSubmit}
              type="primary"
              htmlType="submit"
              className="w-full pt-4 mb-2"
              style={{ height: 40 }}
              // onClick={startCountdown}
            >
              <span className="text-base font-medium">ĐĂNG KÝ</span>
            </Button>
            <span className="m-1">Đã có tài khoản?</span>
            <Link href="/login">Đăng nhập</Link>
            <br />
          </Form.Item>
        </Form>
      )}
    </div>
  );
};
