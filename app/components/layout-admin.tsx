"use client";
import React, { useState } from "react";
import {
  ApartmentOutlined,
  AudioMutedOutlined,
  AuditOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  GoldOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyOutlined,
  ShopOutlined,
  UploadOutlined, 
  UsergroupDeleteOutlined, 
  UserOutlined,
  VideoCameraOutlined, 
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Image, message } from "antd/lib";
import { useDispatch } from "react-redux";
import { setLogoutAction } from "../redux/slice/accountSlide";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { callLogout } from "@/app/config/api";
import { Dropdown } from "antd"; 

const { Header, Sider, Content } = Layout;

export const LayoutAdmin = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = async () => {
    try {
      const res = await callLogout();
      if (res && res.data) {
        dispatch(setLogoutAction({}));
        message.success("Đăng xuất thành công");
        router.push("/login");
      }
    } catch (e) {
      console.log("error logout: ", e);
    }
  };

  const itemsDropdown = [
    {
      label: <Link href={'/'}>Trang chủ</Link>,
      key: 'home',
    },
    {
        label: <label
            style={{ cursor: 'pointer' }}
            onClick={() => handleLogout()}
        >Đăng xuất</label>,
        key: 'logout',
        icon: <LogoutOutlined />
    },
  ];

  return (
    <Layout className="h-full">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: "#ffffff"}}
      >
        <div className="flex justify-center">
          <Link href={"/"}>
            <Image preview={false} style={{marginTop: 15}} src="/logo1.png" width="50px" height="30px" />
          </Link>
        </div>
        {/* <div className="flex flex-col items-center justify-between min-h-screen"> */}
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{marginTop: 30}}
            items={[
              {
                key: "dasboard",
                icon: <DashboardOutlined />,
                label: <Link href="/admin/">Bảng điều khuyển</Link>,
              },
              {
                key: "user",
                icon: <UserOutlined />,
                label: <Link href="/admin/user">Người dùng</Link>,
              },
              {
                key: "role",
                icon: <SafetyOutlined />,
                label: <Link href="/admin/role">Vai Trò</Link>,
              },
              {
                key: "permission",
                icon: <AuditOutlined />,
                label: <Link href="/admin/permission">Quyền hạn</Link>,
              },
              
              {
                key: "movie",
                icon: <VideoCameraOutlined />,
                label: <>Phim</>,
                children: [ 
                  {
                    key: "allmovie",
                    label: <Link href="/admin/movie/all">Phim</Link>,
                  },
                  {
                    key: "addmovie",
                    label: <Link href="/admin/movie/new">Thêm phim mới</Link>,
                  },
                 
                ]
              },
              {
                key: "order",
                icon: <ShopOutlined />,
                label: <>Vé đã đặt</>,
              },
              {
                key: "showtimes",
                icon: <FieldTimeOutlined />,
                label: <>lịch chiếu</>,
                children: [ 
                  {
                    key: "allshowtimes",
                    label: <Link href="/admin/showtimes">Lịch chiếu</Link>,
                  },
                  {
                    key: "addshowtimes",
                    label: <Link href="/admin/showtimes/new">Tạo lịch chiếu phim</Link>,
                  },
                 
                ]
              },
              {
                key: "room",
                icon: <HomeOutlined />,
                label: <>Quản lý phòng</>,
                children: [ 
                  {
                    key: "rooms",
                    label: <Link href="/admin/room/all">Phòng</Link>,
                  },
                  {
                    key: "create-room",
                    label: <Link href="/admin/room/new">Tạo phòng mới</Link>,
                  },
                 
                ]
              },
              {
                key: "staff",
                icon: <UsergroupDeleteOutlined />,
                label: <>Nhân viên</>,
                children: [ 
                  {
                    key: "staffs",
                    label: <Link href="/admin/staff/all">Nhân viên</Link>,
                  },
                  {
                    key: "create-staff",
                    label: <Link href="/admin/staff/new">Thêm nhân viên mới</Link>,
                  },
                 
                ]
              },
              {
                key: "calendar",
                icon: <CalendarOutlined />,
                label: <>Lịnh làm việc</>,
                children: [ 
                  {
                    key: "calendars",
                    label: <Link href="/admin/calendars/all">Lịch làm việc</Link>,
                  },
                  {
                    key: "create-calendar",
                    label: <Link href="/admin/calendars/new">Tạo Lịch làm việc</Link>,
                  },
                  {
                    key: "shifts",
                    label: <Link href="/admin/calendars/shifts">Ca làm việc</Link>,
                  },
                 
                ]
              },
           
            ]}
          />
        {/* </div> */}
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex justify-between">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
              <Button
                type="text"
                icon={<UserOutlined />}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            // padding: 24,
            minHeight: 280,
            height: "100%",
            background: "#f5f5f5",
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
