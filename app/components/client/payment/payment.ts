import { callUpdateBookingTicket, callUpdatePayment } from "@/app/config/api";
import axios from "axios";

interface PaymentRecordPrpos {
  id: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
} 

export const checkPaid = async () => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_OAUTH_CASSO}`, {
      headers: {
        Authorization:
        `Apikey ${process.env.NEXT_PUBLIC_API_KEY_CASSO_CINEMA}`,
          // "Apikey AK_CS.ad1288c0056a11efaec513ed578067cf.TJwlSvVBZdCRTv41lkcA9jFY6DO6kgEtOiNJp5s0aiLljIxn54eHMwbMbAzxZZKv6rHZie6X",
      },
    });
    return res.data.data.records;
  } catch (error) {
    return [];
  }
};

export const checkPaymentRecords = async (
  paymentRecords: PaymentRecordPrpos[],
  total_price: number,
  ma_GD: string,
  paymentId: number
) => {
  const normalizedMa_GD = ma_GD.trim().toUpperCase().replace(/_/g, '');

  for (const record of paymentRecords) {
    // Chuẩn hóa description
    let { description } = record;
    const normalizedDescription = description.trim().toUpperCase().replace(/_/g, '');

    // Kiểm tra sự xuất hiện của ma_GD trong description
    if (normalizedDescription.includes(normalizedMa_GD)) {
      await callUpdatePayment(paymentId);
      return true;
    }
  }
  return false;
};
