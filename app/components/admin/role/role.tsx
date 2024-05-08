"use client";
import React, { useEffect, useRef, useState } from "react";
import { Form, Popconfirm, message, notification } from "antd";
import { callDeleteRole } from "@/app/config/api";
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

export const Role = () => {
  const tableRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const role = useAppSelector((state) => state.role.result);
  const meta = useAppSelector((state) => state.role.meta);
  const isFetching = useAppSelector((state) => state.role.isFetching)
  const dispath = useAppDispatch();

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const handleDeleteRole = async (_id: number | undefined) => {
    if (_id) {
      const res = await callDeleteRole(_id);

      if (res && !res.data.response) {
        message.success("Delete success");
        reloadTable();
      } else {
        notification.error({
          message: "Error delete role",
          description: res.data.message,
        });
      }
    }
  };

  const columns: ProColumns<IRole>[] = [
    {
      title: "Id",
      dataIndex: "_id",
      width: "10%",
    },
    {
      title: "name",
      dataIndex: "name",
      width: "20%",
    },
    {
      title: "State",
      dataIndex: "isActive",
      hideInSearch: true,
      width: "20%",
      render(dom, entity, index, action, schema) {
        return <>
            <Tag color={entity.isActive ? "lime" : "red"} >
                {entity.isActive ? "ACTIVE" : "INACTIVE"}
            </Tag>
        </>
    },
    },
    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      width: "20%",
      hideInSearch: true,
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      width: "20%",
      hideInSearch: true,
    },
    {
      title: "operation",
      dataIndex: "_id",
      hideInSearch: true,
      render: (dom, entity) => (
        <Space size="middle">
          <Access
            permission={ALL_PERMISSIONS.ROLES.UPDATE}
            hideChildren
          >
            <a>
              <EditOutlined
                onClick={() => {
                  dispath(fetchRoleById((entity._id) as number))
                  setOpenModal(true)
                }}
              />
            </a>
          </Access>
          <Access
            permission={ALL_PERMISSIONS.ROLES.DELETE}
            hideChildren
          >
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDeleteRole(entity._id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <a>
                <DeleteOutlined />
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
        <DataTable<IRole>
          actionRef={tableRef}
          rowKey="_id"
          headerTitle="Role list"
          columns={columns}
          dataSource={role}
          loading={isFetching}
          request={async ( 
            params, 
            sort, 
            filter
          ): Promise<any> => {
            const msg = ({
              page: params.current,
              limit: params.pageSize,
            });
            const query = buildQuery(msg, sort, filter)
            dispath(fetchRole({query}));
          }}
          scroll={{ x: true }}
          pagination={{
            current: meta.currentPage,
            pageSize: meta.itemsPerPage,
            showSizeChanger: true,  
            total: meta.totalPages, 
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]}-{range[1]} trên {total} rows
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
      </Access>

      <RoleModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
      />
    </div>
  );
};
