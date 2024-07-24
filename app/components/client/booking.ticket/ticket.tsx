"use client";

import { callCreateOrder, callFetchShowtimeById} from "@/app/config/api";
import { useAppSelector } from "@/app/redux/hook";
import { IMovie } from "@/app/types/backend";
import { Button, Col, Grid, Image, Row, message } from "antd";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { checkPaid, checkPaymentRecords } from "../payment/payment";

const { useBreakpoint } = Grid;

interface TicketProps {
  object: any[];
  seats: string[];
  price: number;
  movie: IMovie | null;
  showtimeId: string | null;
  current: number;
  stepsLength: number;
  setCurrent: (value: number) => void;
  setTicketCode: (value: string) => void;
  setIsModalOpen: (value: boolean) => void;
  isModalOpen: boolean;
}

interface PaymentRecordPrpos {
  id: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface orderProps {
  seatType: string;
  price: number;
  seatNumber: string;
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
  showtimeId,
  object,
  isModalOpen
}: TicketProps) => {
  const [order, setOrder] = useState<orderProps[]>([]);
  const userId = useAppSelector((state) => state.account.user._id);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecordPrpos[]>([]);
  const [ticket, setTicket] = useState<any | null>(null);
  const [showtime, setShowtime] = useState<any | null>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null); 
  const seatsString: string = seats.join(", ");
  const screens = useBreakpoint();
  const router = useRouter();

  useEffect(() => {
    if (showtimeId) {
      const fetchData = async () => {
        try {
          const res = await callFetchShowtimeById(+showtimeId);
          if (res.status === 200) {
            setShowtime(res.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
    if (paymentRecords.length > 0) {
      const check = async () => {
        const check = await checkPaymentRecords(
          paymentRecords,
          ticket?.payment.amount ?? 0,
          ticket?.maGd ?? "",
          ticket?.payment.id
        );
        console.log("check", check);
        if (check) {
          setIsModalOpen(false);
          message.success("Thanh toán thành công");
          router.push("/");
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      };
      check();
    }
  }, [paymentRecords, showtimeId]);

  useEffect(() => {
    setOrder([]);
    object.map((item: any) => {
      const orderItem = {
        seatType: item.category.label,
        price: item.pricing.price,
        seatNumber: item.label,
        showtimeId: showtimeId,
      };
      setOrder((order) => [...order, orderItem]);
    });
  }, [object]);

  const orderTicket = async () => {
    try {
      const order_ = { order, userId };
      const res = await callCreateOrder(order_);
      setTicket(res.data);
      setTicketCode(res.data.maGd);

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
      setIsModalOpen(true);
       
    } catch (error) {
      console.log("error", error);
    }
    
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
                  <span className="">{movie?.time} phút</span>
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
                  <span className="">{showtime.date}</span>
                </Col>
              </Row>
            </li>
            <li className="pt-2 pb-2">
              <Row>
                <Col span={24} md={12}>
                  <span>Giờ chiếu:</span>
                </Col>
                <Col span={24} md={12}>
                  <span className="">
                    {moment(showtime.start_time, "HH:mm:ss").format("HH:mm")}
                  </span>
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
              // <Button type="primary" className="w-full" onClick={payment}>
              <Button type="primary" className="w-full" onClick={orderTicket}>
                Thanh toán
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};
