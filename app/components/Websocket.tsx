'use client'
import React, { useState } from 'react';
import { Button, Tooltip, List, Typography } from 'antd';

type SeatType = 'regular' | 'vip' | 'double';

type Seat = {
  id: number;
  price: number;
  type: SeatType;
  isPurchased: boolean;
};

const initialSeats: Seat[] = Array.from({ length: 50 }, (_, i) => {
  let type: SeatType;
  if (i < 10 * 3) {
    type = 'regular';
  } else if (i >= 10 * 5) {
    type = 'double';
  } else {
    type = 'vip';
  }

  return {
    id: i + 1,
    price: i % 3 === 0 ? 20 : i % 3 === 1 ? 30 : 40,
    type,
    isPurchased: false,
  };
});

const MovieTheater = () => {
  const [seats, setSeats] = useState(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSelect = (seat: Seat) => {
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalAmount = selectedSeats.reduce((total, seat) => total + seat.price, 0);

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.find(s => s.id === seat.id)) return 'blue';
    switch (seat.type) {
      case 'regular':
        return 'green';
      case 'vip':
        return 'gold';
      case 'double':
        return 'purple';
      default:
        return 'green';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '300px' }}>
        {seats.map(seat => (
          <Tooltip key={seat.id} title={`Seat: ${seat.id}, Price: $${seat.price}, Type: ${seat.type}`}>
            <Button
              style={{
                margin: '5px',
                backgroundColor: getSeatColor(seat),
              }}
              disabled={seat.isPurchased}
              onClick={() => handleSelect(seat)}
            >
              {seat.id}
            </Button>
          </Tooltip>
        ))}
      </div>
      <div>
        <Typography.Title level={4}>Selected Seats:</Typography.Title>
        <List
          dataSource={selectedSeats}
          renderItem={seat => <List.Item>Seat: {seat.id}, Price: ${seat.price}, Type: ${seat.type}</List.Item>}
        />
        <Typography.Title level={4}>Total Amount: ${totalAmount}</Typography.Title>
      </div>
    </div>
  );
};

export default MovieTheater;