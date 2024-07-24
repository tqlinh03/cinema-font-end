"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Switch, message } from "antd";
import { Select, notification } from "antd/lib";
import {
  callCreatePermission,
  callCreateUser,
  callFetchRole,
  callUpdatePermission,
  callUpdateUser,
} from "@/app/config/api";
import { IPermission, IUser } from "@/app/types/backend";
import { ALL_MODULES } from "@/app/config/permission";
import { DebounceSelect } from "../admin/user/debouce.select";
import { set } from "lodash";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
};

interface RoleProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  reloadTable: () => void;
  dataInit: IUser | null;
  setDataInit: (v: any) => void;
}

interface ModuleOption {
  value: keyof typeof ALL_MODULES;
  label: string;
}

export interface ISelect {
  label: string;
  value: string;
  key?: string;
}

export const UserModal = ({
  openModal,
  setOpenModal,
  reloadTable,
  dataInit,
  setDataInit,
}: RoleProps) => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<ISelect[]>([]);

  const handleCancel = () => {
    form.resetFields();
    setRoles([]);
    setDataInit(null);
    setOpenModal(false);
  };

  useEffect(() => {
    if (dataInit?.role) {
      setRoles([
        {
          label: dataInit.role?.name,
          value: dataInit.role?.id,
          key: dataInit.role?.id,
        },
      ]);
    }
  }, [dataInit]);
  console.log("dataInit", roles);

  useEffect(() => {
    form.setFieldsValue({
      firstName: dataInit?.firstName,
      lastName: dataInit?.lastName,
      email: dataInit?.email,
      // address: dataInit?.address,
      // gender: dataInit?.gender,
      role: dataInit?.role?.name,
    });
  });

  async function fetchRoleList(name: string): Promise<ISelect[]> {
    const res = await callFetchRole(`page=0&size=100`);
    console.log("fetchRoleList", res);
    if (res && res.data) {
      const list = res.data.content;
      const temp = list.map((item: { name: string; id: string }) => {
        return {
          label: item.name as string,
          value: item.id as string,
        };
      });
      console.log("temp", temp);
      return temp;
    } else return [];
  }

  const onFinish = async (values: any) => {
    const { email, role, firstName, lastName } = values;
    const user = { email, roleId: role.value, firstName, lastName };
    console.log("user", user);
    if (dataInit?.id) {
      const res = await callUpdateUser(+dataInit.id, user);
      console.log("id", dataInit?.id);
      console.log("res", res);
      if (res.data.error) {
        notification.error({
          message: "error",
        });
      } else {
        message.success("Update success role");
        handleCancel();
        reloadTable();
      }
    } else {
      const res = await callCreateUser(user);
      if (res.data.error) {
        notification.error({
          message: "error",
          // description: res.data.message
        });
      } else {
        message.success("Add success User");
        handleCancel();
        reloadTable();
      }
    }
  };

  return (
    <>
      <Modal
        title={dataInit?.id ? "Cập nhật" : "Tạo Tài Khoản"}
        footer={null}
        open={openModal}
        onCancel={handleCancel}
      >
        <Form
          {...layout}
          form={form}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item name="email" label="Email" >
            <Input disabled={!!dataInit?.id} style={{ color: "black" }} />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 10 }}
            name="firstName"
            label="Họ"
           
          
          >
            <Input disabled  style={{ color: "black" }}/>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 10 }}
            name="lastName"
            label="Tên"
           
          >
            <Input disabled  style={{ color: "black" }}/>
          </Form.Item>

          {/* <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item> */}

          {/* <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select
              placeholder="Select a person"
              style={{ width: 120 }}
              allowClear
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />
          </Form.Item> */}

          <Form.Item name="isActive" label="Trạng thái" initialValue={false} rules={[{ required: true }]}>
            <Switch checkedChildren="kHÓA" unCheckedChildren="KHÔNG KHÓA" />
          </Form.Item>

          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <DebounceSelect
              key={dataInit?.role?.id}
              allowClear
              showSearch
              defaultValue={roles}
              value={roles}
              placeholder="Chọn vai trò"
              fetchOptions={fetchRoleList}
              onChange={(newValue: any) => {
                if (newValue?.length === 0 || newValue?.length === 1) {
                  setRoles(newValue as ISelect[]);
                }
              }}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 15 }}>
            <Button type="primary" htmlType="submit">
              {dataInit?.id ? "Cập nhật" : "Tạo mới"}
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
