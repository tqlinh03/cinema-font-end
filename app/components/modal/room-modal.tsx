'use client'

import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Switch, message } from "antd";
import { notification } from "antd";
import { callUpdateRoom } from "@/app/config/api";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
};

interface Props {
  openModal: boolean, 
  setOpenModal: (v: boolean) => void
  reloadTable: () => void 
  dataInit: any | null
  setDataInit: (v: any) => void
}

export const RoomModal = ({
  openModal,
  setOpenModal,
  reloadTable,
  dataInit,
  setDataInit
}: Props) => {
  const [form] = Form.useForm();
  const handleCancel = () => {
    setDataInit(null);
    setOpenModal(false);
  };

  useEffect(() => {
    form.setFieldsValue( {
      name: dataInit?.name,
      code: dataInit?.code,
      isActive: dataInit?.isActive,
    })
  })

  const onFinish = async (values: any) => {
    const { name, code, isActive } = values;
    const room = {  name, code, isActive };
      const res = await callUpdateRoom(+dataInit.id, room);
      if(res.status === 200) {
        message.success("Cập nhật thành công");
        handleCancel();
        reloadTable();
      } else {
        notification.error({
          message: "error",
        })
      }
  };

  return ( 
    <>
      <Modal
        title={dataInit?.id ? "CẬP NHẬT PHÒNG" : "NULL"}
        footer={null}
        open={openModal}
        onCancel={handleCancel}
      >
        <Form
          {...layout}
          form={form}
          name="ROOM"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
        >
           <Form.Item name="name" label="Tên phòng" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="code" label="Mã phòng" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="isActive" label="Trạng thái" initialValue={false}>
            <Switch checkedChildren="HOẠT ĐỘNG" unCheckedChildren="KHÔNG HOẠT ĐỘNG" />
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 15 }}>
            <Button type="primary" htmlType="submit">
              {"Cập nhật"}
            </Button>
            <Button className="bg-zinc-300 ml-2" onClick={handleCancel}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
