'use client'

import React, { useEffect } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import { Select, notification } from "antd";
import { callCreatePermission, callUpdatePermission } from "@/app/config/api";
import { IPermission } from "@/app/types/backend";
import { ALL_MODULES } from "@/app/config/permission";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
};

interface RoleProps {
  openModal: boolean, 
  setOpenModal: (v: boolean) => void
  reloadTable: () => void 
  dataInit: IPermission | null
  setDataInit: (v: any) => void
}

interface ModuleOption {
  value: keyof typeof ALL_MODULES;
  label: string;
}

export const PermissionModal = ({
  openModal,
  setOpenModal,
  reloadTable,
  dataInit,
  setDataInit
}: RoleProps) => {
  const [form] = Form.useForm();
  const handleCancel = () => {
    setDataInit(null);
    setOpenModal(false);
  };

  useEffect(() => {
    form.setFieldsValue( {
      name: dataInit?.name,
      apiPath: dataInit?.apiPath,
      method:dataInit?.method,
      module:dataInit?.module
    })
  })

  const onFinish = async (values: IPermission) => {
    const { name, apiPath, method, module } = values;
  
    const permission = {  name, apiPath, method, module };
    if(dataInit?._id) {
      const res = await callUpdatePermission(+dataInit._id, permission);
      if(res.data) {
        message.success("Update success role");
        handleCancel();
        reloadTable();
      } else {
        notification.error({
          message: "error",
          
        })
      }

    } else {
      const res = await callCreatePermission(permission);
 
      if(res.data) {
        message.success("Add success permission");
        handleCancel();
        reloadTable();
      } else {
        notification.error({
          message: "error",
          // description: res.data.message
        })
      }
    }
  };

  const options: ModuleOption[] = Object.keys(ALL_MODULES).map(module => ({
    value: module as keyof typeof ALL_MODULES,
    label: ALL_MODULES[module as keyof typeof ALL_MODULES]
  }));

  return ( 
    <>
      <Modal
        title={dataInit?._id ? "Update Permission" : "Add Permission"}
        footer={null}
        open={openModal}
        onCancel={handleCancel}
      >
        <Form
          {...layout}
          form={form}
          name="nest-messages"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="apiPath"
            label="API Path"
            rules={[{ required: true }]}
          >
            <Input/>
          </Form.Item>
          
          <Form.Item
            name="method"
            label="Method"
            rules={[{ required: true, message:"please choose method" }]}
            
          >
           <Select
            placeholder="please choose method"
            style={{ width: 200 }}
            options={[
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'PATCH', label: 'PATCH' },
              { value: 'DELETE', label: 'DELETE' },
            ]}
            />
          </Form.Item>

          <Form.Item
            name="module"
            label="Module"
            rules={[{ required: true }]}
          >
            <Select
            placeholder="please choose Module"
            style={{ width: 200 }}
            options={options}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 15 }}>
            <Button type="primary" htmlType="submit">
              {dataInit?._id ? "Update" : "Create"}
            </Button>
            <Button className="bg-zinc-300 ml-2" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
