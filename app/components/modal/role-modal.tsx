import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import { Switch, notification } from "antd/lib";
import {
  callCreateRole,
  callFetchPermission,
  callUpdateRole,
} from "@/app/config/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { resetSingleRole } from "@/app/redux/slice/roleSlide";
import { ProCard } from "@ant-design/pro-components";
import ModuleApi from "../admin/role/module.permission.api";
import { IPermission } from "@/app/types/backend";
import _ from "lodash";

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
}

export const RoleModal = ({
  openModal,
  setOpenModal,
  reloadTable,
}: RoleProps) => {
  const singleRole = useAppSelector((state) => state.role.singleRole);
  const dispath = useAppDispatch();

  const [form] = Form.useForm();
  const [listPermissions, setListPermissions] = useState<
    | {
        module: string;
        permissions: IPermission[];
      }[]
    | null
  >(null);

  const groupByPermission = (data: any) => {
    return _(data)
      .groupBy((x) => x.module)
      .map((value, key) => {
        return { module: key, permissions: value as IPermission[] };
      })
      .value();
  };

  useEffect(() => {
    const init = async () => {
      const res = await callFetchPermission(`page=0&size=100`);
      if (res.data?.content) {
        setListPermissions(groupByPermission(res.data?.content));
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (listPermissions?.length && singleRole?.id) {
      form.setFieldsValue({
        name: singleRole.name,
        isActive: singleRole.active,
        description: singleRole.description,
      });
      const userPermissions = groupByPermission(singleRole.permissions);
      listPermissions.forEach((x) => {
        let allCheck = true;
        x.permissions?.forEach((y) => {
          const temp = userPermissions.find((z) => z.module === x.module);

          if (temp) {
            const isExist = temp.permissions.find((k) => k.id === y.id);
            if (isExist) {
              form.setFieldValue(["permissions", y.id as string], true);
            } else allCheck = false;
          } else {
            allCheck = false;
          }
        });  
        form.setFieldValue(["permissions", x.module], allCheck);
      });
    }
  }, [listPermissions, singleRole]);

  const handleCancel = () => {
    dispath(resetSingleRole({}));
    setOpenModal(false);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue({
      name: singleRole.name,
      description: singleRole.description,
      isActive: singleRole.active,
    });
  });

  const onFinish = async (values: any) => {
    const { name, description, isActive, permissions } = values;
    console.log("valuse", values)
    const checkedPermissions = [];
    if (permissions) {
        for (const key in permissions) {
            if (!isNaN(Number(key)) && permissions[key] === true) {
                checkedPermissions.push(+key);
            }
        }
    } 
    const role = { name, description, isActive, permissions: checkedPermissions};
    if (singleRole?.id) {
      const res = await callUpdateRole(role, singleRole?.id);
      if (res.data) {
        message.success("Update success role");
        handleCancel();
        reloadTable();
      } else {
        notification.error({
          message: "error",
          // description: res.message
        });
      }
    } else { 
      const res = await callCreateRole(role);
      if (res.data) {
        message.success("Add success role");
        handleCancel();
        reloadTable();
      } else {
        notification.error({
          message: "error",
          // description: res.data.message,
        });
      }
    }
  };

  return (
    <>
      <Modal
        title={singleRole.id ? "Cập nhật vai trò" : "Thêm vai trò"}
        footer={null}
        open={openModal}
        onCancel={handleCancel}
        width={800}
      >
        <Form
          {...layout}
          form={form}
          name="nest-messages"
          onFinish={onFinish}
          style={{ maxWidth: 800 }}
          validateMessages={validateMessages}
        >
          <Form.Item name="name" label="Tên vai trò" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Miêu tả"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="isActive" label="Trạng thái" initialValue={false}>
            <Switch checkedChildren="HOẠT ĐỘNG" unCheckedChildren="KHÔNG HOẠT ĐỘNG" />
          </Form.Item>

          <ProCard
            title="Quyền hạn"
            subTitle="(Quyền được phép cho vai trò này)"
            headStyle={{ color: "#d81921" }}
            style={{ marginBottom: 20 }}
            headerBordered
            size="small"
            bordered
          >
            <ModuleApi 
              form={form} 
              listPermissions={listPermissions} 
            />
          </ProCard>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 15 }}>
            <Button type="primary" htmlType="submit">
              {singleRole.id ? "Cập nhật" : "Tạo vai trò"}
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
