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
    const res = await axios.get("https://oauth.casso.vn/v2/transactions?sort=DESC", {
      headers: {
        Authorization:
          "Apikey AK_CS.ad1288c0056a11efaec513ed578067cf.TJwlSvVBZdCRTv41lkcA9jFY6DO6kgEtOiNJp5s0aiLljIxn54eHMwbMbAzxZZKv6rHZie6X",
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
    console.log(">>>>>>>>", price, total_price, description, ma_GD, ticketId)
    console.log("[=====]", total_price >= price,description.includes(`${ma_GD}`));
    if (total_price >= price && description.includes(`${ma_GD}`)) {
      await callUpdateBookingTicket(ticketId);
      return true;
    }
  }
  return false;
};
