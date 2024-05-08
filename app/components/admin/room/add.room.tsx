"use client";
import React, { useState } from "react";
import { Button, Form, Input, List, Switch } from "antd";

type SeatType = "regular" | "vip";

type Seat = {
  id: number;
  name: string;
  type: SeatType;
};

type Row = {
  id: number;
  name: string;
  seats: Seat[];
};

const initialRows: Row[] = [];

const AddSeatsAndRows = () => {
  const [rows, setRows] = useState(initialRows);
  const [seatName, setSeatName] = useState("");
  const [rowName, setRowName] = useState("");

  const handleAddRow = () => {
    const newRow: Row = { id: rows.length + 1, name: rowName, seats: [] };
    setRows([...rows, newRow]);
    setRowName("");
  };

  const handleAddSeat = (rowId: number, type: SeatType) => {
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              seats: [
                ...row.seats,
                { id: row.seats.length + 1, name: seatName, type },
              ],
            }
          : row
      )
    );
    setSeatName("");
  };

  const handleAddSeats = (rowId: number, type: SeatType) => {
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              seats: [
                ...row.seats,
                { id: row.seats.length + 1, name: seatName, type },
                { id: row.seats.length + 2, name: seatName, type },
              ],
            }
          : row
      )
    );
    setSeatName("");
  };

  const handleDeleteRow = (rowId: number) => {
    setRows(rows.filter((row) => row.id !== rowId));
  };

  const handleDeleteSeat = (rowId: number, seatId: number) => {
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? { ...row, seats: row.seats.filter((seat) => seat.id !== seatId) }
          : row
      )
    );
  };

  const handleChangeSeat = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeatName(event.target.value);
  };

  const handleChangeRow = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowName(event.target.value);
  };

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
  };

  const [form] = Form.useForm();

  const onFinish = async (values: any) => {};

  const validateMessages = {
    required: "${label} is required!",
  };

  return (
    <div style={{ display: "flex" }}>
      <Form
        title="Create Room"
        {...layout}
        form={form}
        name="nest-messages"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        validateMessages={validateMessages}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="isAction" label="isAction" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType="submit">Create</Button>
        </Form.Item>
      </Form>
      {/* <div>
        <Input value={rowName} onChange={handleChangeRow} placeholder="Enter row name" />
        <Button onClick={handleAddRow}>Add Row</Button>
        {rows.map(row => (
          <div key={row.id}>
            <h3>{row.name}</h3>
            <Button onClick={() => handleDeleteRow(row.id)}>Delete Row</Button>
            {row.seats.map(seat => (
              <div key={seat.id}>
                <Button style={{ margin: '5px', backgroundColor: seat.type === 'vip' ? 'gold' : 'white' }}>
                  {seat.name} ({seat.type})
                </Button>
                <Button onClick={() => handleDeleteSeat(row.id, seat.id)}>Delete Seat</Button>
              </div>
            ))}
            <Input value={seatName} onChange={handleChangeSeat} placeholder="Enter seat name" />
            <Button onClick={() => handleAddSeat(row.id, 'regular')}>Add Regular Seat</Button>
            <Button onClick={() => handleAddSeats(row.id, 'regular')}>Add Two Regular Seats</Button>
            <Button onClick={() => handleAddSeats(row.id, 'vip')}>Add Two VIP Seats</Button>
          </div>
        ))}
      </div>
      <div style={{ marginLeft: '50px' }}>
        <h2>Added Seats:</h2>
        <List
          dataSource={rows.flatMap(row => row.seats.map(seat => ({ ...seat, rowId: row.id, rowName: row.name })))}
          renderItem={item => <List.Item>{item.rowName}: {item.name} ({item.type})</List.Item>}
        />
      </div> */}
    </div>
  );
};

export default AddSeatsAndRows;
