"use client";
import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider, Form, Popconfirm, message, notification } from "antd";
import { callDeleteRole, callFetchRole } from "@/app/config/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { fetchRole, fetchRoleById } from "@/app/redux/slice/roleSlide";
import { Button, Space, Tag } from "antd/lib";

import { IRole } from "@/app/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { RoleModal } from "../../modal/role-modal";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { DataTable } from "../../table/dataTable";
import queryString from "query-string";
import { Access } from "../../share/access";
import { ALL_PERMISSIONS } from "@/app/config/permission";
import { Locale } from "antd/es/locale";
import vi_VN from "antd/es/locale/vi_VN";
import moment from "moment";

export const Role = () => {
  const tableRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [locale, setLocal] = useState<Locale>(vi_VN);
  // const role = useAppSelector((state) => state.role.result);
  const [meta, setMeta] = useState({ number: 1, size: 10, totalElements: 0 });
  // const meta = useAppSelector((state) => state.role.meta);
  // const isFetching = useAppSelector((state) => state.role.isFetching)
  const dispath = useAppDispatch();

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const handleDeleteRole = async (_id: number | undefined) => {
    if (_id) {
      const res = await callDeleteRole(_id);
      if (res && res.data.error) {
        notification.error({
          message: "Lỗi xóa dữ liệu",
          description: res.data.error,
        });
      } else {
        message.success("Delete success");
        reloadTable();
      }
    }
  };

  const columns: ProColumns<IRole>[] = [
    {
      title: "STT",
      hideInSearch: true,
      // width: "10%",
      render(dom, entity, index, action, schema) {
        return <p style={{ paddingLeft: 10, marginBottom: 0 }}>{index + 1}</p>;
      },
    },
    {
      title: "Tên vai trò",
      dataIndex: "name",
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      hideInSearch: true,
      width: "20%",
      render(dom, entity, index, action, schema) {
        return (
          <>
            <Tag color={entity.active ? "lime" : "red"}>
              {entity.active ? "HOẠT ĐỘNG" : "KHÔNG HOẠT ĐỘNG"}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      width: "20%",
      hideInSearch: true,
      render: (dom, entity, index, action, schema) => {
        return <>{moment(entity.createdDate).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
    },
    {
      title: "Cập nhất lần cuối",
      dataIndex: "lastModifiedDate",
      width: "20%",
      hideInSearch: true,
      render: (dom, entity, index, action, schema) => {
        return (
          <>
            {entity.lastModifiedDate
              ? moment(entity.lastModifiedDate).format("DD-MM-YYYY HH:mm:ss")
              : ""}
          </>
        );
      },
    },
    {
      title: "Hành động",
      // dataIndex: "id",
      hideInSearch: true,
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
        <DataTable<IRole>
          actionRef={tableRef}
          rowKey="id"
          headerTitle="Danh sách vai trò"
          columns={columns}
          request={async (params, sort, filter): Promise<any> => {
            const msg = {
              page: (params.current ?? 1) - 1,
              size: params.pageSize,
            };
            const query = buildQuery(msg, sort, filter);
            const response = await callFetchRole(query);
            dispath(fetchRole({ query }));
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
                Thêm mới
              </Button>
            );
          }}
        />
      </ConfigProvider>
      </Access>

      <RoleModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
      />
    </div>
  );
};
