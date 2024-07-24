"use client";
import React, { useState } from "react";
import { Button, Form, Image, Input, List, Select, Switch, message } from "antd";
import { callCreateRoom, callCreateStaff } from "@/app/config/api";
import { UploadButton } from "@/app/utils/uploadthing";

const CreateStaff = () => {
  const [imgUrl, setImgUrl] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };


  const onFinish = async (values: any) => {
    try {
      const {img, firstName, lastName, email, 
        password, address, phone, hourly_rate, position} = values;

      const staff ={img, firstName, lastName, email, 
        password, address, phone, hourly_rate, position, gender}
      const res = await callCreateStaff(staff);
    console.log("res", res);

      if (res.status === 200) {
        message.success("Tạo thành công");
        form.resetFields();
      } else {
        message.error("Tạo thất bại");
      } 
    } catch (error) {
      console.log(error);
    }
  };

  const validateMessages = {
    required: "${label} Không được để trống!",
  };

  return (
    <div style={{ display: "flex" }}>
      <Form
        title="Create staff"
        {...layout}
        form={form}
        name="create-staff"
        labelAlign="left"
        onFinish={onFinish}
        style={{ width: "100%", margin: "60px", marginTop: 10, padding: "20px" }}
        validateMessages={validateMessages}
        className="text-2xl font-medium mb-10"
      >
        <div className="text-2xl mb-10 flex justify-start">
          THÊM NHÂN VIÊN MỚI
          </div>

          <Form.Item name="img" label="Ảnh">
            <div className="flex">
              <div className="mr-5">
                <Image width={200} src={imgUrl} preview={false} />
              </div>
              <div>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={async (res: any) => {
                    setImgUrl(res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    message.error(error.message);
                  }}
                />
              </div>
            </div>
          </Form.Item>
        <Form.Item name="firstName" label="Họ và tên đệm" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="lastName" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

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

        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
              
        <Form.Item name="phone" label="Số điện thoại"
          rules={[
              {
                required: true,
                message: "Hãy nhập mật khẩu!",
              },
              {
                pattern: /^[0-9]{10}$/,
                message: "Số điện thoại hợp lệ phải có 10 số và không chứa ký tự!",
              },
            ]}>
          <Input />
        </Form.Item>

        <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
        <Select
      defaultValue="nam"
      style={{ width: 120 }}
      onChange={setGender}
      options={[
        { value: 'nam', label: 'Nam' },
        { value: 'nữ', label: 'Nữ' },
        { value: 'khác', label: 'Khác' },
      ]}
    />
        </Form.Item>

        <Form.Item name="hourly_rate" label="Tỉ lệ lương theo giờ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="position" label="Chức vụ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              style={{ height: 40, width: "100%" }}
              type="primary"
              htmlType="submit"
            >
              Thêm nhân viên
            </Button>
          </Form.Item>
      </Form>
   
    </div>
  );
};

export default CreateStaff;
