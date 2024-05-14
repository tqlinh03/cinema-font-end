"use client";
import React, { useRef, useState } from "react";
import { Image, Popconfirm, message, notification } from "antd";
import { callDeleteMovie, callDeletePermission } from "@/app/config/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { Button, Space } from "antd/lib";
import { IMovie, IPermission } from "@/app/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { DataTable } from "../../table/dataTable";
import queryString from "query-string";
import { PermissionModal } from "../../modal/permission-modal";
import { Access } from "../../share/access";
import { ALL_PERMISSIONS } from "@/app/config/permission";
import { fetchMovie, setSingleMovie } from "@/app/redux/slice/movieSlide";
import { useRouter } from "next/navigation";
import moment from "moment";

export const AllMovie = () => {
  const tableRef = useRef<ActionType>();
  const router = useRouter()
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IPermission | null>(null);


  const movie = useAppSelector((state) => state.movie.result);
  const meta = useAppSelector((state) => state.movie.meta);
  const isFetching = useAppSelector((state) => state.movie.isFetching);
  const dispath = useAppDispatch();

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const handleDeleteMovie = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteMovie(+_id);
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

  const columns: ProColumns<IMovie>[] = [
    {
      title: "Id",
      dataIndex: "_id",
      // width: "10%",
    },
    {
      title: "Image",
      dataIndex: "img",
      width: "10%",
      render(dom, entity, index, action, schema) {
        return <Image width={200} src={entity.img} />;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Description",
      dataIndex: "description",
      // width: "20%",
      hideInSearch: true,
    },
    {
      title: "Time",
      dataIndex: "time",
      width: "5%",
      render(dom, entity, index, action, schema) {
        return <><span>{entity.time} Phút</span></>;
      },
    },

    {
      title: "ReleaseDate",
      dataIndex: "ReleaseDate",
      render(dom, entity, index, action, schema) {
        return <>{moment(entity.ReleaseDate).format("DD/MM/YYYY")}</>;
      },
    },

    {
      title: "CreatedAt",
      dataIndex: "createdAt",
      width: "10%",
      render(dom, entity, index, action, schema) {
        return <>{moment(entity?.createdAt).format("DD/MM/YYYY HH:mm:ss")}</>;
      },
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      width: "5%",
      hideInSearch: true,render(dom, entity, index, action, schema) {
        return <>{moment(entity.updatedAt).format("DD/MM/YYYY HH:mm:ss")}</>;
      },
    },
    {
      title: "operation",
      // dataIndex: "_id",
      width: "5%",

      hideInSearch: true,
      render: (dom, entity) => (
        <Space size="middle">
          <Access permission={ALL_PERMISSIONS.PERMISSIONS.UPDATE} hideChildren>
            <a>
              <EditOutlined
                onClick={ async() => {
                  await dispath(setSingleMovie(entity))
                  router.push(`/admin/movie/${entity._id}`)
                }}
              />
            </a>
          </Access>
          <Access permission={ALL_PERMISSIONS.PERMISSIONS.DELETE} hideChildren>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDeleteMovie(entity._id)}
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
        <DataTable<IMovie>
          actionRef={tableRef}
          rowKey="_id"
          headerTitle="Permissions list"
          columns={columns}
          dataSource={movie}
          loading={isFetching}
          request={async (params, sort, filter): Promise<any> => {
            const msg = {
              page: params.current,
              limit: params.pageSize,
            };
            const query = buildQuery(msg, sort, filter);
            dispath(fetchMovie({ query }));
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
