"use client";
import React, { useRef, useState } from "react";
import { ConfigProvider, Popconfirm, message, notification } from "antd";
import {  callDeleteStaff, callFetchStaff } from "@/app/config/api";
import { useAppDispatch } from "@/app/redux/hook";
import { fetchRoleById } from "@/app/redux/slice/roleSlide";
import { Button, Space } from "antd/lib";

import { IRole } from "@/app/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { RoleModal } from "../../modal/role-modal";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { DataTable } from "../../table/dataTable";
import queryString from "query-string";
import { Access } from "../../share/access";
import { Locale } from "antd/es/locale";
import vi_VN from "antd/es/locale/vi_VN";
import moment from "moment";
import Link from "next/link";
import { ALL_PERMISSIONS } from "@/app/config/permission";

export const Staff = () => {
  const tableRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [locale, setLocal] = useState<Locale>(vi_VN);
  const [meta, setMeta] = useState({ number: 1, size: 10, totalElements: 0 });
  const dispath = useAppDispatch();

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const handleDeleteRole = async (_id: number | undefined) => {
    if (_id) {
      const res = await callDeleteStaff(_id);
      if (res.status === 202) {
        message.success("Delete success");
        reloadTable();
      } else {
        notification.error({
          message: "Lỗi xóa dữ liệu",
          description: res.data.error,
        });
      }
    }
  };

  const columns: ProColumns<IRole>[] = [
    {
      title: "STT",
      hideInSearch: true,
      width: "5%",
      render(dom, entity, index, action, schema) {
        return <p style={{ paddingLeft: 10, marginBottom: 0 }}>{index + 1}</p>;
      },
    },
    {
      title: "HỌ VÀ TÊN ĐỆM",
      dataIndex: "firstName",
      width: "20%",
    },
    {
      title: "TÊN",
      dataIndex: "lastName",

    },
    {
      title: "EMAIL",
      dataIndex: "email",
    },
    {
      title: "NGÀY TẠO",
      dataIndex: "createdDate",
      width: "20%",
      hideInSearch: true,
      render: (dom, entity, index, action, schema) => {
        return <>{moment(entity.createdDate).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
    },
    {
      title: "HÀNH ĐỘNG",
      // dataIndex: "id",
      hideInSearch: true,
      width: "10%",

      render: (dom, entity, index, action, schema) => (
        <Space size="middle">
          <Access
            permission={ALL_PERMISSIONS.ROLES.UPDATE}
            hideChildren
          >
          <a>
            <EditOutlined
              onClick={() => {
                dispath(fetchRoleById(entity.id as number));
                setOpenModal(true);
              }}
              style={{ color: "darkorange"}} 
            />
          </a>
          </Access>
          <Access
            permission={ALL_PERMISSIONS.ROLES.DELETE}
            hideChildren
          >
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDeleteRole(entity.id)}
            okText="Delete"
            cancelText="Cancel"
          >
            <a>
              <DeleteOutlined  style={{ color: "red"}} />
            </a>
          </Popconfirm>
          <a>
            Chi tiết
          </a>
          </Access>
        </Space>
      ),
    },
  ];

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = { ...params };
    if (clone.name) clone.name = `/${clone.name}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.createdAt) {
      sortBy =
        sort.createdAt === "ascend" ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
      sortBy =
        sort.updatedAt === "ascend" ? "sort=updatedAt" : "sort=-updatedAt";
    }

    // //mặc định sort theo updatedAt
    // if (Object.keys(sortBy).length === 0) {
    //   temp = `${temp}&sort=-updatedAt`;
    // } else {
    //   temp = `${temp}&${sortBy}`;
    // }

    return temp;
  };

  return (
    <div className="mt-4 bg-white">
      <Access
        permission={ALL_PERMISSIONS.ROLES.GET_PAGINATE}
      >
      <ConfigProvider locale={locale}>
        <DataTable<any>
          actionRef={tableRef}
          rowKey="id"
          headerTitle="DANH SÁCH NHÂN VIÊN"
          columns={columns}
          request={async (params, sort, filter): Promise<any> => {
            const msg = {
              page: (params.current ?? 1) - 1,
              size: params.pageSize,
            };
            const query = buildQuery(msg, sort, filter);
            const response = await callFetchStaff(query);
            setMeta(response.data.meta);
            return {
              data: response.data.content,
              success: true,
            };
          }}
          scroll={{ x: true }}
          pagination={{
            current: meta.number + 1,
            pageSize: meta.size,
            showSizeChanger: true,
            total: meta.totalElements,
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]}-{range[1]} trên {total}
                </div>
              );
            },
          }}
          rowSelection={false}
          toolBarRender={(_action, _rows): any => {
            return (
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setOpenModal(true)}
              >
                <Link href="/admin/staff/new">Thêm mới</Link>
              </Button>
            );
          }}
        />
      </ConfigProvider>
      </Access>
    </div>
  );
};
