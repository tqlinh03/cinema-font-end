"use client";
import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider, Form, Popconfirm, message, notification } from "antd";
import { callDeleteRole, callDeleteShift, callFetchRole, callFetchShift } from "@/app/config/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { fetchRole, fetchRoleById } from "@/app/redux/slice/roleSlide";
import { Button, Space, Tag } from "antd/lib";

import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { DataTable } from "../../table/dataTable";
import queryString from "query-string";
import { Access } from "../../share/access";
import { ALL_PERMISSIONS } from "@/app/config/permission";
import { Locale } from "antd/es/locale";
import vi_VN from "antd/es/locale/vi_VN";
import moment from "moment";
import { ShiftModal } from "../../modal/shift-modal";

export const Shift = () => {
  const tableRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [locale, setLocal] = useState<Locale>(vi_VN);
  const [shift, setShift] = useState<any>([]);
  const [meta, setMeta] = useState({ number: 0, size: 10, totalElements: 0 });
  const dispath = useAppDispatch();

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const handleDeleteRole = async (_id: number | undefined) => {
    if (_id) {
      const res = await callDeleteShift(_id);
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

  const columns: ProColumns<any>[] = [
    {
      title: "STT",
      hideInSearch: true,
      // width: "10%",
      render(dom, entity, index, action, schema) {
        return <p style={{ paddingLeft: 10, marginBottom: 0 }}>{index + 1}</p>;
      },
    },
    {
      title: "THỨ",
      dataIndex: "day_of_weed",
      width: "20%",
    },
    {
      title: "THỜI GIAN BẮT ĐẦU",
      dataIndex: "start_time",
      hideInSearch: true,
      width: "20%",
      render(dom, entity, index, action, schema) {
        return (
          <>
            <Tag color={"lime"}>
              {entity.start_time}
            </Tag>
          </>
        );
      },
    },
    {
      title: "THỜI GIAN KẾT THÚC",
      dataIndex: "end_time",
      hideInSearch: true,
      width: "20%",
      render(dom, entity, index, action, schema) {
        return (
          <>
            <Tag color={"lime"}>
              {entity.end_time}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      width: "20%",
      hideInSearch: true,
      render: (dom, entity, index, action, schema) => {
        return <>{moment(entity.created_at).format("DD-MM-YYYY HH:mm:ss")}</>;
      },
    },
    {
      title: "Hành động",
      // dataIndex: "id",
      hideInSearch: true,
      render: (dom, entity, index, action, schema) => (
        <Space size="middle">
          {/* <Access
            permission={ALL_PERMISSIONS.ROLES.UPDATE}
            hideChildren
          > */}
          <a>
            <EditOutlined
              onClick={() => {
                setShift(entity);
                setOpenModal(true);
              }}
              style={{ color: "darkorange"}} 
            />
          </a>
          {/* </Access>
          <Access
            permission={ALL_PERMISSIONS.ROLES.DELETE}
            hideChildren
          > */}
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
          {/* </Access> */}
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
      {/* <Access
        permission={ALL_PERMISSIONS.ROLES.GET_PAGINATE}
      > */}
      <ConfigProvider locale={locale}>
        <DataTable<any>
          actionRef={tableRef}
          rowKey="id"
          headerTitle="DANH SÁCH CA LÀM VIỆC"
          columns={columns}
          // dataSource={role}
          // loading={isFetching}
          request={async (params, sort, filter): Promise<any> => {
            const msg = {
              page: (params.current ?? 1) - 1,
              size: params.pageSize,
            };
            const query = buildQuery(msg, sort, filter);
            const response = await callFetchShift(query);
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
      {/* </Access> */}

      <ShiftModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        shift={shift}
      />
    </div>
  );
};
