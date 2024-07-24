"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { Card, Col, ConfigProvider, Popconfirm, Row, Tag, message, notification } from "antd";
import {  callDeleteRota, callDeleteStaff, callFetchRota, callFetchRotaByDate, callFetchStaff } from "@/app/config/api";
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
import { useRouter } from "next/navigation";

export const Rota = () => {
  const tableRef = useRef<ActionType>();
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const today = new Date();

  const [date, setDate] = useState<Date>(today);
  const [locale, setLocal] = useState<Locale>(vi_VN);
  const [meta, setMeta] = useState({ number: 1, size: 10, totalElements: 0 });
  const [rotaDay, setRotaDay] = useState<any[]>([]);
  const nextSevenDays = Array.from(
    { length: 8 },
    (_, i) => new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
 
  const router = useRouter();
  const reloadTable = () => {
    tableRef?.current?.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      const day = moment(date).format("YYYY-MM-DD");
      const res = await callFetchRotaByDate(day);
      if (res.status === 200) {
        console.log(res);
        setRotaDay(res.data);
      } else {
        notification.error({
          message: "Lỗi lấy dữ liệu",
          description: res.data.error,
        });
      }
    };
    fetchData();
  }, [date]);

  const handleClick = (date: Date, index: number) => {
    setDate(date);
    setSelectedIndex(index);
  };

  const handleDeleteRole = async (_id: number | undefined) => {
    if (_id) {
      const res = await callDeleteRota(_id);
      console.log(res);
      if (res.status === 200) {
        message.success("Xóa thành công");
        reloadTable();
      } else {
        notification.error({
          message: "Lỗi xóa dữ liệu",
          description: res.data.error,
        });
      }
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: "STT",
      hideInSearch: true,
      width: "5%",
      render(dom, entity, index, action, schema) {
        return <p style={{ paddingLeft: 10, marginBottom: 0 }}>{index + 1}</p>;
      },
    },
    {
      title: "NGÀY",
      dataIndex: "date",
      width: "20%",
      render: (dom, entity, index, action, schema) => {
        return <>
          <Tag color="blue">{entity.date}</Tag>
        </>;
      }
    }, 
    {
      title: "CA LÀM VIỆC",
      render: (dom, entity, index, action, schema) => {
        return <>
          <Tag color="green">{entity.name}</Tag>
        </>;
      }

    },
    {
      title: "THỜI GIAN ",
      render: (dom, entity, index, action, schema) => {
        return <>
          <Tag color="gold">{moment(entity.shift?.start_time, "HH:mm:ss").format("HH:mm")} - {moment(entity.shift?.end_time, "HH:mm:ss").format("HH:mm")} </Tag>
        </>;
      }

    },
    {
      title: "NHÂN VIÊN",
      render: (dom, entity, index, action, schema) => {
        return <>
        {entity.staffs?.map((staff: any) => {
          return <Tag color="cyan">{staff.firstName} {staff.lastName}</Tag>
        } )}
        </>;
      }
    },
    {
      title: "HÀNH ĐỘNG",
      // dataIndex: "id",
      hideInSearch: true,
      width: "10%",

      render: (dom, entity, index, action, schema) => (
        <Space size="middle">
          {/* <Access
            permission={ALL_PERMISSIONS.ROLES.UPDATE}
            hideChildren
          > */}
          <a>
            <EditOutlined
              onClick={() => {
                router.push(`/admin/calendars/${entity.id}`);
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
      <Row gutter={16}>
        {nextSevenDays.map((day, index) => (
          <Col key={index} span={3}>
            <Card
              onClick={() => handleClick(day, index)}
              style={{
                backgroundColor: selectedIndex === index ? "#BFBFBF" : "",
              }}
            >
              <span className="text-2xl">{moment(day).format("DD/")}</span>
              <span>{moment(day).format("MM")}</span>
              <span> - {days[day.getDay()]}</span>
            </Card>
          </Col>
        ))}
      </Row>
      <ConfigProvider locale={locale}>
        <DataTable<any>
          actionRef={tableRef}
          rowKey="id"
          headerTitle="DANH SÁCH LỊCH LÀM VIỆC"
          columns={columns}
          dataSource={rotaDay}
          // request={async (params, sort, filter): Promise<any> => {
          //   const msg = {
          //     page: (params.current ?? 1) - 1,
          //     size: params.pageSize,
          //   };
          //   const query = buildQuery(msg, sort, filter);
          //   const response = await callFetchRota(query);
          //   setMeta(response.data.meta);
          //   return {
          //     data: response.data.content,
          //     success: true,
          //   };
          // }}
          // scroll={{ x: true }}
          // pagination={{
          //   current: meta.number + 1,
          //   pageSize: meta.size,
          //   showSizeChanger: true,
          //   total: meta.totalElements,
          //   showTotal: (total, range) => {
          //     return (
          //       <div>
          //         {range[0]}-{range[1]} trên {total}
          //       </div>
          //     );
          //   },
          // }}
          rowSelection={false}
          toolBarRender={(_action, _rows): any => {
            return (
              <Button
                icon={<PlusOutlined />}
                type="primary"
              >
                <Link href="/admin/calendars/new">Thêm mới</Link>
              </Button>
            );
          }}
        />
      </ConfigProvider>
      {/* </Access> */}
    </div>
  );
};
