
"use client";
import React, { useRef, useState } from "react";
import { Popconfirm, message, notification } from "antd";
import { callDeleteCinema } from "@/app/config/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { Button, Space } from "antd/lib";
import { ICinema } from "@/app/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { DataTable } from "../../table/dataTable";
import queryString from "query-string";
import { Access } from "../../share/access";
import { ALL_PERMISSIONS } from "@/app/config/permission";
import { CinemaModal } from "../../modal/cinema-modal";
import { fetchCinema } from "@/app/redux/slice/cinemaSlide";

export const Cinema = () => {
  const tableRef = useRef<ActionType>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<ICinema | null>(null)
  
  const cinema = useAppSelector((state) => state.cinema.result);
  const meta = useAppSelector((state) => state.cinema.meta);
  const isFetching = useAppSelector((state) => state.cinema.isFetching)
  const dispath = useAppDispatch();

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const handleDeleteRole = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteCinema(+_id);
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

  const columns: ProColumns<ICinema>[] = [
    {
      title: "Id",
      dataIndex: "_id",
      // width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",
      // width: "20%",
    },
    {
      title: "Area",
      dataIndex: "area",
      // width: "20%",
      hideInSearch: true,
      
    },

    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      // width: "20%",
      hideInSearch: true,
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      // width: "20%",
      hideInSearch: true,
    },
    {
      title: "operation",
      // dataIndex: "_id",
      hideInSearch: true,
      render: (dom, entity) => (
        <Space size="middle">
          <Access
            permission={ALL_PERMISSIONS.CINEMAS.UPDATE}
            hideChildren
          >
            <a>
              <EditOutlined
                onClick={() => {
                  setDataInit(entity)
                  setOpenModal(true)
                }}
              />
            </a>
          </Access>
          <Access
            permission={ALL_PERMISSIONS.CINEMAS.DELETE}
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
          permission={ALL_PERMISSIONS.CINEMAS.GET_PAGINATE}
      >
        <DataTable<ICinema>
          actionRef={tableRef}
          rowKey="_id"
          headerTitle="Cinemas list"
          columns={columns}
          dataSource={cinema}
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
            dispath(fetchCinema({query}));
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

      <CinemaModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadTable={reloadTable}
        dataInit={dataInit}
        setDataInit={setDataInit}
      />
    </div>
  );
};
