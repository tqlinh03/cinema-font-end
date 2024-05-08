"use client";

import { callBookingTicket, callUpdateBookingTicket } from "@/app/config/api";
import { useAppSelector } from "@/app/redux/hook";
import { IBooking, IMovie } from "@/app/types/backend";
import { Button, Col, Grid, Image, Row, message } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { checkPaid, checkPaymentRecords } from "../payment/payment";
import { set } from "lodash";
import { fetchAccount } from "@/app/redux/slice/accountSlide";
import { useDispatch } from "react-redux";
const { useBreakpoint } = Grid;
interface TicketProps {
  seats: string[];
  price: number;
  movie: IMovie | null;
  current: number;
  stepsLength: number;
  setCurrent: (value: number) => void;
  setTicketCode: (value: string) => void;
  setIsModalOpen: (value: boolean) => void;
}

interface PaymentRecordPrpos {
  id: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const Ticket = ({
  seats,
  price,
  movie,
  current,
  stepsLength,
  setTicketCode,
  setCurrent,
  setIsModalOpen,
}: TicketProps) => {
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecordPrpos[]>(
    []
  );
  const [ticket, setTicket] = useState<IBooking | null>(null);
  const user = useAppSelector((state) => state.account.user._id);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const seatsString: string = seats.join(", ");
  const screens = useBreakpoint();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (paymentRecords.length > 0) {
      const check = async () => {
        const check = await checkPaymentRecords(
          paymentRecords,
          ticket?.total_price ?? 0,
          ticket?.ma_GD ?? "",
          ticket?._id
        );
        if (check) {
          setIsModalOpen(false);
          message.success("Thanh toán thành công");
          dispatch(fetchAccount() as any)
          router.push("/");
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      };
      check();
    }
  }, [paymentRecords]);

  const payment = () => {
    bookingTicket();
    setIsModalOpen(true);
  };

  const bookingTicket = async () => {
    const ticket = {
      movie: movie?._id,
      total_price: price,
      seats,
      user: +user,
    };
    const res = await callBookingTicket(ticket);
    setTicket(res.data);
    setTicketCode(res.data.ma_GD);

    intervalRef.current = setInterval(async () => {
      const check = await checkPaid();
      setPaymentRecords(check);
    }, 1000);
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        setIsModalOpen(false);
      }
    }, 120000);
  };

  
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={screens.sm ? 12 : 24}>
          <Image
            // width={120}
            // height={ !screens.sm ? 12 : 24}
            src={movie?.img}
            preview={false}
          />
        </Col>
        <Col span={24} md={12}>
          <Row>
            <span className="font-bold text-lg text-cyan-700">
              {movie?.name}
            </span>
          </Row>
        </Col>

        <Col span={24} md={24}>
          <ul className="list-none">
            <li className="pt-2 pb-2">
              <Row>
                <Col span={24} md={12}>
                  <span>Thể loại:</span>
                </Col>
                <Col span={24} md={12}>
                  <span className="">{movie?.genre}</span>
                </Col>
              </Row>
            </li>
            <li>
              <Row>
                <Col span={24} md={12}>
                  <span>Thời lượng:</span>
                </Col>
                <Col span={24} md={12}>
                  <span className="">{movie?.time}</span>
                </Col>
              </Row>
            </li>
          </ul>
        </Col>
        <Col span={24} md={24}>
          <hr className="border-t-2 border-dashed border-gray-300 my-4 " />
          <ul className="list-none">
            <li className="pt-2 pb-2">
              <Row>
                <Col span={24} md={12}>
                  <span>Ngày chiếu:</span>
                </Col>
                <Col span={24} md={12}>
                  <span className="">
                    {moment(movie?.ReleaseDate).format("DD/MM/YYYY")}
                  </span>
                </Col>
              </Row>
            </li>
            <li className="pt-2 pb-2">
              <Row>
                <Col span={24} md={12}>
                  <span>Giờ chiếu:</span>
                </Col>
                <Col span={24} md={12}>
                  <span className="">{moment().format("DD/MM/YYYY")}</span>
                </Col>
              </Row>
            </li>
            <li className="pt-2 pb-2">
              <Row>
                <Col span={24} md={12}>
                  <span>Ghế ngồi:</span>
                </Col>
                <Col span={24} md={12}>
                  <span className="">{seatsString}</span>
                </Col>
              </Row>
            </li>
            <li className="pt-2 pb-2">
              <Row>
                <Col span={24} md={12}>
                  <span>Giá:</span>
                </Col>
                <Col span={24} md={12}>
                  <span className="">{price} vnđ</span>
                </Col>
              </Row>
            </li>
          </ul>
          <div>
            {/* {current > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                Previous
              </Button>
            )} */}
            {current < stepsLength - 1 && (
              <Button type="primary" className="w-full" onClick={() => next()}>
                Đặt vé
              </Button>
            )}
            {current === stepsLength - 1 && (
              <Button type="primary" className="w-full" onClick={payment}>
                Thanh toán
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};
