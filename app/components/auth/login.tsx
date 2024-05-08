"use client";
import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, notification } from "antd";
import { useDispatch } from "react-redux";
import { setUserLoginInfo } from "@/app/redux/slice/accountSlide";
import { callLogin } from "@/app/config/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Login = () => {
  const route = useRouter();
  const dispatch = useDispatch();
  const [isSubmit, setIsSubmit] = useState(false); 

  const onFinish = async (values: any) => {
    const { username, password } = values;
    setIsSubmit(true);
    try {
      const res = await callLogin(username, password)
      if (res?.data) {
        localStorage.setItem("access_token", res.data.access_token);
        dispatch(setUserLoginInfo(res.data.user));
        route.push("/")
        // window.location.href = "/";
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description:
            res.data.message && Array.isArray(res.data.message)
              ? res.data.message[0]
              : res.data.message,
          duration: 5,
        });
      }
    } catch (error) {
      console.error("Error fetching data login:", error);
    }
    setIsSubmit(false);
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <div className="text-xl mb-10 flex justify-center">Login</div>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your Username!" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button
          loading={isSubmit}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          Log in
        </Button>
        <span className="m-1">Or</span>
        <Link href="/register">register now!</Link>
      </Form.Item>
    </Form>
  );
};
