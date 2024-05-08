'use client'

import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, message } from "antd";
import { Select, notification } from "antd/lib";
import { callCreateCinema, callCreatePermission, callUpdateCinema, callUpdatePermission } from "@/app/config/api";
import { ICinema, IPermission } from "@/app/types/backend";
import { ALL_MODULES } from "@/app/config/permission";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
};

interface Props {
  openModal: boolean, 
  setOpenModal: (v: boolean) => void
  reloadTable: () => void 
  dataInit: ICinema | null
  setDataInit: (v: any) => void
}

export const CinemaModal = ({
  openModal,
  setOpenModal,
  reloadTable,
  dataInit,
  setDataInit
}: Props) => {
  const [form] = Form.useForm();
  const [region, setRegion] = useState('');

  const handleCancel = () => {
    setDataInit(null);
    setOpenModal(false);
    setRegion('')
  };

  useEffect(() => {
    form.setFieldsValue( {
      name: dataInit?.name,
      are: dataInit?.area,
    })
  })

  const onFinish = async (values: ICinema) => {
    const { name, area } = values;
    console.log("value: ", values)
  
    const cinema = {  name, area };
    if(dataInit?._id) {
      const res = await callUpdateCinema(+dataInit._id, cinema);
      if(res.data) {
        message.success("Update success cinema");
        handleCancel();
        reloadTable();
      } else {
        notification.error({
          message: "error",
          
        })
      }
    } else {
      const res = await callCreateCinema(cinema);
      console.log(res)
      if(res.data) {
        message.success("Add success cinema");
        handleCancel();
        reloadTable();
      } else {
        notification.error({
          message: "error",
          // description: res.data.message
        })
      }
    }
  };

  return ( 
    <>
      <Modal
        title={dataInit?._id ? "Update Cinema" : "Add Cinema"}
        footer={null}
        open={openModal}
        onCancel={handleCancel}
      >
        <Form
          {...layout}
          form={form}
          name="nest-messages"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
        >
          <Form.Item
            name="area"
            label="area"
            rules={[{ required: true }]}
          >
            <div>
              <RegionDropdown
                name="area"
                country={"Vietnam"}
                value={region}
                onChange={(val) => setRegion(val)} 
              />
            </div>
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
          >
              <Input/>
          </Form.Item>

          
          
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 15 }}>
            <Button type="primary" htmlType="submit">
              {dataInit?._id ? "Update" : "Create"}
            </Button>
            <Button className="bg-zinc-300 ml-2" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
