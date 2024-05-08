'use client';
import React, { useState } from 'react';
import { Button, Col, Divider, Modal, Row } from 'antd';
import { IMovie } from '@/app/types/backend';
import moment from 'moment';
import { DataSourceItemObject } from 'antd/es/auto-complete';
import { useRouter } from 'next/navigation';

export interface IShowtimeProps {
  _id?: any;
  date: Date;
  start_time: Date;
  end_time: Date;
  movie: {
    _id: number;
    name: string;
    img: string;
    description: string;
    time: number;
  };
}
interface MovieProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  showtime: IShowtimeProps | undefined;
}

export const ConfirmTicketBookingModal = ({
  openModal,
  setOpenModal,
  showtime
}: MovieProps) => {
  const router = useRouter();

  const handleCancel = () => {
    setOpenModal(false);
  };
  const handleOk = () => {
    router.push(`/booking-ticket/${showtime?.movie._id}`);
  }

  return (<>
      <Modal title="BẠN ĐANG ĐẶT VÉ PHIM" open={openModal}
        onCancel={handleCancel}
        onOk={handleOk}
        width={600}
      >
        <Divider/>
        <Row style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><span className='text-2xl font-bold text-sky-500'>{showtime?.movie?.name}</span></Row>
        <Divider/>
        <Row >
          <Col span={8} style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>Rạp chiếu</Col>
          <Col span={8}style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>Ngày chiếu</Col>
          <Col span={8}style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>Giờ chiếu</Col>
        </Row>
        <Divider/>
        <Row style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Col span={8}style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><span className='text-xl font-bold'>...</span></Col>
          <Col span={8}style={{ display: "flex", justifyContent: "center", alignItems: "center"}}> <span className='text-xl font-bold'>{moment(showtime?.date).format("MM/DD/YYYY")}</span></Col>
          <Col span={8}style={{ display: "flex", justifyContent: "center", alignItems: "center"}}><span className='text-xl font-bold'>{moment(showtime?.start_time).format("HH:mm")}</span></Col>
        </Row>
        <Divider/>
      </Modal>
  </>);
};

export default ConfirmTicketBookingModal;