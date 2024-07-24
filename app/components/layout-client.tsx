"use client";
import React from "react";
import { Layout, Menu, theme, Image, message } from "antd/lib";
import { useDispatch } from "react-redux";
import { setLogoutAction } from "../redux/slice/accountSlide";
import { useRouter } from "next/navigation";
import { callLogout } from "@/app/config/api";
import { useAppSelector } from "../redux/hook";
import { Avatar, Breadcrumb, Divider, Dropdown, Grid, Space } from "antd";
import { Footer } from "antd/es/layout/layout";
import { isMobile } from "react-device-detect";
import Link from "next/link";
import {
  ContactsOutlined,
  DashOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

export const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector(
    (state) => state.account.isAuthenticated
  );
  const user = useAppSelector((state) => state.account.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const screens = useBreakpoint();

  const handleLogout = async () => {
    try {
      const res = await callLogout();
      if (res && res.data) {
        dispatch(setLogoutAction({}));
        // router.push(`${window.location.origin}/login`);
        message.success("Đăng xuất thành công");
      }
    } catch (e) {
      console.log("error logout: ", e);
    }
  };

  const itemsDropdown = [
    {
      label: <Link href={"/account"}> Quản lý tài khoản</Link>,
      key: "manage-account",
      icon: <ContactsOutlined />,
    },
    {
      label: <Link href={"/admin"}>Trang Quản Trị</Link>,
      key: "admin",
      icon: <DashOutlined />,
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="flex justify-center items-center">
      <div className=" sm:w-full flex justify-center bg-white fixed !top-0 !left-0 !z-50">
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 99,
            width: screens.xl
              ? 1180
              : screens.lg
              ? 1024
              : screens.md
              ? 768
              : screens.sm
              ? 640
              : 390,
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            padding: screens.sm ? 48 : 24,
          }}
        >
          <div className="demo-logo">
            <Link href={"/"}>
              <Image
                preview={false}
                src="/logo.png"
                width="70px"
                height="54px"
              />
            </Link>
          </div>
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={[
              {
                key: "home",
                // icon: <UserOutlined />, 
                label: <Link href="/"><span className="text-lg">Trang chủ</span></Link>,
              },
              {
                key: "/news-and-offers",
                // icon: <SafetyOutlined />,
                label: <Link href="/news-and-offers"><span className="text-lg">Tin mới và ưu đãi</span></Link>,
              },
              // {
              //   key: "permission",
              //   // icon: <UploadOutlined />,
              //   label: <Link href="/admin/permission">Permission</Link>,
              // },
            ]}
            style={{ flex: 1, minWidth: 0 }}
          />
          {isAuthenticated === false ? (
            <Link href={"login"}>Login</Link>
          ) : (
            <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
              <Space style={{ cursor: "pointer" }}>
                <span>Xin chào! {user?.lastName}</span>
                <Avatar> {user?.lastName?.substring(0, 1)?.toUpperCase()} </Avatar>
              </Space>
            </Dropdown>
          )}
        </Header>
      </div>
      {/* <Divider style={{ margin: 0 }} /> */} 
      <Content
        style={{
          width: screens.xl
            ? 1180
            : screens.lg
            ? 1024
            : screens.md
            ? 768
            : screens.sm
            ? 640
            : 390,
          // padding: screens.sm ? 640 : 390"0 48px"
          paddingLeft: screens.sm ? 48 : 0,
          paddingRight: screens.sm ? 48 : 0,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer
        style={{ width: "100%", textAlign: "center", background: "#d9d9d9" }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};
