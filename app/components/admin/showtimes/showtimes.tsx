"use client";
import React, { use, useEffect, useRef, useState } from "react";
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
  message,
  Tag,
} from "antd";
import moment from "moment";
import { callDeleteShowtime, callFetchShowtimeByDate } from "@/app/config/api";
import { IShowtime } from "@/app/types/backend";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Access } from "../../share/access";
import { ALL_PERMISSIONS } from "@/app/config/permission";
import { setSingleMovie } from "@/app/redux/slice/movieSlide";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/redux/hook";
import { error } from "console";
import { set } from "lodash";

export interface IShowtimeProps {
  id?: any;
  date: Date;
  start_time: String;
  end_time: String;
  movie: {
    id: number;
    name: string;
    img: string;
    description: string;
    time: number;
  };
  room: String;

  createdAt?: string;
  updatedAt?: string;
}

export const Showtimes = () => {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const today = new Date();
  const [date, setDate] = useState<Date>(today);
  const [callAgain, setCallAgain] = useState<boolean>(false);
  const [showtimesDay, setShowtimesDay] = useState<IShowtimeProps[]>([]);
  const nextSevenDays = Array.from(
    { length: 8 },
    (_, i) => new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const router = useRouter();
  const dispatch = useAppDispatch();


  const handleClick = (date: Date, index: number) => {
    setDate(date);
    setSelectedIndex(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const day = moment(date).format("YYYY-MM-DD");
        const res = await callFetchShowtimeByDate(day);
        // console.log("res: ", res);
        if (res.data) {
          setShowtimesDay(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };  
    fetchData();
    setCallAgain(false);
  }, [date, callAgain]);


  const handleDeleteShowtimes = async (_id: number | undefined) => {
    console.log(_id);
    if (_id) {
      const res = await callDeleteShowtime(+_id);
      if (res && res.data.error) {
        message.error("Xóa thất bại");
        } else {
          message.success("Xóa thành công");
          setCallAgain(true);
      }
    }
  }

  return (
    <div>
      <span className="text-2xl mb-10 flex justify-start"> LỊCH CHIẾU PHIM</span>
      {/* <div className="text-2xl mb-10 flex justify-start">
      
      </div> */}
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
        className="text-2xl font-medium"
        style={{padding: "10px", border: "1px solid #e8e8e8", marginTop: 40}}
      >
        <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          THỜI GIAN CHIẾU
        </Col>
        <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          PHÒNG CHIẾU 
        </Col>
        <Col span={2}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          ẢNH
        </Col>
        <Col span={10}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          TÊN PHIM
        </Col>
        <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          THỜI LƯỢNG PHIM
        </Col>
        <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          HÀNH ĐỘNG
        </Col>
      </Row>
      {showtimesDay.map((showtime) => (
        <Row
          justify="center"
          key={showtime.id}
          gutter={[16, 48]}
          style={{padding: "10px",  border: "1px solid #e8e8e8" }}
        >
          <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
            <Tag style={{fontSize: 14}} color="geekblue">
            {showtime.start_time.slice(0,5)} - {" "}
            {showtime.end_time.slice(0,5)}
            </Tag>
          </Col>
          <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
            <Tag style={{fontSize: 14}} color="cyan">
            {showtime.room}
            </Tag>
          </Col>
          <Col span={2}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
              <Image width={50} src={showtime.movie.img} />
          </Col>
          <Col span={10}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8", fontSize: 16 }}>
            {showtime.movie.name}
          </Col>
          <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
            <Tag style={{fontSize: 14}} color="green">
            {showtime.movie.time} phút
            </Tag>
          </Col>
          <Col span={3}style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #e8e8e8" }}>
          <Space size="middle">
          
            <a>
              <EditOutlined
               onClick={ async() => {
                //  await dispath(setSingleMovie(entity))
                  router.push(`/admin/showtimes/${showtime.id}`)
               }}
              />
            </a>
         
            <Popconfirm
              title="Sure to delete?"
             onConfirm={() => handleDeleteShowtimes(showtime.id)}
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
