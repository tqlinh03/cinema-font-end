"use client";
import React, { use, useEffect, useState } from "react";
import { Form, Button, DatePicker, TimePicker, Select, message, Input } from "antd";
import dayjs from "dayjs";
import { IShowtime } from "@/app/types/backend";
import {
  callCreateRota,
  callCreateShowtime,
  callFetchRotaById,
  callFetchShift,
  callFetchShowtimeById,
  callFetchStaff,
  callUpdateRota,
  callUpdateShowtime,
} from "@/app/config/api";
import moment from "moment";
import { useRouter } from "next/navigation";

interface IProps {
  calendarId?: number;
}

const CreateRota = ({ calendarId }: IProps) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const today = new Date();
  const [showtimeDate, setShowtimeDate] = useState(today);
  const route = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callFetchStaff("page=0&size=100");
        if (res.status === 200) {
          setStaffs(res.data.content);
        }
        const shiftsResponse = await callFetchShift("page=0&size=100");
        console.log("shiftsResponse", shiftsResponse);
        if (shiftsResponse.status === 200) { 
          setShifts(shiftsResponse.data.content);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (calendarId) {
      const fetchData = async () => {
        const res = await callFetchRotaById(calendarId);
        console.log("res", res);
        if (res.status === 200) {
          const stafftItem = res.data.staffs.map((item: any) => item.id);
          console.log("stafftItem", stafftItem);

          form.setFieldsValue({ 
            staffIds: stafftItem,
            name: res.data.name,
            shiftId: res.data.id,
          });
        }
      };
      fetchData();
    }
  }, [calendarId]);

  const onFinish = async (values: any) => {
    const { name, staffIds, shiftId } = values;
    const rota = { name, staffIds, shiftId, date: showtimeDate };
    try {
      if (!calendarId) {
        const res = await callCreateRota(rota);
        if (res.data.error) {
          message.error(res.data.error);
        } else {
          message.success("Tạo thành công");
          form.resetFields();
        }
      } else {
        const res = await callUpdateRota(calendarId, rota);
        if (res.data.error) {
          message.error("Cập nhật thất bại");
        } else {
          message.success("Cập nhật thành công");
          route.push("/admin/calendars/all");
        }
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleDateChange = (date: any) => {
    setShowtimeDate(date || dayjs()); // Cập nhật giá trị của biến trạng thái khi người dùng thay đổi
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  return (
    <div className="m-5 bg-white flex justify-center ">
      {/* <h1>Tạo lịch chiếu phim</h1> */}
      <Form
        name="basic"
        form={form}
        {...layout}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        labelAlign="left"
        style={{ width: "100%", margin: "60px", padding: "20px" }}
        className="text-2xl font-medium mb-10"
      >
        <div className="text-2xl mb-10 flex justify-start">
          {calendarId ? "CẬP NHẬT LỊCH LÀM VIỆC" : "TẠO LỊCH LÀM VIỆC"}
        </div>
        <Form.Item
          label="Ngày"
          rules={[{ required: true, message: "Không được để trống!" }]}
        >
          <DatePicker
            onChange={handleDateChange}
            defaultValue={dayjs()}
            format="DD-MM-YYYY"
          />
        </Form.Item>

        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Không được để trống!" }]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="Nhân viên"
          name="staffIds"
          rules={[{ required: true, message: "Không được để trống!" }]}
        >
          <Select
            allowClear
             mode="multiple"
            placeholder="Chọn..."
            value={selectedItems}
            onChange={setSelectedItems}
            style={{ width: "100%" }}
          >
            {staffs.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.firstName} {item.lastName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Thời gian "
          name="shiftId"
          rules={[{ required: true, message: "Không được để trống!" }]}
        >
          <Select
            allowClear
            placeholder="Chọn..."
            value={selectedItems}
            onChange={setSelectedItems}
            style={{ width: "100%" }}
          >
            {shifts.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.day_of_weed} ({moment(item.start_time, "HH:mm:ss").format("HH:mm")} - {moment(item.end_time, "HH:mm:ss").format("HH:mm")})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: 30, height: 40, width: "100%" }}
          >
            {calendarId ? "Cập nhật" : " Tạo lịch chiếu"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateRota;
