"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, message } from "antd";
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
          value: dataInit.role?._id,
          key: dataInit.role?._id,
        },
      ]);
    }
  }, [dataInit]);

  useEffect(() => {
    form.setFieldsValue({
      name: dataInit?.name,
      email: dataInit?.email,
      address: dataInit?.address,
      gender: dataInit?.gender,
      role: dataInit?.role?.name
    });
  },);


  async function fetchRoleList(name: string): Promise<ISelect[]> {
    const res = await callFetchRole(`page=1&limit=100&name=/${name}/i`);

    if (res && res.data) {
      const list = res.data.items;
      const temp = list.map((item: { name: string; _id: string }) => {
        return {
          label: item.name as string,
          value: item._id as string,
        };
      });
      return temp;
    } else return [];
  }

  const onFinish = async (values: any) => {
    const { name, email, password, address, gender, role } = values;
    const user = { name, email,password, address, gender, role: role.value };
    if (dataInit?._id) {
      const res = await callUpdateUser(+dataInit._id, user);
      if (res.data) {
        message.success("Update success role");
        handleCancel();
        reloadTable();
      } else {
        notification.error({
          message: "error",
        });
      }
    } else {
      const res = await callCreateUser(user);
      if (res.data) {
        message.success("Add success User");
        handleCancel();
        reloadTable();
      } else {
        notification.error({
          message: "error",
          // description: res.data.message
        });
      }
    }
  };

  return (
    <>
      <Modal
        title={dataInit?._id ? "Update User" : "Add User"}
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
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input disabled={!!dataInit?._id} style={{ color: "black" }} />
          </Form.Item>
 
          {!dataInit?._id ? 
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
           : 
            <> </> 
          }

          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
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
          </Form.Item>

          <Form.Item 
            name="role" 
            label="Role" rules={[{ required: true }]}>
            <DebounceSelect
              key={dataInit?.role?._id}
              allowClear
              showSearch
              defaultValue={roles}
              value={roles}
              placeholder="Choose role"
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
