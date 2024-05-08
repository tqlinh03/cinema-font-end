"use client";
import { callBookingSeats } from "@/app/config/api";
import {
  Pricing,
  SeatsioEventManager,
  SeatsioSeatingChart,
} from "@seatsio/seatsio-react";
import { Button, Col, Row, message } from "antd";
import React, { useEffect, useState } from "react";

interface BookingProps {
  setTotalPrice: (v: number) => void;
  setSeats: (v: string[]) => void;
}

export const ChooseSeats = ({ setTotalPrice, setSeats }: BookingProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  //const [totalPrice, setTotalPrice] = useState(0);
  const [selectedObject, setSelectedObject] = useState<any[]>([]);

  const handleObjectSelected = (object: any) => {
    setSelectedObject((prevSelectedObject) => [...prevSelectedObject, object]);
    setSelectedSeats((prevSelectedSeats) => [
      ...prevSelectedSeats,
      object.label,
    ]);
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

  const pricing: Pricing = [
    { category: "1", price: 1000 },
    { category: "2", price: 2000 },
    { category: "3", price: 3000 },
  ];

  const handleBookingSeats = async (seatNumber: string[], price: number) => {
    const booking = { seatNumber, price };
    try {
      const res = await callBookingSeats(booking);
      console.log("res", res);
    } catch (error) {
      message.error("Booking failed");
    }
  };

  return (
    <div>
      {/* <Button onClick={() => handleBookingSeats(selectedSeats, totalPrice)}>Booking</Button> */}
      <Row style={{ height: 500 }}>
        <SeatsioSeatingChart
          workspaceKey="2ddd4138-617c-4d94-9ff5-6d4ff6f79a7d"
          event="2c219f18-9856-4bee-9ca8-5e56e4c633cb"
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

      {/* <SeatsioEventManager
        secretKey="b82a0d82-a8a4-4790-ade9-32a408c2de61"
        event="2c219f18-9856-4bee-9ca8-5e56e4c633cb"
        mode="manageObjectStatuses"
        session="start"
        region="oc"
      /> */}
    </div>
  );
};
