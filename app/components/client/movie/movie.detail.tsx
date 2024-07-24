"use client";
import {
  callFetchMovie,
  callFetchMovieById,
  callFetchMovieByIdAndDate,
  callFetchShowtimeByDate,
  callGetMovieByIdAndDate,
} from "@/app/config/api";
import { IMovie } from "@/app/types/backend";
import { Card, Col, Grid, Image, Row, Spin, message } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { CommentMovie } from "../comment/comment";
import { ConfirmTicketBookingModal } from "../../modal/confirm-ticket-booking-modal";

interface IProps {
  movieId: number;
}

interface IShowtimeProps {
  id?: any;
  date: Date;
  start_time: Date;
  end_time: Date;
  movie: {
    id: number;
    name: string;
    img: string;
    description: string;
    time: number;
  };
  roomId: number;
}

const { useBreakpoint } = Grid;

export const MovieDetail = ({ movieId }: IProps) => {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const today = new Date();
  const [date, setDate] = useState<Date>(today);
  const [movieDetai, setMovieDetail] = useState<IMovie | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showtimesDay, setShowtimesDay] = useState<IShowtimeProps[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showtime, setShowtime] = useState<IShowtimeProps>();

  const screens = useBreakpoint();

  const nextSevenDays = Array.from(
    { length: 6 },
    (_, i) => new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
  );

  const handleClick = (date: Date, index: number) => {
    setDate(date);
    setSelectedIndex(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const day = moment(date).format("YYYY-MM-DD");
        const res = await callGetMovieByIdAndDate(movieId, day);
        if (res.status === 200) {
          setShowtimesDay(res.data.showtime);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }; 
    fetchData();
  }, [date]);

  useEffect(() => {
    const fetchMovieID = async () => {
      const res = await callFetchMovieById(movieId);
      if (!res.data.error) {
        setMovieDetail(res.data);
      } else {
        message.error("có lỗi xảy ra!");
      }
    };
    fetchMovieID();
  }, []);

  const handleModal = (showtime: IShowtimeProps, hour: Date) => {
    setOpenModal(true);
    setShowtime(showtime);
  };

  return (
    <>
      <Row className="mt-10" gutter={[20, 20]}>
        <Col span={screens.md ? 7 : screens.sm ? 24 : 24}>
          <Image
            style={{
              borderRadius: 20,
              width: screens.xl
                ? 260
                : screens.lg
                ? 240
                : screens.md
                ? 170
                : screens.sm
                ? 500
                : 340,
              height: screens.lg
                ? 410
                : screens.md
                ? 260
                : screens.sm
                ? 700
                : 470,
            }}
            // width={260}
            // height={410}
            src={movieDetai?.img}
          />
        </Col>
        <Col span={screens.md ? 17 : screens.sm ? 24 : 24}>
          <h1 className="text-3xl mt-2">{movieDetai?.name}</h1>
          <p className="text-lg">{movieDetai?.description}</p>
          <Row>
            <Col span={8}>
              <span className="font-bold text-gray-700 text-lg">ĐẠO DIỄN:</span>
            </Col>
            <Col span={16}>
              <span className="text-lg">{movieDetai?.director}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span className="font-bold text-gray-700 text-lg">
                DIỄN VIÊN:
              </span>
            </Col>
            <Col span={16}>
              <span className="text-lg">{movieDetai?._cast}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span className="font-bold text-gray-700 text-lg">THỂ LOẠI:</span>
            </Col>
            <Col span={16}>
              <span className="text-lg">{movieDetai?.genre}</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span className="font-bold text-gray-700 text-lg">
                THỜI LƯỢNG:
              </span>
            </Col>
            <Col span={16}>
              <span className="text-lg">{movieDetai?.time} phút</span>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <span className="font-bold text-gray-700 text-lg">
                NGÀY KHỞI CHIẾU:
              </span>
            </Col>
            <Col span={16}>
              <span className="text-lg">
                {moment(movieDetai?.releaseDate).format("MM/DD/YYYY")}
              </span>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            {nextSevenDays.map((day, index) => (
              <Col key={index} span={screens.md ? 4 : screens.sm ? 6 : 6}>
                <Card
                  onClick={() => handleClick(day, index)}
                  style={{
                    padding: 0,
                    backgroundColor: selectedIndex === index ? "#d9d9d9" : "",
                  }}
                >
                  <span className="text-2xl font-medium text-zinc-800">
                    {moment(day).format("DD/")}
                  </span>
                  <span className="text-lg">{moment(day).format("MM")}</span>
                  <span className="text-lg"> - {days[day.getDay()]}</span>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={24}>
          <span className="mt-6 text-lg font-bold text-zinc-700">
            2D PHỤ ĐỀ
          </span>
        </Col>
        <Col span={24}>
          <Row style={{ height: 60 }}>
            {showtimesDay.map((showtime) => (
              <Col
                span={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p
                  onClick={() => handleModal(showtime, showtime.start_time)}
                  className="w-32 h-8 hover:bg-zinc-300  bg-zinc-200 flex justify-center items-center"
                >
                  {moment(showtime.start_time, "HH:mm:ss").format("HH:mm")}
                </p>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <div className="bg-slate-800 w-full mt-10">
        <div className="flex justify-center">
          <span className="text-3xl font-bold text-gray-100 mt-10">
            TRAILER
          </span>
        </div>

        <div className="flex justify-center p-8">
          {movieDetai && (
            
            <ReactPlayer
              width={800}
              height={screens.lg ? 400 : screens.sm ? 200 : 140}
              url={movieDetai.videoURL}
              controls={true}
            />
          )}
        </div>
      </div>
      <div>
        <ConfirmTicketBookingModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          showtime={showtime}
        />
      </div>

      {/* <CommentMovie movieId={movieId} /> */}
    </>
  );
};
