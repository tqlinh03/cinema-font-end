"use client";

import { callUpdateUser } from "@/app/config/api";
import { useAppSelector } from "@/app/redux/hook";
import { fetchAccount } from "@/app/redux/slice/accountSlide";
import { IUser } from "@/app/types/backend";
import { Button, Form, Input, Select, message } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const validateMessages = {
  required: "${label} is required!",
};

export const Infor = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.account.user);
  console.log(user);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        email: user.email,
        name: user.name,
        address: user.address,
        gender: user.gender,
      });
    }
  }, [user]);

  const onFinish = async (values: IUser) => {
    const { email, name, address,gender } = values;
    const updateValues = { email, name, address, gender };
    try {
      const res = await callUpdateUser(+user._id, updateValues);
      if(res.data){
        dispatch(fetchAccount() as any)
        message.success("Cập nhật thành công");
      }
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  return (
    <>
      <div className="mt-10">
        <Form
          name="nest-messages"
          labelCol={{ flex: "110px" }}
          labelAlign="left"
          labelWrap
          form={form}
          wrapperCol={{ flex: 1 }}
          colon={false}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input type="email" disabled />
          </Form.Item>

          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              // onChange={handleChange}
              options={[
                { value: "female", label: "Female" },
                { value: "male", label: "Male" },
                { value: "other", label: "Other" },
              ]}
            />
          </Form.Item>

          <Form.Item className="">
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
