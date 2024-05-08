"use client";
import React, { use, useEffect, useState } from "react";
import { Form, Button, DatePicker, TimePicker, Select, message } from "antd";
import dayjs from "dayjs";
import { IMovie, IShowtime } from "@/app/types/backend";
import { callCreateShowtime, callFetchMovie } from "@/app/config/api";

const NewAndUpdateShowtime = () => {
  const { Option } = Select;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [showtimeDate, setShowtimeDate] = useState(dayjs());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callFetchMovie("page=1&limit=100");
        if (res.data) {
          setMovies(res.data.items);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const onFinish = async(values: any) => {
    const { hour, movie } = values;
    const [startTime, endTime] = hour;

    const showtime: IShowtime = {
      date: showtimeDate.toDate(),
      start_time: startTime.toDate(),
      end_time: endTime.toDate(),
      movie,
    };

    try {
      const res = await callCreateShowtime(showtime);
      if (res.data) {
        message.success("Create showtime successfully");
      } else {
        message.error("Create showtime failed");
      }
    } catch (error) {
      
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const handleDateChange = (date: any) => {
    setShowtimeDate(date || dayjs()); // Cập nhật giá trị của biến trạng thái khi người dùng thay đổi
  };

  return (
    <div>
      <h1>New and Update Showtime</h1>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Showtime Date"
          //name="showtimeDate"
        >
          <DatePicker
            onChange={handleDateChange}
            defaultValue={dayjs()}
            format="DD-MM-YYYY"
          />
        </Form.Item>

        <Form.Item
          label="Hour"
          name="hour"
          rules={[{ required: true, message: "Please input the hour!" }]}
        >
          <TimePicker.RangePicker format={"HH:ss"} />
        </Form.Item>

        <Form.Item
          label="Movie"
          name="movie"
          rules={[{ required: true, message: "Please input the hour!" }]}
        >
          <Select
            allowClear
            placeholder="Choose movie"
            value={selectedItems}
            onChange={setSelectedItems}
            style={{ width: "100%" }}
          >
            {movies.map((item) => (
              <Option key={item._id} value={item._id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewAndUpdateShowtime;
