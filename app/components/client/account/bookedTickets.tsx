"use client";

import { useAppSelector } from "@/app/redux/hook";
import { Col, Row, Tag, message } from "antd";
import { useEffect, useRef, useState } from "react";
import PaymentQrModal from "../../modal/payment-qr-modal";
import { checkPaid, checkPaymentRecords } from "../payment/payment";
import { useDispatch } from "react-redux";
import { fetchAccount } from "@/app/redux/slice/accountSlide";

interface PaymentRecordPrpos {
  id: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const BookedTickets = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticketCode, setTicketCode] = useState<string>("");
  const [ticketId, setTicketId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecordPrpos[]>(
    []
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const booked = useAppSelector((state) => state.account.user.bookings);
  const dispatch = useDispatch();

  useEffect(() => {
    if (paymentRecords.length > 0) {
      const check = async () => {
        const check = await checkPaymentRecords(
          paymentRecords,
          totalPrice,
          ticketCode,
          +ticketId
        );
        if (check) {
          setIsModalOpen(false);
          message.success("Thanh toán thành công");
          dispatch(fetchAccount() as any);
          // router.push("/");
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      };
      check();
    }
  }, [paymentRecords]);

  const handlePayment = (price: string, code: string, ticketId: string) => {
    setTotalPrice(+price);
    setTicketCode(code);
    setTicketId(ticketId);
    setIsModalOpen(true);
    interval();
  };

  const interval = () => {
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
  return (
    <div className="mt-10">
      <Row justify="center">
        <Col
          className="font-bold"
          style={{
            textAlign: "center",
            border: "1px solid #d9d9d9",
            padding: "8px",
          }}
          span={2}
        >
          STT
        </Col>
        <Col
          className="font-bold"
          style={{
            textAlign: "center",
            border: "1px solid #d9d9d9",
            padding: "8px",
          }}
          span={3}
        >
          Mã vé
        </Col>
        <Col
          className="font-bold"
          style={{
            textAlign: "center",
            border: "1px solid #d9d9d9",
            padding: "8px",
          }}
          span={7}
        >
          Phim
        </Col>
        <Col
          className="font-bold"
          style={{
            textAlign: "center",
            border: "1px solid #d9d9d9",
            padding: "8px",
          }}
          span={4}
        >
          Số ghế
        </Col>
        <Col
          className="font-bold"
          style={{
            textAlign: "center",
            border: "1px solid #d9d9d9",
            padding: "8px",
          }}
          span={4}
        >
          Tổng tiền
        </Col>
        <Col
          className="font-bold"
          style={{
            textAlign: "center",
            border: "1px solid #d9d9d9",
            padding: "8px",
          }}
          span={4}
        >
          Thanh toán
        </Col>
        {booked.map((item, index) => (
          <Col span={24}>
            <Row>
              <Col
                style={{
                  textAlign: "center",
                  border: "1px solid #d9d9d9",
                  padding: "8px",
                }}
                span={2}
              >
                {index + 1}
              </Col>
              <Col
                style={{
                  textAlign: "center",
                  border: "1px solid #d9d9d9",
                  padding: "8px",
                }}
                span={3}
              >
                {item.ma_GD}
              </Col>
              <Col
                style={{
                  textAlign: "center",
                  border: "1px solid #d9d9d9",
                  padding: "8px",
                }}
                span={7}
              >
                {item.movie.name}
              </Col>
              <Col
                style={{
                  textAlign: "center",
                  border: "1px solid #d9d9d9",
                  padding: "8px",
                }}
                span={4}
              >
                {item.seats.join(", ")}
              </Col>
              <Col
                style={{
                  textAlign: "center",
                  border: "1px solid #d9d9d9",
                  padding: "8px",
                }}
                span={4}
              >
                {item.total_price}
              </Col>
              <Col
                style={{
                  textAlign: "center",
                  border: "1px solid #d9d9d9",
                  padding: "8px",
                }}
                span={4}
              >
                {item.isPayment ? (
                  <Tag color="green">Đã thanh toán</Tag>
                ) : (
                  <Tag
                    onClick={() =>
                      handlePayment(item.total_price, item.ma_GD, item._id)
                    }
                    color="red"
                  >
                    Nhấn vào để thanh toán
                  </Tag>
                )}
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
      <PaymentQrModal
        price={totalPrice}
        ticketCode={ticketCode}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};
