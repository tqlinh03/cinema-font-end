import { callUpdateBookingTicket } from "@/app/config/api";
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
  ticketId: number
) => {
  for (const record of paymentRecords) {
    const description = record.description;
    const price = record.amount;
    if (total_price >= price && description.includes(`${ma_GD}`)) {
      await callUpdateBookingTicket(ticketId);
      return true;
    }
  }
  return false;
};
