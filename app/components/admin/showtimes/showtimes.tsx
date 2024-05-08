"use client";
import React, { use, useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  InputNumber,
  Image,
  Divider,
  Space,
  Popconfirm,
} from "antd";
import moment from "moment";
import { callFetchShowtimeByDate } from "@/app/config/api";
import { IShowtime } from "@/app/types/backend";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export interface IShowtimeProps {
  _id?: any;
  date: Date;
  start_time: Date;
  end_time: Date;
  movie: {
    _id: number;
    name: string;
    img: string;
    description: string;
    time: number;
  };

  createdAt?: string;
  updatedAt?: string;
}

export const Showtimes = () => {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const today = new Date();
  const [date, setDate] = useState<Date>(today);
  const [showtimesDay, setShowtimesDay] = useState<IShowtimeProps[]>([]);
  const nextSevenDays = Array.from(
    { length: 7 },
    (_, i) => new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleClick = (date: Date, index: number) => {
    setDate(date);
    setSelectedIndex(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callFetchShowtimeByDate(date);
        if (res.data) {
          setShowtimesDay(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [date]);

  return (
    <div>
      <h1 className="text-4xl mb-4">Showtimes</h1>

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

      <Row
        
        gutter={16}
        justify="center"
        style={{
          padding: "10px",
          border: "1px solid #e8e8e8",
          borderRadius: "5px",
        }}
      >
        <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          Showtime
        </Col>
        <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          Image
        </Col>
        <Col span={6}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          Name
        </Col>
        <Col span={6}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          Description
        </Col>
        <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          Time
        </Col>
        <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          Action
        </Col>
      </Row>
      {showtimesDay.map((showtime) => (
        <Row
          justify="center"
          key={showtime._id}
          gutter={[16, 48]}
          style={{ marginBottom: "10px", border: "1px solid #e8e8e8" }}
        >
          <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
            <p>
              {moment(showtime.start_time).format("HH:mm")} -{" "}
              {moment(showtime.end_time).format("HH:mm")}
            </p>
          </Col>
          <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
            <div>
              <Image width={150} src={showtime.movie.img} />
            </div>
          </Col>
          <Col span={6}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
            <p>{showtime.movie.name}</p>
          </Col>
          <Col span={6}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
            <p>{showtime.movie.description}</p>
          </Col>
          <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
            <p>{showtime.movie.time}</p>
          </Col>
          <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          <Space size="middle">
          
            <a>
              <EditOutlined
               // onClick={ async() => {
                 // await dispath(setSingleMovie(entity))
                  //router.push(`/admin/movie/${entity._id}`)
               // }}
              />
            </a>
         
            <Popconfirm
              title="Sure to delete?"
             // onConfirm={() => handleDeleteMovie(entity._id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <a>
                <DeleteOutlined />
              </a>
            </Popconfirm>
         
        </Space>
          </Col>
        </Row>
      ))}
    </div>
  );
};
