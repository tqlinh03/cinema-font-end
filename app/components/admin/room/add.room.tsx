"use client";
import React, { useState } from "react";
import { Button, Form, Input, List, Switch, message } from "antd";
import { callCreateRoom } from "@/app/config/api";

const AddSeatsAndRows = () => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };


  const onFinish = async (values: any) => {
    try {
      const res = await callCreateRoom(values);
      if (res.status === 200) {
        message.success("Tạo phòng thành công");
        form.resetFields();
      } else {
        message.error("Tạo phòng thất bại");
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
        title="Create Room"
        {...layout}
        form={form}
        name="room"
        labelAlign="left"
        onFinish={onFinish}
        style={{ width: "100%", margin: "60px", padding: "20px" }}
        validateMessages={validateMessages}
        className="text-2xl font-medium mb-10"
      >
        <div className="text-2xl mb-10 flex justify-start">
          TẠO PHÒNG MỚI
            {/* {movieId != undefined
              ? "CÂP NHẬT TÔNG TIN PHIM"
              : "THÊM BỘ PHIM MỚI"} */}
          </div>
        <Form.Item name="name" label="Tên phòng" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="code" label="Mã phòng" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="isActive" label="Trạng thái" initialValue={false}>
            <Switch checkedChildren="HOẠT ĐỘNG" unCheckedChildren="KHÔNG HOẠT ĐỘNG" />
          </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              style={{ height: 40, width: "100%" }}
              type="primary"
              htmlType="submit"
            >
              Tạo mới
              {/* {movieId != undefined
                ? "Cập nhật"
                : "Thêm "} */}
            </Button>
          </Form.Item>
      </Form>
   
    </div>
  );
};

export default AddSeatsAndRows;
