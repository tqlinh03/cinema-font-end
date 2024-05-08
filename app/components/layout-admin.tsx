"use client";
import React, { useState } from "react";
import {
  ApartmentOutlined,
  GoldOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyOutlined,
  UploadOutlined, 
  UserOutlined, 
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
        style={{ background: "#ffffff" }}
      >
        <div className="flex justify-center">
          <Link href={"/"}>
            <Image preview={false} src="/logo.png" width="70px" height="54px" />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-between min-h-screen">
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "user",
                icon: <UserOutlined />,
                label: <Link href="/admin/user">User</Link>,
              },
              {
                key: "/role",
                icon: <SafetyOutlined />,
                label: <Link href="/admin/role">Role</Link>,
              },
              {
                key: "permission",
                icon: <UploadOutlined />,
                label: <Link href="/admin/permission">Permission</Link>,
              },
              {
                key: "cinema",
                icon: <ApartmentOutlined/>,
                label: <Link href="/admin/cinema">Cinema</Link>,
              },
              {
                key: "room",
                icon: <GoldOutlined/>,
                label: <>Manage Room</>,
                children: [ 
                  {
                    key: "AllRoom",
                    label: <Link href="/admin/room/all">All Room</Link>,
                  },
                  {
                    key: "AddRoom",
                    label: <Link href="/admin/room/new">Add Room</Link>,
                  },
                 
                ]
              },
              {
                key: "Manage_Movie",
                icon: <GoldOutlined/>,
                label: <>Manage Movie</>,
                children: [ 
                  {
                    key: "AllMovie",
                    label: <Link href="/admin/movie/all">All Movies</Link>,
                  },
                  {
                    key: "AddMovie",
                    label: <Link href="/admin/movie/new">Add Movie</Link>,
                  },
                 
                ]
              },
              {
                key: "showtimes",
                icon: <SafetyOutlined />,
                label: <>Manage Showtime</>,
                children: [ 
                  {
                    key: "allshowtimes",
                    label: <Link href="/admin/showtimes">Showtimes</Link>,
                  },
                  {
                    key: "addshowtimes",
                    label: <Link href="/admin/showtimes/new">Add Movie</Link>,
                  },
                 
                ]
              },
           
            ]}
          />
        </div>
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
