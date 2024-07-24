"use client";
import React, { useRef, useState } from "react";
import { ConfigProvider, Popconfirm, Tag, message, notification } from "antd";
import { callDeleteUser, callFetchUser } from "@/app/config/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { Button, Space } from "antd/lib";
import { IUser } from "@/app/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { DataTable } from "../../table/dataTable";
import queryString from "query-string";
import { fetchUser } from "@/app/redux/slice/userSlide";
import { UserModal } from "../../modal/user-modal";
import { Access } from "../../share/access";
import { ALL_PERMISSIONS } from "@/app/config/permission";
import { Locale } from "antd/es/locale";
import vi_VN from "antd/es/locale/vi_VN";
import moment from "moment";
import { red } from "@ant-design/colors";

export const User = () => {
  const tableRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IUser | null>(null);
  const [meta, setMeta] = useState({ number: 1, size: 10, totalElements: 0 });
  const [locale, setLocal] = useState<Locale>(vi_VN);

  // const user = useAppSelector((state) => state.user.result);
  // const meta = useAppSelector((state) => state.user.meta);
  // const isFetching = useAppSelector((state) => state.user.isFetching)
  const dispatch = useAppDispatch();

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const handleDeleteUser = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteUser(+_id);
      if (res && res.data) {
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

  const columns: ProColumns<IUser>[] = [
    {
      title: "STT",
      dataIndex: "id",
      render(dom, entity, index, action, schema) {
        return <p style={{ paddingLeft: 10, marginBottom: 0 }}>{index + 1}</p>;
      },
    },
    {
      title: "HỌ VÀ TÊN ĐỆM",
      dataIndex: "firstName",
      // width: "20%",
      hideInSearch: true,
    },
    {
      title: "TÊN",
      dataIndex: "lastName",
      // width: "20%",
      hideInSearch: true,
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      // width: "20%",
      hideInSearch: true,
    },

    {
      title: "NGÀY SINH",
      dataIndex: "dateOfBirth",
      // width: "20%",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <p>
            {entity?.dateOfBirth
              ? moment(entity?.dateOfBirth).format("DD/MM/YYYY")
              : "-"}
          </p>
        );
      },
    },
    {
      title: "KÍCH HOAT TÀI KHOẢN",
      // dataIndex: "dateOfBirth",
      // width: "20%",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <Tag color={entity.accountLocked ? "red" : "green"}>
          {entity?.enabled ? "ĐÃ KÍCH HOẠT" : "CHƯA KÍCH HOẠT"}
        </Tag>
        );
      },
    },
    {
      title: "KHÓA TÀI KHOẢN",
      // dataIndex: "dateOfBirth",
      // width: "20%",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
         
            <Tag color={entity.accountLocked ? "red" : "green"}>
              {entity.accountLocked ? "ĐÃ KHÓA" : "CHƯA KHÓA"}
            </Tag>
        );
      },
    },
    {
      title: "VAI TRÒ",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
           <Tag color="geekblue">
           {entity?.role?.name} 
         </Tag>
        );
      }
    },
    {
      title: "NGÀY TẠO",
      dataIndex: "createDate",
      // width: "20%",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return <p>{moment(entity?.createDate).format("DD/MM/YYYY") || "-"}</p>;
      },
    },
    {
      title: "CẬP NHẬT LÚC",
      dataIndex: "lastModifiedDate",
      // width: "20%",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <p>
            {entity?.lastModifiedDate
              ? moment(entity?.lastModifiedDate).format("DD/MM/YYYY")
              : "-"}
          </p>
        );
      },
    },
    {
      title: "HÀNH ĐỘNG",
      // dataIndex: "_id",
      hideInSearch: true,
      render: (dom, entity) => (
        <Space size="middle">
          {/* <Access
            permission={ALL_PERMISSIONS.USERS.UPDATE}
            hideChildren
          > */}
          <a>
            <EditOutlined
             style={{ color: "darkorange"}} 
              onClick={() => {
                setDataInit(entity);
                setOpenModal(true);
              }}
            />
          </a>

          {/* </Access>
          <Access
            permission={ALL_PERMISSIONS.USERS.DELETE}
            hideChildren
          > */}
          <Popconfirm
            title="Chắc chán muốn xóa?"
            onConfirm={() => handleDeleteUser(entity.id)}
            okText="Xóa"
            cancelText="Hủy"
           
          >
            <DeleteOutlined  style={{ color: "red"}} />
          </Popconfirm>
          {/* </Access> */}
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
      <ConfigProvider locale={locale}>
        {/* <Access
        permission={ALL_PERMISSIONS.USERS.GET_PAGINATE}
      > */}
        <DataTable<IUser>
          actionRef={tableRef}
          rowKey="id"
          headerTitle="DANH SÁCH TÀI KHOẢN"
          columns={columns}
          // dataSource={user}
          // loading={isFetching}
          scroll={{ x: true }}
          request={async (params, sort, filter): Promise<any> => {
            const msg = {
              page: (params.current ?? 1) - 1,
              size: params.pageSize,
            };
            const query = buildQuery(msg, sort, filter);
            const response = await callFetchUser(query);
            console.log(response);
            dispatch(fetchUser({ query }));
            setMeta(response.data.meta);
            return {
              data: response.data.content,
              success: true,
            };
          }}
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
        />
      </ConfigProvider>
      {/* </Access> */}
      <UserModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </div>
  );
};
