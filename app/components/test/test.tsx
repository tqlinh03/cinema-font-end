'use client'
import { Button, Image } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
interface PaymentRecordPrpos {
  id: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const Test = () => {
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecordPrpos []>([]);

  const BANK_ID = "MB";
  const ACCOUNT_NO = "0373642687";
  const TEMPLATE = "print";
  const AMOUNT = "790000";
  const DESCRIPTION = "Thanh toán vé phim";

  let MB1 = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${AMOUNT}&addInfo=${DESCRIPTION}`; 

  
  const checkPaid = async() => {
    try {
      const res = await axios.get('https://oauth.casso.vn/v2/transactions', {
      headers: {
        Authorization: "Apikey AK_CS.ad1288c0056a11efaec513ed578067cf.TJwlSvVBZdCRTv41lkcA9jFY6DO6kgEtOiNJp5s0aiLljIxn54eHMwbMbAzxZZKv6rHZie6X"
       }
    });
    setPaymentRecords(res.data.data.records);
    paymentRecords.map((record) => {
      console.log("record",record.description);
      const data = record.description;
      data.includes("LINH") ? console.log("Thanh toán vé phim") : console.log("Không phải thanh toán vé phim");
    });
   // console.log("res",res.data.data.records[0]);
//const data = res.data.data.records[0];
//console.log("data",data[]);

    } catch (error) {
      console.log(error);
    }

  }
  return (
    <>
      <h1>Test</h1>
      <Button type="primary" onClick={() => checkPaid()}>Primary Button</Button>
      <Image
    width={400}
    src={MB1}
  />

    </>
  );
};

export default Test;