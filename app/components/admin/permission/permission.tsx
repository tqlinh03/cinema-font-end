"use client";
import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider, Popconfirm, message, notification } from "antd";
import { callDeletePermission, callFetchPermission } from "@/app/config/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { Button, Space } from "antd/lib";
import { IPermission } from "@/app/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { DataTable } from "../../table/dataTable";
import queryString from "query-string";
import { PermissionModal } from "../../modal/permission-modal";
import { fetchPermission } from "@/app/redux/slice/permissionSlide";
import { colorMethod } from "@/app/config/utils";
import { Access } from "../../share/access";
import { ALL_PERMISSIONS } from "@/app/config/permission";
import moment from "moment";
import { Locale } from "antd/es/locale";
import vi_VN from "antd/es/locale/vi_VN";
import { red } from "@ant-design/colors";

export const Permission = () => {
  const tableRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IPermission | null>(null);
  const [meta, setMeta] = useState({ number: 1, size: 10, totalElements: 0 });
  const [locale, setLocal] = useState<Locale>(vi_VN);
  const dispatch = useAppDispatch();
  // const permission = useAppSelector((state) => state.permission.result);

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const handleDeleteRole = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeletePermission(+_id);
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

  const columns: ProColumns<IPermission>[] = [
    {
      title: "STT",
      hideInSearch: true,
      // width: "10%",
      render(dom, entity, index, action, schema) {
        return <p style={{ paddingLeft: 10, marginBottom: 0 }}>{index + 1}</p>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      hideInSearch: true,
      // width: "20%",
    },
    {
      title: "API Path",
      dataIndex: "apiPath",
      // width: "20%",
      hideInSearch: true,
    },

    {
      title: "Method",
      dataIndex: "method",
      // width: "20%",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <p
            style={{
              paddingLeft: 10,
              fontWeight: "bold",
              marginBottom: 0,
              color: colorMethod(entity?.method as string),
            }}
          >
            {entity?.method || ""}
          </p>
        );
      },
    },
    {
      title: "Module",
      dataIndex: "module",
      // width: "20%",
      hideInSearch: true,
    },
    {
      title: "CreatedAt",
      dataIndex: "createdDate",
      // width: "20%",
      hideInSearch: true,
      render: (dom, entity, index, action, schema) => {
        return <>{moment(entity.createdDate).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
    },
    // {
    //   title: "UpdatedAt",
    //   dataIndex: "updatedAt",
    //   // width: "20%",
    //   hideInSearch: true,
    // },
    {
      title: "operation",
      // dataIndex: "_id",
      hideInSearch: true,
      render: (dom, entity) => (
        <Space size="middle">
          <Access permission={ALL_PERMISSIONS.PERMISSIONS.UPDATE} hideChildren>
            <a>
              <EditOutlined
                onClick={() => {
                  setDataInit(entity);
                  setOpenModal(true);
                }}
                style={{ color: "darkorange" }}
              />
            </a>
          </Access>
          <Access permission={ALL_PERMISSIONS.PERMISSIONS.DELETE} hideChildren>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDeleteRole(entity.id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <DeleteOutlined style={{ color: red[5] }} />
            </Popconfirm>
          </Access>
        </Space>
      ),
    },
  ];

  const buildQuery = (params: any, sort: any, filter: any) => {
    const clone = { ...params };
    if (clone.name) clone.name = `/${clone.name}/i`;
    if (clone.apiPath) clone.apiPath = `/${clone.apiPath}/i`;
    if (clone.method) clone.method = `/${clone.method}/i`;
    if (clone.module) clone.module = `/${clone.module}/i`;

    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
      sortBy = sort.name === "ascend" ? "sort=name" : "sort=-name";
    }
    if (sort && sort.apiPath) {
      sortBy = sort.apiPath === "ascend" ? "sort=apiPath" : "sort=-apiPath";
    }
    if (sort && sort.method) {
      sortBy = sort.method === "ascend" ? "sort=method" : "sort=-method";
    }
    if (sort && sort.module) {
      sortBy = sort.module === "ascend" ? "sort=module" : "sort=-module";
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
    //     temp = `${temp}&sort=-updatedAt`;
    // } else {
    //     temp = `${temp}&${sortBy}`;
    // }

    return temp;
  };

  return (
    <div className="mt-4 bg-white">
      <Access permission={ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE}>
        <ConfigProvider locale={locale}>
          <DataTable<IPermission>
            actionRef={tableRef}
            rowKey="id"
            headerTitle="Danh sách quyền hạn"
            columns={columns}
            request={async (params, sort, filter): Promise<any> => {
              const msg = {
                page: (params.current ?? 1) - 1,
                size: params.pageSize,
              };
              const query = buildQuery(msg, sort, filter);
              const response = await callFetchPermission(query);
              dispatch(fetchPermission({ query }));
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

      <PermissionModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </div>
  );
};
