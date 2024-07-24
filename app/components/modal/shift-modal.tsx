import React, { useEffect } from "react";
import { Button, Form, Input, Modal, TimePicker, message } from "antd";
import {
  callCreateShift,
  callUpdateShift,
} from "@/app/config/api";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import moment from "moment";

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
};

interface Props {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  reloadTable: () => void;
  shift?: any;
}

export const ShiftModal = ({
  openModal,
  setOpenModal,
  reloadTable,
  shift,
}: Props) => {

  const [form] = Form.useForm();


  const handleCancel = () => {
    setOpenModal(false);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue({
      day_of_weed: shift?.day_of_weed,
      hour: [moment(shift?.start_time, "HH:mm:ss"), moment(shift?.end_time, "HH:mm:ss")]
    });
  });

  const onFinish = async (values: any) => {
    const { hour, day_of_weed} = values;
    const [startTime, endTime] = hour;

    const startTimeString = moment(startTime.toDate()).format("HH:mm:ss");
    const endTimeString = moment(endTime.toDate()).format("HH:mm:ss");
    const _shift = {
      start_time: startTimeString,
      end_time: endTimeString,
      day_of_weed
    };

    try {
      if(shift?.id) {
        const res = await callUpdateShift(shift.id, _shift);
        if(res.status === 200) {
          message.success("Cập nhật thành công");
          form.resetFields();
          reloadTable();
          handleCancel();
        } else {
          message.error("Cập nhật thất bại");
        }
      } else {
        const res = await callCreateShift(_shift);
        if(res.status === 200) {
          message.success("Tạo thành công");
          form.resetFields();
          reloadTable();
          handleCancel();
        } else {
          message.error("Tạo thất bại");
        }
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log("shift", shift)

    // const { name, description, isActive, permissions } = values;
    // const checkedPermissions = [];
    // if (permissions) {
    //     for (const key in permissions) {
    //         if (!isNaN(Number(key)) && permissions[key] === true) {
    //             checkedPermissions.push(+key);
    //         }
    //     }
    // } 
    // const role = { name, description, isActive, permissions: checkedPermissions};
    // if (singleRole?.id) {
    //   const res = await callUpdateRole(role, singleRole?.id);
    //   if (res.data) {
    //     message.success("Update success role");
    //     handleCancel();
    //     reloadTable();
    //   } else {
    //     notification.error({
    //       message: "error",
    //       // description: res.message
    //     });
    //   }
    // } else { 
    //   const res = await callCreateRole(role);
    //   if (res.data) {
    //     message.success("Add success role");
    //     handleCancel();
    //     reloadTable();
    //   } else {
    //     notification.error({
    //       message: "error",
    //       // description: res.data.message,
    //     });
    //   }
    // }
  };

  return (
    <>
      <Modal
        title={shift.id ? "CẬP NHẬT CA LÀM VIỆC" : "THÊM CA LÀM VIỆC"}
        footer={null}
        open={openModal}
        onCancel={handleCancel}
        width={800}
      >
        <Form
          {...layout}
          form={form}
          name="nest-messages"
          onFinish={onFinish}
          style={{ maxWidth: 800 }}
          validateMessages={validateMessages}
        >
          <Form.Item name="day_of_weed" label="Thứ " rules={[{ required: true }]}>
            <Input placeholder="vd: Thứ Hai, Thứ Ba ..."/>
          </Form.Item>

          <Form.Item
          label="Thời gian"
          name="hour"
          rules={[{ required: true, message: "Không được để trống!" }]}
        >
          <TimePicker.RangePicker format={"HH:mm"} />
        </Form.Item>


          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 15 }}>
            <Button type="primary" htmlType="submit">
              {shift.id ? "Cập nhật" : "Tạo mới"}
            </Button>
            <Button className="bg-zinc-300 ml-2" onClick={handleCancel}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
