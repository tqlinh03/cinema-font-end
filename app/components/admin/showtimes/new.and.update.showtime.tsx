"use client";
import React, { use, useEffect, useState } from "react";
import { Form, Button, DatePicker, TimePicker, Select, message } from "antd";
import dayjs from "dayjs";
import { IMovie, IRoom, IShowtime } from "@/app/types/backend";
import {
  callCreateShowtime,
  callFetchMovie,
  callFetchRoomAll,
  callFetchShowtimeById,
  callUpdateShowtime,
} from "@/app/config/api";
import moment from "moment";
import { useRouter } from "next/navigation";

interface IProps {
  showtimeId?: number;
}

const NewAndUpdateShowtime = ({ showtimeId }: IProps) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string[]>([]);
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const today = new Date();
  const [showtimeDate, setShowtimeDate] = useState(today);
  const route = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callFetchMovie("page=0&size=100");
        if (res.data) {
          setMovies(res.data.content);
        }
        const resRoom = await callFetchRoomAll();
        if (resRoom.data) {
          setRooms(resRoom.data.content);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (showtimeId) {
      const fetchData = async () => {
        const res = await callFetchShowtimeById(showtimeId);
        if (res.data) {
          const { date, start_time, end_time, movie, room } = res.data;
          const startTime = moment(`${date} ${start_time}`);
          const endTime = moment(`${date} ${end_time}`);
          form.setFieldsValue({
            hour: [startTime, endTime],
            movie: movie.id,
            roomId: room,
          });
          setSelectedItems([movie.id]);
        }
      };
      fetchData();
    }
  }, []);

  const onFinish = async (values: any) => {
    const { hour, movie, roomId} = values;
    const [startTime, endTime] = hour;

    const startTimeString = moment(startTime.toDate()).format("HH:mm:ss");
    const endTimeString = moment(endTime.toDate()).format("HH:mm:ss");
    const showtime: IShowtime = {
      date: showtimeDate,
      start_time: startTimeString,
      end_time: endTimeString,
      movie,
      roomId
    };

    try {
      if (!showtimeId) {
        const res = await callCreateShowtime(showtime);
        console.log("res", res);
        if (res.data.error) {
          message.error(res.data.error);
        } else {
          message.success("Tạo thành công");
          form.resetFields();
        }
      } else {
        const res = await callUpdateShowtime(showtimeId, showtime);
        if (res.data.error) {
          message.error("Cập nhật thất bại");
        } else {
          message.success("Cập nhật thành công");
          route.push("/admin/showtimes");
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
          {showtimeId ? "CẬP NHẬT LỊCH CHIẾU PHIM" : "TẠO LỊCH CHIẾU PHIM"}
        </div>
        <Form.Item
          label="Ngày chiếu phim"
          //name="showtimeDate"
          rules={[{ required: true, message: "Không được để trống!" }]}
        >
          <DatePicker
            onChange={handleDateChange}
            defaultValue={dayjs()}
            format="DD-MM-YYYY"
          />
        </Form.Item>

        <Form.Item
          label="Thời gian"
          name="hour"
          rules={[{ required: true, message: "Không được để trống!" }]}
        >
          <TimePicker.RangePicker format={"HH:mm"} />
        </Form.Item>

        <Form.Item
          label="Phim"
          name="movie"
          rules={[{ required: true, message: "Không được để trống!" }]}
        >
          <Select
            allowClear
            placeholder="Chọn phim"
            value={selectedItems}
            onChange={setSelectedItems}
            style={{ width: "100%" }}
          >
            {movies.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Phòng chiếu phim"
          name="roomId"
          rules={[{ required: true, message: "Không được để trống!" }]}
        >
          <Select
            allowClear
            placeholder="Chọn phòng"
            value={selectedRoom}
            onChange={setSelectedRoom}
            style={{ width: "100%" }}
          >
            {rooms.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
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
            {showtimeId ? "Cập nhật" : " Tạo lịch chiếu"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewAndUpdateShowtime;
