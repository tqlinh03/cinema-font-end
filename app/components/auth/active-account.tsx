"use client";
import { Button, Col, Row, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { ConfirmOTP } from "./confirm-otp";
import { callActivateAccount, callSendCodeEmail } from "@/app/config/api";
import { useRouter } from "next/navigation";

interface Props {
  email: string;
  hidden: boolean;
}
export const ActiveAccount = ({ email, hidden}: Props) => {
  const [countdown, setCountdown] = useState(2 * 60);
  const [otp, setOtp] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(true);

  const [sendCodeEmail, setSendCodeEmail] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  const resetCountdown = () => {
    setCountdown(2 * 60);
  };

  useEffect(() => {
    if (hidden === false || sendCodeEmail === true) {
      startCountdown();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sendCodeEmail]);

  const startCountdown = async () => {
    intervalRef.current = await setInterval(() => {
      setDisabled(true);
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setSendCodeEmail(false);
          setDisabled(false);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const activateAccount = async () => { 
    try {
      const res = await callActivateAccount(otp);
      console.log("activateAccount: ", res);
      if (res.data) {
        message.success("Kích hoạt tài khoản thành công!");
        // router.push("/login");
        window.location.href = "/login";
      }
    } catch (error) {
      message.error("Kích hoạt tài khoản thất bại!");
    }
  };

  const handleResendOTP = async () => {
    resetCountdown();
    try {
      const res = await callSendCodeEmail(email);
      setSendCodeEmail(true);
    } catch (error) {
      console.error("ERROR_SEND_CODE_EMAIL", error);
    }
  };
  return (
    <div>
      <Row className="text-lg" style={{ textAlign: "center", width: 420 }}>
        <Col className="mb-4" span={24}>
          <span className="text-gray-700 text-xl font-bold">
            Xác thực mã OTP
          </span>
        </Col>
        <Col span={24}>
          <span className="text-gray-800">
            Mã OTP đã được gửi đến email {email}
          </span>
        </Col>
        <Col className="mt-2 mb-2" span={24}>
          <span className="text-gray-800">
            Vui lòng nhập mã OTP để xác thực tài khoản
          </span>
        </Col>
        <Col span={24}>
          <ConfirmOTP otp={otp} setOtp={setOtp} />
          <span>Bạn chưa nhận được mã?</span>
          <Button type="link" disabled={disabled} onClick={handleResendOTP}>
            Gửi lại OTP
            {disabled === true ? (
              <span>
                ({minutes}:{seconds < 10 ? "0" : ""}
                {seconds})
              </span>
            ) : (
              ""
            )}
          </Button>
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full pt-4 mt-4"
            style={{ height: 40 }}
            onClick={activateAccount}
          >
            <span className="text-lg">Xác Nhận</span>
          </Button>
        </Col>
      </Row>
    </div>
  );
};
