"use client";
import React, { useRef, useState } from "react";
import { ConfigProvider, Image, Popconfirm, message, notification } from "antd";
import {
  callDeleteMovie,
  callDeletePermission,
  callFetchMovie,
} from "@/app/config/api";
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
import { Locale } from "antd/es/locale";
import vi_VN from "antd/es/locale/vi_VN";
import Link from "next/link";

export const AllMovie = () => {
  const tableRef = useRef<ActionType>();
  const router = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataInit, setDataInit] = useState<IPermission | null>(null);
  const [meta, setMeta] = useState({ number: 1, size: 10, totalElements: 0 });
  const [locale, setLocal] = useState<Locale>(vi_VN);

  // const movie = useAppSelector((state) => state.movie.result);
  // const meta = useAppSelector((state) => state.movie.meta);
  // const isFetching = useAppSelector((state) => state.movie.isFetching);
  const dispath = useAppDispatch();

  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  const handleDeleteMovie = async (_id: string | undefined) => {
    if (_id) {
      const res = await callDeleteMovie(+_id);
      console.log(res);
      if (res && !res.data.error) {
        message.success("Xóa thành công");
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
      title: "STT",
      // width: "10%",
      render(dom, entity, index, action, schema) {
        return <p style={{ paddingLeft: 10, marginBottom: 0 }}>{index + 1}</p>;
      },
    },
    {
      title: "ẢNH",
      dataIndex: "img",
      render(dom, entity, index, action, schema) {
        return <Image width={100} src={entity.img} />;
      },
    },
    {
      title: "TÊN PHIM",
      dataIndex: "name",
    },

    {
      title: "GIỚI THIỆU",
      dataIndex: "description",
      // width: "20%",
      hideInSearch: true,
    },
    {
      title: "THỜI LƯỢNG",
      dataIndex: "time",
      // width: "5%",
      render(dom, entity, index, action, schema) {
        return (
          <>
            <span>{entity.time} Phút</span>
          </>
        );
      },
    },

    {
      title: "NGÀY CÔNG CHIẾU",
      render(dom, entity, index, action, schema) {
        return <>{moment(entity.releaseDate).format("DD/MM/YYYY")}</>;
      },
    },

    {
      title: "TẠO LÚC",
      // width: "10%",
      render(dom, entity, index, action, schema) {
        return <>{moment(entity?.createdDate).format("DD/MM/YYYY HH:mm:ss")}</>;
      },
    },
    {
      title: "CẬP NHẬT LÚC",
      // width: "5%",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>{moment(entity.lastModifiedDate).format("DD/MM/YYYY HH:mm:ss")}</>
        );
      },
    },
    {
      title: "HÀNH ĐỘNG",
      // dataIndex: "_id",
      // width: "5%",

      hideInSearch: true,
      render: (dom, entity) => (
        <Space size="middle">
          <Access permission={ALL_PERMISSIONS.MOVIES.UPDATE} hideChildren>
            <a>
              <EditOutlined
                style={{ color: "darkorange"}} 
                onClick={async () => {
                  await dispath(setSingleMovie(entity));
                  router.push(`/admin/movie/${entity.id}`);
                }}
              />
            </a>
          </Access>
          <Access permission={ALL_PERMISSIONS.MOVIES.DELETE} hideChildren>
            <Popconfirm
              title="Bạn có muốn xóa?"
              onConfirm={() => handleDeleteMovie(entity.id)}
              okText="xóa"
              cancelText="Hủy"
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
      <Access permission={ALL_PERMISSIONS.MOVIES.GET_PAGINATE}>
        <ConfigProvider locale={locale}>
          <DataTable<IMovie>
            actionRef={tableRef}
            rowKey="id"
            headerTitle="DANH SÁCH PHIM"
            columns={columns}
            // dataSource={movie}
            // loading={isFetching}
            request={async (params, sort, filter): Promise<any> => {
              const msg = {
                page: (params.current ?? 1) - 1,
                size: params.pageSize,
              };
              const query = buildQuery(msg, sort, filter);
              const response = await callFetchMovie(query);
              console.log(response.data.content)
              dispath(fetchMovie({ query }));
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
                <Link href={"/admin/movie/new"}>
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                >
                  Thêm bộ phim mới
                </Button>
                </Link>
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
