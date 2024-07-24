"use client";
import { callBookingSeats, callCreateOrder, callFetchRoomById } from "@/app/config/api";
import { useAppSelector } from "@/app/redux/hook";
import {
  Pricing,
  SeatsioSeatingChart,
} from "@seatsio/seatsio-react";
import { Button, Row, message } from "antd";
import React, { useEffect, useState } from "react";

interface orderProps {
  seatType: string;
  price: number;
  seatNumber: string;
}

interface BookingProps {
  setTotalPrice: (v: number) => void;
  setSeats: (v: string[]) => void;
  setObject: (v: any) => void;
  roomId: string | null;
  showtimeId: string | null;
}



export const ChooseSeats = ({ setTotalPrice, setSeats, roomId,showtimeId, setObject }: BookingProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedObject, setSelectedObject] = useState<any[]>([]);
  // const [object, setObject] = useState<any>([]);
  // const [order, setOrder] = useState<orderProps[]>([]);
  const [roomCode, setRoomCode] = useState<string>("");


  useEffect(() => {
    if (roomId) {
      const data = async () => {
        const res = await callFetchRoomById(+roomId);
        if(res.status === 200) {
          setRoomCode(res.data.code);
        }
      }
      data();
    }
  }, [roomId]); 

  const handleObjectSelected = (objectNew: any) => {
    setSelectedObject((prevSelectedObject) => [...prevSelectedObject, objectNew]);
    setSelectedSeats((prevSelectedSeats) => [
      ...prevSelectedSeats,
      objectNew.label,
    ]);
    setObject((object: any) => [...object, objectNew]);
  };

  useEffect(() => {
    setSeats(selectedSeats);
  }, [selectedSeats]);

  useEffect(() => {
    // Lặp qua các thuộc tính của selectedObject để tính tổng giá
    let newTotalPrice = 0;
    for (let key in selectedObject) {
      if (selectedObject.hasOwnProperty(key) && selectedObject[key].pricing) {
        newTotalPrice += selectedObject[key].pricing.price;
      }
    }
    setTotalPrice(newTotalPrice);
  }, [selectedObject]);

  // useEffect(() => {
  //   setOrder([]);
  //   object.map((item: any) => {
  //     const orderItem = {
  //       seatType: item.category.label,
  //       price: item.pricing.price,
  //       seatNumber: item.label,
  //       showtimeId: showtimeId
  //     };
  //     setOrder((order) => [...order, orderItem]);
  //   });
  // }, [object]);

  const pricing: Pricing = [
    { category: "1", price: 1000 },
    { category: "2", price: 2000 },
    { category: "3", price: 3000 },
  ];

  const handleBookingSeats = async (seatNumber: string[], price: number) => {
    const booking = { seatNumber, price };
    try {
      const res = await callBookingSeats(booking);
    } catch (error) {
      message.error("Booking failed");
    }
  };

  // const handleTest = async () => {
  //   console.log(1);
  //   try {
  //     const order_ = {order, userId};
  //     console.log("order", order_);
  //     const res = await callCreateOrder(order_);
  //     console.log("order", res);
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // }
  // console.log("order", order);

  return (
    <div>
      {/* <Button onClick={() => handleBookingSeats(selectedSeats, totalPrice)}>Booking</Button> */}
      <Row style={{ height: 500 }}>
        <SeatsioSeatingChart
          workspaceKey="2ddd4138-617c-4d94-9ff5-6d4ff6f79a7d"
          event={roomCode}
          pricing={pricing}
          priceFormatter={(price) => price + " VNĐ"}
          region="oc"
          onObjectSelected={handleObjectSelected}
          onObjectDeselected={(deselectedObject) => {
            setSelectedSeats((prevSelectedSeats) =>
              prevSelectedSeats.filter(
                (seat) => seat !== deselectedObject.label
              )
            );
            setSelectedObject((prevSelectedObject) =>
              prevSelectedObject.filter(
                (object) => object.label !== deselectedObject.label
              )
            );
          }}
        />
      </Row>
    </div>
  );
};
