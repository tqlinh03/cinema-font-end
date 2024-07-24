
"use client";
import React, { useRef, useState } from "react";
import { ConfigProvider, Popconfirm, Tag, message, notification } from "antd";
import { callDeletePermission, callDeleteRoom, callFetchRoom } from "@/app/config/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { Button, Space } from "antd/lib";
import { IPermission, IRoom } from "@/app/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { DataTable } from "../../table/dataTable";
import queryString from "query-string";
import { PermissionModal } from "../../modal/permission-modal";
import { fetchPermission } from "@/app/redux/slice/permissionSlide";

import { Access } from "../../share/access";
import { ALL_PERMISSIONS } from "@/app/config/permission";
import { fetchRoom } from "@/app/redux/slice/roomSilide";
import { Locale } from "antd/es/locale";
import vi_VN from "antd/es/locale/vi_VN";
import Link from "next/link";
import { RoomModal } from "../../modal/room-modal";

export const Room = () => {
  const tableRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IPermission | null>(null)
  const [meta, setMeta] = useState({ number: 1, size: 10, totalElements: 0 });
  const [locale, setLocal] = useState<Locale>(vi_VN);

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const handleDeleteRoom = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteRoom(+_id);
      if (res.status === 200) {
        message.success("Xóa thành công");
        reloadTable();
      } else {
        notification.error({
          message: "Error delete room",
          description: res.data.message,
        });
      }
    }
  };

  const columns: ProColumns<IRoom>[] = [
    {
      title: "STT",
      renderText: (_, __, index) => index + 1,
    },
    {
      title: "name",
      dataIndex: "name",
      // width: "20%",
    },
    {
      title: "MÃ PHÒNG",
      dataIndex: "code",
      // width: "20%",
    },
    {
      title: "isActive",
      dataIndex: "isActive",
      // width: "20%",
      render(dom, entity, index, action, schema) {
        return (
          <>
            <Tag color={entity.isActive ? "lime" : "red"}>
              {entity.isActive ? "HOẠT ĐỘNG" : "KHÔNG HOẠT ĐỘNG"}
            </Tag>
          </>
        );
      },
      
    },
   
    {
      title: "operation",
      // dataIndex: "_id",
      hideInSearch: true,
      render: (dom, entity) => (
        <Space size="middle">
          <Access
            permission={ALL_PERMISSIONS.ROOMS.UPDATE}
            hideChildren
          >
            <a>
              <EditOutlined
                onClick={() => {
                  setDataInit(entity)
                  setOpenModal(true)
                }}
                style={{ color: "darkorange"}} 
              />
            </a>
          </Access>
          <Access
            permission={ALL_PERMISSIONS.ROOMS.DELETE}
            hideChildren
          >
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDeleteRoom(entity.id)}
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
    if (clone.apiPath) clone.apiPath = `/${clone.apiPath}/i`;
    if (clone.method) clone.method = `/${clone.method}/i`;
    if (clone.module) clone.module = `/${clone.module}/i`;


    let temp = queryString.stringify(clone);

    let sortBy = "";
    if (sort && sort.name) {
        sortBy = sort.name === 'ascend' ? "sort=name" : "sort=-name";
    }
    if (sort && sort.apiPath) {
        sortBy = sort.apiPath === 'ascend' ? "sort=apiPath" : "sort=-apiPath";
    }
    if (sort && sort.method) {
        sortBy = sort.method === 'ascend' ? "sort=method" : "sort=-method";
    }
    if (sort && sort.module) {
        sortBy = sort.module === 'ascend' ? "sort=module" : "sort=-module";
    }
    if (sort && sort.createdAt) {
        sortBy = sort.createdAt === 'ascend' ? "sort=createdAt" : "sort=-createdAt";
    }
    if (sort && sort.updatedAt) {
        sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt" : "sort=-updatedAt";
    }

    // //mặc định sort theo updatedAt
    // if (Object.keys(sortBy).length === 0) {
    //     temp = `${temp}&sort=-updatedAt`;
    // } else {
    //     temp = `${temp}&${sortBy}`;
    // } 

    return temp;
}

  return (
    <div className="mt-4 bg-white">
      <Access
          permission={ALL_PERMISSIONS.ROOMS.GET_PAGINATE}
      >
        <ConfigProvider locale={locale}>
          <DataTable<IRoom>
            actionRef={tableRef}
              rowKey="_id"
              headerTitle="DANH SÁCH PHÒNG"
              columns={columns}
              // dataSource={room}
              // loading={isFetching}
              request={async (params, sort, filter): Promise<any> => {
                const msg = {
                  page: (params.current ?? 1) - 1,
                  size: params.pageSize,
                };
                const query = buildQuery(msg, sort, filter);
                const response = await callFetchRoom(query);
                // dispath(fetchMovie({ query }));
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
                    // onClick={() => setOpenModal(true)}
                  >
                    <Link href={"/admin/room/new"}>Tạo phòng mới</Link>
                  </Button>
                );
            }}
           />     

        </ConfigProvider>
      </Access>

      <RoomModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </div>
  );
};
