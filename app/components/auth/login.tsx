"use client";
import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message, notification } from "antd";
import { useDispatch } from "react-redux";
import { setUserLoginInfo } from "@/app/redux/slice/accountSlide";
import { callLogin, callSendCodeEmail } from "@/app/config/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ActiveAccount } from "./active-account";

export const Login = () => {
  const route = useRouter();
  const dispatch = useDispatch();
  const [hidden, setHiden] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [isSubmit, setIsSubmit] = useState(false);

  const onFinish = async (values: any) => {
    const { username, password } = values;
    setEmail(username);
    setIsSubmit(true);
    try {
      const res = await callLogin(username, password);
      console.log("res: ", res);
      if (res?.data.access_token) { 
        localStorage.setItem("access_token", res.data.access_token);
        route.push("/")
        // window.location.href = "/";
      }
      if (res?.data.businessErrorCode === 303) {
        setHiden(false);
        await callSendCodeEmail(email);
      }

      if (res?.data.businessErrorCode === 304) {
        message.warning(res?.data.error);
      }
    } catch (error) {
      console.error("Error login:", error);
    }
    setIsSubmit(false);
  };

  return (
    <div>
      {hidden === false ? (
        <ActiveAccount email={email} hidden={hidden}/>
      ) : (
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // style={{ width: 300 }}
        >
          <div className="text-2xl mt-5 mb-10 flex justify-center">
            Đăng Nhập
          </div>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập Username!" }]}
          >
            <Input
              className="h-10"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            // style={{ marginBottom: 5 }}
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              className="h-10"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          {/* <Form.Item   style={{ marginBottom: 5 }}>
            <div className="flex justify-end pr-2 text-sm cursor-pointer hover:text-blue-400"><span>Quên mật khẩu</span></div>
          </Form.Item> */}

          <Form.Item>
            <Button
              loading={isSubmit}
              type="primary"
              htmlType="submit"
              className="w-full pt-4 mb-2"
              style={{ height: 40 }}
            >
              Đăng nhập
            </Button>
            <span className="m-1">Chưa có tài khoản?</span>
            <Link href="/register">Đăng ký ngay</Link>
            <br />
          </Form.Item>
        </Form>
      )}
    </div>
  );
};
