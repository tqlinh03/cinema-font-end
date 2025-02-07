"use client";
import { Col, Grid, Row } from "antd";
import { useEffect, useState } from "react";
import { ChooseSeats } from "./choose.seats";
import { Ticket } from "./ticket";
import { callFetchMovieById } from "@/app/config/api";
import { IMovie } from "@/app/types/backend";
import {  PaymentInfo } from "./payment.info";
import PaymentQrModal from "../../modal/payment-qr-modal";
import { useSearchParams } from "next/navigation";

const { useBreakpoint } = Grid;

interface IProps {
  movieId: number;
}


export const Booking = ({ movieId }: IProps) => {
  const [object, setObject] = useState<any>([]);


  const [seats, setSeats] = useState<string[]>([]);
  const [ticketCode, setTicketCode] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(0); 

  const screens = useBreakpoint();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('r');
  const showtimeId = searchParams.get('s');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callFetchMovieById(movieId);
        if (res.data) {
          setMovie(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [movieId]);

  const steps = [
    {
      // title: "First",
      content: (
        <ChooseSeats setObject={setObject} showtimeId={showtimeId}  roomId={roomId} setSeats={setSeats} setTotalPrice={setTotalPrice} />
      ),
    },
    {
      title: "Second",
      content: <PaymentInfo/>,
    },
  ];
  

  return (
    <> 
      <Row style={{marginTop: 50}} gutter={16}>
        <Col  span={ screens.sm ? 19 : 24}>
          <div>{steps[current].content}</div>
        </Col>
        <Col span={ screens.sm ? 5 : 24}>
          <Ticket
            object={object}
            price={totalPrice}
            seats={seats}
            movie={movie}
            showtimeId={showtimeId}
            current={current}
            setTicketCode={setTicketCode}
            setCurrent={setCurrent}
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            stepsLength={steps.length}
          />
        </Col>
      </Row>
      <PaymentQrModal 
        price={totalPrice}
        ticketCode={ticketCode}
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};
